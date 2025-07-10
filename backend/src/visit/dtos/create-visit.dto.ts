import { IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { VisitType } from "../enums/visit-type.enum";

export class CreateVisitDto {

  @IsDateString()
  @IsNotEmpty()
  visitDate: Date


  @IsOptional()
  notes: String

  @IsEnum(VisitType)
  @IsString()
  @IsNotEmpty()
  visitType: VisitType
}
