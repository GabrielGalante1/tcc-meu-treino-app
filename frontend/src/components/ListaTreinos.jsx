import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/meus-treinos.css';
import '../styles/header.css';

function ListaTreinos() {
  const [activeTab, setActiveTab] = useState('treinos'); // 'treinos' or 'historico'
  const [treinos, setTreinos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [mensagem, setMensagem] = useState('Carregando...');
  const [openTreinoId, setOpenTreinoId] = useState(null); // For workouts list
  const [openHistoricoId, setOpenHistoricoId] = useState(null); // For history list

  const navigate = useNavigate();

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // Fetch Treinos
        const resTreinos = await axios.get('/api/treinos', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setTreinos(resTreinos.data);

        // Fetch Historico
        const resHistorico = await axios.get('/api/registros', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setHistorico(resHistorico.data);

        if (resTreinos.data.length === 0 && resHistorico.data.length === 0) {
          setMensagem('Nenhum registro encontrado.');
        }

      } catch (error) {
        console.error("Erro ao buscar dados", error);
        setMensagem('Erro ao carregar dados.');
      }
    };

    fetchData();
  }, [activeTab]); // Re-fetch when tab changes to ensure fresh data

  // Helper to check if a workout was done today
  const isFeitoHoje = (treinoId) => {
    const hoje = new Date();
    const year = hoje.getFullYear();
    const month = String(hoje.getMonth() + 1).padStart(2, '0');
    const day = String(hoje.getDate()).padStart(2, '0');
    const hojeStr = `${year}-${month}-${day}`;

    return historico.some(reg => reg.treino_id === treinoId && reg.data === hojeStr);
  };

  const handleToggleExercicios = (treinoId) => {
    setOpenTreinoId(openTreinoId === treinoId ? null : treinoId);
  };

  const handleToggleHistorico = (registroId) => {
    setOpenHistoricoId(openHistoricoId === registroId ? null : registroId);
  };

  const handleApagarTreino = async (treinoId, e) => {
    e.stopPropagation();
    if (!window.confirm('Tem certeza que deseja apagar este treino?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/treinos/${treinoId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Treino apagado com sucesso!');
      setTreinos(treinos.filter(treino => treino.id !== treinoId));
    } catch (error) {
      console.error('Erro ao apagar treino:', error);
      alert('Não foi possível apagar o treino.');
    }
  };

  const handleIniciarExecucao = (treinoId, e) => {
    e.stopPropagation();
    navigate(`/treinos/${treinoId}/executar`);
  };

  const formatTime = (seconds) => {
    if (!seconds) return '00:00';
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }



  return (
    <>
      <header className="page-header">
        <div className="header-title-wrapper">
          <Link to="/" className="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          </Link>
          <h1>Meus Treinos</h1>
        </div>
        <p className="page-subtitle">Gerencie, Edite ou Delete.</p>

        {/* Tabs */}
        <div className="tabs-container">
          <button
            onClick={() => setActiveTab('treinos')}
            className={`tab-button ${activeTab === 'treinos' ? 'active' : ''}`}
          >
            Treinos
          </button>
          <button
            onClick={() => setActiveTab('historico')}
            className={`tab-button ${activeTab === 'historico' ? 'active' : ''}`}
          >
            Histórico
          </button>
        </div>

        {activeTab === 'treinos' && (
          <div>
            <Link
              to="/criar-treino"
              className="btn btn-primary"
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                marginTop: '3rem',
                backgroundColor: treinos.length === 0 ? '#3B82F6' : 'white',
                color: treinos.length === 0 ? 'white' : '#F97316'
              }}
            >
              + Novo Treino
            </Link>
          </div>
        )}
      </header>

      <main className="main-content" style={{ borderRadius: '0 0 0.75rem 0' }}>
        <section className="meus-treinos-section">

          {/* TAB: TREINOS */}
          {activeTab === 'treinos' && (
            treinos.length === 0 ? (
              <div className="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: '48px', height: '48px', margin: '0 auto', color: '#9CA3AF' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <h3>Nenhum treino encontrado</h3>
                <p>Comece criando seu primeiro plano de treino.</p>
              </div>
            ) : (
              <div className="lista-treinos">
                {treinos.map(treino => {
                  const feitoHoje = isFeitoHoje(treino.id);
                  return (
                    <div className="card treino-card" key={treino.id} onClick={() => handleToggleExercicios(treino.id)}>
                      <div className="treino-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h3>{treino.nome}</h3>
                            {feitoHoje && (
                              <span style={{
                                backgroundColor: '#10B981',
                                color: 'white',
                                fontSize: '0.7rem',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px'
                              }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '12px', height: '12px' }}>
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Feito
                              </span>
                            )}
                          </div>
                          {treino.dia && <span style={{ fontSize: '0.85rem', color: '#F97316', fontWeight: 'bold' }}>{treino.dia}</span>}
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{ width: '20px', transform: openTreinoId === treino.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: '#9CA3AF' }}>
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>

                      {openTreinoId === treino.id && (
                        <div className="treino-card-body" style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                          <ul className="exercicio-lista-detalhes">
                            {treino.exercicios.map((ex, idx) => (
                              <li key={idx} style={{ marginBottom: '0.5rem', borderBottom: '1px solid #f9f9f9', paddingBottom: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <div>
                                    <div style={{ fontWeight: '600', color: '#374151' }}>{ex.nome_exercicio}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                      {ex.series}x{ex.repeticoes} {ex.peso ? `(${ex.peso})` : ''}
                                    </div>
                                  </div>
                                </div>
                                {ex.gif_url && (
                                  <div style={{ width: '100%', maxWidth: '200px', margin: '0.5rem 0' }}>
                                    <img
                                      src={ex.gif_url}
                                      alt={`Demonstração ${ex.nome_exercicio}`}
                                      style={{ width: '100%', borderRadius: '8px' }}
                                    />
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>

                          <div className="card-actions" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button onClick={(e) => handleIniciarExecucao(treino.id, e)} className="btn-icon" style={{ color: 'green', border: '1px solid green' }}>
                              {feitoHoje ? 'Fazer Novamente' : 'Iniciar'}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); navigate(`/treinos/${treino.id}/editar`); }} className="btn-icon" style={{ color: '#3B82F6', border: '1px solid #3B82F6' }}>Editar</button>
                            <button onClick={(e) => handleApagarTreino(treino.id, e)} className="btn-icon delete" style={{ color: 'red', border: '1px solid red' }}>Excluir</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* TAB: HISTÓRICO */}
          {activeTab === 'historico' && (
            historico.length === 0 ? (
              <div className="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: '48px', height: '48px', margin: '0 auto', color: '#9CA3AF' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <h3>Nenhum histórico encontrado</h3>
                <p>Complete seu primeiro treino para ver o histórico.</p>
              </div>
            ) : (
              <div className="lista-treinos">
                {historico.map(reg => (
                  <div className="card treino-card" key={reg.id} onClick={() => handleToggleHistorico(reg.id)} style={{ borderLeft: '4px solid #10B981' }}>
                    <div className="treino-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3>{reg.nome_treino}</h3>
                        <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                          {formatDate(reg.data)} • {formatTime(reg.duracao_segundos)}
                        </div>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{ width: '20px', transform: openHistoricoId === reg.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: '#9CA3AF' }}>
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>

                    {openHistoricoId === reg.id && (
                      <div className="treino-card-body" style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#374151' }}>Exercícios:</h4>
                        <ul className="exercicio-lista-detalhes">
                          {reg.itens.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-start' }}>
                              <span style={{ color: item.concluido ? '#374151' : '#9CA3AF', textDecoration: item.concluido ? 'none' : 'line-through' }}>
                                {item.exercicio_nome}
                              </span>
                              {item.concluido ? (
                                <span style={{ color: '#10B981' }}>✓</span>
                              ) : (
                                <span style={{ color: '#EF4444' }}>✕</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}

        </section>
      </main>
    </>
  );
}

export default ListaTreinos;