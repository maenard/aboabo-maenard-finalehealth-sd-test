import { IsDate, IsDateString, IsEmail, IsNotEmpty, IsString } from "class-validator";
export class CreatePatientDto {

    @IsString()
    @IsNotEmpty()
    firstName: String

    @IsString()
    @IsNotEmpty()
    lastName: String

    @IsDateString()
    @IsNotEmpty()
    dob: Date

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    phoneNumber: String

    @IsString()
    @IsNotEmpty()
    address: String
}