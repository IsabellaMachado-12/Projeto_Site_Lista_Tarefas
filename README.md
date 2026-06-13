# 💜 FLOWFY - Lista de Tarefas & Controle Financeiro Integrado

O **FLOWFY** é uma plataforma moderna e elegante para gerenciamento de produtividade pessoal e controle financeiro (fluxo de caixa) integrado. Construído com tecnologias web de ponta, oferece uma experiência visual premium (glassmorphism, gradientes harmoniosos e micro-interações) e sincronização em tempo real.

---

## 🚀 Principais Funcionalidades

### 📋 Gestão de Tarefas (Kanban)
* **Fluxo de Trabalho em 4 Colunas**: Organize suas tarefas entre as colunas **A Fazer**, **Em Progresso**, **Pendente** e **Concluído**.
* **Modal Dinâmico**: Crie e edite tarefas através de um fluxo baseado em modal centralizado e responsivo.
* **Informações Detalhadas**: Cada tarefa possui Título, Descrição (multilinha), Categoria, Nível de Prioridade (Baixa, Média, Alta) e Data Limite.
* **Filtros Avançados**: Barra de busca em tempo real e filtros rápidos por Categoria ou Nível de Prioridade no cabeçalho do Kanban.

### 💰 Controle Financeiro (Cash Flow)
* **Fluxo de Caixa Simplificado**: Cadastro ágil de receitas e despesas.
* **Saldos em Destaque**: Painel com Saldo Geral, Total de Entradas e Total de Saídas em tempo real.
* **Histórico de Transações**: Lista de movimentações ordenadas por data com possibilidade de exclusão.

### 📅 Calendário de Tarefas
* **Visualização Mensal**: Acompanhe visualmente as datas de entrega de suas tarefas distribuídas no calendário do mês corrente.

### 📊 Analytics
* **Métricas Visuais**: Painéis com gráficos de distribuição de tarefas por prioridade e por status de conclusão, além de resumos de produtividade.

### 🔒 Autenticação & Segurança
* Autenticação de usuários segura e independente por e-mail e senha gerenciada pelo Supabase Auth.
* Isolamento de dados baseado em **Row Level Security (RLS)**, garantindo que cada usuário visualize e gerencie apenas suas próprias tarefas e finanças.

---

## 🛠️ Tecnologias Utilizadas

* **Front-end**: React (v18) + TypeScript + Vite.
* **Estilização**: Tailwind CSS + Custom CSS (Vibrant Purple Theme / Glassmorphism).
* **Banco de Dados & Auth**: Supabase (PostgreSQL).
* **Ícones**: Lucide React.
* **Gráficos**: Recharts.

---

## 📦 Estrutura de Tabelas no Supabase

Para o correto funcionamento do aplicativo, as seguintes tabelas precisam estar criadas no seu banco de dados PostgreSQL do Supabase:

### 1. Tabela `categories`
Armazena as categorias das tarefas.
* `id` (uuid, primary key)
* `name` (text, obrigatório)
* `color` (text, classe Tailwind para fundo)
* `text_color` (text, classe Tailwind para texto)
* `border_color` (text, classe Tailwind para borda)
* `created_at` (timestamp with time zone)

### 2. Tabela `todos`
Armazena as tarefas cadastradas pelos usuários.
* `id` (uuid, primary key)
* `title` (text, obrigatório)
* `description` (text, opcional)
* `completed` (boolean, padrão `false`)
* `due_date` (date, obrigatório)
* `priority` (text, valores: `'low' | 'medium' | 'high'`)
* `category_id` (uuid, chave estrangeira para `categories.id`)
* `user_email` (text, e-mail do usuário autenticado)
* `created_at` (timestamp with time zone)

### 3. Tabela `finance_transactions`
Armazena as transações financeiras.
* `id` (uuid, primary key)
* `user_email` (text, e-mail do usuário autenticado)
* `description` (text, obrigatório)
* `amount` (numeric, obrigatório)
* `type` (text, valores: `'income' | 'expense'`)
* `category` (text, obrigatório)
* `date` (date, obrigatório)
* `created_at` (timestamp with time zone)

*Nota: Certifique-se de ativar o **RLS (Row Level Security)** nas tabelas `todos` e `finance_transactions` filtrando pela coluna `user_email` vinculada ao `auth.jwt() ->> 'email'`.*

---

## ⚙️ Instalação e Execução Local

Siga as instruções abaixo para rodar o projeto localmente em sua máquina:

### 1. Clonar o Repositório
```bash
git clone https://github.com/IsabellaMachado-12/Projeto_Site_Lista_Tarefas.git
cd "07 Lista de Tarefas"
```

### 2. Configurar Variáveis de Ambiente
Renomeie o arquivo `.env.example` para `.env` na raiz do projeto:
```bash
cp .env.example .env
```
Abra o arquivo `.env` e preencha com as credenciais do seu projeto Supabase:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_publica
```

### 3. Instalar Dependências
```bash
npm install
```

### 4. Executar em Modo de Desenvolvimento
```bash
npm run dev
```
O servidor local será iniciado (geralmente em `http://localhost:5173`).

### 5. Compilar para Produção (Build)
```bash
npm run build
```

---

## 🎨 Design & Layout
O FLOWFY apresenta uma interface escura e moderna com gradientes vibrantes em tons de roxo e azul, transparências suaves no estilo *glassmorphism*, sombras profundas e micro-animações interativas ao passar o mouse ou focar em campos.
