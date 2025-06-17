import { Module } from '@nestjs/common';
import { BeneficiosService } from './beneficios.service';
import { BeneficiosController } from './beneficios.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [BeneficiosController],
  providers: [BeneficiosService, DatabaseService],
})
export class BeneficiosModule { }
