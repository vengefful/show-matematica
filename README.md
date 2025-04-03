# Show Matemática

Este é um projeto educacional desenvolvido para auxiliar no ensino de matemática, composto por uma aplicação web moderna com frontend em React e backend em Node.js.

## 🚀 Tecnologias Utilizadas

### Frontend (Client)
- React 18
- React Router DOM
- Tailwind CSS
- Axios
- React LaTeX Next (para renderização de fórmulas matemáticas)
- HTML React Parser

### Backend (Server)
- Node.js
- Express
- SQLite3
- Multer (para upload de arquivos)
- CORS
- CSV Parser/Writer

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Instale as dependências do frontend:
```bash
cd client
npm install
```

3. Instale as dependências do backend:
```bash
cd ../server
npm install
```

## 🏃‍♂️ Executando o Projeto

### Backend
```bash
cd server
npm run dev
```
O servidor estará rodando em `http://localhost:5000`

### Frontend
```bash
cd client
npm start
```
O cliente estará rodando em `http://localhost:3000`

## 📁 Estrutura do Projeto

### Client
- `/src` - Código fonte do frontend
- `/public` - Arquivos estáticos
- `tailwind.config.js` - Configuração do Tailwind CSS
- `postcss.config.js` - Configuração do PostCSS

### Server
- `server.js` - Arquivo principal do servidor
- `/uploads` - Diretório para uploads de arquivos
- `/rank` - Sistema de ranking
- `/questoes` - Gerenciamento de questões
- `/imagens` - Armazenamento de imagens

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença ISC.

## ✨ Recursos Principais

- Sistema de questões matemáticas
- Upload e gerenciamento de arquivos
- Sistema de ranking
- Renderização de fórmulas matemáticas em LaTeX
- Interface responsiva com Tailwind CSS 