import { GenderEnum } from "src/common/enum/user.enum";
import z from "zod";

export const createUserSchema = z.object({
    userName: z.string(),
    email: z.email(),
    phone: z.string(),
    gender: z.enum(GenderEnum).default(GenderEnum.male),
    password: z.string(),
    cPassword: z.string(),
}).superRefine((args,ctx)=>{
    if(args.password !== args.cPassword){
        ctx.addIssue({
            code:"custom",
            path:["cPassword"],
            message:"password and cPassword must be matched"
        })
    }
})

export type zodCreateUserDTO = z.infer<typeof createUserSchema>;