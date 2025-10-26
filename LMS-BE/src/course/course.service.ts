import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.course.findMany({
            include: {
                learningPath: true,
                chapters: true,
                enrollments: true,
            },
        });
    }

    async findOne(slug: string) {
        const course = await this.prisma.course.findUnique({
            where: { slug },
            include: {
                learningPath: true,
                chapters: true,
                enrollments: true,
            },
        });
        if (!course) {
            throw new NotFoundException(`Course with ID ${slug} not found`);
        }
        return course;
    }

    async getChapters(courseId: number) {
        // First verify the course exists
        const course = await this.prisma.course.findUnique({
            where: { id: courseId }
        });
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }

        return this.prisma.chapter.findMany({
            where: { courseId },
            include: {
                lessons: {
                    include: {
                        quizzes: {
                            include: {
                                questions: {
                                    include: {
                                        options: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: { position: 'asc' }
                }
            },
            orderBy: { position: 'asc' }
        });
    }

    async create(data: CreateCourseDto) {
        return this.prisma.course.create({ data });
    }

    async update(id: number, data: UpdateCourseDto) {
        return this.prisma.course.update({ where: { id }, data });
    }

    async delete(id: number) {
        return this.prisma.course.delete({ where: { id } });
    }
}
