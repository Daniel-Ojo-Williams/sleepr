import { IsEmail, IsString } from 'class-validator';

export class ReservationCreatedMailDto {
  @IsEmail()
  toEmail: string;

  @IsString()
  toName: string;
}
