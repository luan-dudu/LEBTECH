name: Teste Neon DB

on:
  push:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest

    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}

    steps:
      - name: Clonar repositório
        uses: actions/checkout@v3

      - name: Instalar Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Instalar pnpm
        run: npm install -g pnpm

      - name: Instalar dependências
        run: pnpm install

      - name: Rodar teste de conexão
        run: node test-db.js