import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async createPost(body: { heading: string; descriptions: string; banner: string; slug: string; content: unknown; tags?: string[] }) {
    // Get the first user (assuming single user)
    const user = await this.prisma.user.findFirst();
    if (!user) throw new NotFoundException('No user found');

    return this.prisma.post.create({
      data: {
        userId: user.id,
        heading: body.heading,
        descriptions: body.descriptions,
        bannerUrl: body.banner,
        slug: body.slug,
        content: body.content as any,
      },
    });
  }

  async getSaved() {
    // Get the first user (assuming single user)
    const user = await this.prisma.user.findFirst();
    if (!user) throw new NotFoundException('No user found');

    const archives = await this.prisma.userPostArchive.findMany({ where: { userId: user.id }, include: { post: true } });
    return archives.map((a) => a.post);
  }

  async toggleArchive(postId: string, type: boolean) {
    // Get the first user (assuming single user)
    const user = await this.prisma.user.findFirst();
    if (!user) throw new NotFoundException('No user found');

    const key = { userId_postId: { userId: user.id, postId } } as const;
    if (type) {
      await this.prisma.userPostArchive.upsert({ where: key, update: {}, create: { userId: user.id, postId } });
    } else {
      await this.prisma.userPostArchive.delete({ where: key }).catch(() => undefined);
    }
    return { success: true };
  }
}
