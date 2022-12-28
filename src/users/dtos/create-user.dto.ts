import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password: string;
}
