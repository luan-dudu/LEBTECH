<h1>🚀 Projeto LEB TECH - Soluções em Tecnologia</h1>

### Este projeto consiste em um sistema institucional e de gestão para a **LEB TECH**, uma empresa especializada em serviços de TI. A aplicação oferece uma interface moderna para que clientes conheçam soluções tecnológicas e solicitem orçamentos, além de um painel administrativo completo para gerenciamento de solicitações e usuários.

✨ Funcionalidades

### 📦 Catálogo de Serviços
Apresentação detalhada dos serviços oferecidos:
- Assistência Técnica
- Venda de Equipamentos
- Consultoria
- Projetos
- Gestão de TI

### 📝 Solicitação de Orçamentos
Formulários específicos por tipo de serviço, permitindo o envio de:
- Detalhes técnicos
- Necessidades de negócio

### 🔐 Painel Administrativo
Área restrita para gestão de leads:
- Visualização de solicitações
- Filtros avançados
- Atualização de status

### 👥 Gestão de Usuários
Controle completo de acesso:
- Admin
- Gerente
- Usuário

### 📊 Dashboard de Indicadores
Visualização de métricas com gráficos dinâmicos:
- Volume de solicitações
- Status de atendimento
- Indicadores de desempenho

## 🛠️ Tecnologias Utilizadas

### Frontend
- React 19
- Vite
- TailwindCSS 4
- TypeScript
- Framer Motion
- Shadcn/ui
- Lucide React
- Wouter
- Sonner
- Recharts

### Backend
- Node.js
- Express
- TypeScript
- Drizzle ORM
- Zod

### Banco de Dados
- PostgreSQL (ou compatível)

## ⚙️ Instalação

### 📋 Requisitos
- Node.js >= 20.x.x
- npm ou yarn
- PostgreSQL


### 🚀 Passo a Passo

#### 1. Clone o repositório

```bash

git clone https://github.com/usuario/lebtech-site.git
cd lebtech-site
```

2. Instale as dependências
```   
npm install
```

4. Configure as variáveis de ambiente
```
Crie um arquivo .env na raiz do projeto:

DATABASE_URL="postgresql://usuario:senha@host:port/database"
```

4. Execute as migrações do banco
```   
npx drizzle-kit 
push
```

6. Inicie o servidor
 ```  
npm run dev
 ``` 

🌐 Acesso ao Sistema

Após iniciar o servidor:
 ``` 
Aplicação: http://localhost:3000
 ``` 




