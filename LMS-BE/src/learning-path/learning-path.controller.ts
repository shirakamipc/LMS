import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { LearningPathService } from './learning-path.service';
import {CreateLearningPathDto} from "./dto/create-learning-path.dto";
import {UpdateLearningPathDto} from "./dto/update-learning-path.dto";
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@Controller('learning-paths')
@UseGuards(JwtAuthGuard)
export class LearningPathController {
    constructor(private readonly service: LearningPathService) {}

    @Get()
    findAll() {
        return this.service.getAllWithCourses();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(Number(id));
    }

    @Post()
    create(@Body() dto: CreateLearningPathDto) {
        return this.service.create(dto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateLearningPathDto) {
        return this.service.update(Number(id), dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.service.delete(Number(id));
    }
}
