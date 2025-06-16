import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { PowerFitnessDbService } from './database/power-fitness-db.service';
import { ClientesModule } from './modules/clientes/clientes.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { AuthModule } from './modules/auth/auth.module';
import { RutinasModule } from './modules/rutinas/rutinas.module';
import { AdministrativosModule } from './modules/administrativos/administrativos.module';
import { UsersModule } from './modules/users/users.module';
import { MembresiasModule } from './modules/membresias/membresias.module';
import { BeneficiosModule } from './modules/beneficios/beneficios.module';

@Module({
  imports: [
    // Configuración
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Servir frontend estático
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public'),
      exclude: ['/api*'],
      serveRoot: '/',
    }),

    // Base de datos
    DatabaseModule,

    // Módulos de la aplicación
    ClientesModule,

    AuthModule,

    RutinasModule,

    AdministrativosModule,

    UsersModule,

    MembresiasModule,

    BeneficiosModule,
  ],
  providers: [PowerFitnessDbService],
  exports: [PowerFitnessDbService],
})
export class AppModule { }
