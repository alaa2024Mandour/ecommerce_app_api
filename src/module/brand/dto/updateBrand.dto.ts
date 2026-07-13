import { PartialType } from "@nestjs/mapped-types";
import { CreateBrandDTO } from "./createBrand.dto";
import { AtLeastOne } from "src/common/decorators/atLeastOne.decorator";

@AtLeastOne(["name","slogan"])
export class UpdateBrandDTO extends PartialType(CreateBrandDTO){}