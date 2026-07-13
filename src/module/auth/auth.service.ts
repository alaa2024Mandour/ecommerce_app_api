import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { signUpDTO } from "./dto/signUp.dto";
import UserRepository from "../../DB/repositories/user.repository";
import { EncryptionService } from "src/common/utils/security/encrypt.security";
import { EventEnum } from "src/common/utils/email/event.enum";
import { signInDTO } from "./dto/signIn.dto";
import { HashingService } from "src/common/utils/security/hash.security";
import { JwtService } from "@nestjs/jwt";
import { RoleEnum } from "src/common/enum/user.enum";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";
import { EmailService } from "src/common/utils/email/email.service";
import { updatePasswordDTO } from "./dto/updatePassword.dto";
import { UserDocument } from "../../DB/models/user.model";
import { forgotPasswordDTO } from "./dto/forgotPassword.dto";
import { ConfirmEmailDTO } from "./dto/confirmEmail.dto";
import { RedisService } from "../../DB/redis/redis.service";
import { eventEmitter } from "src/common/utils/email/email.events";
import { emailTemplate } from "src/common/utils/email/email.template";
import { resendEmailDTO } from "./dto/resendEmail.dto";
import { resetPasswordDTO } from "./dto/resetPassword.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly encryptionService: EncryptionService,
        private readonly emailService: EmailService,
        private readonly hashingService: HashingService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly redisService : RedisService
    ) { }

    async signUp(data: signUpDTO) {
        const { userName, email, phone, gender, password, cPassword, role } = data
        let user = await this.userRepo.findOne({ filter: { email } })
        if (user) {
            throw new ConflictException("this email already exist");
        }
        const otp = await this.emailService.generateOTP();
        eventEmitter.emit(EventEnum.confirmEmail, async () => {
                await this.emailService.sendEmail({
                    to: email,
                    subject: "welcome to Ecommerce app , verify your account",
                    html: emailTemplate(otp)
                })
            })

            await this.redisService.set({
                key: this.redisService.otp_key({ email, subject: EventEnum.confirmEmail }),
                value: this.hashingService.Hash({ plainText: String(otp), saltRounds: 12 }),
                ttl: 60 * 5, //5m
            });

            await this.redisService.set({
                key: this.redisService.max_tries_otp({ email }),
                value: 1,
                ttl: 60 * 5 * 3,
            })
        user = await this.userRepo.create(
            {
                userName,
                email,
                phone: this.encryptionService.encrypt(phone),
                gender,
                password,
                role: role? role : "user"
            }
        )
        return user
    }

    async signIn(data: signInDTO) {
        const { email, password } = data
        let user = await this.userRepo.findOne({ filter: { email, confirmed: true } })
        if (!user) {
            throw new ConflictException("user not found or not confirmed yet");
        }

        if (!this.hashingService.Compare({ plainText: password, cipherText: user.password })) {
            throw new BadRequestException("email or password are wrong");
        }

        const payload = { sub: user._id, username: user.userName };
        const jti_uuid = randomUUID() 

        const accessToken = await this.jwtService.signAsync(
            payload,
            {
                secret:user.role == RoleEnum.user ? this.configService.get<string>('jwt.user.accessSecret') : this.configService.get<string>('jwt.admin.accessSecret'),
                jwtid:jti_uuid,
            }
        );

        const refreshToken = await this.jwtService.signAsync(
            payload,
            {
                secret:user.role == RoleEnum.user ? this.configService.get<string>('jwt.user.refreshSecret') : this.configService.get<string>('jwt.admin.refreshSecret'),
                jwtid:jti_uuid,
            }
        );
        return {accessToken,refreshToken}
    }

    async confirmEmail(data:ConfirmEmailDTO){
        const {email,code} = data

        const otpValue = await this.redisService.get(this.redisService.otp_key({email,subject:EventEnum.confirmEmail}))

        
        if(!otpValue){
            throw new BadRequestException("otp expired");
        }

        if(!this.hashingService.Compare({plainText:String(code) ,cipherText:otpValue})){
            throw new BadRequestException("invalid otp");
        }

        const user = await this.userRepo.findOneAndUpdate({
            filter:{
                email,
                confirmed:{$ne:true}
            },
            updateData:{
                confirmed:true
            }
        })

        if(!user){
            throw new BadRequestException("user not exist");
        }

        await this.redisService.del(this.redisService.otp_key({email,subject:EventEnum.confirmEmail}))
        return user
    }

    async resendEmail(data:resendEmailDTO){
        const {email} = data
        const user = await this.userRepo.findOne({
            filter: {
                email,
                confirmed: { $ne: true },
            },
        });

        if (!user) {
            throw new BadRequestException(" user not exist or already confirmed ");
        }

        await this.emailService.sendEmailOTP({ email, subject: EventEnum.confirmEmail })

        return 
    }

    async updatePassword(user:UserDocument, data : updatePasswordDTO){
        const {password , newPassword} = data
        const userPassword = user.password
        if(!this.hashingService.Compare({plainText:password,cipherText:userPassword})){
            throw new BadRequestException("Invalid password");
        }

        user.password = newPassword
        await user.save()

        return user
    }

    async forgotPassword(data : forgotPasswordDTO){
        const {email} = data
        const user = await this.userRepo.findOne({
            filter:{
                email
            },
        })

        if(!user){
            throw new BadRequestException("email not exist");
        }

        await this.emailService.sendEmailOTP({
            email,
            subject:EventEnum.forgotPassword
        })
    }

    async resetPassword(data:resetPasswordDTO){
        const {email,code,password} = data

        const otpValue = await this.redisService.get(this.redisService.otp_key({email,subject:EventEnum.forgotPassword}))

        
        if(!otpValue){
            throw new BadRequestException("otp expired");
        }

        if(!this.hashingService.Compare({plainText:String(code) ,cipherText:otpValue})){
            throw new BadRequestException("invalid otp");
        }

        const user = await this.userRepo.findOne({
            filter:{
                email,
            },
        })
        
        if(!user){
            throw new BadRequestException("user not exist");
        }
        user.password=password;
        await user?.save()

        await this.redisService.del(this.redisService.otp_key({email,subject:EventEnum.forgotPassword}))
        return user
    }

}