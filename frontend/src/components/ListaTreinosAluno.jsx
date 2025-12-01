import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../styles/meus-treinos.css';
import '../styles/header.css';

function ListaTreinosAluno() {
    const { alunoId } = useParams();
    const [treinos, setTreinos] = useState([]);
    const [aluno, setAluno] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openTreinoId, setOpenTreinoId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                // Fetch Treinos do Aluno
                const resTreinos = await axios.get(`/api/usuarios/${alunoId}/treinos`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setTreinos(resTreinos.data);

                // Fetch Dados do Aluno (opcional, para mostrar o nome no título)
                // Como não temos um endpoint direto público para pegar info de qualquer user, 
                // podemos tentar pegar da lista de alunos ou assumir que o instrutor sabe quem é.
                // Mas vamos tentar pegar da lista de alunos para ser mais bonito.
                const resAlunos = await axios.get('/api/meus-alunos', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const alunoEncontrado = resAlunos.data.find(a => String(a.id) === String(alunoId));
                if (alunoEncontrado) setAluno(alunoEncontrado);

            } catch (error) {
                console.error("Erro ao buscar dados", error);
                alert('Erro ao carregar treinos do aluno.');
                navigate('/meus-alunos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [alunoId, navigate]);

    const handleToggleExercicios = (treinoId) => {
        setOpenTreinoId(openTreinoId === treinoId ? null : treinoId);
    };

    const handleApagarTreino = async (treinoId, e) => {
        e.stopPropagation();
        if (!window.confirm('Tem certeza que deseja apagar este treino do aluno?')) return;
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

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>;

    return (
        <>
            <header className="page-header">
                <div className="header-title-wrapper">
                    <Link to="/meus-alunos" className="back-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </Link>
                    <h1>Treinos de {aluno ? aluno.nome : 'Aluno'}</h1>
                </div>
                <p className="page-subtitle">Gerencie os treinos do seu aluno.</p>

                <div>
                    <button
                        onClick={() => navigate(`/criar-treino?alunoId=${alunoId}`)}
                        className="btn btn-primary"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                            marginTop: '3rem',
                            backgroundColor: 'white',
                            color: '#F97316'
                        }}
                    >
                        + Novo Treino
                    </button>
                </div>
            </header>

            <main className="main-content" style={{ borderRadius: '0 0 0.75rem 0' }}>
                <section className="meus-treinos-section">
                    {treinos.length === 0 ? (
                        <div className="empty-state">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: '48px', height: '48px', margin: '0 auto', color: '#9CA3AF' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            <h3>Nenhum treino encontrado</h3>
                            <p>Este aluno ainda não possui treinos.</p>
                        </div>
                    ) : (
                        <div className="lista-treinos">
                            {treinos.map(treino => (
                                <div className="card treino-card" key={treino.id} onClick={() => handleToggleExercicios(treino.id)}>
                                    <div className="treino-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <h3>{treino.nome}</h3>
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
                                                <button onClick={(e) => { e.stopPropagation(); navigate(`/treinos/${treino.id}/editar`); }} className="btn-icon" style={{ color: '#3B82F6', border: '1px solid #3B82F6' }}>Editar</button>
                                                <button onClick={(e) => handleApagarTreino(treino.id, e)} className="btn-icon delete" style={{ color: 'red', border: '1px solid red' }}>Excluir</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                            )}
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}

export default ListaTreinosAluno;
