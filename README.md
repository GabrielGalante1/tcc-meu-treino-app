# Meu Treino App

> Aplicativo para gerenciamento fácil de treinos físicos

O aplicativo permite a criação de rotinas de treino de maneira simples, mas detalhada.
O software é focado em facilitar a vida daqueles que frequetam academias por todo o globo!
Pode ser utilizado tanto por professores, ao criar o treino de seus alunos, quanto por aqueles que apenas querem organizar sua rotina.

## 🚀 Sobre o Projeto

Levando em consideração a complexidade da grande maioria dos aplicativos que seguem o mesmo genero, estamos focando em simplicidade e facilidade, sem a necessidade de pagar por funcionalidades básicas do proprio aplicativo.
Criamos este aplicativo para facilitar nossas rotinas e de outras pessoas. Focamos em resolver nossas dificuldades.
A longo prazo esperamos conseguir lançar o app em todas as lojas de aplicativos com suporte abrangente.

## ✨ Funcionalidades

* ✅ **Cadastro:** Implementamos a funcionalidade do cadrastro, que permite com que os usuários criem suas contas e tenham acesso apenas as suas próprias fichas de treino.
* ✅ **Login:** Implementamos a funcionalidade de login, que permite acessar a sua conta de forma segura, por meio de tokens.
* ✅ **Perfil:** Implementamos a funcionalidade de perfil, uma página que serve para que os usuários vejam seus dados cadastrados
* ✅ **Visualização das fichas de treino:** Essa funcionalidade garante que os usuários vejam os detalhes de seus treinos
* ✅ **Montagem das fichas de treino:** Essa funcionalidade permite que os usuários montem suas fichas de treino a partir dos exercicios fornecidos no banco de dados e personalizem seus atributos.
* ✅ **Rotas upgrade e remoção fichas de treino:** Essa funcionalidade permite que os usuários atualizem e deletem suas fichas de treino.
* ❌ **Adicionar exercicios por meio da api (Em desenvolvimento):** Essa funcionalidade é apenas disponivel para administradores, para que sejam adicionados os exercicios ao app.
  

## 🛠️ Tecnologias Utilizadas

* **Frontend:** [React](https://reactjs.org/), [Axios](https://axios-http.com/)
* **Backend:** [Node.js](https://nodejs.org/), [Python](https://www.python.org/)
* **Banco de Dados:** [SQLAlchemy](https://www.sqlalchemy.org/), [MySQLWorkbench](https://www.mysql.com/products/workbench/)

Antes de começar, garanta que você tem as seguintes ferramentas instaladas na sua máquina:
* [Git](https://git-scm.com/downloads)
* [Node.js e npm](https://nodejs.org/en/) (versão LTS recomendada)
* [Python](https://www.python.org/downloads/) (versão 3.8 ou superior)
* [MySQL Server](https://dev.mysql.com/downloads/mysql/) (e opcionalmente o [MySQL Workbench](https://dev.mysql.com/downloads/workbench/))

## ⚙️ Passo a Passo da Instalação

### 1. Clonar o Repositório
Abra seu terminal e clone o projeto para sua máquina local:
```bash
git clone [https://github.com/EnzoQuinalha/tcc-meu-treino-app.git](https://github.com/EnzoQuinalha/tcc-meu-treino-app.git)
cd tcc-meu-treino-app
```

### 2. Configurar o Backend (Python)
```bash
# Navegue para a pasta do backend
cd backend

# Crie e ative um ambiente virtual
python -m venv venv
# No Windows:
venv\Scripts\activate
# No macOS/Linux:
# source venv/bin/activate

# Instale as dependências do Python
pip install -r requirements.txt
```

### 3. Configurar o Banco de Dados e Variáveis de Ambiente
```bash
# No MySQL, crie o banco de dados para o projeto
# Você pode fazer isso pelo MySQL Workbench com o comando:
# CREATE DATABASE meu_treino_db;

# Na pasta backend/, copie o arquivo de exemplo .env.example
# No Windows:
copy .env.example .env
# No macOS/Linux:
# cp .env.example .env

# Abra o arquivo .env que acabou de ser criado e preencha com suas credenciais do MySQL
# Ex: DB_PASS="sua_senha_secreta"
```

### 4. Aplicar as Migrações do Banco de Dados
Com o ambiente virtual do backend ainda ativo, execute os seguintes comandos para criar as tabelas do banco de dados:
```bash
# No Windows:
set FLASK_APP=app.py
# No macOS/Linux:
# export FLASK_APP=app.py

flask db upgrade
```

### 5. Configurar o Frontend (React)
```bash
# A partir da pasta raiz do projeto, navegue para o frontend
cd ../frontend

# Instale as dependências do Node.js
npm install
```

## Como Rodar a Aplicação

Para rodar o projeto, você precisará de **dois terminais abertos**.

**Terminal 1 - Rodando o Backend:**
```bash
cd backend
venv\Scripts\activate  # Ative o venv se não estiver ativo
python app.py
```
*O servidor Flask estará rodando em `http://127.0.0.1:5000`*

**Terminal 2 - Rodando o Frontend:**
```bash
cd frontend
npm start
```
*O servidor de desenvolvimento do React abrirá automaticamente no seu navegador em `http://localhost:3000` (ou uma porta similar).*

**Pronto!** Agora a aplicação está totalmente configurada e rodando na sua máquina.








> //TODO Transcrição para React Native; <br>
> //Criar interface para o App
