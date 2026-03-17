# PDA-SYSTEM 🚀

Bem-vindo ao **PDA-SYSTEM**! Este é um ecossistema completo (Full-Stack) desenvolvido para o gerenciamento preciso de pesos e usuários. O projeto une um **Backend robusto em ASP.NET Core 8.0** com um **Frontend moderno e ultra-responsivo em React 19**, focado em performance, segurança e uma experiência de usuário (UX) de alto nível.

O sistema foi construído sob o conceito de **Monorepo**, mantendo API e Web em um único repositório para facilitar a manutenção e o deploy sincronizado.

<div align="center">
  <img src="https://img.shields.io/badge/.NET%208-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt=".NET 8">
  <img src="https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white" alt="JWT">
</div>

---

## ✨ Sobre o Projeto

O **PDA-SYSTEM** foi desenvolvido para atender à necessidade de controle rigoroso de especificações de produtos. Ele permite a consulta, cadastro, edição e exclusão de parâmetros de peso, além de contar com um sistema de auditoria que registra qual usuário realizou a última atualização.

A segurança é um pilar central, utilizando **RBAC (Role-Based Access Control)** com três níveis de permissão:
- **HOKAGE:** Acesso total ao sistema, incluindo gestão de usuários e exclusão de dados.
- **ADMINISTRADOR:** Gestão completa de produtos (Cadastro/Edição).
- **OPERADOR:** Acesso restrito a consultas e visualização de dados.

---

## 🌟 Funcionalidades Principais

- ✅ **Autenticação Avançada:** Sistema de login com tokens JWT, expiração controlada e suporte a upgrade automático de hash de senhas antigas para **BCrypt**.
- ✅ **Dashboard de Produtos:** Interface dinâmica para busca rápida de códigos de produto com visualização detalhada de pesos mínimos, máximos e revisões.
- ✅ **Gestão de Usuários (HOKAGE Only):** Painel administrativo para criação de contas, troca de senhas e alteração de níveis de acesso em tempo real.
- ✅ **UI/UX Dark Premium:** Interface construída com **Tailwind CSS 4.0** e **Shadcn UI**, apresentando temas escuros, animações de transição suaves e componentes modulares.
- ✅ **Sistema de Notificações Toast:** Feedback instantâneo no canto superior direito para ações de sucesso, alerta ou erro, utilizando instâncias personalizadas de SweetAlert2.
- ✅ **Segurança de Endpoints:** Proteção de rotas tanto no Frontend (React Router) quanto no Backend (Policies do ASP.NET Core).

---

## 🧱 Estrutura do Projeto

O projeto utiliza uma estrutura modular e escalável:
```
├── PdaSystem.API/           # Backend ASP.NET Core 8.0
│   ├── Controllers/         # Endpoints da API (Auth, Products, Users)
│   ├── Data/                # Contexto do Entity Framework e Migrations
│   ├── DTOs/                # Objetos de Transferência de Dados
│   ├── Models/              # Entidades do Banco de Dados (Mapeamento ORM)
│   └── appsettings.json.template # Modelo de configuração de ambiente
├── pda-system-web/          # Frontend React 19 + Vite
│   ├── src/
│   │   ├── components/      # UI Components (Shadcn) e Layout (Sidebar, Menu)
│   │   ├── contexts/        # Gerenciamento de estado (SidebarAction)
│   │   ├── hooks/           # Hooks personalizados (useAuth)
│   │   ├── pages/           # Páginas principais (Login, Products, Users)
│   │   └── services/        # Configuração do Axios e chamadas de API
├── .gitignore               # Regras de exclusão para o Git
└── LICENSE                  # Licença MIT
```

---

## 🛠️ Pilha de Tecnologias (Tech Stack)

#### Backend (API)
- **C# / .NET 8:** Linguagem e Framework principal.
- **Entity Framework Core:** ORM para manipulação do banco de dados MySQL.
- **BCrypt.Net:** Criptografia de alta segurança para senhas.
- **QuestPDF:** Engine preparada para futura geração de relatórios PDF.
- **Swashbuckle:** Documentação interativa dos endpoints (Swagger).

#### Frontend (Web)
- **React 19:** Biblioteca principal para a interface.
- **Vite:** Ferramenta de build ultra-rápida.
- **Tailwind CSS 4.0:** Estilização baseada em utilitários e variáveis OKLCH.
- **Axios:** Cliente HTTP com interceptadores para renovação de sessão.
- **Lucide React:** Conjunto de ícones vetoriais modernos.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- .NET SDK 8.0+
- Node.js (v18+)
- MySQL Server

### 1. Configuração do Backend (API)
1. Navegue até a pasta `PdaSystem.API/PdaSystem.API`.
2. Renomeie o arquivo `appsettings.json.template` para `appsettings.json`.
3. Preencha a `DefaultConnection` com seus dados do MySQL e defina uma `Jwt:Secret`.
4. Execute as migrations ou inicie o projeto:
   ```bash
   dotnet run
   ```

### 2. Configuração do Frontend (Web)
Navegue até a pasta `pda-system-web`.

**Instale as dependências:**
npm install

**Inicie o servidor de desenvolvimento:**
npm run dev

---

## ✉️ Contato

- **Desenvolvedor:** Johnatan dos Santos Reis
- **GitHub:** [DevSanthiago](https://github.com/DevSanthiago)
- **Organização:** Engenharia de Automação — Grupo Multi

---

_Este projeto é uma ferramenta interna protegida sob a **Licença MIT**._

   
