import { plainToInstance } from "class-transformer";
import { IsNotEmpty, IsString, validate } from "class-validator";

class Config {
    @IsNotEmpty()
    @IsString()
    BASE_URL: string;

    @IsNotEmpty()
    @IsString()
    DATABASE_URL: string;

    @IsNotEmpty()
    @IsString()
    JWT_SECRET: string;

    @IsNotEmpty()
    @IsString()
    JWT_EXPIRATION: string;

    @IsNotEmpty()
    @IsString()
    PORT: number;

    @IsNotEmpty()
    @IsString()
    NODE_ENV: string;
}

export let config: Config;
// export let config: Config = plainToInstance(Config, { ...process.env });

export const setupConfig = async () => {
    config = plainToInstance(Config, process.env);
    const [error] = await validate(config, { whitelist: true })
    if (error) return error;
}
