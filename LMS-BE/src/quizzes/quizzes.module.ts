import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';

@Module({
  imports: [PrismaModule],
  providers: [QuizzesService],
  controllers: [QuizzesController],
})
export class QuizzesModule {}


