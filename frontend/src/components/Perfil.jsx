import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/conta.css';
import '../styles/header.css';
import '../styles/base.css';

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  // Estados para Edição de Perfil
  const [modalEditarPerfilAberto, setModalEditarPerfilAberto] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState(''); // <--- Novo estado

  // Estados para Alteração de Senha
  const [modalSenhaAberto, setModalSenhaAberto] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Estados para Detalhes da Conta
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);

  useEffect(() => {
    const buscarPerfil = async () => {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      try {
        const response = await axios.get('/api/perfil', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUsuario(response.data);
        setNome(response.data.nome);
        setEmail(response.data.email);
        setTel(response.data.tel || ''); // <--- Setando telefone
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    buscarPerfil();
  }, [navigate]);

  const handleExcluirConta = async () => {
    if (window.confirm("ATENÇÃO: Tem certeza que deseja excluir sua conta? Essa ação é irreversível e apagará todos os seus treinos e histórico.")) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete('/api/perfil', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        alert('Conta excluída com sucesso.');
        localStorage.removeItem('token');
        navigate('/cadastro');
      } catch (error) {
        console.error('Erro ao excluir conta:', error);
        alert('Erro ao excluir conta. Tente novamente.');
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleSalvarPerfil = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put('/api/perfil', { nome, email, tel }, { // <--- Enviando tel
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsuario({ ...usuario, nome, email, tel });
      setModalEditarPerfilAberto(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert(error.response?.data?.erro || 'Erro ao atualizar perfil.');
    }
  };

  const handleAlterarSenha = async (e) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      alert('A nova senha e a confirmação não coincidem.');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      await axios.put('/api/perfil/senha', { senha_atual: senhaAtual, nova_senha: novaSenha }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Senha alterada com sucesso!');
      setModalSenhaAberto(false);
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      alert(error.response?.data?.erro || 'Erro ao alterar senha.');
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Carregando...</div>;

  return (
    <>
      <header className="page-header profile-header">
        <div className="header-title-wrapper">
          <Link to="/" className="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          </Link>
          <h1>Minha Conta</h1>
        </div>
        <div className="profile-details">
          <div className="profile-avatar">
            <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontSize: '2.5rem', color: 'white', fontWeight: 'bold' }}>
              {usuario.nome.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="profile-info">
            <h2>
              {usuario.nome}
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 'normal',
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '0.25rem 0.5rem',
                borderRadius: '9999px',
                marginLeft: '0.75rem',
                textTransform: 'capitalize',
                verticalAlign: 'middle'
              }}>
                {usuario.cargo}
              </span>
            </h2>
            <p>{usuario.email}</p>
          </div>
        </div>
      </header>

      <main className="main-content" style={{ borderRadius: '0 0 0.75rem 0' }}>
        <div className="conta-container">

          {/* Nova Seção: Detalhes da Conta (Separada) */}
          <div className="profile-section">
            <div className="section-header">
              <h3>Dados da Conta</h3>
            </div>
            <div className="action-item" onClick={() => setModalDetalhesAberto(true)}>
              <div className="action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <span>Ver Detalhes da Conta</span>
              <svg className="chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Seção de Configurações */}
          <div className="profile-section">
            <div className="section-header">
              <h3>Configurações</h3>
            </div>

            {/* Botão Editar Dados */}
            <div className="action-item" onClick={() => setModalEditarPerfilAberto(true)}>
              <div className="action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <span>Editar Dados</span>
              <svg className="chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Botão Alterar Senha */}
            <div className="action-item" onClick={() => setModalSenhaAberto(true)}>
              <div className="action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span>Alterar Senha</span>
              <svg className="chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>



          </div>

          {/* Zona de Perigo / Ações da Conta */}
          <div className="account-actions-footer">
            <button onClick={handleLogout} className="btn-logout-neutral">
              Sair
            </button>
            <button onClick={handleExcluirConta} className="btn-delete">
              Deletar Conta
            </button>
          </div>

        </div>
      </main>

      {/* Modal de Detalhes da Conta */}
      {modalDetalhesAberto && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Cabeçalho Laranja com Título */}
            <div className="modal-header">
              <h3>Detalhes da Conta</h3>
            </div>

            <div style={{ padding: '2rem' }}>
              <div className="info-display-clean">
                <div className="info-item">
                  <div className="info-content">
                    <span className="label">ID do Usuário</span>
                    <span className="value">#{usuario.id}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-content">
                    <span className="label">Nome Completo</span>
                    <span className="value">{usuario.nome}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-content">
                    <span className="label">Email</span>
                    <span className="value">{usuario.email}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-content">
                    <span className="label">Telefone</span>
                    <span className="value">{usuario.tel || '-'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-content">
                    <span className="label">Cargo</span>
                    <span className="value" style={{ textTransform: 'capitalize' }}>{usuario.cargo}</span>
                  </div>
                </div>
              </div>
              <div className="modal-actions" style={{ marginTop: '2rem' }}>
                <button type="button" onClick={() => setModalDetalhesAberto(false)} className="btn-primary-sm" style={{ width: '100%' }}>Fechar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editar Perfil */}
      {modalEditarPerfilAberto && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="modal-header">
              <h3>Editar Dados</h3>
            </div>
            <div style={{ padding: '2rem' }}>
              <form onSubmit={handleSalvarPerfil}>
                <div className="form-group">
                  <label>Nome</label>
                  <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="form-input" required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" required />
                </div>
                <div className="form-group">
                  <label>Telefone</label>
                  <input type="tel" value={tel} onChange={(e) => setTel(e.target.value)} className="form-input" placeholder="(XX) XXXXX-XXXX" />
                </div>
                <div className="modal-actions" style={{ marginTop: '2rem' }}>
                  <button type="button" onClick={() => { setModalEditarPerfilAberto(false); setNome(usuario.nome); setEmail(usuario.email); setTel(usuario.tel || ''); }} className="btn-secondary">Cancelar</button>
                  <button type="submit" className="btn-primary-sm">Salvar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Alterar Senha */}
      {modalSenhaAberto && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="modal-header">
              <h3>Alterar Senha</h3>
            </div>
            <div style={{ padding: '2rem' }}>
              <form onSubmit={handleAlterarSenha}>
                <div className="form-group">
                  <label>Senha Atual</label>
                  <input type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} className="form-input" required />
                </div>
                <div className="form-group">
                  <label>Nova Senha</label>
                  <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} className="form-input" required />
                </div>
                <div className="form-group">
                  <label>Confirmar Nova Senha</label>
                  <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} className="form-input" required />
                </div>
                <div className="modal-actions" style={{ marginTop: '2rem' }}>
                  <button type="button" onClick={() => setModalSenhaAberto(false)} className="btn-secondary">Cancelar</button>
                  <button type="submit" className="btn-primary-sm">Alterar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Perfil;