<div align="center">
  <img src="public/logo/Logo.png" alt="Ponto a Ponto Logo" width="100" />
  <h1>Ponto a Ponto</h1>
  <p><strong>Organizador pessoal de tarefas integrando planejamento, execução e rastreamento de tempo.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  </p>
</div>

---

## 📌 Sobre o Projeto

O **Ponto a Ponto** é um organizador pessoal desenvolvido para centralizar o planejamento, a organização e o acompanhamento de atividades em um único ambiente.

Mais do que uma simples lista de afazeres (*to-do list*), o Ponto a Ponto une **planejamento** e **execução**: permite acompanhar as atividades desde o momento em que são planejadas no calendário até sua conclusão no Kanban, mantendo prazos, notas contextuais e métricas de tempo em um só lugar.

> *O conceito por trás do nome representa justamente essa ideia: avançar gradualmente, conectando cada etapa e transformando pequenas ações em progresso contínuo.*

---

## 🚀 Funcionalidades Principais

| Módulo | Descrição | Status |
| :--- | :--- | :---: |
| 📅 **Planejamento** | Calendário interativo mensal/semanal. Atividades que duram múltiplos dias são conectadas visualmente por um **gradiente gradual de cores**, destacando a continuidade temporal. | ✅ Implementado |
| 📝 **Detalhamento** | Visão *Master-Detail*: seleção de tarefas com metadados à esquerda e editor de anotações ricas à direita com salvamento em tempo real. | ✅ Implementado |
| ⏱️ **Cronômetro** | Temporizador com display circular animado (estilo anel de progresso), cronometragem livre ou vinculada a uma tarefa e salvamento do tempo dedicado no histórico da atividade. | ✅ Implementado |
| 📋 **Fases (Kanban)** | Quadro de fluxo de trabalho dividido em 4 colunas (**A Fazer**, **Em Processo**, **Revisão**, **Finalizado**) com suporte a *drag-and-drop*, atalhos rápidos de avanço e abas mobile. | ✅ Implementado |
| ➕ **Criação de Tarefas** | Modal global para cadastro de tarefas com datas de início/fim, prioridades e seleção de paletas de gradientes personalizadas. | ✅ Implementado |
| 📱 **Design Responsivo** | Interface adaptada para desktop e mobile com menu lateral retrátil (*Sidebar Drawer*) baseado nos protótipos originais. | ✅ Implementado |

---

## 🛠️ Stack Tecnológica

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Biblioteca de UI:** [React 19](https://react.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Manipulação de Datas:** [date-fns](https://date-fns.org/)
- **Armazenamento:** LocalStorage reativo via `AppContext` (preparado para sincronização com Supabase/PostgreSQL)

---

## 📁 Estrutura do Projeto

```text
ponto-a-ponto/
├── public/
│   └── logo/             # Logo oficial e favicon
├── src/
│   ├── app/
│   │   ├── layout.tsx     # Shell raiz com AppProvider e estilos globais
│   │   ├── page.tsx       # Visão 1: Planejamento (Calendário)
│   │   ├── detalhamento/  # Visão 2: Detalhamento (Tarefas & Anotações)
│   │   ├── cronometro/    # Visão 3: Cronômetro (Temporizador Circular)
│   │   ├── fases/         # Visão 4: Fases (Quadro Kanban)
│   │   └── globals.css    # Variáveis de cores, tema e scrollbar customizada
│   ├── components/
│   │   ├── AppShell.tsx   # Shell padrão com Header e acionamento da Sidebar
│   │   ├── Sidebar.tsx    # Menu lateral retrátil com rotas e Logo
│   │   └── TaskModal.tsx  # Modal de criação de tarefas com seletor de gradientes
│   ├── context/
│   │   └── AppContext.tsx # Estado global, sincronização e persistência
│   └── types/
│       └── index.ts       # Definições de tipos (Task, TaskStatus, TimeSession)
├── Prototipos/            # Wireframes e rascunhos originais de design
└── README.md
```

---

## 💻 Como Rodar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior
- [npm](https://www.npmjs.com/) ou [pnpm](https://pnpm.io/)

### Passo a Passo

1. **Clone o repositório ou acesse a pasta:**
   ```bash
   cd "Ponto a Ponto"
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   Abra [http://localhost:3000](http://localhost:3000)

---

## 🗺️ Roadmap de Evolução

- [x] **Fase 1: Setup & Prototipação Funcional**
  - [x] Configuração inicial Next.js + Tailwind CSS v4.
  - [x] Criação da navegação e layout baseado nos wireframes.
  - [x] Implementação das 4 visões (Planejamento, Detalhamento, Cronômetro, Fases).
  - [x] Suporte a gradientes temporais em tarefas multi-dias no calendário.
  - [x] Persistência local (LocalStorage).
- [ ] **Fase 2: Persistência em Nuvem & Multi-dispositivo**
  - [ ] Modelagem e conexão com Supabase (PostgreSQL).
  - [ ] Criação de autenticação (Login com Google / E-mail).
  - [ ] Sincronização em tempo real das sessões do cronômetro.
- [ ] **Fase 3: Refinamentos e Funcionalidades Avançadas**
  - [ ] Notificações sonoras/visuais ao completar blocos de tempo (Pomodoro opcional).
  - [ ] Exportação e importação de dados (JSON/CSV).
  - [ ] Suporte a PWA para instalação no celular e no computador como aplicativo nativo.

---

## 📜 Histórico de Commits Principais

- `b1f34c5` — `chore: setup inicial do projeto com Next.js, Tailwind CSS e dependencias basicas`
- `8003b76` — `feat: implementacao completa das 4 visoes baseadas nos prototipos (Planejamento, Detalhamento, Cronometro e Fases)`
- `efe5e2a` — `fix: adicionar @tailwindcss/postcss e postcss.config.mjs para compilacao do Tailwind CSS`
- `docs: criacao do README.md detalhando proposta, arquitetura, stack e roadmap`
