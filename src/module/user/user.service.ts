import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService{

    constructor(
        
    ){}

    users = [
        {name:"a'laa",age:24},
        {name:"nada",age:30},
        {name:"mohammed",age:15},
    ]

    getAllUsers():object[]{
        return this.users
    }

    createUser(data:{name:string,age:number}):object{
        this.users.push(data)
        return {message:"user created",users:this.users}
    }

    deleteUser(name:string):object{
        console.log(name)
        const updatedUsers = this.users.filter((user)=>{
            console.log(user.name)
            return user.name!=name
        })
        
        return {message:"user deleted successfully",users:updatedUsers}
    }
}