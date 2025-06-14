import { Module } from '@nestjs/common';
import { AdministrativosService } from './administrativos.service';
import { AdministrativosController } from './administrativos.controller';
import { PowerFitnessDbService } from 'src/database/power-fitness-db.service';

@Module({
  controllers: [AdministrativosController],
  providers: [AdministrativosService, PowerFitnessDbService],
})
export class AdministrativosModule { }
