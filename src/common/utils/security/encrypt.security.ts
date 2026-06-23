import { ConfigService } from '@nestjs/config';
import { Injectable } from "@nestjs/common";
import crypto from "node:crypto"

@Injectable()
export class EncryptionService {
    private readonly ENCRYPTION_KEY :Buffer;
    private readonly IV_LENGTH : number;

    constructor(private readonly configService: ConfigService) {
        this.ENCRYPTION_KEY = Buffer.from(this.configService.get<string>("encryption.key")!);
        this.IV_LENGTH = Number(this.configService.get<number>("encryption.ivLength")); 
    }


encrypt(text: string) {
    if (!text) {
        throw new Error("encrypted value is required");
    }
    const iv = crypto.randomBytes(this.IV_LENGTH);

    const cipher = crypto.createCipheriv('aes-256-cbc',this.ENCRYPTION_KEY, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');

    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
}


decrypt(text: string) {

    const [ivHex, encryptedText] = text.split(':');

    const iv = Buffer.from(ivHex!, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', this.ENCRYPTION_KEY, iv);

    let decrypted = decipher.update(encryptedText!, 'hex', 'utf8');

    decrypted += decipher.final('utf8');

    return decrypted;
}

}