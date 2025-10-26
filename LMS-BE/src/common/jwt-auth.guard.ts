import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const header: string | undefined = req.headers['authorization'];
    
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }
    
    const token = header.slice(7);
    
    if (!token) {
      throw new UnauthorizedException('Token is required');
    }
    
    try {
      const payload = await this.jwt.verifyAsync(token, { 
        secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production' 
      });
      
      if (!payload.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }
      
      req.user = { id: payload.sub };
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}


