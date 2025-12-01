import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';
import '../styles/meus-treinos.css';
import '../styles/header.css';
import '../styles/base.css';

function FormularioNoticia() {
    const { id } = useParams(); // ID da notícia se estiver editando
    const [titulo, setTitulo] = useState('');
    const [subtitulo, setSubtitulo] = useState('');
    const [conteudo, setConteudo] = useState('');
    const [imagem, setImagem] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const fetchNoticia = async () => {
                const token = localStorage.getItem('token');
                try {
                    const response = await axios.get(`/api/noticias/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const { titulo, subtitulo, conteudo } = response.data;
                    setTitulo(titulo);
                    setSubtitulo(subtitulo);
                    setConteudo(conteudo);
                } catch (error) {
                    console.error("Erro ao carregar notícia", error);
                    alert("Erro ao carregar dados da notícia.");
                }
            };
            fetchNoticia();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('subtitulo', subtitulo);
        formData.append('conteudo', conteudo);
        if (imagem) {
            formData.append('imagem', imagem);
        }

        try {
            if (id) {
                // EDITAR (PUT)
                await axios.put(`/api/noticias/${id}`,
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                alert('Notícia atualizada com sucesso!');
            } else {
                // CRIAR (POST)
                await axios.post('/api/noticias',
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                alert('Notícia publicada com sucesso!');
            }
            navigate('/noticias');
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar notícia: ' + (error.response?.data?.erro || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content-wrapper">
            <header className="page-header">
                <div className="header-title-wrapper">
                    <Link to="/noticias" className="back-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </Link>
                    <h1>{id ? 'Editar Notícia' : 'Nova Notícia'}</h1>
                </div>
                <p className="page-subtitle">{id ? 'Atualize as informações da notícia.' : 'Publique um aviso para a academia.'}</p>
            </header>

            <main className="main-content">
                <div className="card" style={{ padding: '1.5rem' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>Título</label>
                            <input
                                type="text"
                                className="form-input"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }}
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                required
                                placeholder="Ex: Horário de Feriado"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>Subtítulo</label>
                            <input
                                type="text"
                                className="form-input"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }}
                                value={subtitulo}
                                onChange={(e) => setSubtitulo(e.target.value)}
                                required
                                placeholder="Ex: Funcionaremos até as 12h"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>Conteúdo</label>
                            <textarea
                                className="form-input"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB', minHeight: '150px', fontFamily: 'inherit' }}
                                value={conteudo}
                                onChange={(e) => setConteudo(e.target.value)}
                                required
                                placeholder="Digite os detalhes da notícia..."
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>Imagem {id && '(Opcional se não quiser alterar)'}</label>
                            <input
                                type="file"
                                className="form-input"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #D1D5DB' }}
                                onChange={(e) => setImagem(e.target.files[0])}
                                required={!id} // Obrigatório apenas se NÃO estiver editando
                                accept="image/*"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
                            disabled={loading}
                        >
                            {loading ? 'Salvando...' : (id ? 'Salvar Alterações' : 'Publicar Notícia')}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default FormularioNoticia;
