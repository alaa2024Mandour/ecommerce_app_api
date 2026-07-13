import { Type } from "class-transformer";
import { 
    IsNumber, 
    IsOptional, 
    IsPositive, 
    IsString 
} from "class-validator";

export class GetPaginationDataDTO{
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Type(()=>Number)
    page:number

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Type(()=>Number)
    limit:number

    @IsOptional()
    @IsString()
    search:string
}