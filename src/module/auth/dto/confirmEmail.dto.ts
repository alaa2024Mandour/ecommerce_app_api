import { IsEmail, IsNumber, Length } from "class-validator";

export class ConfirmEmailDTO{
    @IsEmail()
    email:string;

    @IsNumber()
    code:number
}