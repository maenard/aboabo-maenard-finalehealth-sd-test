import { IsOptional, IsNumberString, IsIn } from "class-validator";


export class PaginationQueryDto {

    @IsOptional()
    @IsNumberString()
    page?: string;

    @IsOptional()
    @IsNumberString()
    limit?: string;

    @IsOptional()
    sortBy?: string;

    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc';

    @IsOptional()
    search?: string;
}