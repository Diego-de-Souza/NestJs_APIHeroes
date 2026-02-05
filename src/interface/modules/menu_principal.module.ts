import { Module } from '@nestjs/common';
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { MenuPrincipalController } from '../../interface/controllers/menu_principal.controller';
import { MenuPrincipalUseCase } from '../../application/use-cases/menu-principal/menu-principal.use-case';
import { MenuPrincipalRepository } from '../../infrastructure/repositories/menu-principal.repository';

/**
 * Módulo Menu Principal – arquitetura Clean/Hexagonal.
 * Port IN → UseCase; Port OUT → Repository.
 */
@Module({
  imports: [SequelizeModule.forFeature(models)],
  controllers: [MenuPrincipalController],
  providers: [
    MenuPrincipalRepository,
    MenuPrincipalUseCase,
    { provide: 'IFindMenuDataPort', useClass: MenuPrincipalUseCase },
    { provide: 'IMenuPrincipalRepository', useClass: MenuPrincipalRepository },
  ],
  exports: ['IMenuPrincipalRepository', MenuPrincipalRepository],
})
export class MenuPrincipalModule {}
