import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { BaseService } from 'src/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseProvider } from 'src/database/database.provider';
import { LoginDto, SignUp, ChangePasswordDto, RefreshTokenDto } from './dto';
import { compare, hash } from 'bcrypt';
import { JWTPayload } from './auth.interface';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class AuthService extends BaseService {
  constructor(
    private prisma: DatabaseProvider,
    private jwtService: JwtService
  ) {
    super();
  }

  async signJWT(payload: any) {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = uuidv4();

    await this.storeRefreshToken(refreshToken, payload.userId);

    return this.Results({ accessToken, refreshToken });
  }

  async verifyJWT(jwt: string) {
    try {
      const user: JWTPayload = this.jwtService.verify(jwt);
      return this.Results(user);
    } catch (error) {
      if (error.message.includes('expired')) {
        return this.HandleError(
          new UnauthorizedException('Token Expired! Please Sign in.'),
        );
      }
      if (error.message.includes('invalid')) {
        return this.HandleError(
          new UnauthorizedException('Invalid Token! Please Sign in.'),
        );
      }
      throw error;
    }
  }

  async signUp(payload: SignUp) {
    const existingUser = await this.prisma.user.findFirst({
      where:
        { email: payload.email }
    })
    if (existingUser) {
      return this.HandleError(
        new ConflictException('User with this email already exists')
      )
    }

    const newUser = await this.prisma.user.create({
      data: {
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        password: await hash(payload.password, 10),
      }
    });

    const jwtPayload: JWTPayload = {
      email: newUser.email,
      lastLoggedInAt: new Date().toISOString(),
      userId: newUser.id,
    }

    const { data: accessToken } = await this.signJWT(jwtPayload);

    return this.Results({ user: newUser, accessToken });
  }

  async login(payload: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: payload.email }
    });

    if (!user) {
      return this.HandleError(
        new UnauthorizedException('Incorrect Credentials')
      );
    }

    if (!(await compare(payload.password, user.password))) {
      return this.HandleError(
        new UnauthorizedException('Incorrect Credentials')
      )
    }

    const jwtPayload: JWTPayload = {
      email: user.email,
      lastLoggedInAt: new Date().toISOString(),
      userId: user.id,
    }

    const { data: accessToken } = await this.signJWT(jwtPayload);
    return this.Results({ user, accessToken });
  }

  async refreshTokens(payload: RefreshTokenDto) {
    const { token } = payload;

    const refreshToken = await this.prisma.refreshToken.findFirst({
      where: {
        token,
        expiryDate: { gte: new Date() }
      }
    });

    if (!refreshToken) {
      return this.HandleError(
        new UnauthorizedException('Invalid Refresh Token')
      );
    }

    const user = await this.prisma.user.findFirst({
      where: { id: refreshToken.userId }
    });

    if (!user) {
      return this.HandleError(
        new UnauthorizedException('User not found')
      );
    }

    const jwtPayload: JWTPayload = {
      email: user.email,
      lastLoggedInAt: new Date().toISOString(),
      userId: user.id,
    }
    const newToken = await this.signJWT(jwtPayload);

    return this.Results(newToken);
  }

  // async validateUser(email: string, password: string) {
  //   const user = await this.prisma.user.findUnique({
  //     where: { email }
  //   });

  //   if (!user) {
  //     return this.HandleError(
  //       new NotFoundException('User with this email not found')
  //     );
  //   }

  //   const isPasswordValid = await compare(password, user.password);
  //   if (!isPasswordValid) {
  //     return this.HandleError(
  //       new UnauthorizedException('Invalid Credentials')
  //     );
  //   }

  //   return this.Results(user);
  // }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return this.HandleError(
          new NotFoundException('User with this email not found')
        );
      }

      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        return this.HandleError(
          new UnauthorizedException('Invalid Credentials')
        );
      }

      return this.Results(user);
    } catch (error) {
      return this.HandleError(error);
    }
  }

  async storeRefreshToken(token: string, userId: string) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    await this.prisma.refreshToken.upsert({
      where: { userId },
      update: {
        token,
        expiryDate
      },
      create: {
        token,
        userId,
        expiryDate
      }
    });
  }
}
