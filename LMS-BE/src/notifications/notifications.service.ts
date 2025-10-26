import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async listForUser() {
    // Get the first user (assuming single user)
    const user = await this.prisma.user.findFirst();
    if (!user) throw new NotFoundException('No user found');

    return this.prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
  }
}


