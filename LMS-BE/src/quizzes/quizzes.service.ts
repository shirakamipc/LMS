import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async submitAttempt(params: { quizId: string; answers: { questionId: string; optionId: string }[] }) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: params.quizId },
      include: { questions: { include: { options: true } } },
    });
    if (!quiz) throw new NotFoundException('Quiz not found');

    // Get the first user (assuming single user)
    const user = await this.prisma.user.findFirst();
    if (!user) throw new NotFoundException('No user found');

    const correctMap = new Map<string, string>();
    for (const q of quiz.questions) {
      const correct = q.options.find((o) => o.isCorrect);
      if (correct) correctMap.set(q.id, correct.id);
    }

    let correctCount = 0;
    for (const a of params.answers) {
      if (correctMap.get(a.questionId) === a.optionId) correctCount += 1;
    }
    const isAllCorrect = correctCount === quiz.questions.length && quiz.questions.length > 0;

    const existing = await this.prisma.quizAttempt.findUnique({ where: { quizId_userId: { quizId: params.quizId, userId: user.id } } });
    const attemptsCount = (existing?.attemptsCount ?? 0) + 1;

    const attempt = await this.prisma.quizAttempt.upsert({
      where: { quizId_userId: { quizId: params.quizId, userId: user.id } },
      update: { correct: isAllCorrect, attemptsCount, answeredAt: new Date() },
      create: { quizId: params.quizId, userId: user.id, correct: isAllCorrect, attemptsCount },
    });

    return { correct: isAllCorrect, attempts_count: attempt.attemptsCount };
  }
}


