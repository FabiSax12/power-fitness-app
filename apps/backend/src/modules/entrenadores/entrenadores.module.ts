import { Module } from '@nestjs/common';
import { EntrenadoresService } from './entrenadores.service';
import { EntrenadoresController } from './entrenadores.controller';

@Module({
  controllers: [EntrenadoresController],
  providers: [EntrenadoresService],
})
export class EntrenadoresModule {}
