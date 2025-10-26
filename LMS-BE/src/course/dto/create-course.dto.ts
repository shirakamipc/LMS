import { Expose } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCourseDto {
    @IsString()
    title: string;

    @IsString()
    slug: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    image?: string;

    @Expose({ name: 'image_url' })
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @Expose({ name: 'icon_url' })
    @IsOptional()
    @IsString()
    iconUrl?: string;

    @IsOptional()
    @IsString()
    icon?: string;

    @IsOptional()
    @IsString()
    video?: string;

    @Expose({ name: 'video_type' })
    @IsOptional()
    @IsString()
    videoType?: string;

    @Expose({ name: 'video_url' })
    @IsOptional()
    @IsString()
    videoUrl?: string;

    @Expose({ name: 'price' })
    @IsOptional()
    @IsNumber()
    price?: number;

    @Expose({ name: 'old_price' })
    @IsOptional()
    @IsNumber()
    oldPrice?: number;

    @Expose({ name: 'pre_order_price' })
    @IsOptional()
    @IsNumber()
    preOrderPrice?: number;

    @Expose({ name: 'students_count' })
    @IsOptional()
    @IsInt()
    studentsCount?: number;

    @Expose({ name: 'is_pro' })
    @IsOptional()
    @IsBoolean()
    isPro?: boolean;

    @Expose({ name: 'is_selling' })
    @IsOptional()
    @IsBoolean()
    isSelling?: boolean;

    @Expose({ name: 'published_at' })
    @IsOptional()
    @IsDateString()
    publishedAt?: string;

    @Expose({ name: 'is_registered' })
    @IsOptional()
    @IsBoolean()
    isRegistered?: boolean;

    @Expose({ name: 'user_progress' })
    @IsOptional()
    @IsNumber()
    userProgress?: number;

    @Expose({ name: 'last_completed_at' })
    @IsOptional()
    @IsString()
    lastCompletedAt?: string;

    @Expose({ name: 'is_coming_soon' })
    @IsOptional()
    @IsBoolean()
    isComingSoon?: boolean;

    @Expose({ name: 'is_pre_order' })
    @IsOptional()
    @IsBoolean()
    isPreOrder?: boolean;

    @Expose({ name: 'is_published' })
    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;

    @Expose({ name: 'related_courses' })
    @IsOptional()
    @IsArray()
    relatedCourses?: any[];
}
