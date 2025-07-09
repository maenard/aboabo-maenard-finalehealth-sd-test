import { IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { VisitType } from "../enums/visit-type.enum";

export class CreateVisitDto {

    @IsDateString()
    @IsNotEmpty()
    visitDate: Date

    @IsString()
    notes: String

    @IsEnum(VisitType)
    @IsString()
    @IsNotEmpty()
    visitType: VisitType
}