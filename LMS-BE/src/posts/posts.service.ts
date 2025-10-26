import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async list(params: { order?: 'asc' | 'desc'; limit?: number; page?: number }) {
    const order = params.order ?? 'desc';
    const limit = params.limit ?? 10;
    const page = Math.max(1, params.page ?? 1);
    const [items, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        orderBy: { createdAt: order },
        take: limit,
        skip: (page - 1) * limit,
        where: { isPublished: true },
        select: { id: true, slug: true, heading: true, descriptions: true, bannerUrl: true, createdAt: true },
      }),
      this.prisma.post.count({ where: { isPublished: true } }),
    ]);
    return { items, total, page, limit };
  }

  async getBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({ where: { slug }, include: { author: true } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async togglePostReaction(input: { postId: string; emoji: string; isReaction: boolean }) {
    // Get the first user (assuming single user)
    const user = await this.prisma.user.findFirst();
    if (!user) throw new NotFoundException('No user found');

    const key = { postId_userId: { postId: input.postId, userId: user.id } } as const;
    if (input.isReaction) {
      return this.prisma.postReaction.upsert({
        where: key,
        update: { emoji: input.emoji },
        create: { postId: input.postId, userId: user.id, emoji: input.emoji },
      });
    }
    await this.prisma.postReaction.delete({ where: key }).catch(() => undefined);
    return { success: true };
  }

  async listComments(postId: string) {
    return this.prisma.comment.findMany({ where: { postId }, orderBy: { createdAt: 'asc' } });
  }

  async addComment(input: { postId: string; content: unknown }) {
    // Get the first user (assuming single user)
    const user = await this.prisma.user.findFirst();
    if (!user) throw new NotFoundException('No user found');

    return this.prisma.comment.create({ data: { postId: input.postId, userId: user.id, content: input.content as any } });
  }

  async toggleCommentReaction(input: { commentId: string; emoji: string; isReaction: boolean }) {
    // Get the first user (assuming single user)
    const user = await this.prisma.user.findFirst();
    if (!user) throw new NotFoundException('No user found');

    const key = { commentId_userId: { commentId: input.commentId, userId: user.id } } as const;
    if (input.isReaction) {
      return this.prisma.commentReaction.upsert({
        where: key,
        update: { emoji: input.emoji },
        create: { commentId: input.commentId, userId: user.id, emoji: input.emoji },
      });
    }
    await this.prisma.commentReaction.delete({ where: key }).catch(() => undefined);
    return { success: true };
  }
}


