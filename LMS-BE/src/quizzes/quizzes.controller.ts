import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@Controller('quizzes')
@UseGuards(JwtAuthGuard)
export class QuizzesController {
  constructor(private quizzes: QuizzesService) {}

  @Post(':id/attempts')
  attempt(
    @Param('id') id: string,
    @Body() body: { answers: { questionId: string; optionId: string }[] },
  ) {
    return this.quizzes.submitAttempt({ quizId: id, answers: body.answers ?? [] });
  }
}


