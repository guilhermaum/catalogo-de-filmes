# MyCineList

Catálogo pessoal de filmes feito com TypeScript, HTML e CSS. O projeto permite cadastrar filmes, acompanhar o status de cada um e organizar a lista.

## Funcionalidades

- Cadastro de título, sinopse, gênero, ano, duração, país e status de exibição.
- Validação dos campos obrigatórios e dos limites de ano e duração.
- Listagem de filmes com resumo dos totais cadastrados, assistidos e não assistidos.
- Busca pelo título e filtro por status.
- Alteração do status de exibição e exclusão de filmes.

## Requisitos

- Node.js e npm.
- Python 3 para servir a página localmente, ou uma extensão como Live Server no VS Code.

## Como executar

Instale as dependências do projeto:

```bash
npm install
```

No primeiro terminal, na pasta do projeto, inicie o compilador em modo de observação:

```bash
npx tsc --watch
```

O compilador gera os arquivos JavaScript em `dist/` e os atualiza quando os arquivos TypeScript mudam.

Em um segundo terminal, também na pasta do projeto, inicie um servidor HTTP:

```bash
python -m http.server 5500 --bind 127.0.0.1
```

Abra [http://127.0.0.1:5500/](http://127.0.0.1:5500/) no navegador. Mantenha os dois terminais em execução enquanto usa o projeto. Também é possível servir o `index.html` com o Live Server.

> O compilador gera os arquivos do app, enquanto o servidor HTTP disponibiliza a página no navegador. A página deve ser aberta pelo endereço local, não diretamente pelo caminho do arquivo.

Para fazer uma compilação única, sem modo de observação:

```bash
npm run build
```

## Estrutura do projeto

```text
src/
├── app.ts                       # Inicialização do app
├── controllers/
│   └── movieController.ts       # Coordena ações e atualizações da interface
├── models/
│   └── movieModel.ts            # Tipos dos dados de filme
├── services/
│   └── movieService.ts          # Cadastro, busca, status e exclusão
└── views/
    └── movieView.ts             # Formulário e renderização do catálogo
index.html                        # Estrutura da página
styles.css                        # Estilos
dist/                             # JavaScript gerado pelo TypeScript
```

## Armazenamento

Os filmes ficam em memória enquanto a página está aberta. Ao recarregá-la, a lista volta ao estado vazio.
