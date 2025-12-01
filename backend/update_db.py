from app import create_app
from database import db
from sqlalchemy import text

app = create_app()

with app.app_context():
    try:
        with db.engine.connect() as conn:
            conn.execute(text("ALTER TABLE noticias ADD COLUMN subtitulo VARCHAR(300)"))
            conn.commit()
        print("Coluna 'subtitulo' adicionada com sucesso!")
    except Exception as e:
        print(f"Erro ao adicionar coluna: {e}")
