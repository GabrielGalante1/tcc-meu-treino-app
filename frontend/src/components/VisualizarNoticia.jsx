import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/meus-treinos.css'; // Reutilizando estilos

function VisualizarNoticia() {
    const { id } = useParams();
    const [noticia, setNoticia] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargo = localStorage.getItem('cargo');

    useEffect(() => {
        const fetchNoticia = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`/api/noticias/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setNoticia(response.data);
            } catch (err) {
                console.error(err);
                setError('Erro ao carregar notícia.');
            } finally {
                setLoading(false);
            }
        };

        fetchNoticia();
    }, [id]);

    if (loading) return <div className="loading-container">Carregando...</div>;
    if (error) return <div className="error-container">{error}</div>;
    if (!noticia) return <div className="error-container">Notícia não encontrada.</div>;

    return (
        <div className="content-wrapper">
            <header className="page-header" style={{ borderRadius: '0.75rem 0.75rem 0 0', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <div className="header-title-wrapper" style={{ alignItems: 'center' }}>
                    <Link to="/noticias" className="back-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </Link>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <h1>{noticia.titulo}</h1>
                        {cargo === 'adm' && (
                            <Link to={`/noticias/${id}/editar`} style={{ color: '#F97316', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{ width: '16px' }}>
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                Editar
                            </Link>
                        )}
                    </div>
                </div>
                {/* Subtítulo removido do header */}
            </header>

            <main className="main-content" style={{ borderRadius: '0 0 0.75rem 0.75rem', overflow: 'hidden', padding: '0', maxWidth: '800px', margin: '0 auto', width: '100%', backgroundColor: 'white' }}>
                <div style={{ width: '100%' }}>
                    {noticia.imagem_url && (
                        <img
                            alt={noticia.titulo}
                            src={noticia.imagem_url}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                    )}
                </div>
                <div style={{ padding: '2rem' }}>
                    {noticia.subtitulo && (
                        <h2 style={{ fontSize: '1.25rem', color: 'rgb(75, 85, 99)', marginBottom: '1.5rem', fontWeight: 'normal', wordBreak: 'break-word' }}>
                            {noticia.subtitulo}
                        </h2>
                    )}
                    <div style={{ color: 'rgb(55, 65, 81)', lineHeight: '1.8', fontSize: '1.1rem', whiteSpace: 'pre-wrap', marginBottom: '2rem', wordBreak: 'break-word' }}>
                        {noticia.conteudo}
                    </div>
                    <div style={{ borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: 'rgb(229, 231, 235)', paddingTop: '1rem', color: 'rgb(156, 163, 175)', fontSize: '0.9rem', textAlign: 'right' }}>
                        Publicado em {noticia.data_criacao} por {noticia.autor_nome}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default VisualizarNoticia;
