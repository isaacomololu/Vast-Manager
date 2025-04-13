import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean } from "class-validator";

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
    timezone: string;

    @ApiProperty({
        required: false,
        example: '2024-05-15T14:30:00.000Z',
        description: 'ISO-8601 DateTime format (YYYY-MM-DDThh:mm:ss.sssZ)'
    })
    @IsOptional()
    @IsString()
    startTime: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    duration: number;

    @ApiProperty({
        required: false,
        example: '2024-05-15',
        description: 'Date in YYYY-MM-DD format'
    })
    @IsOptional()
    @IsString()
    date: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    location: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isRecurring: boolean;
}