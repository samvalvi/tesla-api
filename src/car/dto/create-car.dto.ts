import {
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateCarDto {
  @IsString()
  name: string;

  @IsString()
  model: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  quantity?: number;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  colors?: string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  carImages?: string[];
}
