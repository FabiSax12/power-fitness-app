import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EntrenadoresService } from './entrenadores.service';
import { CreateEntrenadoreDto } from './dto/create-entrenadore.dto';
import { UpdateEntrenadoreDto } from './dto/update-entrenadore.dto';

@Controller('entrenadores')
export class EntrenadoresController {
  constructor(private readonly entrenadoresService: EntrenadoresService) { }

  @Post()
  create(@Body() createEntrenadoreDto: CreateEntrenadoreDto) {
    return this.entrenadoresService.create(createEntrenadoreDto);
  }

  @Get()
  findAll() {
    return this.entrenadoresService.findAll();
  }

  @Get(':cedula')
  findOne(@Param('cedula') cedula: string) {
    return this.entrenadoresService.findOne(+cedula);
  }

  @Get(':cedula/clientes')
  async findClients(@Param('cedula') cedula: string) {
    const clients = await this.entrenadoresService.findClients(cedula);
    return clients.recordset;
  }

  @Patch(':cedula')
  update(@Param('cedula') cedula: string, @Body() updateEntrenadoreDto: UpdateEntrenadoreDto) {
    return this.entrenadoresService.update(+cedula, updateEntrenadoreDto);
  }

  @Delete(':cedula')
  remove(@Param('cedula') cedula: string) {
    return this.entrenadoresService.remove(+cedula);
  }
}
