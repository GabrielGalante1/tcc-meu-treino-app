from app import create_app, db
from sqlalchemy import text

app = create_app()

with app.app_context():
    try:
        # Use raw SQL to describe the table
        result = db.session.execute(text("DESCRIBE aluno"))
        print(f"{'Field':<20} {'Type':<20} {'Null':<10} {'Key':<10} {'Default':<20} {'Extra':<20}")
        print("-" * 100)
        for row in result:
            # row is a tuple-like object. Accessing by index or name depends on driver, but printing row usually shows content.
            # MySQL DESCRIBE returns: Field, Type, Null, Key, Default, Extra
            print(f"{str(row[0]):<20} {str(row[1]):<20} {str(row[2]):<10} {str(row[3]):<10} {str(row[4]):<20} {str(row[5]):<20}")
            
    except Exception as e:
        print(f"Error: {e}")
