# --- ESTÁGIO 1: Construir (Build) o App React ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copia os arquivos de definição de pacotes
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install

# Copia todo o código-fonte do frontend
COPY . .

# Executa o script de build (definido no package.json)
# Isso cria a pasta 'build' com os arquivos estáticos
RUN npm run build

# --- ESTÁGIO 2: Servir (Serve) os arquivos estáticos com Nginx ---
FROM nginx:1.25-alpine

# Copia os arquivos estáticos da pasta 'build' do estágio anterior
# para o diretório padrão do Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# ★★★ IMPORTANTE ★★★
# Copia nosso arquivo de configuração customizado do Nginx
# Este arquivo é essencial para o React Router funcionar
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80 (padrão do Nginx)
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]