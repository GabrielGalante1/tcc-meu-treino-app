import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/criarTreino.css'; // Using the creation form styles
import '../styles/header.css';

function ExecucaoTreino() {
    const { treinoId } = useParams();
    const navigate = useNavigate();
    const [treino, setTreino] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Timer state
    const [segundos, setSegundos] = useState(0);
    const timerRef = useRef(null);

    // Checkbox state: map of exercise_id -> boolean
    const [concluidos, setConcluidos] = useState({});

    const [iniciado, setIniciado] = useState(false); // Novo estado para controlar o início

    // Fetch workout details
    useEffect(() => {
        const fetchTreino = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('/api/treinos', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const treinoEncontrado = response.data.find(t => t.id === parseInt(treinoId));

                if (treinoEncontrado) {
                    setTreino(treinoEncontrado);
                    const initialConcluidos = {};
                    treinoEncontrado.exercicios.forEach(ex => {
                        // The API returns 'id_exercicio' in the list endpoint
                        const id = ex.id_exercicio || ex.id;
                        if (id) {
                            initialConcluidos[id] = false;
                        }
                    });
                    setConcluidos(initialConcluidos);
                } else {
                    setError('Treino não encontrado.');
                }
            } catch (err) {
                console.error('Erro ao buscar treino:', err);
                setError('Falha ao carregar dados do treino.');
            } finally {
                setLoading(false);
            }
        };

        fetchTreino();
    }, [treinoId, navigate]);

    // Timer logic - Só roda se iniciado for true
    useEffect(() => {
        if (iniciado) {
            timerRef.current = setInterval(() => {
                setSegundos(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [iniciado]);

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleToggle = (exercicioId) => {
        setConcluidos(prev => ({
            ...prev,
            [exercicioId]: !prev[exercicioId]
        }));
    };

    const handleIniciar = () => {
        setIniciado(true);
    };

    const handleFinalizar = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const itens = Object.keys(concluidos).map(exId => ({
            exercicio_id: parseInt(exId),
            concluido: concluidos[exId]
        }));

        // Obter data local no formato YYYY-MM-DD
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const dia = String(hoje.getDate()).padStart(2, '0');
        const dataLocal = `${ano}-${mes}-${dia}`;

        const payload = {
            treino_id: parseInt(treinoId),
            duracao: segundos,
            itens: itens,
            data: dataLocal
        };

        try {
            await axios.post('/api/registros', payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert(`Treino finalizado em ${formatTime(segundos)}!`);
            navigate('/treinos');
        } catch (err) {
            console.error('Erro ao finalizar treino:', err);
            alert('Erro ao salvar registro do treino.');
        }
    };

    if (loading) return <div className="loading-container">Carregando...</div>;
    if (error) return <div className="error-container">{error} <Link to="/treinos">Voltar</Link></div>;
    if (!treino) return null;

    return (
        <>
            <header className="page-header" style={{ borderRadius: '0.75rem 0.75rem 0 0' }}>
                <div className="header-title-wrapper">
                    <Link to="/treinos" className="back-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </Link>
                    <h1>Modo Execução</h1>
                </div>
            </header>

            <div className="form-container">
                {/* Timer & Info Section */}
                <section className="form-section" style={{ borderRadius: '0 0 0.75rem 0.75rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '3rem', color: '#3B82F6', fontFamily: 'monospace', margin: '0.5rem 0' }}>
                        {formatTime(segundos)}
                    </h2>
                    <p style={{ color: '#6B7280', marginBottom: '1rem' }}>Tempo decorrido</p>

                    <div style={{ marginBottom: '1rem' }}>
                        {!iniciado ? (
                            <button
                                onClick={handleIniciar}
                                className="btn btn-primary"
                                style={{ fontSize: '1.1rem', padding: '0.75rem 2rem', backgroundColor: '#10B981', width: 'auto' }} // Verde para iniciar
                            >
                                Iniciar Treino
                            </button>
                        ) : (
                            <button
                                onClick={handleFinalizar}
                                className="btn btn-primary"
                                style={{ fontSize: '1.1rem', padding: '0.75rem 2rem', width: 'auto' }}
                            >
                                Finalizar Treino
                            </button>
                        )}
                    </div>

                    <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1rem', width: '100%' }}>
                        <h3 style={{ fontSize: '1.25rem', color: '#1F2937', marginBottom: '0.25rem' }}>{treino.nome}</h3>
                        {treino.dia && <span style={{
                            backgroundColor: '#FFF7ED',
                            color: '#C2410C',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            display: 'inline-block'
                        }}>{treino.dia}</span>}
                    </div>
                </section>

                <h2 className="section-title">Checklist de Exercícios</h2>

                <div id="exercicio-lista">
                    {treino.exercicios.map((ex, idx) => {
                        const id = ex.id_exercicio || ex.id;
                        const isChecked = concluidos[id] || false;
                        return (
                            <div
                                className="exercicio-card"
                                key={id || idx}
                                style={{
                                    opacity: iniciado ? 1 : 0.5, // Opacidade reduzida se não iniciado
                                    pointerEvents: iniciado ? 'auto' : 'none', // Desabilita clique se não iniciado
                                    transform: 'scale(1)',
                                    borderLeft: isChecked ? '4px solid #10B981' : '4px solid #F97316',
                                    backgroundColor: isChecked ? '#ECFDF5' : 'white',
                                    transition: 'all 0.3s ease'
                                }}
                                onClick={() => id && handleToggle(id)}
                            >
                                <div className="exercicio-card-header" style={{ marginBottom: '0.5rem' }}>
                                    <h3 style={{
                                        fontSize: '1.1rem',
                                        fontWeight: '600',
                                        color: isChecked ? '#065F46' : '#1F2937',
                                        textDecoration: isChecked ? 'line-through' : 'none'
                                    }}>
                                        {ex.nome_exercicio}
                                    </h3>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '4px',
                                        border: isChecked ? '2px solid #10B981' : '2px solid #D1D5DB',
                                        backgroundColor: isChecked ? '#10B981' : 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '16px'
                                    }}>
                                        {isChecked && '✓'}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <span className="form-label-inline">Séries</span>
                                        <div className="form-input" style={{ backgroundColor: isChecked ? '#D1FAE5' : '#F9FAFB' }}>{ex.series}</div>
                                    </div>
                                    <div className="form-group">
                                        <span className="form-label-inline">Repetições</span>
                                        <div className="form-input" style={{ backgroundColor: isChecked ? '#D1FAE5' : '#F9FAFB' }}>{ex.repeticoes}</div>
                                    </div>
                                </div>
                                <div className="form-row" style={{ marginTop: '0.5rem' }}>
                                    <div className="form-group">
                                        <span className="form-label-inline">Descanso</span>
                                        <div className="form-input" style={{ backgroundColor: isChecked ? '#D1FAE5' : '#F9FAFB' }}>{ex.descanso_seg || 60}s</div>
                                    </div>
                                    <div className="form-group">
                                        <span className="form-label-inline">Carga</span>
                                        <div className="form-input" style={{ backgroundColor: isChecked ? '#D1FAE5' : '#F9FAFB' }}>{ex.peso || '-'}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default ExecucaoTreino;
