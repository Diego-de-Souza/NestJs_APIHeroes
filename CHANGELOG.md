# **CHANGELOG.md**

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato segue as convenções de [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e este projeto segue [SemVer](https://semver.org/lang/pt-BR/).

---
## [Unreleased]
### **✨ Added**

- (exemplo) Novo endpoint para autenticação com refresh token.

### **🛠️ Changed**

- (exemplo) Melhorada a performace do endpoint.

### **🐛 Fixed**

- (exemplo) Corrigido bug de valização de CPF cadastro de usuário.

### **⚠️ Deprecated**

- (exemplo) Endpoint '/old-login' marcado como obsoleto.

### **❌ Removed**

- (exemplo) Endpoint '/legacy-report' removido. 

### **🛑 Security**

- (exemplo) atualização dependencia do jwttoken para corrigir vuklnerabilidade

---

# **[1.0.1]- 2025-08-21**

### **✨ Added**

- Criação de rota para login social com o Google.
- Criação de metodo na authService para login social com google.
- Criação da AuthSignInGoogleUseCase para conter as regras de login com usuário do google.
- Criação de metodos para criação de usuário e usuário social no banco na authRepository.
- Criação de Model da UserSocialModel para persit^ncia no banco.
- Criação de migration e script no database unit para criação de tabela user_social no banco de dados.

### **🛠️ Changed**

- Inclusão de metodo na AuthService para direcionamento para AuthSignInGoogleUseCase que faz o login com o usuário do google.
- Declaração da AuthSignInGoogleUseCase no module AuthModule.
- Inclusão de metodos para salvar usuário e usuário social no banco.
- Atualização do arquivo README.md.

### **🐛 Fixed**

- 

### **⚠️ Deprecated**

-

### **❌ Removed**

-

### **🛑 Security**

-

---
