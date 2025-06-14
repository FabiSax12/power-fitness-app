import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { PowerFitnessDbService } from 'src/database/power-fitness-db.service';

@Module({
  controllers: [ClientesController],
  providers: [ClientesService, PowerFitnessDbService],
})
export class ClientesModule { }
