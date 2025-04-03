import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMeetingDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    timezone: string
    // startTime   DateTime
    // endTime     DateTime?

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    time: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsNumber()
    duration: number;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    date: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    location: string;
}