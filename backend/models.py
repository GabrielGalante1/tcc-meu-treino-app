from database import db

class Academia(db.Model):
    __tablename__ = 'academia'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    # endereco = db.Column(db.String(200)) # Removido conforme solicitação
    
    instrutores = db.relationship('Instrutor', backref='academia', lazy=True)
    alunos = db.relationship('Aluno', backref='academia', lazy=True)

    def __repr__(self):
        return f'<Academia {self.nome}>'

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha_hash = db.Column(db.String(256), nullable=False)
    
    # Novos campos
    cargo = db.Column(db.Enum('aluno', 'instrutor', 'adm', name='cargo_enum'), nullable=False, default='aluno')
    tel = db.Column(db.String(20))
    foto_perfil = db.Column(db.String(255))

    # Relação: Um usuário pode ter muitos treinos.
    treinos = db.relationship('Treino', backref='usuario', lazy=True, cascade="all, delete-orphan")
    
    # Relacionamentos 1-to-1
    aluno_perfil = db.relationship('Aluno', backref='usuario', uselist=False, cascade="all, delete-orphan")
    instrutor_perfil = db.relationship('Instrutor', backref='usuario', uselist=False, cascade="all, delete-orphan")
    adm_perfil = db.relationship('Adm', backref='usuario', uselist=False, cascade="all, delete-orphan")
    
    # Relação com registros de treino (Cascade para deletar registros quando usuário for deletado)
    registros = db.relationship('RegistroTreino', backref='usuario_ref', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Usuario {self.nome} ({self.cargo})>'

class Aluno(db.Model):
    __tablename__ = 'aluno'
    # id_usuario é a PK e FK
    usuario_id = db.Column('id_usuario', db.Integer, db.ForeignKey('usuarios.id'), primary_key=True)
    
    peso = db.Column(db.Float)
    altura = db.Column(db.Float)
    metas = db.Column(db.Text)
    
    id_academia = db.Column(db.Integer, db.ForeignKey('academia.id'))
    id_instrutor = db.Column(db.Integer, db.ForeignKey('instrutor.id_usuario')) # Aponta para id_usuario

    def __repr__(self):
        return f'<Aluno {self.usuario_id}>'

class Instrutor(db.Model):
    __tablename__ = 'instrutor'
    # id_usuario é a PK e FK
    usuario_id = db.Column('id_usuario', db.Integer, db.ForeignKey('usuarios.id'), primary_key=True)
    
    id_academia = db.Column(db.Integer, db.ForeignKey('academia.id'))
    
    alunos = db.relationship('Aluno', backref='instrutor', lazy=True)

    def __repr__(self):
        return f'<Instrutor {self.usuario_id}>'

class Adm(db.Model):
    __tablename__ = 'adm'
    # id_usuario é a PK e FK
    usuario_id = db.Column('id', db.Integer, db.ForeignKey('usuarios.id'), primary_key=True)
    
    def __repr__(self):
        return f'<Adm {self.usuario_id}>'

# --- SEU MODELO IMPLEMENTADO ---

# Tabela 1: O Catálogo de todos os exercícios possíveis
class Exercicio(db.Model):
    __tablename__ = 'exercicios'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), unique=True, nullable=False)
    gif_url = db.Column(db.String(255)) # URL para o GIF demonstrativo
    grupo_muscular = db.Column(db.String(100), nullable=True)

    def __repr__(self):
        return f'<Exercicio {self.nome}>'

# Tabela 2: A Ficha de Treino, que pertence a um usuário
class Treino(db.Model):
    __tablename__ = 'treinos'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False) # Ex: "Treino A"
    dia = db.Column(db.String(50)) # Ex: "Segunda-feira", "Peito e Tríceps"
    
    # Chave estrangeira que liga o treino ao seu dono
    user_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    
    # Relação com a tabela de associação
    exercicios_associados = db.relationship('TreinoExercicio', backref='treino', lazy=True, cascade="all, delete-orphan")
    registros = db.relationship('RegistroTreino', backref='treino', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Treino {self.nome}>'

# Tabela 3: A Tabela de Associação (Junction Table) que você idealizou
class TreinoExercicio(db.Model):
    __tablename__ = 'treino_exercicio'
    id = db.Column(db.Integer, primary_key=True) # ID próprio, como você sugeriu
    
    # Chaves estrangeiras
    treino_id = db.Column(db.Integer, db.ForeignKey('treinos.id'), nullable=False)
    exercicio_id = db.Column(db.Integer, db.ForeignKey('exercicios.id'), nullable=False)
    
    # Dados específicos desta combinação
    series = db.Column(db.String(50))
    repeticoes = db.Column(db.String(50))
    descanso_seg = db.Column(db.Integer)
    peso = db.Column(db.String(50), nullable=True) # Opcional, como você sugeriu
    
    # Relações para facilitar a navegação
    exercicio = db.relationship('Exercicio')

    def __repr__(self):
        return f'<Associacao Treino ID:{self.treino_id} Exercicio ID:{self.exercicio_id}>'
    
class RegistroTreino(db.Model):
    __tablename__ = 'registros_treino'

    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.Date, nullable=False) 
    user_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    treino_id = db.Column(db.Integer, db.ForeignKey('treinos.id'), nullable=False)
    duracao_segundos = db.Column(db.Integer, nullable=True) # Novo campo

    usuario = db.relationship('Usuario')
    itens = db.relationship('RegistroItem', backref='registro', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<RegistroTreino user:{self.user_id} data:{self.data}>'

class RegistroItem(db.Model):
    __tablename__ = 'registro_itens'
    id = db.Column(db.Integer, primary_key=True)
    registro_id = db.Column(db.Integer, db.ForeignKey('registros_treino.id'), nullable=False)
    exercicio_id = db.Column(db.Integer, db.ForeignKey('exercicios.id'), nullable=False)
    concluido = db.Column(db.Boolean, default=False)

    exercicio = db.relationship('Exercicio')

    def __repr__(self):
        return f'<RegistroItem reg:{self.registro_id} ex:{self.exercicio_id} done:{self.concluido}>'

class Noticia(db.Model):
    __tablename__ = 'noticias'
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    subtitulo = db.Column(db.String(300), nullable=False)
    conteudo = db.Column(db.Text, nullable=False)
    data_criacao = db.Column(db.DateTime, default=db.func.current_timestamp())
    imagem_url = db.Column(db.String(500), nullable=False)
    
    # Relacionamento com Academia (Assumindo que notícias são por academia)
    id_academia = db.Column(db.Integer, db.ForeignKey('academia.id'), nullable=False)
    
    # Relacionamento com Autor (Admin que postou)
    id_autor = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    
    autor = db.relationship('Usuario', backref='noticias_criadas')

    def __repr__(self):
        return f'<Noticia {self.titulo}>'