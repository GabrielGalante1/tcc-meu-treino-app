from flask_sqlalchemy import SQLAlchemy

# Cria uma instância do SQLAlchemy que será usada por todo o projeto.
# Note que não estamos associando ela a nenhum app Flask ainda.
db = SQLAlchemy()