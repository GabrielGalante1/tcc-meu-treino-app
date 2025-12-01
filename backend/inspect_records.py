from app import create_app
from database import db
from models import RegistroTreino, Usuario

app = create_app()

with app.app_context():
    users = Usuario.query.all()
    print(f"Users found: {len(users)}")
    for u in users:
        print(f"User: {u.id} - {u.nome}")

    registros = RegistroTreino.query.all()
    print(f"Total records: {len(registros)}")
    for r in registros:
        print(f"Record ID: {r.id}, User: {r.user_id}, Date: {r.data}, Treino: {r.treino_id}")
