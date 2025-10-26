import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as crypto from 'crypto';

function hashPassword(plain: string): string {
  const salt = process.env.PASSWORD_SALT || 'static-salt';
  return crypto.pbkdf2Sync(plain, salt, 10000, 64, 'sha512').toString('hex');
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(input: SignUpDto): Promise<AuthResponseDto> {
    const exists = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (exists) throw new BadRequestException('Email already in use');
    
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        fullName: input.fullName,
        passwordHash: hashPassword(input.password),
      },
    });

    const access = await this.jwt.signAsync({ sub: user.id }, { expiresIn: '15m' });
    const refreshToken = crypto.randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    
    await this.prisma.refreshSession.create({
      data: { userId: user.id, refreshToken, expiresAt },
    });

    return {
      access_token: access,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async login(input: SignInDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = user.passwordHash === hashPassword(input.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const access = await this.jwt.signAsync({ sub: user.id }, { expiresIn: '15m' });
    const refreshToken = crypto.randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    await this.prisma.refreshSession.create({
      data: { userId: user.id, refreshToken, expiresAt },
    });

    return {
      access_token: access,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async refresh(input: RefreshTokenDto): Promise<{ access_token: string }> {
    const session = await this.prisma.refreshSession.findUnique({ where: { refreshToken: input.refresh_token } });
    if (!session || session.expiresAt < new Date()) throw new UnauthorizedException('Invalid refresh');
    const access = await this.jwt.signAsync({ sub: session.userId }, { expiresIn: '15m' });
    return { access_token: access };
  }

  async logout(input: { refresh_token?: string; userId?: string }) {
    if (input.refresh_token) {
      await this.prisma.refreshSession.delete({ where: { refreshToken: input.refresh_token } }).catch(() => undefined);
    } else if (input.userId) {
      await this.prisma.refreshSession.deleteMany({ where: { userId: input.userId } });
    }
    return { success: true };
  }
}


