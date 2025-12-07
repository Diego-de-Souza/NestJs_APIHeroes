import { Module } from '@nestjs/common';
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { MenuPrincipalController } from '../../interface/controllers/menu_principal.controller';
import { MenuPrincipalService } from '../../application/services/menu-principal.service';
import { MenuPrincipalUseCase } from '../../application/use-cases/menu-principal/menu-principal.use-case';
import { MenuPrincipalRepository } from '../../infrastructure/repositories/menu-principal.repository';

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
