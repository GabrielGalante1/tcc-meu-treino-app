# Estágio 1: Base com Python
FROM python:3.11-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Instala dependências do sistema necessárias para o mysqlclient/pymysql
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copia o arquivo de requisitos
COPY requirements.txt .

# Instala Gunicorn (servidor de produção) e as dependências do projeto
# (Adicionamos o gunicorn aqui, pois não está no seu requirements.txt)
RUN pip install --no-cache-dir gunicorn
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o código do backend para o container
COPY . .

# Expõe a porta que o Gunicorn vai usar
EXPOSE 5000

# Comando para rodar a aplicação em produção
# Ele usa o Gunicorn para servir a 'app' (do app.py) usando a factory 'create_app()'
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:create_app()"]