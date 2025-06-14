import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PowerFitnessDbService } from 'src/database/power-fitness-db.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PowerFitnessDbService],
})
export class UsersModule { }
