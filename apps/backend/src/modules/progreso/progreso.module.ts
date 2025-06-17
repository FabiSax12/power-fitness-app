import { Module } from '@nestjs/common';
import { ProgresoService } from './progreso.service';
import { ProgresoController } from './progreso.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [ProgresoController],
  providers: [ProgresoService, DatabaseService],
})
export class ProgresoModule { }
