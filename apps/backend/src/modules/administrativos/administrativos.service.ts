import { Injectable } from '@nestjs/common';
import { CreateAdministrativoDto } from './dto/create-administrativo.dto';
import { UpdateAdministrativoDto } from './dto/update-administrativo.dto';
import { PowerFitnessDbService } from 'src/database/power-fitness-db.service';

@Injectable()
export class AdministrativosService {
  constructor(
    private readonly dbService: PowerFitnessDbService
  ) { }
  create(createAdministrativoDto: CreateAdministrativoDto) {
    return 'This action adds a new administrativo';
  }

  findAll() {
    return `This action returns all administrativos`;
  }

  findOne(cedula: string) {
    return this.dbService.consultarAdministrativo(cedula);
  }

  getAnanlisisFinanciero() {
    return this.dbService.obtenerAnalisisFinanciero();
  }

  update(id: number, updateAdministrativoDto: UpdateAdministrativoDto) {
    return `This action updates a #${id} administrativo`;
  }

  remove(id: number) {
    return `This action removes a #${id} administrativo`;
  }
}
