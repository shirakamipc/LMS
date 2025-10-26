import { IsString, IsNumber, IsOptional, IsInt, Min } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  chapterId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  videoProvider: string;

  @IsString()
  videoRef: string;

  @IsInt()
  @Min(0)
  durationSeconds: number;

  @IsInt()
  @Min(1)
  position: number;
}

export class UpdateLessonDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  videoProvider?: string;

  @IsOptional()
  @IsString()
  videoRef?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  durationSeconds?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  position?: number;
}

export class UpdateProgressDto {
  @IsOptional()
  is_completed?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  watch_seconds?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  last_checkpoint_seconds?: number;
}

export class SubmitQuizAttemptDto {
  @IsString()
  selectedOptionId: string;
}
