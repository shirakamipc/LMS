import { Controller, Get, Post, Param, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import {CreateCourseDto} from "./dto/create-course.dto";
import {UpdateCourseDto} from "./dto/update-course.dto";
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CourseController {
    constructor(private readonly courseService: CourseService) { }

    @Get()
    findAll() {
        return this.courseService.findAll();
    }

    @Get(':id/chapters')
    getChapters(@Param('id') id: string) {
        return this.courseService.getChapters(Number(id));
    }
    
    @Get(':slug')
    findOne(@Param('slug') slug: string) {
        return this.courseService.findOne(slug);
    }

    @Post()
    create(@Body() dto: CreateCourseDto) {
        return this.courseService.create(dto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
        return this.courseService.update(Number(id), dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.courseService.delete(Number(id));
    }
}
