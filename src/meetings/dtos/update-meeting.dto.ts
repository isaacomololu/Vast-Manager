import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, IsNumber } from "class-validator";

export class UpdateMeetingDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    title: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    timezone: string
    // startTime   DateTime
    // endTime     DateTime?

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    time: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    duration: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    date: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    location: string;
}