import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsBoolean } from "class-validator";

export class CreateMeetingDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty({ required: true, example: 'Africa/Lagos', description: 'IANA Timezone identifier' })
    @IsNotEmpty()
    @IsString()
    timezone: string;

    @ApiProperty({
        required: true,
        example: '2024-05-15T14:30:00.000Z',
        description: 'ISO-8601 DateTime format (YYYY-MM-DDThh:mm:ss.sssZ)'
    })
    @IsNotEmpty()
    @IsString()
    startTime: string;

    @ApiProperty({
        required: true,
        example: 60,
        description: 'Duration in minutes'
    })
    @IsNotEmpty()
    @IsNumber()
    duration: number;

    @ApiProperty({
        required: true,
        example: '2024-05-15',
        description: 'Date in YYYY-MM-DD format'
    })
    @IsNotEmpty()
    @IsString()
    date: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    location: string;

    @ApiProperty({ required: false, default: false })
    @IsOptional()
    @IsBoolean()
    isRecurring: boolean;
}