import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  Min,
} from 'class-validator';

export class CreatePaymentDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(100)
  amount: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  expiration?: Date;

  @IsObject()
  @IsOptional()
  meta?: Record<string, string>;
}
