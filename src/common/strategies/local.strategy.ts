
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email',
        });
    }

    async validate(email: string, password: string): Promise<any> {
        const result = await this.authService.validateUser(email, password);
        if (result.isError) {
            throw new UnauthorizedException(result.error.message);
        }
        return result.data;

    }
}
