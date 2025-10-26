import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLearningPathDto } from './dto/create-learning-path.dto';
import { UpdateLearningPathDto } from './dto/update-learning-path.dto';

@Injectable()
export class LearningPathService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.learningPath.findMany({
            include: {
                courses: true, // Quan hệ trực tiếp 1-N
            },
        });
    }

    async findOne(id: number) {
        const path = await this.prisma.learningPath.findUnique({
            where: { id },
            include: {
                courses: true,
            },
        });

        if (!path) {
            throw new NotFoundException(`Learning Path with ID ${id} not found`);
        }

        return path;
    }

    async create(data: CreateLearningPathDto) {
        return this.prisma.learningPath.create({
            data,
        });
    }

    async update(id: number, data: UpdateLearningPathDto) {
        return this.prisma.learningPath.update({
            where: { id },
            data,
        });
    }

    async delete(id: number) {
        return this.prisma.learningPath.delete({
            where: { id },
        });
    }

    async getAllWithCourses() {
        return this.prisma.learningPath.findMany({
            include: {
                courses: {
                    orderBy: {
                        id: 'asc',
                    },
                },
            },
        });
    }
}
