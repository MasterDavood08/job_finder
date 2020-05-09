require('dotenv').config()
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeorm.config';
import { SeekersModule } from './seekers/seekers.module';
import { EmployersModule } from './employers/employers.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfig } from './config/mailer.config';

@Module({
  imports: [MailerModule.forRoot(MailerConfig), TypeOrmModule.forRoot(TypeOrmConfig), AuthModule, UsersModule, SeekersModule, EmployersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
