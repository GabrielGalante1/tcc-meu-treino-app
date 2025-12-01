import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css'; // <-- 1. Importa o CSS específico do login

function FormularioLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 2. EFEITO PARA MUDAR O FUNDO (O GRADIENTE)
  // O seu CSS aplica o gradiente na tag <body>,
  // então usamos o useEffect para adicionar essa classe quando
  // o componente de login é montado, e remover quando ele é desmontado.
  useEffect(() => {
    document.body.classList.add('login-body'); // Adiciona a classe do gradiente
    return () => {
      document.body.classList.remove('login-body'); // Remove ao sair da página
    };
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  // 3. LÓGICA DE LOGIN (continua a mesma)
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const response = await axios.post('/api/login', {
        email: email,
        senha: senha,
      });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('cargo', response.data.cargo); // Salva o cargo
      navigate('/'); // Redireciona para a página principal
    } catch (error) {
      const errorMessage = error.response?.data?.erro || 'Erro no login. Verifique suas credenciais.';
      setError(errorMessage);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Novo estado
  const [modalMessage, setModalMessage] = useState('');

  const handleForgotPassword = async () => {
    if (!resetEmail || !newPassword || !confirmPassword) {
      setModalMessage('Por favor, preencha todos os campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setModalMessage('As senhas não coincidem.');
      return;
    }

    try {
      await axios.post('/api/recuperar-senha', {
        email: resetEmail,
        nova_senha: newPassword
      });
      setModalMessage('Senha redefinida com sucesso! Tente logar.');
      setTimeout(() => {
        setShowModal(false);
        setModalMessage('');
        setResetEmail('');
        setNewPassword('');
        setConfirmPassword('');
      }, 2000);
    } catch (error) {
      setModalMessage(error.response?.data?.erro || 'Erro ao redefinir senha.');
    }
  };

  // 4. "TRADUÇÃO" DO HTML PARA JSX
  return (
    <div className="login-container">
      <header className="login-header-role">
        <h1 className="logo-title-role">Acesse sua conta</h1>
        <p className="login-subtitle">Bem-vindo de volta!</p>
      </header>

      <form id="login-form" className="form-container" onSubmit={handleSubmit}>
        <section className="form-section">
          {/* Mostra o erro da API aqui */}
          {error && <p style={{ color: '#EF4444', textAlign: 'center', fontSize: '0.9rem', fontWeight: '500' }}>{error}</p>}

          <div>
            <label htmlFor="email" className="form-label">Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="senha" className="form-label">Senha</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="senha"
                name="senha"
                className="form-input"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
            <div style={{ textAlign: 'left', marginTop: '0.5rem' }}> {/* Alinhado à esquerda */}
              <button
                type="button"
                onClick={() => setShowModal(true)}
                style={{ background: 'none', border: 'none', color: '#F97316', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '500', padding: 0 }}
              >
                Esqueceu a senha?
              </button>
            </div>
          </div>

          <div className="button-group-role">
            <button type="submit" className="btn btn-neutral">
              Entrar
            </button>

            <p className="register-text">Não tem uma conta?</p>
            <Link to="/cadastro" className="btn btn-blue">
              Cadastre-se
            </Link>
          </div>
        </section>
      </form>

      {/* MODAL DE RECUPERAÇÃO DE SENHA */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{
            backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', width: '90%', maxWidth: '400px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: '#1F2937' }}>Recuperar Senha</h2>
            <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#6B7280' }}>
              Digite seu email e a nova senha desejada.
            </p>

            {modalMessage && (
              <div style={{
                marginBottom: '1rem', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.9rem',
                backgroundColor: modalMessage.includes('sucesso') ? '#D1FAE5' : '#FEE2E2',
                color: modalMessage.includes('sucesso') ? '#065F46' : '#991B1B'
              }}>
                {modalMessage}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Email</label>
                <input
                  type="email"
                  className="form-input"
                  style={{ padding: '0.75rem' }}
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  placeholder="Seu email cadastrado"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Nova Senha</label>
                <input
                  type="password"
                  className="form-input"
                  style={{ padding: '0.75rem' }}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Nova senha"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Confirmar Nova Senha</label>
                <input
                  type="password"
                  className="form-input"
                  style={{ padding: '0.75rem' }}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirme a nova senha"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn"
                style={{ backgroundColor: '#E5E7EB', color: '#374151', flex: 1 }}
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn"
                style={{ backgroundColor: '#F97316', color: 'white', flex: 1 }}
                onClick={handleForgotPassword}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormularioLogin;