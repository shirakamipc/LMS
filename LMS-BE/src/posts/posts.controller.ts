import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private posts: PostsService) {}

  @Get('all')
  list(@Query('order') order?: 'asc' | 'desc', @Query('limit') limit?: string, @Query('page') page?: string) {
    return this.posts.list({ order, limit: limit ? Number(limit) : undefined, page: page ? Number(page) : undefined });
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.posts.getBySlug(slug);
  }

  @Post(':id/reactions')
  reactPost(@Param('id') id: string, @Body() body: { emoji: string; isReaction: boolean }) {
    return this.posts.togglePostReaction({ postId: id, emoji: body.emoji, isReaction: body.isReaction });
  }

  @Get(':id/comments')
  getComments(@Param('id') id: string) {
    return this.posts.listComments(id);
  }

  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body() body: { content: unknown }) {
    return this.posts.addComment({ postId: id, content: body.content });
  }

  @Post('comments/:id/reactions')
  reactComment(@Param('id') id: string, @Body() body: { emoji: string; isReaction: boolean }) {
    return this.posts.toggleCommentReaction({ commentId: id, emoji: body.emoji, isReaction: body.isReaction });
  }
}


