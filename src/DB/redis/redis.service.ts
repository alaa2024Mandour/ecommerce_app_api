import { createClient } from "@redis/client";
import { type RedisClientType } from "redis";
import { Types } from "mongoose";
import { Inject, Injectable } from "@nestjs/common";
import { EventEnum } from "src/common/utils/email/event.enum";

@Injectable()
export class RedisService{
    constructor(
        @Inject("REDIS_CLIENT") private readonly client : RedisClientType
    ){}

    handelEvent(){
        this.client.on("error",(error)=>{
            console.log("Redis Connected Failed 😱",error);
        })
    }

    async connect(){
        await this.client.connect();
        console.log("Redis Connected Successfully 👏");
        
    }

    revokedToken_key = ({ userId, jti } : {userId:Types.ObjectId, jti:number}) => {
        return `revokedToken::${userId}::${jti}`;
    };
    
    getUser_revokedKeys = ({ userId } : {userId:Types.ObjectId}) => {
        return `revokedToken::${userId}`;
    };
    
    profile_key = ({ userId } : {userId:Types.ObjectId}) => {
        return `profile::${userId}`;
    };
    
    otp_key = ({ email, subject = EventEnum.confirmEmail } : {email:string, subject?:string}) => {
        return `otp::${email}::${subject}`;
    };
    
    max_tries_otp = ({ email }: {email:string}) => {
        return `${this.otp_key({email})}::max_tries`;
    };
    
    blocked_otp = ({ email }: {email:string}) => {
        return `${this.otp_key({email})}::blocked`;
    };
    
    set = async({key,value,ttl}:{key:string,value:string|object|number,ttl:number})=>{
        try {
            const data = typeof value == "string" ? value : JSON.stringify(value);
            return ttl ? await this.client.set(key,data,{EX:ttl}) : await this.client.set(key,data)
        } catch (error) {
            console.log({error,mes:"error on set cash operation"});
            
        }
    }
    update = async({key,value,ttl}:{key:string,value:string,ttl:number})=>{
        try {
            if(await this.client.exists(key)) return 0;
            return await this.set({key,value,ttl});
        } catch (error) {
            console.log({error,mes:"error on update cash operation"});
            
        }
    }
    get = async(key:string)=>{
        try {
            const value = await this.client.get(key);
            if (value === null) return null;
            try {
                return JSON.parse(value)  
            } catch (error) {
                return value 
            }
        } catch (error) {
            console.log({error,mes:"error on get cash operation"});
            
        }
    }
    ttl = async(key:string)=>{
        try {
            return await this.client.ttl(key)
        } catch (error) {
            console.log({error,mes:"error on ttl cash operation"});
            
        }
    }
    exists = async(key:string)=>{
        try {
            return await this.client.exists(key)
        } catch (error) {
            console.log({error,mes:"error on exist cash operation"});
        }
    }
    expire = async({key,ttl}:{key:string,ttl:number})=>{
        try {
            return await this.client.expire(key, ttl)
        } catch (error) {
            console.log({error,mes:"error on expire cash operation"});
            
        }
    }
    del = async(key:string)=>{
        try {
            return await this.client.del(key)
        } catch (error) {
            console.log({error,mes:"error on del cash operation"});
            
        }
    }
    
    keys = async(pattern:string)=>{
        try {
            return await this.client.keys(`${pattern}*`)
        } catch (error) {
            console.log({error,mes:"error on keys cash operation"});
            
        }
    }
    
    
    incr = async(key:string)=>{
        try {
            return await this.client.incr(key)
        } catch (error) {
            console.log({error,mes:"error on increment cash operation"});
            
        }
    }

    // -------------FCM Caching----------------

    key (userId:Types.ObjectId){
        return `user:FCM:${userId}`
    }
    async addFCM (userId:Types.ObjectId,FCMToken:string){
        return await this.client.sAdd(this.key(userId),FCMToken)
    }
    async removeFCM (userId:Types.ObjectId,FCMToken:string){
        return await this.client.sRem(this.key(userId),FCMToken)
    }
    async getFCMs (userId:Types.ObjectId){
        return await this.client.sMembers(this.key(userId))
    }
    async hasFCMs (userId:Types.ObjectId){
        return await this.client.sCard(this.key(userId))
    }
    async removeFCMUser (userId:Types.ObjectId){
        return await this.client.del(this.key(userId))
    }


    // -------------socketIo Caching----------------

    socketIoKey (userId:Types.ObjectId){
        return `user:socketIo:${userId}`
    }
    async addSocketIo (userId:Types.ObjectId,SocketIoId:string){
        return await this.client.sAdd(this.socketIoKey(userId),SocketIoId)
    }
    async removeSocketIo (userId:Types.ObjectId,SocketIoId:string){
        return await this.client.sRem(this.socketIoKey(userId),SocketIoId)
    }
    async getSocketIos (userId:Types.ObjectId){
        return await this.client.sMembers(this.socketIoKey(userId))
    }
    async hasSocketIos (userId:Types.ObjectId){
        return await this.client.sCard(this.socketIoKey(userId))
    }
    async removeSocketIoUser (userId:Types.ObjectId){
        return await this.client.del(this.socketIoKey(userId))
    }
}

