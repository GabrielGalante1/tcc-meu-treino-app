from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt # <-- 1. IMPORTE O BCRYPT
from database import db
from routes import api # <-- 2. IMPORTE O BLUEPRINT 'api'
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv
from datetime import timedelta
load_dotenv()

# --- INÍCIO DA CONFIGURAÇÃO ---
DB_USER = os.getenv('DB_USER')
DB_PASS = os.getenv('DB_PASS')
DB_HOST = os.getenv('DB_HOST')
DB_NAME = os.getenv('DB_NAME')
# --- FIM DA CONFIGURAÇÃO ---

# Inicializa o Bcrypt fora da função para ser importado em routes.py
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {
        "origins": "http://localhost:3000",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Authorization", "Content-Type"]
    }})

    app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}'

    jwt = JWTManager(app)
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

    # Configuração de Upload
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static/uploads')
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


    db.init_app(app)
    Migrate(app, db)
    bcrypt.init_app(app)


    # 4. REGISTRE O BLUEPRINT
    app.register_blueprint(api, url_prefix='/api')

    @app.route('/')
    def hello_world():
        return '<h1>API do Meu Treino App está no ar!</h1>'

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)