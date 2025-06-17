import { Module } from '@nestjs/common';
import { MembresiasService } from './membresias.service';
import { MembresiasController } from './membresias.controller';
import { PowerFitnessDbService } from 'src/database/power-fitness-db.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [MembresiasController],
  providers: [MembresiasService, PowerFitnessDbService, DatabaseService],
})
export class MembresiasModule { }
