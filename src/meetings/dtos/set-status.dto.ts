import { ApiProperty } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { IsEnum, IsString } from "class-validator";

export class SetStatusDto {
    @ApiProperty({ required: true, enum: Status })
    @IsEnum(Status)
    status: Status;
}