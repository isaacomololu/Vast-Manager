import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('Invalid token');
        }
        try {
            const payload = this.jwtService.verify(token);
            // request.user = payload;
            request.user = {
                email: payload.email,
                userId: payload.userId || payload.sub, // JWT often uses 'sub' for subject/user ID
                lastLoggedInAt: payload.lastLoggedInAt || new Date().toISOString()
            };

            console.log('guard user', payload);
        } catch (error) {
            Logger.error(error);
            throw new UnauthorizedException('Invalid token');
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        return request.headers.authorization?.split(' ')[1];
    }
}