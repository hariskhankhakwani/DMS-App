import { Expose } from 'class-transformer';
import { IsNotEmpty, IsEmail, IsJWT, IsString, MaxLength, MinLength, minLength } from 'class-validator';

export class RegisterUserRequest {
  @Expose()
  @IsString()
  @IsNotEmpty({ message: 'Firstname cannot be empty ' })
  @MinLength(2, { message: 'Firstname minimum length can be two ' })
  @MaxLength(50, { message: 'Firstname max length can be fifty' })
  firstName: string;

  @Expose()
  @IsString()
  @IsNotEmpty({ message: 'Lastname cannot be empty ' })
  @MinLength(2, { message: 'Lastname minimum length can be two ' })
  @MaxLength(50, { message: 'Lastname max length can be fifty' })
  lastName: string;

  @IsString()
  @IsEmail()
  @Expose()
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  @IsString({ message: 'Password has to be alpha numeric ' })
  @Expose()
  @MinLength(8, { message: 'Password minimum length can be eight' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}

export type RegisterUserResponse = {
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  password: string;
};

export class LoginUserRequest {
  @IsString()
  @IsEmail()
  @Expose()
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Expose()
  password: string;
}

export class RefreshTokenRequest {
  @IsJWT({ message: 'token must be jwt' })
  @IsNotEmpty()
  refreshToken: string;
}

export class RefreshTokenResponse {
  @IsJWT({ message: 'token must be jwt' })
  @IsNotEmpty()
  accessToken: string;
}

export class JWTAccessTokenPayload {
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;
}

export class JWTRefreshTokenPayload {
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;
}

export class LoginUserResponse {
  accessToken: string;
  id: string;
  email: string;
}
