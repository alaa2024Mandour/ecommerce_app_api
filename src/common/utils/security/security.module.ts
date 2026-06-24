import { Module } from "@nestjs/common";
import { HashingService } from "./hash.security";
import { EncryptionService } from "./encrypt.security";

@Module({
    providers:[
        HashingService,
        EncryptionService
    ],
    exports:[
        HashingService,
        EncryptionService
    ]
})
export class SecurityModule{

}