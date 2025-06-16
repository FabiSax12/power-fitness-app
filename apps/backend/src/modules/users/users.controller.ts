import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':cedula')
  findOne(@Param('cedula') cedula: string) {
    return this.usersService.findOne(+cedula);
  }

  @Patch(':cedula')
  update(@Param('cedula') cedula: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+cedula, updateUserDto);
  }

  @Delete(':cedula')
  remove(@Param('cedula') cedula: string) {
    return this.usersService.remove(+cedula);
  }
}
