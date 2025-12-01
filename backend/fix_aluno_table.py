from app import create_app, db
from sqlalchemy import text

app = create_app()

with app.app_context():
    try:
        # Drop the problematic 'id' column
        print("Dropping column 'id' from 'aluno' table...")
        db.session.execute(text("ALTER TABLE aluno DROP COLUMN id"))
        
        # Drop the problematic 'usuario_id' column (if it exists and is not needed)
        # The model maps 'usuario_id' attribute to 'id_usuario' column.
        # The table has 'id_usuario' (PRI) and 'usuario_id'.
        print("Dropping column 'usuario_id' from 'aluno' table...")
        db.session.execute(text("ALTER TABLE aluno DROP COLUMN usuario_id"))
        
        db.session.commit()
        print("Columns dropped successfully.")
        
    except Exception as e:
        print(f"Error: {e}")
        db.session.rollback()
