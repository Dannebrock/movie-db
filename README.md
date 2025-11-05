# 🎬 App de Descoberta de Filmes

Este é um projeto front-end construído com **React**, **TypeScript** e **Tailwind CSS**.  
O objetivo principal é listar filmes populares consumindo a API do [The Movie Database (TMDB)](https://www.themoviedb.org/).

Veja o projeto funcionando hospedado na **Vercel** : [Acesse Aqui!](https://movie-db-cdb1.vercel.app)
---

## ✨ Funcionalidades

- **Listagem de Filmes Populares:** Exibe os filmes mais populares do momento na página inicial.  
- **Scroll Infinito:** Carrega automaticamente mais filmes (próxima página) conforme o usuário rola a página.  
- **Estado de Carregamento:** Exibe um *spinner* de carregamento enquanto os filmes são buscados.  
- **Tratamento de Erro:** Mostra uma mensagem amigável caso a API falhe.  
- **Design Responsivo:** O layout se adapta a diferentes tamanhos de tela (mobile, tablet, desktop).  
- **Favoritos:** Permite salvar e visualizar seus filmes favoritos.  
- **Testes:** Cobertura de testes unitários e de integração para os principais componentes e páginas.

---

## 🛠️ Tecnologias Utilizadas

- ⚛️ [React](https://reactjs.org/) (com Hooks)  
- 🧩 [TypeScript](https://www.typescriptlang.org/)  
- ⚡ [Vite](https://vitejs.dev/)  
- 🎨 [Tailwind CSS](https://tailwindcss.com/)  
- 🌐 [Axios](https://axios-http.com/)  
- 🔄 [React Infinite Scroll Component](https://www.npmjs.com/package/react-infinite-scroll-component)  
- 🧪 [Vitest](https://vitest.dev/)  
- 🧰 [React Testing Library](https://testing-library.com/)

---

## 🚀 Como Executar o Projeto

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)  
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)  
- Uma **API Key (v3)** do TMDB (crie gratuitamente [aqui](https://www.themoviedb.org/signup))  

---

### 2. Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/Dannebrock/movie-db.git
cd movie-db
npm install
```

---

### 3. Configuração do Ambiente
1. Crie uma conta gratuita em: [https://www.themoviedb.org/](https://www.themoviedb.org/)  
2. Gere sua **API Key (v3)** em: [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
3. Renomeie o arquivo `.env.example` para `.env`
4. Adicione sua chave de API:

```bash
VITE_TMDB_API_KEY=sua_api_key_aqui
```

> O arquivo `src/services/api.ts` deve estar configurado para utilizar essa variável e incluir a `api_key` nas requisições à API do TMDB.

---

### 4. Rodando o Projeto

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no navegador.

---

## 🧪 Rodando os Testes

Execute os testes com:

```bash
npm run test
```

---

## 📂 Estrutura de Pastas (Simplificada)

```
src/
├── components/
│   └── NavBar.tsx             # Barra de navegação
│
├── contexts/
│   └── FavoritesContext.tsx   # Contexto para gerenciamento de favoritos
│
├── pages/
│   ├── Home.tsx               # Página inicial com listagem e scroll infinito
│   ├── Favorites.tsx          # Página de filmes favoritos
│   ├── MovieDetails.tsx       # Detalhes de um filme
│   ├── Search.tsx             # Busca de filmes
│   └── NotFoundPage.tsx       # Página 404
│
├── services/
│   └── api.ts                 # Configuração do Axios
│
├── tests/
│   ├── Home.test.tsx
│   ├── Favorites.test.tsx
│   ├── MovieCard.test.tsx
│   ├── NavBar.test.tsx
│   └── Search.test.tsx
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## 📜 Licença

Este projeto é de uso livre para fins de estudo e aprendizado.  
Sinta-se à vontade para clonar, modificar e contribuir!

---

👨‍💻 **Desenvolvido por [Matheus Dannebrock](https://www.linkedin.com/in/matheus-dannebrock)** 

