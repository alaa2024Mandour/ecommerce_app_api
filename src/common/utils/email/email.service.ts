import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { eventEmitter } from "./email.events";
import { EventEnum } from "./event.enum";
import { emailTemplate } from "./email.template";
import { RedisService } from "src/module/DB/redis/redis.service";
import { HashingService } from "../security/hash.security";

@Injectable()
export class EmailService {
    constructor(
        private readonly configService:ConfigService,
        private readonly _redisService:RedisService,
        private readonly hashingService:HashingService,
    ){}

    sendEmail = async (mailOptions: Mail.Options) => {
        
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, 
            auth: {
                user: this.configService.get<string>("mail.appMail"),
                pass: this.configService.get<string>("mail.password"),
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Send an email using async/await
        const info = await transporter.sendMail({
            from: `"E-commerce App 🤦‍♀️🤷‍♀️" <${this.configService.get<string>("mail.appMail")}>`,
            ...mailOptions
        });


        return info.accepted.length > 0 ? true : false;
    };

    generateOTP = async () => {
        return Math.floor(Math.random() * 900000 + 100000);
    };

    sendEmailOTP = async ({ email, subject }: { email: string, subject: string }) => {
        const otpBlocked = await this._redisService.ttl(this._redisService.blocked_otp({ email }));
        if (otpBlocked && otpBlocked > 0) {
            throw new Error(`you are bloked now , resend otp after ${otpBlocked} seconds `);
        }

        const otpTTL = await this._redisService.ttl(this._redisService.otp_key({ email }));
        if (otpTTL && otpTTL > 0) {
            throw new Error(`you can resend otp after ${otpTTL} seconds `);
        }

        const maxOTP = await this._redisService.get(this._redisService.max_tries_otp({ email }));
        if (maxOTP >= 3) {
            await this._redisService.set({ key: this._redisService.blocked_otp({ email }), value: 1, ttl: 60 })
            throw new Error(`you have exceeded the maximum nuber of tries`);
        }

        const OTP = await this.generateOTP();

        eventEmitter.emit(EventEnum.confirmEmail, async () => {
            await this.sendEmail({
                to: email,
                subject: "welcome to our app",
                html: emailTemplate(OTP),
            });

            await this._redisService.incr(this._redisService.max_tries_otp({ email }))

            await this._redisService.set({
                key: this._redisService.otp_key({ email, subject }),
                value: this.hashingService.Hash({ plainText: String(OTP), saltRounds: 12 }),
                ttl: 60, //1m
            });
        })
    }
}
