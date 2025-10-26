import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  // GET all lessons
  async findAll() {
    return this.prisma.lesson.findMany({
      include: {
        chapter: {
          include: {
            course: true,
          },
        },
        quizzes: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
      orderBy: [
        { chapter: { position: 'asc' } },
        { position: 'asc' },
      ],
    });
  }

  // GET lesson by ID
  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        chapter: {
          include: {
            course: true,
          },
        },
        quizzes: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
        progress: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  // GET lessons by chapter ID
  async findByChapter(chapterId: string) {
    return this.prisma.lesson.findMany({
      where: { chapterId },
      include: {
        quizzes: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
      orderBy: { position: 'asc' },
    });
  }

  // GET lessons by course ID
  async findByCourse(courseId: number) {
    return this.prisma.lesson.findMany({
      where: {
        chapter: {
          courseId,
        },
      },
      include: {
        chapter: true,
        quizzes: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
      orderBy: [
        { chapter: { position: 'asc' } },
        { position: 'asc' },
      ],
    });
  }

  // CREATE lesson
  async create(createLessonDto: CreateLessonDto) {
    // Verify chapter exists
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: createLessonDto.chapterId },
    });

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    return this.prisma.lesson.create({
      data: {
        chapterId: createLessonDto.chapterId,
        title: createLessonDto.title,
        description: createLessonDto.description,
        videoProvider: createLessonDto.videoProvider,
        videoRef: createLessonDto.videoRef,
        durationSeconds: createLessonDto.durationSeconds,
        position: createLessonDto.position,
      },
      include: {
        chapter: {
          include: {
            course: true,
          },
        },
      },
    });
  }

  // UPDATE lesson
  async update(id: string, updateLessonDto: UpdateLessonDto) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return this.prisma.lesson.update({
      where: { id },
      data: {
        title: updateLessonDto.title,
        description: updateLessonDto.description,
        videoProvider: updateLessonDto.videoProvider,
        videoRef: updateLessonDto.videoRef,
        durationSeconds: updateLessonDto.durationSeconds,
        position: updateLessonDto.position,
      },
      include: {
        chapter: {
          include: {
            course: true,
          },
        },
      },
    });
  }

  // DELETE lesson
  async remove(id: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return this.prisma.lesson.delete({
      where: { id },
    });
  }

  // UPDATE lesson progress (assuming single user)
  async updateProgress(params: {
    lessonId: string;
    is_completed?: boolean;
    watch_seconds?: number;
    last_checkpoint_seconds?: number;
  }) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: params.lessonId } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    // Get the first user (assuming single user)
    const user = await this.prisma.user.findFirst();
    if (!user) throw new NotFoundException('No user found');

    const data = {
      isCompleted: params.is_completed ?? undefined,
      watchSeconds: params.watch_seconds ?? undefined,
      lastCheckpointSeconds: params.last_checkpoint_seconds ?? undefined,
    } as const;

    return this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId: params.lessonId } },
      update: data,
      create: {
        userId: user.id,
        lessonId: params.lessonId,
        isCompleted: params.is_completed ?? false,
        watchSeconds: params.watch_seconds ?? 0,
        lastCheckpointSeconds: params.last_checkpoint_seconds ?? 0,
      },
    });
  }

  // GET lesson progress (assuming single user)
  async getProgress(lessonId: string) {
    const user = await this.prisma.user.findFirst();
    if (!user) throw new NotFoundException('No user found');

    return this.prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId: user.id, lessonId } },
    });
  }

  // GET user's progress for all lessons in a course (assuming single user)
  async getCourseProgress(courseId: number) {
    const user = await this.prisma.user.findFirst();
    if (!user) throw new NotFoundException('No user found');

    return this.prisma.lessonProgress.findMany({
      where: {
        userId: user.id,
        lesson: {
          chapter: {
            courseId,
          },
        },
      },
      include: {
        lesson: {
          include: {
            chapter: true,
          },
        },
      },
    });
  }

  // GET quizzes for a lesson
  async getQuizzes(lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return this.prisma.quiz.findMany({
      where: { lessonId },
      orderBy: { timestampSeconds: 'asc' },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  // SUBMIT quiz attempt (assuming single user)
  async submitQuizAttempt(quizId: string, selectedOptionId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Get the first user (assuming single user)
    const user = await this.prisma.user.findFirst();
    if (!user) throw new NotFoundException('No user found');

    // Find the correct option
    const correctOption = quiz.questions[0]?.options.find(option => option.isCorrect);
    const selectedOption = quiz.questions[0]?.options.find(option => option.id === selectedOptionId);

    if (!selectedOption) {
      throw new BadRequestException('Invalid option selected');
    }

    const isCorrect = selectedOption.isCorrect;

    return this.prisma.quizAttempt.upsert({
      where: { quizId_userId: { quizId, userId: user.id } },
      update: {
        correct: isCorrect,
        attemptsCount: { increment: 1 },
        answeredAt: new Date(),
      },
      create: {
        quizId,
        userId: user.id,
        correct: isCorrect,
        attemptsCount: 1,
        answeredAt: new Date(),
      },
    });
  }
}


