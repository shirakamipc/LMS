import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UploadsModule } from './uploads/uploads.module';
import {CourseModule} from "./course/course.module";
import {LearningPathModule} from "./learning-path/learning-path.module";
import { LessonsModule } from './lessons/lessons.module';
import { QuizzesModule } from './quizzes/quizzes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    PrismaModule,
    HealthModule,
    UsersModule,
    AuthModule,
    PostsModule,
    NotificationsModule,
    UploadsModule,
    CourseModule,
    LearningPathModule,
    LessonsModule,
    QuizzesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
