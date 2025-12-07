'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Verifica se o usuário root já existe
      const [existingUsers] = await queryInterface.sequelize.query(
        'SELECT COUNT(*) as count FROM users WHERE firstemail = :email OR nickname = :nickname',
        {
          replacements: { 
            email: 'plataformaheroes20250820@gmail.com',
            nickname: 'root'
          },
          type: Sequelize.QueryTypes.SELECT,
          transaction
        }
      );

      if (existingUsers.count > 0) {
        console.log('✅ Usuário root já existe, pulando criação...');
        await transaction.commit();
        return;
      }

      // Hash da senha
      const password = process.env.ROOT_PASSWORD || 'admin@2025';
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insere o usuário root
      const [userResult] = await queryInterface.sequelize.query(
        `INSERT INTO users (
          fullname,
          nickname, 
          firstemail, 
          state,
          city,
          password, 
          twofa_active,
          created_at,
          updated_at
        ) VALUES (
          :fullname,
          :nickname,
          :email,
          :state,
          :city,
          :password,
          :twofa_active,
          NOW(),
          NOW()
        ) RETURNING id`,
        {
          replacements: {
            fullname: 'Administrador do Sistema',
            nickname: 'root',
            email: 'plataformaheroes20250820@gmail.com',
            state: 'Sistema',
            city: 'Servidor',
            password: hashedPassword,
            twofa_active: false
          },
          type: Sequelize.QueryTypes.INSERT,
          transaction
        }
      );

      const userId = userResult[0].id;

      // Insere a role de admin para o usuário
      await queryInterface.sequelize.query(
        `INSERT INTO roles (
          role,
          usuario_id,
          access,
          created_at,
          updated_at
        ) VALUES (
          :role,
          :usuario_id,
          :access,
          NOW(),
          NOW()
        )`,
        {
          replacements: {
            role: 'admin',
            usuario_id: userId,
            access: 'full'
          },
          type: Sequelize.QueryTypes.INSERT,
          transaction
        }
      );

      console.log('🚀 ===============================================');
      console.log('✅ Usuário ROOT criado com sucesso!');
      console.log('📧 Email: plataformaheroes20250820@gmail.com');
      console.log('🔑 Senha: admin@2025');
      console.log('👤 Nickname: root');
      console.log('🛡️  Role: admin (acesso completo)');
      console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
      console.log('===============================================');

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Erro ao criar usuário root:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Remove as roles primeiro (devido à FK)
      await queryInterface.sequelize.query(
        `DELETE FROM roles 
         WHERE usuario_id IN (
           SELECT id FROM users 
           WHERE firstemail = :email OR nickname = :nickname
         )`,
        {
          replacements: { 
            email: 'plataformaheroes20250820@gmail.com',
            nickname: 'root'
          },
          transaction
        }
      );

      // Remove o usuário root
      await queryInterface.sequelize.query(
        'DELETE FROM users WHERE firstemail = :email OR nickname = :nickname',
        {
          replacements: { 
            email: 'plataformaheroes20250820@gmail.com',
            nickname: 'root'
          },
          transaction
        }
      );

      console.log('✅ Usuário root removido com sucesso!');
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Erro ao remover usuário root:', error);
      throw error;
    }
  }
};