import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateLearningPathDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @Expose({ name: 'image_url' })
    @IsOptional()
    @IsString()
    imageUrl?: string;
}
