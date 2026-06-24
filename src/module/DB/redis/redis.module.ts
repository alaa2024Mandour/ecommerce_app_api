import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient } from "redis";
import { RedisService } from "./redis.service";

@Global()
@Module({
    providers:[
        {
            provide:'REDIS_CLIENT',
            useFactory:async(configService:ConfigService)=>{
                const redis = await createClient({
                    url:configService.get<string>("redis.url")
                })
                console.log("redis connected successfully");
                
                await redis.connect()
                redis.on("error",(err)=>{
                    console.log("redis connect error",err);
                    
                })
                return redis
            },
            inject:[ConfigService]
        },
        RedisService
    ],
    exports:['REDIS_CLIENT',RedisService]
})
export class RedisModule{}
