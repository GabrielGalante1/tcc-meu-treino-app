from flask import Blueprint, request, jsonify
from database import db
from models import Usuario, Aluno, Instrutor, Adm, Treino, Exercicio, TreinoExercicio, RegistroTreino, RegistroItem, Noticia, Academia
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta


# Inicializamos o bcrypt aqui, mas ele será configurado no app.py
bcrypt = Bcrypt()

# Cria um "Blueprint". Pense nisso como um organizador de rotas.
# Todas as rotas definidas aqui começarão com /api
api = Blueprint('api', __name__)

@api.route('/usuarios', methods=['GET'])
@jwt_required()
def listar_usuarios():
    # Opcional: Verificar se é admin
    # current_user_id = get_jwt_identity()
    # user = Usuario.query.get(current_user_id)
    # if user.cargo != 'adm': ...

    usuarios = Usuario.query.all()
    resultado = []
    for u in usuarios:
        user_data = {
            "id": u.id,
            "nome": u.nome,
            "email": u.email,
            "cargo": u.cargo
        }
        if u.cargo == 'aluno' and u.aluno_perfil:
            user_data['id_instrutor'] = u.aluno_perfil.id_instrutor
        
        resultado.append(user_data)
    
    return jsonify(resultado)

@api.route('/usuarios/<int:user_id>', methods=['PUT'])
@jwt_required()
def atualizar_usuario_admin(user_id):
    # Aqui seria ideal verificar se quem está chamando é ADMIN
    # current_user_id = get_jwt_identity()
    # admin = Usuario.query.get(current_user_id)
    # if admin.cargo != 'adm': return jsonify({"erro": "Acesso negado"}), 403

    usuario = Usuario.query.get(user_id)
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado"}), 404

    dados = request.get_json()
    usuario.nome = dados.get('nome', usuario.nome)
    usuario.email = dados.get('email', usuario.email)
    usuario.cargo = dados.get('cargo', usuario.cargo)
    
    # Atualizar id_instrutor se for aluno e o campo estiver presente
    if usuario.cargo == 'aluno' and usuario.aluno_perfil:
        if 'id_instrutor' in dados:
            usuario.aluno_perfil.id_instrutor = dados['id_instrutor']
    
    db.session.commit()
    return jsonify({"mensagem": "Usuário atualizado com sucesso"})

@api.route('/usuarios/<int:user_id>', methods=['DELETE'])
@jwt_required()
def deletar_usuario_admin(user_id):
    # Verificar se é ADMIN...

    usuario = Usuario.query.get(user_id)
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado"}), 404

    try:
        db.session.delete(usuario)
        db.session.commit()
        return jsonify({"mensagem": "Usuário deletado com sucesso"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": f"Erro ao deletar usuário: {str(e)}"}), 500

@api.route('/usuarios/<int:user_id>/senha', methods=['PUT'])
@jwt_required()
def alterar_senha_usuario_admin(user_id):
    # Verificar se é ADMIN...

    usuario = Usuario.query.get(user_id)
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado"}), 404

    dados = request.get_json()
    nova_senha = dados.get('nova_senha')
    
    if not nova_senha:
        return jsonify({"erro": "Nova senha é obrigatória"}), 400

    usuario.senha_hash = bcrypt.generate_password_hash(nova_senha).decode('utf-8')
    db.session.commit()
    return jsonify({"mensagem": "Senha alterada com sucesso"})

@api.route('/usuarios', methods=['POST'])
def criar_usuario():
    # Pega os dados JSON enviados na requisição
    dados = request.get_json()

    nome = dados.get('nome')
    email = dados.get('email')
    senha = dados.get('senha')

    # Validação simples
    if not nome or not email or not senha:
        return jsonify({'erro': 'Dados incompletos'}), 400

    # Verifica se o email já existe
    if Usuario.query.filter_by(email=email).first():
        return jsonify({'erro': 'Email já cadastrado'}), 409

    # Gera o hash da senha
    senha_hash = bcrypt.generate_password_hash(senha).decode('utf-8')

    # Cria a nova instância do usuário
    cargo = dados.get('cargo', 'aluno') # Default para aluno se não especificado
    novo_usuario = Usuario(nome=nome, email=email, senha_hash=senha_hash, cargo=cargo, tel=dados.get('tel'))

    db.session.add(novo_usuario)
    db.session.flush() # Para gerar o ID do usuário antes do commit final

    # Cria o registro específico dependendo do cargo
    if cargo == 'aluno':
        novo_aluno = Aluno(
            usuario_id=novo_usuario.id,
            peso=dados.get('peso'),
            altura=dados.get('altura'),
            metas=dados.get('metas'),
            id_instrutor=dados.get('id_instrutor')
        )
        db.session.add(novo_aluno)
    elif cargo == 'instrutor':
        novo_instrutor = Instrutor(
            usuario_id=novo_usuario.id,
            # id_academia=... (se tiver campo para selecionar academia)
        )
        db.session.add(novo_instrutor)
    elif cargo == 'adm':
        novo_adm = Adm(usuario_id=novo_usuario.id)
        db.session.add(novo_adm)

    db.session.commit()

    # Retorna uma resposta de sucesso
    return jsonify({'mensagem': 'Usuário criado com sucesso!'}), 201

@api.route('/login', methods=['POST'])
def login_usuario():
    # Pega os dados JSON enviados na requisição
    dados = request.get_json()
    email = dados.get('email')
    senha = dados.get('senha')

    # Validação simples
    if not email or not senha:
        return jsonify({'erro': 'Email e senha são obrigatórios'}), 400

    # Busca o usuário no banco de dados pelo email
    usuario = Usuario.query.filter_by(email=email).first()

    # Verifica se o usuário existe E se a senha enviada corresponde ao hash salvo no banco
    if not usuario or not bcrypt.check_password_hash(usuario.senha_hash, senha):
        return jsonify({'erro': 'Credenciais inválidas'}), 401 # Código 401: Unauthorized

    # Se as credenciais estiverem corretas, criamos o token de acesso
    access_token = create_access_token(identity=str(usuario.id))
    
    # Retorna o token e o cargo para o frontend
    return jsonify({
        "access_token": access_token,
        "cargo": usuario.cargo
    })

@api.route('/perfil', methods=['GET'])
@jwt_required() # <-- Este é o "segurança" que protege a rota
def meu_perfil():
    # A função get_jwt_identity() pega o 'id' do usuário que foi salvo no token durante o login
    id_do_usuario_logado = get_jwt_identity()

    # Busca o usuário no banco de dados com base nesse id
    usuario = Usuario.query.get(id_do_usuario_logado)

    if not usuario:
        return jsonify({"erro": "Usuário não encontrado"}), 404

    # Prepara a resposta base
    response_data = {
        "id": usuario.id,
        "nome": usuario.nome,
        "email": usuario.email,
        "tel": usuario.tel,
        "cargo": usuario.cargo
    }

    # Se for aluno, busca o nome do instrutor
    if usuario.cargo == 'aluno' and usuario.aluno_perfil and usuario.aluno_perfil.id_instrutor:
        instrutor = Instrutor.query.filter_by(usuario_id=usuario.aluno_perfil.id_instrutor).first()
        if instrutor and instrutor.usuario:
            response_data['nome_instrutor'] = instrutor.usuario.nome

    return jsonify(response_data)

@api.route('/perfil', methods=['PUT'])
@jwt_required()
def atualizar_perfil():
    user_id = get_jwt_identity()
    usuario = Usuario.query.get(user_id)
    
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado"}), 404
        
    dados = request.get_json()
    novo_nome = dados.get('nome')
    novo_email = dados.get('email')
    novo_tel = dados.get('tel') # <--- Adicionado
    
    if not novo_nome or not novo_email:
        return jsonify({"erro": "Nome e email são obrigatórios"}), 400
        
    # Verifica se o email já está em uso por OUTRO usuário
    if novo_email != usuario.email:
        if Usuario.query.filter_by(email=novo_email).first():
            return jsonify({"erro": "Este email já está em uso"}), 409
            
    usuario.nome = novo_nome
    usuario.email = novo_email
    usuario.tel = novo_tel # <--- Adicionado
    db.session.commit()
    
    return jsonify({"mensagem": "Perfil atualizado com sucesso!"})

@api.route('/perfil/senha', methods=['PUT'])
@jwt_required()
def alterar_senha():
    user_id = get_jwt_identity()
    usuario = Usuario.query.get(user_id)
    
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado"}), 404
        
    dados = request.get_json()
    senha_atual = dados.get('senha_atual')
    nova_senha = dados.get('nova_senha')
    
    if not senha_atual or not nova_senha:
        return jsonify({"erro": "Senha atual e nova senha são obrigatórias"}), 400
        
    # Verifica a senha atual
    if not bcrypt.check_password_hash(usuario.senha_hash, senha_atual):
        return jsonify({"erro": "Senha atual incorreta"}), 401
        
    # Atualiza para a nova senha
    usuario.senha_hash = bcrypt.generate_password_hash(nova_senha).decode('utf-8')
    db.session.commit()
    
    return jsonify({"mensagem": "Senha alterada com sucesso!"})

@api.route('/recuperar-senha', methods=['POST'])
def recuperar_senha():
    dados = request.get_json()
    email = dados.get('email')
    nova_senha = dados.get('nova_senha')
    
    if not email or not nova_senha:
        return jsonify({"erro": "Email e nova senha são obrigatórios"}), 400
        
    usuario = Usuario.query.filter_by(email=email).first()
    
    if not usuario:
        return jsonify({"erro": "Email não encontrado"}), 404
        
    # Verifica se a nova senha é igual à antiga
    if bcrypt.check_password_hash(usuario.senha_hash, nova_senha):
        return jsonify({"erro": "A nova senha não pode ser igual à senha atual"}), 400
        
    # Em um sistema real, enviaríamos um email com token.
    # Aqui, permitimos reset direto para simplificar o TCC.
    usuario.senha_hash = bcrypt.generate_password_hash(nova_senha).decode('utf-8')
    db.session.commit()
    
    return jsonify({"mensagem": "Senha redefinida com sucesso!"})

@api.route('/perfil', methods=['DELETE'])
@jwt_required()
def excluir_conta():
    user_id = get_jwt_identity()
    usuario = Usuario.query.get(user_id)
    
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado"}), 404
        
    # Opcional: Apagar dados relacionados manualmente se o cascade não estiver configurado
    # Treino.query.filter_by(user_id=user_id).delete()
    # RegistroTreino.query.filter_by(user_id=user_id).delete()
    
    db.session.delete(usuario)
    db.session.commit()
    
    return jsonify({"mensagem": "Conta excluída com sucesso!"})

@api.route('/usuarios/<int:user_id>/treinos', methods=['GET'])
@jwt_required()
def listar_treinos_aluno(user_id):
    current_user_id = get_jwt_identity()
    current_user = Usuario.query.get(current_user_id)
    
    # Verifica se é o próprio usuário ou se é o instrutor dele
    aluno = Usuario.query.get(user_id)
    if not aluno:
        return jsonify({"erro": "Aluno não encontrado"}), 404

    autorizado = False
    if str(current_user_id) == str(user_id):
        autorizado = True
    elif current_user.cargo == 'instrutor' and aluno.cargo == 'aluno' and aluno.aluno_perfil:
        if str(aluno.aluno_perfil.id_instrutor) == str(current_user_id):
            autorizado = True
    
    if not autorizado:
        return jsonify({"erro": "Acesso não autorizado"}), 403

    treinos = Treino.query.filter_by(user_id=user_id).all()
    
    resultado = []
    for treino in treinos:
        exercicios_list = []
        for assoc in treino.exercicios_associados:
            exercicios_list.append({
                "id_exercicio": assoc.exercicio.id,
                "nome_exercicio": assoc.exercicio.nome,
                "gif_url": assoc.exercicio.gif_url,
                "series": assoc.series,
                "repeticoes": assoc.repeticoes,
                "descanso_seg": assoc.descanso_seg,
                "peso": assoc.peso
            })

        resultado.append({
            "id": treino.id,
            "nome": treino.nome,
            "dia": treino.dia,
            "exercicios": exercicios_list
        })
        
    return jsonify(resultado)

@api.route('/treinos', methods=['POST'])
@jwt_required()
def criar_treino():
    current_user_id = get_jwt_identity()
    current_user = Usuario.query.get(current_user_id)
    
    dados = request.get_json()
    nome_treino = dados.get('nome')
    dia_treino = dados.get('dia')
    exercicios_data = dados.get('exercicios')
    target_user_id = dados.get('user_id') # Opcional, para instrutores

    if not nome_treino or not exercicios_data:
        return jsonify({"erro": "Nome do treino e lista de exercícios são obrigatórios"}), 400

    # Define quem será o dono do treino
    if target_user_id:
        # Se tentou criar para outro, verifica permissão
        if str(target_user_id) != str(current_user_id):
            target_user = Usuario.query.get(target_user_id)
            if not target_user:
                 return jsonify({"erro": "Usuário alvo não encontrado"}), 404
            
            # Verifica se é instrutor deste aluno
            eh_instrutor = False
            if current_user.cargo == 'instrutor' and target_user.cargo == 'aluno' and target_user.aluno_perfil:
                 if str(target_user.aluno_perfil.id_instrutor) == str(current_user_id):
                     eh_instrutor = True
            
            if not eh_instrutor:
                return jsonify({"erro": "Acesso não autorizado para criar treino para este usuário"}), 403
            
            user_id_final = target_user_id
        else:
            user_id_final = current_user_id
    else:
        user_id_final = current_user_id

    novo_treino = Treino(nome=nome_treino, dia=dia_treino, user_id=user_id_final)
    db.session.add(novo_treino)

    for exercicio_info in exercicios_data:
        exercicio_id = exercicio_info.get('exercicio_id')
        exercicio_catalogo = Exercicio.query.get(exercicio_id)
        if not exercicio_catalogo:
            return jsonify({"erro": f"Exercício com ID {exercicio_id} não encontrado no catálogo"}), 404

        nova_associacao = TreinoExercicio(
            treino=novo_treino,
            exercicio_id=exercicio_id,
            series=exercicio_info.get('series'),
            repeticoes=exercicio_info.get('repeticoes'),
            descanso_seg=exercicio_info.get('descanso_seg'),
            peso=exercicio_info.get('peso')
        )
        db.session.add(nova_associacao)

    db.session.commit()

    return jsonify({"mensagem": "Treino criado com sucesso!"}), 201

@api.route('/treinos', methods=['GET'])
@jwt_required()
def listar_treinos():
    # Pega o ID do usuário logado a partir do token
    user_id = get_jwt_identity()
    
    # Busca no banco de dados todos os treinos que pertencem a este usuário
    treinos_do_usuario = Treino.query.filter_by(user_id=user_id).all()
    
    # Precisamos converter os objetos de treino (que o Python entende) 
    # para um formato que possa ser enviado como JSON (dicionários e listas).
    resultado = []
    for treino in treinos_do_usuario:
        exercicios_list = []
        for assoc in treino.exercicios_associados:
            exercicios_list.append({
                "id_exercicio": assoc.exercicio.id,
                "nome_exercicio": assoc.exercicio.nome,
                "gif_url": assoc.exercicio.gif_url,
                "series": assoc.series,
                "repeticoes": assoc.repeticoes,
                "descanso_seg": assoc.descanso_seg,
                "peso": assoc.peso
            })

        resultado.append({
            "id": treino.id,
            "nome": treino.nome,
            "dia": treino.dia,
            "exercicios": exercicios_list
        })
        
    return jsonify(resultado)

@api.route('/treinos/<int:treino_id>', methods=['DELETE'])
@jwt_required()
def apagar_treino(treino_id):
    current_user_id = get_jwt_identity()
    current_user = Usuario.query.get(current_user_id)
    
    treino = Treino.query.get(treino_id)
    
    if not treino:
        return jsonify({"erro": "Treino não encontrado"}), 404
        
    # Verifica permissão (Dono ou Instrutor)
    autorizado = False
    if str(treino.user_id) == str(current_user_id):
        autorizado = True
    else:
        dono = Usuario.query.get(treino.user_id)
        if current_user.cargo == 'instrutor' and dono.cargo == 'aluno' and dono.aluno_perfil:
            if str(dono.aluno_perfil.id_instrutor) == str(current_user_id):
                autorizado = True
    
    if not autorizado:
        return jsonify({"erro": "Acesso não autorizado"}), 403
        
    db.session.delete(treino)
    db.session.commit()
    
    return jsonify({"mensagem": "Treino apagado com sucesso"})

@api.route('/exercicios', methods=['GET'])
@jwt_required()
def listar_catalogo_exercicios():
    # Busca todos os exercícios da tabela 'exercicios'
    todos_exercicios = Exercicio.query.order_by(Exercicio.nome).all()
    
    # Converte a lista de objetos para um formato JSON
    resultado = [{
        "id": ex.id,
        "nome": ex.nome,
        "gif_url": ex.gif_url,
        "grupo_muscular": ex.grupo_muscular
    } for ex in todos_exercicios]
    
    return jsonify(resultado)

@api.route('/treinos/<int:treino_id>', methods=['GET'])
@jwt_required()
def obter_treino_por_id(treino_id):
    current_user_id = get_jwt_identity()
    current_user = Usuario.query.get(current_user_id)
    
    treino = Treino.query.get(treino_id)
    
    if not treino:
        return jsonify({"erro": "Treino não encontrado"}), 404
        
    # Verifica permissão (Dono ou Instrutor)
    autorizado = False
    if str(treino.user_id) == str(current_user_id):
        autorizado = True
    else:
        dono = Usuario.query.get(treino.user_id)
        if current_user.cargo == 'instrutor' and dono.cargo == 'aluno' and dono.aluno_perfil:
            if str(dono.aluno_perfil.id_instrutor) == str(current_user_id):
                autorizado = True

    if not autorizado:
        return jsonify({"erro": "Acesso não autorizado"}), 403

    # Serializa o treino e seus exercícios (lógica parecida com a de listar_treinos)
    exercicios_list = []
    for assoc in treino.exercicios_associados:
        exercicios_list.append({
            "id_associacao": assoc.id, # Pode ser útil no frontend
            "exercicio_id": assoc.exercicio.id,
            "nome_exercicio": assoc.exercicio.nome,
            "series": assoc.series,
            "repeticoes": assoc.repeticoes,
            "descanso_seg": assoc.descanso_seg,
            "peso": assoc.peso
        })

    resultado = {
        "id": treino.id,
        "nome": treino.nome,
        "dia": treino.dia,
        "exercicios": exercicios_list,
        "user_id": treino.user_id # Retorna o dono para o frontend saber
    }
        
    return jsonify(resultado)

@api.route('/treinos/<int:treino_id>', methods=['PUT'])
@jwt_required()
def atualizar_treino(treino_id):
    current_user_id = get_jwt_identity()
    current_user = Usuario.query.get(current_user_id)
    
    treino = Treino.query.get(treino_id)
    
    if not treino:
        return jsonify({"erro": "Treino não encontrado"}), 404

    # Verifica permissão (Dono ou Instrutor)
    autorizado = False
    if str(treino.user_id) == str(current_user_id):
        autorizado = True
    else:
        dono = Usuario.query.get(treino.user_id)
        if current_user.cargo == 'instrutor' and dono.cargo == 'aluno' and dono.aluno_perfil:
            if str(dono.aluno_perfil.id_instrutor) == str(current_user_id):
                autorizado = True
    
    if not autorizado:
        return jsonify({"erro": "Acesso não autorizado"}), 403

    dados = request.get_json()
    
    treino.nome = dados.get('nome', treino.nome)
    treino.dia = dados.get('dia', treino.dia)
    
    TreinoExercicio.query.filter_by(treino_id=treino_id).delete()
    
    exercicios_data = dados.get('exercicios')
    if exercicios_data:
        for exercicio_info in exercicios_data:
            exercicio_id = exercicio_info.get('exercicio_id')
            nova_associacao = TreinoExercicio(
                treino_id=treino.id,
                exercicio_id=exercicio_id,
                series=exercicio_info.get('series'),
                repeticoes=exercicio_info.get('repeticoes'),
                descanso_seg=exercicio_info.get('descanso_seg'),
                peso=exercicio_info.get('peso')
            )
            db.session.add(nova_associacao)
            
    db.session.commit()
    
    return jsonify({"mensagem": "Treino atualizado com sucesso!"})

@api.route('/registros', methods=['POST'])
@jwt_required()
def registrar_treino():
    user_id = get_jwt_identity()
    dados = request.get_json()
    treino_id = dados.get('treino_id')
    duracao = dados.get('duracao') # Segundos
    itens = dados.get('itens') # Lista de { exercicio_id, concluido }
    data_recebida = dados.get('data') # YYYY-MM-DD (Opcional)

    # Usa a data recebida ou a de hoje por padrão
    if data_recebida:
        try:
            data_treino = datetime.strptime(data_recebida, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"erro": "Formato de data inválido. Use YYYY-MM-DD"}), 400
    else:
        data_treino = datetime.utcnow().date()

    if not treino_id:
        return jsonify({"erro": "ID do treino é obrigatório"}), 400

    novo_registro = RegistroTreino(
        user_id=user_id, 
        treino_id=treino_id, 
        data=data_treino,
        duracao_segundos=duracao
    )
    db.session.add(novo_registro)
    
    # Salva os itens (quais exercicios foram feitos)
    if itens:
        for item in itens:
            novo_item = RegistroItem(
                registro=novo_registro,
                exercicio_id=item.get('exercicio_id'),
                concluido=item.get('concluido', False)
            )
            db.session.add(novo_item)

    db.session.commit()

    return jsonify({"mensagem": "Treino registrado com sucesso!"}), 201

# Rota para buscar o histórico completo
@api.route('/registros', methods=['GET'])
@jwt_required()
def listar_historico():
    user_id = get_jwt_identity()
    
    # Busca todos os registros do usuário, ordenados por data (mais recente primeiro)
    registros = RegistroTreino.query.filter_by(user_id=user_id).order_by(RegistroTreino.data.desc(), RegistroTreino.id.desc()).all()
    
    resultado = []
    for reg in registros:
        # Pega o nome do treino (se ainda existir)
        nome_treino = reg.treino.nome if reg.treino else "Treino Excluído"
        
        resultado.append({
            "id": reg.id,
            "treino_id": reg.treino_id,
            "nome_treino": nome_treino,
            "data": reg.data.isoformat(),
            "duracao_segundos": reg.duracao_segundos,
            "itens": [{
                "exercicio_nome": item.exercicio.nome if item.exercicio else "Exercicio Excluído",
                "concluido": item.concluido
            } for item in reg.itens]
        })
        
    return jsonify(resultado)

# NOVA ROTA PARA BUSCAR OS REGISTROS DA ÚLTIMA SEMANA
@api.route('/registros/semana', methods=['GET'])
@jwt_required()
def registros_da_semana():
    user_id = get_jwt_identity()
    
    start_date_str = request.args.get('start')
    end_date_str = request.args.get('end')

    if start_date_str and end_date_str:
        try:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            
            registros = RegistroTreino.query.filter(
                RegistroTreino.user_id == user_id,
                RegistroTreino.data >= start_date,
                RegistroTreino.data <= end_date
            ).all()
        except ValueError:
             return jsonify({"erro": "Formato de data inválido. Use YYYY-MM-DD"}), 400
    else:
        # Fallback para o comportamento antigo (últimos 7 dias)
        hoje = datetime.utcnow().date()
        inicio_semana = hoje - timedelta(days=6)

        registros = RegistroTreino.query.filter(
            RegistroTreino.user_id == user_id,
            RegistroTreino.data >= inicio_semana,
            RegistroTreino.data <= hoje
        ).all()

    # Retorna uma lista de objetos com data e id do treino
    dados_retorno = [{
        "data": reg.data.isoformat(),
        "treino_id": reg.treino_id
    } for reg in registros]

    return jsonify(dados_retorno)

@api.route('/instrutores', methods=['GET'])
def listar_instrutores():
    # Busca todos os instrutores
    instrutores = Instrutor.query.all()
    
    resultado = []
    for instrutor in instrutores:
        # Acessa o nome através da relação com Usuario
        resultado.append({
            "id": instrutor.usuario_id,
            "nome": instrutor.usuario.nome
        })
        
    return jsonify(resultado)

@api.route('/meus-alunos', methods=['GET'])
@jwt_required()
def listar_meus_alunos():
    user_id = get_jwt_identity()
    usuario = Usuario.query.get(user_id)

    if not usuario or usuario.cargo != 'instrutor':
        return jsonify({"erro": "Acesso não autorizado"}), 403

    # Busca o perfil de instrutor do usuário
    instrutor = usuario.instrutor_perfil
    if not instrutor:
        return jsonify({"erro": "Perfil de instrutor não encontrado"}), 404

    # Busca os alunos associados a este instrutor
    alunos = Aluno.query.filter_by(id_instrutor=instrutor.usuario_id).all()

    resultado = []
    for aluno in alunos:
        if aluno.usuario:
            resultado.append({
                "id": aluno.usuario.id,
                "nome": aluno.usuario.nome,
                "email": aluno.usuario.email,
                "tel": aluno.usuario.tel,
                "foto_perfil": aluno.usuario.foto_perfil
            })

    return jsonify(resultado)

# --- ROTAS DE ACADEMIA ---

@api.route('/academias', methods=['GET'])
@jwt_required()
def listar_academias():
    academias = Academia.query.all()
    resultado = [{
        "id": a.id,
        "nome": a.nome
    } for a in academias]
    return jsonify(resultado)

@api.route('/academias', methods=['POST'])
@jwt_required()
def criar_academia():
    dados = request.get_json()
    nome = dados.get('nome')
    
    if not nome:
        return jsonify({"erro": "Nome da academia é obrigatório"}), 400
        
    nova_academia = Academia(nome=nome)
    db.session.add(nova_academia)
    db.session.commit()
    
    return jsonify({"mensagem": "Academia criada com sucesso!"}), 201

@api.route('/academias/<int:id>', methods=['PUT'])
@jwt_required()
def atualizar_academia(id):
    academia = Academia.query.get(id)
    if not academia:
        return jsonify({"erro": "Academia não encontrada"}), 404
        
    dados = request.get_json()
    academia.nome = dados.get('nome', academia.nome)
    
    db.session.commit()
    return jsonify({"mensagem": "Academia atualizada com sucesso!"})

@api.route('/academias/<int:id>', methods=['DELETE'])
@jwt_required()
def deletar_academia(id):
    academia = Academia.query.get(id)
    if not academia:
        return jsonify({"erro": "Academia não encontrada"}), 404
        
    try:
        # Desvincula alunos e instrutores antes de deletar
        for aluno in academia.alunos:
            aluno.id_academia = None
        for instrutor in academia.instrutores:
            instrutor.id_academia = None
            
        db.session.delete(academia)
        db.session.commit()
        return jsonify({"mensagem": "Academia deletada com sucesso!"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": f"Erro ao deletar academia: {str(e)}"}), 500

# --- ROTAS DE NOTÍCIAS ---

@api.route('/noticias', methods=['GET'])
@jwt_required()
def listar_noticias():
    user_id = get_jwt_identity()
    usuario = Usuario.query.get(user_id)

    if not usuario:
        return jsonify({'erro': 'Usuário não encontrado'}), 404

    # Determinar a academia do usuário
    id_academia = None
    if usuario.cargo == 'aluno' and usuario.aluno_perfil:
        id_academia = usuario.aluno_perfil.id_academia
    elif usuario.cargo == 'instrutor' and usuario.instrutor_perfil:
        id_academia = usuario.instrutor_perfil.id_academia
    
    # Se for ADM, ele pode ver todas ou filtrar. 
    # Regra: "Todos podem ver as notícias da sua academia". 
    # Se ADM não tem academia, vamos assumir que ele vê todas ou passamos um parametro.
    # Por simplicidade, se for ADM, retorna todas. Se for aluno/instrutor, filtra.
    
    query = Noticia.query
    if id_academia:
        query = query.filter_by(id_academia=id_academia)
    
    noticias = query.order_by(Noticia.data_criacao.desc()).all()

    resultado = []
    for n in noticias:
        resultado.append({
            'id': n.id,
            'titulo': n.titulo,
            'subtitulo': n.subtitulo,
            'conteudo': n.conteudo,
            'data_criacao': n.data_criacao.strftime('%Y-%m-%d %H:%M'),
            'imagem_url': n.imagem_url,
            'autor_nome': n.autor.nome if n.autor else 'Admin'
        })

    return jsonify(resultado), 200

import os
from werkzeug.utils import secure_filename
from flask import current_app

@api.route('/noticias', methods=['POST'])
@jwt_required()
def criar_noticia():
    user_id = get_jwt_identity()
    usuario = Usuario.query.get(user_id)

    if not usuario or usuario.cargo != 'adm':
        return jsonify({'erro': 'Apenas administradores podem criar notícias.'}), 403

    # Usar request.form para dados de texto e request.files para arquivos
    titulo = request.form.get('titulo')
    subtitulo = request.form.get('subtitulo')
    conteudo = request.form.get('conteudo')
    id_academia = request.form.get('id_academia', 1)
    
    imagem = request.files.get('imagem')

    if not titulo or not subtitulo or not conteudo or not imagem:
        return jsonify({'erro': 'Título, subtítulo, conteúdo e imagem são obrigatórios.'}), 400

    # Salvar Imagem
    filename = secure_filename(imagem.filename)
    # Adicionar timestamp para evitar duplicatas
    import time
    filename = f"{int(time.time())}_{filename}"
    
    upload_folder = current_app.config['UPLOAD_FOLDER']
    imagem.save(os.path.join(upload_folder, filename))
    
    # URL para acesso (assumindo que o backend serve estáticos em /static)
    # Ajuste a URL base conforme necessário (ex: http://localhost:5000)
    base_url = request.host_url.rstrip('/')
    imagem_url = f"{base_url}/static/uploads/{filename}"

    nova_noticia = Noticia(
        titulo=titulo,
        subtitulo=subtitulo,
        conteudo=conteudo,
        imagem_url=imagem_url,
        id_academia=id_academia,
        id_autor=usuario.id
    )

    db.session.add(nova_noticia)
    db.session.commit()

    return jsonify({'mensagem': 'Notícia criada com sucesso!'}), 201

@api.route('/noticias/<int:noticia_id>', methods=['DELETE'])
@jwt_required()
def deletar_noticia(noticia_id):
    user_id = get_jwt_identity()
    usuario = Usuario.query.get(user_id)

    if not usuario or usuario.cargo != 'adm':
        return jsonify({'erro': 'Permissão negada.'}), 403

    noticia = Noticia.query.get(noticia_id)
    if not noticia:
        return jsonify({'erro': 'Notícia não encontrada.'}), 404

    # Deletar imagem do sistema de arquivos
    if noticia.imagem_url:
        try:
            # Extrair nome do arquivo da URL
            # Ex: http://localhost:5000/static/uploads/123_image.jpg -> 123_image.jpg
            filename = noticia.imagem_url.split('/')[-1]
            upload_folder = current_app.config['UPLOAD_FOLDER']
            file_path = os.path.join(upload_folder, filename)
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Erro ao deletar imagem: {e}")

    db.session.delete(noticia)
    db.session.commit()

    return jsonify({'mensagem': 'Notícia deletada com sucesso!'}), 200

@api.route('/noticias/<int:noticia_id>', methods=['GET'])
@jwt_required()
def obter_noticia(noticia_id):
    noticia = Noticia.query.get(noticia_id)
    if not noticia:
        return jsonify({'erro': 'Notícia não encontrada.'}), 404

    # Verificar permissão de visualização (se necessário, por academia)
    user_id = get_jwt_identity()
    usuario = Usuario.query.get(user_id)
    
    if usuario.cargo != 'adm':
        id_academia = None
        if usuario.cargo == 'aluno' and usuario.aluno_perfil:
            id_academia = usuario.aluno_perfil.id_academia
        elif usuario.cargo == 'instrutor' and usuario.instrutor_perfil:
            id_academia = usuario.instrutor_perfil.id_academia
        
        if id_academia and noticia.id_academia != id_academia:
             return jsonify({'erro': 'Permissão negada.'}), 403

    return jsonify({
        'id': noticia.id,
        'titulo': noticia.titulo,
        'subtitulo': noticia.subtitulo,
        'conteudo': noticia.conteudo,
        'data_criacao': noticia.data_criacao.strftime('%Y-%m-%d %H:%M'),
        'imagem_url': noticia.imagem_url,
        'autor_nome': noticia.autor.nome if noticia.autor else 'Admin'
    }), 200

@api.route('/noticias/<int:noticia_id>', methods=['PUT'])
@jwt_required()
def editar_noticia(noticia_id):
    user_id = get_jwt_identity()
    usuario = Usuario.query.get(user_id)

    if not usuario or usuario.cargo != 'adm':
        return jsonify({'erro': 'Apenas administradores podem editar notícias.'}), 403

    noticia = Noticia.query.get(noticia_id)
    if not noticia:
        return jsonify({'erro': 'Notícia não encontrada.'}), 404

    # Atualizar campos de texto
    noticia.titulo = request.form.get('titulo', noticia.titulo)
    noticia.subtitulo = request.form.get('subtitulo', noticia.subtitulo)
    noticia.conteudo = request.form.get('conteudo', noticia.conteudo)
    
    # Atualizar imagem se fornecida
    imagem = request.files.get('imagem')
    if imagem:
        # Deletar imagem antiga
        if noticia.imagem_url:
            try:
                filename = noticia.imagem_url.split('/')[-1]
                upload_folder = current_app.config['UPLOAD_FOLDER']
                file_path = os.path.join(upload_folder, filename)
                if os.path.exists(file_path):
                    os.remove(file_path)
            except Exception as e:
                print(f"Erro ao deletar imagem antiga: {e}")

        # Salvar nova imagem
        filename = secure_filename(imagem.filename)
        import time
        filename = f"{int(time.time())}_{filename}"
        
        upload_folder = current_app.config['UPLOAD_FOLDER']
        imagem.save(os.path.join(upload_folder, filename))
        
        base_url = request.host_url.rstrip('/')
        noticia.imagem_url = f"{base_url}/static/uploads/{filename}"

    db.session.commit()

    return jsonify({'mensagem': 'Notícia atualizada com sucesso!'}), 200
