import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdministrativosService } from './administrativos.service';
import { CreateAdministrativoDto } from './dto/create-administrativo.dto';
import { UpdateAdministrativoDto } from './dto/update-administrativo.dto';

@Controller('administrativos')
export class AdministrativosController {
  constructor(private readonly administrativosService: AdministrativosService) { }

  @Post()
  create(@Body() createAdministrativoDto: CreateAdministrativoDto) {
    return this.administrativosService.create(createAdministrativoDto);
  }

  @Get()
  findAll() {
    return this.administrativosService.findAll();
  }

  @Get(':cedula')
  findOne(@Param('cedula') cedula: string) {
    return this.administrativosService.findOne(cedula);
  }

  @Get(':cedula/financiero')
  getAnanlisisFinanciero() {
    return this.administrativosService.getAnanlisisFinanciero();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdministrativoDto: UpdateAdministrativoDto) {
    return this.administrativosService.update(+id, updateAdministrativoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.administrativosService.remove(+id);
  }
}
