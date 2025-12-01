import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/meus-treinos.css';
import '../styles/header.css';
import '../styles/base.css';

function MuralNoticias() {
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const cargo = localStorage.getItem('cargo');

    useEffect(() => {
        const fetchNoticias = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await axios.get('/api/noticias', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setNoticias(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao carregar notícias", error);
                setLoading(false);
            }
        };

        fetchNoticias();
    }, []);

    const handleContestar = (noticiaId) => {
        // Simulação de contestação
        const motivo = prompt("Digite o motivo da contestação:");
        if (motivo) {
            console.log(`Contestação enviada para notícia ${noticiaId}: ${motivo}`);
            alert("Contestação enviada ao administrador com sucesso!");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Tem certeza que deseja apagar esta notícia?")) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/noticias/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNoticias(noticias.filter(n => n.id !== id));
            alert("Notícia apagada!");
        } catch (error) {
            console.error(error);
            alert("Erro ao apagar notícia.");
        }
    };

    if (loading) return <div className="loading-container">Carregando...</div>;

    return (
        <div className="content-wrapper">
            <header className="page-header" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <div className="header-title-wrapper">
                    <Link to="/" className="back-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </Link>
                    <h1>Mural de Notícias</h1>
                </div>
                <p className="page-subtitle">Fique por dentro das novidades da sua academia.</p>

                {cargo === 'adm' && (
                    <div>
                        <button
                            onClick={() => navigate('/noticias/criar')}
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
                            + Nova Notícia
                        </button>
                    </div>
                )}
            </header>

            <main className="main-content" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <section className="meus-treinos-section">
                    {noticias.length === 0 ? (
                        <div className="empty-state">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            <h3>Nenhuma notícia encontrada</h3>
                            <p>Fique atento! Em breve teremos novidades para você.</p>
                        </div>
                    ) : (
                        <div className="noticias-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {noticias.map(noticia => (
                                <div key={noticia.id} className="card" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
                                    {/* Link para abrir em nova aba */}
                                    <Link to={`/noticias/${noticia.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                        {noticia.imagem_url && (
                                            <div style={{ height: '200px', overflow: 'hidden' }}>
                                                <img src={noticia.imagem_url} alt={noticia.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        )}
                                        <div style={{ padding: '1.5rem' }}>
                                            <div style={{ marginBottom: '0.5rem', textAlign: 'left' }}>
                                                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1F2937' }}>{noticia.titulo}</h3>
                                                {noticia.subtitulo && <h4 style={{ margin: '0.25rem 0 0', fontSize: '1rem', color: '#4B5563', fontWeight: 'normal' }}>{noticia.subtitulo}</h4>}
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Botões de ação fora do Link para evitar clique acidental no link */}
                                    <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                        {cargo === 'adm' && (
                                            <>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); navigate(`/noticias/${noticia.id}/editar`); }}
                                                    style={{
                                                        background: 'white',
                                                        border: '1px solid #D1D5DB',
                                                        color: '#374151',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: '0.5rem',
                                                        cursor: 'pointer',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '500',
                                                        zIndex: 10
                                                    }}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); handleDelete(noticia.id); }}
                                                    style={{
                                                        background: '#EF4444',
                                                        border: 'none',
                                                        color: 'white',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: '0.5rem',
                                                        cursor: 'pointer',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '500',
                                                        zIndex: 10
                                                    }}
                                                >
                                                    Excluir
                                                </button>
                                            </>
                                        )}

                                        {cargo === 'instrutor' && (
                                            <button
                                                onClick={(e) => { e.preventDefault(); handleContestar(noticia.id); }}
                                                className="btn-secondary"
                                                style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', zIndex: 10 }}
                                            >
                                                Contestar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default MuralNoticias;
