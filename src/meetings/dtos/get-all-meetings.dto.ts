import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class GetAllMeetingsDto {
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