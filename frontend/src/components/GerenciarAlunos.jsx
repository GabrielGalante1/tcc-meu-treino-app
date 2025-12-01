import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/meus-treinos.css'; // Reusing styles for consistency
import '../styles/header.css';

function GerenciarAlunos() {
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAlunos = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await axios.get('/api/meus-alunos', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setAlunos(response.data);
            } catch (err) {
                console.error("Erro ao buscar alunos", err);
                setError('Erro ao carregar alunos.');
            } finally {
                setLoading(false);
            }
        };

        fetchAlunos();
    }, []);

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>;
    }

    return (
        <>
            <header className="page-header">
                <div className="header-title-wrapper">
                    <Link to="/" className="back-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </Link>
                    <h1>Meus Alunos</h1>
                </div>
                <p className="page-subtitle">Gerencie seus alunos e seus treinos.</p>
            </header>

            <main className="main-content" style={{ borderRadius: '0 0 0.75rem 0' }}>
                <section className="meus-treinos-section">
                    {alunos.length === 0 ? (
                        <div className="empty-state">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: '48px', height: '48px', margin: '0 auto', color: '#9CA3AF' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                            </svg>
                            <h3>Nenhum aluno encontrado</h3>
                            <p>Você ainda não tem alunos vinculados.</p>
                        </div>
                    ) : (
                        <div className="lista-treinos">
                            {alunos.map(aluno => (
                                <div key={aluno.id} className="card treino-card" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '3rem', height: '3rem', borderRadius: '9999px', backgroundColor: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#374151', fontSize: '1.25rem', overflow: 'hidden' }}>
                                            {aluno.foto_perfil ? (
                                                <img src={aluno.foto_perfil} alt={aluno.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                aluno.nome.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0 }}>{aluno.nome}</h3>
                                            <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>{aluno.email}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <Link to={`/alunos/${aluno.id}/treinos`} className="btn-secondary-outline" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}>
                                            Ver Treinos
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}

export default GerenciarAlunos;
