import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { signUpDTO } from "./dto/signUp.dto";
import UserRepository from "../DB/repositories/user.repository";
import { EncryptionService } from "src/common/utils/security/encrypt.security";
import { EmailService } from "src/common/utils/email/email.service";
import { EventEnum } from "src/common/utils/email/event.enum";
import { signInDTO } from "./dto/signIn.dto";
import { HashingService } from "src/common/utils/security/hash.security";
import { JwtService } from "@nestjs/jwt";
import { RoleEnum } from "src/common/enum/user.enum";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";

@Injectable()
export class UserService {

    constructor(
        private readonly userRepo: UserRepository,
        private readonly encryptionService: EncryptionService,
        private readonly emailService: EmailService,
        private readonly hashingService: HashingService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async getAllUsers() {
        return await this.userRepo.find({ filter: {} })
    }

    async signUp(data: signUpDTO) {
        const { userName, email, phone, gender, password, cPassword } = data
        let user = await this.userRepo.findOne({ filter: { email } })
        if (user) {
            throw new ConflictException("this email already exist");
        }
        user = await this.userRepo.create(
            {
                userName,
                email,
                phone: this.encryptionService.encrypt(phone),
                gender,
                password
            }
        )
        this.emailService.sendEmailOTP({
            email,
            subject: EventEnum.confirmEmail
        })
        return user
    }

    async signIn(data: signInDTO) {
        const { email, password } = data
        let user = await this.userRepo.findOne({ filter: { email } })
        if (!user) {
            throw new ConflictException("user not found");
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


}