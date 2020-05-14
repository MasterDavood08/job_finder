import { Module } from '@nestjs/common';
import { EmployersController } from './employers.controller';
import { EmployersService } from './employers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployerRepository } from './employer.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EmployerRepository])],
  controllers: [EmployersController],
  providers: [EmployersService],
  exports: [EmployersService]
})
export class EmployersModule { }
