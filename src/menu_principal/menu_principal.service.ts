import { Injectable } from '@nestjs/common';
import { CreateMenuPrincipalDto } from './dto/create-menu_principal.dto';
import { UpdateMenuPrincipalDto } from './dto/update-menu_principal.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Studio,Team } from 'src/models/index.model';

@Injectable()
export class MenuPrincipalService {

  async getData(): Promise<any> {
    try {
      const dadosMenu = await Promise.all([
        Studio.findAll({ attributes: ['nome'] }),
        Team.findAll({ attributes: ['nome'] }),
      ]);
  
      // Verifica se todos os resultados foram retornados corretamente
      if (dadosMenu.some(result => !result)) {
        throw new Error('Alguns dados do banco não retornaram');
      }
  
      return dadosMenu;
  
    } catch (err) {
      return { error: err.message };
    }
  }
  

  findAll() {
    return `This action returns all menuPrincipal`;
  }

  findOne(id: number) {
    return `This action returns a #${id} menuPrincipal`;
  }

  update(id: number, updateMenuPrincipalDto: UpdateMenuPrincipalDto) {
    return `This action updates a #${id} menuPrincipal`;
  }

  remove(id: number) {
    return `This action removes a #${id} menuPrincipal`;
  }
}
