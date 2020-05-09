import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './passport/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/user.repository';
import { UserpasswordRepository } from 'src/users/password/user-password.repository';
import { jwtConstants } from './constants';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [UsersModule, PassportModule, TypeOrmModule.forFeature([UserRepository, UserpasswordRepository]), JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: {
      expiresIn: '7d',
      issuer: 'ED',
    },
  })],

})
export class AuthModule { }
