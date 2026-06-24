import { Injectable } from "@nestjs/common";
import { hashSync, compareSync } from "bcrypt"

@Injectable()
export class HashingService {
    Hash(
        {
            plainText,
            saltRounds = 12
        }:
            {
                plainText: string,
                saltRounds?: number
            }): string {
        return hashSync(String(plainText), Number(saltRounds))
    }

    Compare({
        plainText,
        cipherText
    }: {
        plainText: string,
        cipherText: string
    }): boolean {
        return compareSync(plainText, cipherText)
    }
}