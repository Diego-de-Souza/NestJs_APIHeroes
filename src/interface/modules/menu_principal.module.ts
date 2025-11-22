import { Module } from '@nestjs/common';
import { models } from 'src/infrastructure/database/sequelize/models/index.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { MenuPrincipalController } from 'src/interface/controllers/menu_principal.controller';
import { MenuPrincipalService } from 'src/application/services/menu-principal.service';
import { MenuPrincipalUseCase } from 'src/application/use-cases/menu-principal/menu-principal.use-case';
import { MenuPrincipalRepository } from 'src/infrastructure/repositories/menu-principal.repository';

@Module({
  imports: [SequelizeModule.forFeature(models)],
  controllers: [MenuPrincipalController],
  providers: [
    MenuPrincipalService,
    MenuPrincipalUseCase,
    MenuPrincipalRepository
  ],
  exports: [MenuPrincipalService]
})
export class MenuPrincipalModule {}
