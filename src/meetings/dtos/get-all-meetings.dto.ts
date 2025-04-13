import { ApiProperty } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";

export class GetAllMeetingsDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsEnum(Status)
    status: Status;

    @ApiProperty({ required: true, default: 1, type: 'integer' })
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    page: number;

    @ApiProperty({ required: true, default: 10, type: 'integer' })
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    pageSize: number;
}