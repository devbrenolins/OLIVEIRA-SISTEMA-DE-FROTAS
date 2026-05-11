# OLIVEIRA FLEET CONTROL

Sistema interno de gestão de frotas desenvolvido para operação, controle logístico e acompanhamento técnico da **OLIVEIRA MANUTENÇÃO E VENDAS**.

A aplicação centraliza o gerenciamento da frota, ordens de serviço, motoristas, inspeções operacionais e acompanhamento de viagens, oferecendo controle administrativo e rastreabilidade completa da operação.

---

## Estrutura do sistema

### Administrativo

- Cadastro e gerenciamento de veículos
- Controle de motoristas
- Gestão de ordens de serviço
- Planejamento e distribuição de rotas
- Controle de quilometragem
- Histórico operacional
- Indicadores de desempenho
- Relatórios gerenciais

### Operacional (Motorista)

- Visualização de rotas
- Registro de saída e chegada
- Quilometragem inicial e final
- Relatos operacionais
- Registro de ocorrências
- Checklist diário

### Inspeção de veículo

Checklist obrigatório antes da liberação:

- Nível de óleo
- Pneus
- Sistema de iluminação
- Freios
- Água / arrefecimento
- Documentação
- Condições gerais

Em caso de irregularidade crítica, o veículo pode ser bloqueado para operação até validação administrativa.

---

## Tecnologias utilizadas

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL

---

## Instalação local

Clone o projeto:

```bash
git clone URL_DO_REPOSITORIO
```

Acesse a pasta:

```bash
cd oliveira-fleet-control
```

Instale as dependências:

```bash
npm install
```

Execute:

```bash
npm run dev
```

---

## Configuração do ambiente

Criar arquivo:

```env
.env.local
```

Adicionar:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Banco de dados

A estrutura está preparada para integração com Supabase.

Principais entidades:

- usuários
- veículos
- motoristas
- ordens de serviço
- rotas
- viagens
- inspeções
- abastecimentos
- manutenções
- relatórios

---

## Deploy

Ambiente recomendado:

- Vercel

Deploy de produção:

```bash
npm run build
```

---

## Objetivo

Padronizar o controle operacional da frota, reduzir falhas de registro, melhorar rastreabilidade de atendimentos externos e fornecer indicadores confiáveis para tomada de decisão.

---

## Empresa

**OLIVEIRA MANUTENÇÃO E VENDAS**
