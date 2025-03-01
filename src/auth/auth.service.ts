import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { BaseService } from 'src/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseProvider } from 'src/database/database.provider';
import { LoginUserDto, CreateUserDto } from './dto';
import { compare, hash } from 'bcrypt';
import { JWTPayload } from './auth.interface';


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
    return this.Results(accessToken);
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

  async signUp(payload: CreateUserDto) {
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

  async login(payload: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: payload.email }
    });

    if (!user) {
      return this.HandleError(
        new NotFoundException('User with this email not found')
      );
    }

    if (!(await compare(payload.password, user.password))) {
      return this.HandleError(
        new UnauthorizedException('Invalid Credentials')
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
}
