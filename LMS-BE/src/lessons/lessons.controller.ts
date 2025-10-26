import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  ParseIntPipe,
  UseGuards
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { 
  CreateLessonDto, 
  UpdateLessonDto, 
  UpdateProgressDto, 
  SubmitQuizAttemptDto 
} from './dto/lesson.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@Controller('lessons')
@UseGuards(JwtAuthGuard)
export class LessonsController {
  constructor(private lessons: LessonsService) {}

  // GET all lessons
  @Get()
  findAll() {
    return this.lessons.findAll();
  }

  // GET lessons by chapter (more specific routes first)
  @Get('chapter/:chapterId')
  findByChapter(@Param('chapterId') chapterId: string) {
    return this.lessons.findByChapter(chapterId);
  }

  // GET lessons by course
  // @Get('course/:courseId')
  // findByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
  //   return this.lessons.findByCourse(courseId);
  // }

  // GET course progress
  @Get('course/:courseId/progress')
  getCourseProgress(@Param('courseId') courseId: number) {
    return this.lessons.getCourseProgress(courseId);
  }

  // SUBMIT quiz attempt
  @Post('quiz/:quizId/attempt')
  submitQuizAttempt(
    @Param('quizId') quizId: string,
    @Body() body: SubmitQuizAttemptDto,
  ) {
    return this.lessons.submitQuizAttempt(quizId, body.selectedOptionId);
  }

  // GET lesson progress (specific route before generic :id)
  @Get(':id/progress')
  getProgress(@Param('id') id: string) {
    return this.lessons.getProgress(id);
  }

  // GET quizzes for a lesson (specific route before generic :id)
  @Get(':id/quizzes')
  getQuizzes(@Param('id') id: string) {
    return this.lessons.getQuizzes(id);
  }

  // UPDATE lesson progress (specific route before generic :id)
  @Post(':id/progress')
  updateProgress(
    @Param('id') id: string,
    @Body() body: UpdateProgressDto,
  ) {
    return this.lessons.updateProgress({
      lessonId: id,
      is_completed: body.is_completed,
      watch_seconds: body.watch_seconds,
      last_checkpoint_seconds: body.last_checkpoint_seconds,
    });
  }

  // GET lesson by ID (generic route last)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessons.findOne(id);
  }

  // CREATE lesson
  @Post()
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessons.create(createLessonDto);
  }

  // UPDATE lesson
  @Put(':id')
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessons.update(id, updateLessonDto);
  }

  // DELETE lesson
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessons.remove(id);
  }
}
