import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/cadastro.css';

function FormularioCadastro() {
  const navigate = useNavigate();

  // Estados de Controle
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);

  // Estados gerais
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaRepeat, setSenhaRepeat] = useState('');
  const [cargo, setCargo] = useState('aluno'); // 'aluno' ou 'instrutor'
  const [tel, setTel] = useState('');

  // Estados específicos de Aluno
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [idInstrutor, setIdInstrutor] = useState('');
  const [listaInstrutores, setListaInstrutores] = useState([]);

  useEffect(() => {
    document.body.classList.add('login-body');

    // Busca lista de instrutores ao carregar
    axios.get('/api/instrutores')
      .then(response => {
        setListaInstrutores(response.data);
      })
      .catch(err => console.error("Erro ao buscar instrutores", err));

    return () => {
      document.body.classList.remove('login-body');
    };
  }, []);

  const handleNextStep = (e) => {
    e.preventDefault();
    setError(null);

    if (step === 1) {
      if (senha !== senhaRepeat) {
        setError('As senhas não coincidem.');
        return;
      }
      if (!nome || !email || !senha) {
        setError('Preencha todos os campos obrigatórios.');
        return;
      }

      // Se for instrutor, já pode finalizar
      if (cargo === 'instrutor') {
        handleSubmit();
      } else {
        // Se for aluno, vai para o passo 2
        setStep(2);
      }
    }
  };

  const handlePrevStep = () => {
    setStep(1);
    setError(null);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    const dadosParaApi = {
      nome,
      email,
      senha,
      cargo,
      tel,
      // Campos opcionais (só serão usados se cargo for aluno)
      peso: cargo === 'aluno' ? parseFloat(peso) : null,
      altura: cargo === 'aluno' ? parseFloat(altura) : null,
      id_instrutor: cargo === 'aluno' ? (idInstrutor || null) : null
    };

    try {
      await axios.post('/api/usuarios', dadosParaApi);
      alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.erro || 'Erro ao cadastrar. Verifique seus dados.';
      setError(errorMessage);
    }
  };

  return (
    <div className="login-container" style={{ overflow: 'visible' }}>
      <div className="content-wrapper" >
        <header className="login-header-role" style={{ marginBottom: '0.5rem' }}>
          <Link to="/login" className="role-back-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
          <h1 className="logo-title-role" style={{ marginBottom: 0 }}>Criar Conta</h1>
        </header>

        <p className="page-subtitle-cadastro" style={{ marginTop: 0, marginBottom: '1.5rem' }}>
          {step === 1 ? 'Preencha seus dados de acesso.' : 'Complete seu perfil de aluno.'}
        </p>

        <form id="cadastro-form" className="form-container" onSubmit={step === 1 ? handleNextStep : handleSubmit}>

          <section id="dados-acesso-section" className="form-section">

            {step === 1 && (
              <>
                {/* Aviso sobre Cargo */}
                <div style={{
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  fontSize: '0.875rem',
                  color: '#1E40AF'
                }}>
                  <strong>Nota:</strong> Este cadastro é exclusivo para <strong>Alunos</strong>. Para contas de Instrutor, solicite à gerência.
                </div>

                <label htmlFor="nome" className="form-label">Nome Completo</label>
                <input
                  type="text"
                  id="nome"
                  className="form-input"
                  placeholder="Seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />

                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="seuemail@dominio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label htmlFor="tel" className="form-label">Telefone</label>
                <input
                  type="tel"
                  id="tel"
                  className="form-input"
                  placeholder="(XX) XXXXX-XXXX"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                />

                <label htmlFor="senha" className="form-label">Senha</label>
                <div className="password-wrapper">
                  <input
                    type="password"
                    id="senha"
                    className="form-input"
                    placeholder="Pelo menos 6 caracteres"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                </div>
                <label htmlFor="senha-repeat" className="form-label">Repita a Senha</label>
                <div className="password-wrapper">
                  <input
                    type="password"
                    id="senha-repeat"
                    className="form-input"
                    placeholder="Digite a senha novamente"
                    value={senhaRepeat}
                    onChange={(e) => setSenhaRepeat(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {step === 2 && cargo === 'aluno' && (
              <>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#333', fontWeight: '600' }}>Dados Corporais</h3>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="peso" className="form-label">Peso (kg)</label>
                    <input
                      type="number"
                      id="peso"
                      className="form-input"
                      placeholder="Ex: 70.5"
                      value={peso}
                      onChange={(e) => setPeso(e.target.value)}
                      step="0.1"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="altura" className="form-label">Altura (m)</label>
                    <input
                      type="number"
                      id="altura"
                      className="form-input"
                      placeholder="Ex: 1.75"
                      value={altura}
                      onChange={(e) => setAltura(e.target.value)}
                      step="0.01"
                    />
                  </div>
                </div>

                <label htmlFor="instrutor" className="form-label" style={{ marginTop: '1rem' }}>Selecione seu Instrutor</label>
                <select
                  id="instrutor"
                  className="form-input"
                  value={idInstrutor}
                  onChange={(e) => setIdInstrutor(e.target.value)}
                >
                  <option value="">Não tenho instrutor por agora</option>
                  {listaInstrutores.map(instrutor => (
                    <option key={instrutor.id} value={instrutor.id}>
                      {instrutor.nome}
                    </option>
                  ))}
                </select>
              </>
            )}

            {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}

            <div className="button-group-role" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              {step === 2 && (
                <button type="button" className="btn btn-neutral" onClick={handlePrevStep} style={{ flex: 1 }}>
                  Voltar
                </button>
              )}
              <button type="submit" className="btn btn-blue" style={{ flex: 1 }}>
                {step === 1 ? 'Próximo' : 'Finalizar Cadastro'}
              </button>
            </div>

          </section>
        </form>
      </div>
    </div>
  );
}

export default FormularioCadastro;