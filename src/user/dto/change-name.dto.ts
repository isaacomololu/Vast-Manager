import { IsNotEmpty, IsString } from "class-validator";

export class ChangeNameDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;
}