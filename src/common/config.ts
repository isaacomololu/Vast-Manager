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

    // @IsNotEmpty()
    // @IsString()
    // EMAIL_RESET_PASSWORD_URL: string;

    // @IsNotEmpty()
    // @IsString()
    // EMAIL_USER: string;

    // @IsNotEmpty()
    // @IsString()
    // EMAIL_PASSWORD: string;

    // @IsNotEmpty()
    // @IsString()
    // JWT_VERIFICATION_TOKEN_SECRET: string;

    // @IsNotEmpty()
    // @IsString()
    // MAIL_USERNAME: string;

    // @IsNotEmpty()
    // @IsString()
    // MAIL_PASSWORD: string;

    @IsNotEmpty()
    @IsString()
    OAUTH_CLIENTID: string;

    @IsNotEmpty()
    @IsString()
    OAUTH_CLIENT_SECRET: string;

    @IsNotEmpty()
    @IsString()
    OAUTH_REFRESH_TOKEN: string;
}

export let config: Config;
// export let config: Config = plainToInstance(Config, { ...process.env });

export const setupConfig = async () => {
    config = plainToInstance(Config, process.env);
    const [error] = await validate(config, { whitelist: true })
    if (error) return error;
}
