import { Body, Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post('posts')
  createPost(@Body() body: { heading: string; descriptions: string; banner: string; slug: string; content: unknown; tags?: string[] }) {
    return this.usersService.createPost(body);
  }

  @Get('posts/saved')
  getSaved() {
    return this.usersService.getSaved();
  }

  @Post('posts/:id/archive')
  toggleArchive(@Param('id') id: string, @Body() body: { type: boolean }) {
    return this.usersService.toggleArchive(id, body.type);
  }
}
