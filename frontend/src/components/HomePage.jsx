import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Importa os estilos da página
import '../styles/index.css';
import '../styles/header.css';
import '../styles/base.css';

function HomePage() {
  const [usuario, setUsuario] = useState({ nome: 'Usuário', cargo: '' });
  const [resumo, setResumo] = useState({ realizados: 0, meta: 5 });
  const [agenda, setAgenda] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const headers = { Authorization: `Bearer ${token}` };

        // 1. Buscar Perfil
        const perfilRes = await axios.get('/api/perfil', { headers });
        setUsuario({ nome: perfilRes.data.nome, cargo: perfilRes.data.cargo });

        // 4. Montar a Agenda da Semana (Segunda a Sábado) - MOVIDO PARA CIMA
        const hoje = new Date();
        const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const novaAgenda = [];

        // Encontrar a Segunda-feira da semana atual
        const diaSemana = hoje.getDay(); // 0 (Dom) a 6 (Sab)
        const diffParaSegunda = diaSemana === 0 ? -6 : 1 - diaSemana; // Se Dom(-6), se Seg(0), se Ter(-1)...

        const segundaFeira = new Date(hoje);
        segundaFeira.setDate(hoje.getDate() + diffParaSegunda);

        // Calcular datas de início e fim para a API (YYYY-MM-DD local)
        const formatLocalYMD = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        const startStr = formatLocalYMD(segundaFeira);
        const domingo = new Date(segundaFeira);
        domingo.setDate(segundaFeira.getDate() + 6);
        const endStr = formatLocalYMD(domingo);

        // 2. Buscar Registros da Semana (para o resumo) - COM DATAS
        const registrosRes = await axios.get(`/api/registros/semana?start=${startStr}&end=${endStr}`, { headers });
        const registrosSemana = registrosRes.data; // Lista de objetos { data, treino_id }
        setResumo({ realizados: registrosSemana.length, meta: 7 });

        // 3. Buscar Treinos (para montar a agenda)
        const treinosRes = await axios.get('/api/treinos', { headers });
        const treinos = treinosRes.data;

        // Gera 7 dias: Segunda a Domingo
        for (let i = 0; i < 7; i++) {
          const dataAtual = new Date(segundaFeira);
          dataAtual.setDate(segundaFeira.getDate() + i);

          const diaSemanaIndex = dataAtual.getDay();
          const diaSemanaNome = diasDaSemana[diaSemanaIndex];
          // Formatar data localmente YYYY-MM-DD para comparação correta
          const dataFormatada = formatLocalYMD(dataAtual);
          const diaMes = `${dataAtual.getDate()}/${dataAtual.getMonth() + 1}`;

          // Verifica se é hoje
          const isToday = dataAtual.toDateString() === hoje.toDateString();

          // Tenta encontrar um treino agendado para este dia da semana
          const treinoDoDia = treinos.find(t =>
            (t.dia && t.dia.toLowerCase().includes(diaSemanaNome.toLowerCase())) ||
            (t.nome && t.nome.toLowerCase().includes(diaSemanaNome.toLowerCase()))
          );

          // Verifica se treinou neste dia (por data) OU se o treino agendado foi feito em algum momento da semana
          let treinouHoje = false;

          // Check por ID do treino (Flexibilidade: se fez o treino da segunda na terça, conta como feito)
          // Só marca como feito se o treino agendado para ESTE dia foi concluído (em qualquer dia da semana)
          if (treinoDoDia) {
            if (registrosSemana.some(r => r.treino_id === treinoDoDia.id)) {
              treinouHoje = true;
            }
          }

          let status = 'rest';
          let label = 'Descanso';
          let treinoInfo = null;

          if (treinouHoje) {
            status = 'done';
            label = treinoDoDia ? treinoDoDia.nome : 'Treino Realizado';
            treinoInfo = treinoDoDia;
          } else if (treinoDoDia) {
            status = 'pending';
            label = treinoDoDia.nome;
            treinoInfo = treinoDoDia;
          }

          // Se for hoje e não treinou e não tem treino agendado, sugere um treino qualquer se houver
          if (i === 0 && status === 'rest' && treinos.length > 0) {
            // status = 'pending';
            // label = "Sugestão: " + treinos[0].nome;
            // treinoInfo = treinos[0];
          }

          novaAgenda.push({
            diaNome: isToday ? 'Hoje' : diaSemanaNome,
            diaMes: diaMes,
            status: status,
            label: label,
            isToday: isToday,
            treinoInfo: treinoInfo
          });
        }

        setAgenda(novaAgenda);
        setLoading(false);

      } catch (error) {
        console.error("Erro ao carregar dados da home:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando painel...</div>;
  }

  // RENDERIZAÇÃO PARA ADMIN
  if (usuario.cargo === 'adm') {
    return (
      <>
        <header className="page-header">
          <h1>Olá, Admin</h1>
          <p className="page-subtitle">Bem-vindo ao painel administrativo.</p>
        </header>
        <main className="main-content" style={{ borderRadius: '0 0 0.75rem 0', padding: '1.5rem' }}>
          <div className="card">
            <h2>Visão Geral</h2>
            <p>Selecione uma opção no menu lateral para gerenciar o sistema.</p>
          </div>
        </main>
      </>
    );
  }

  // RENDERIZAÇÃO PARA INSTRUTOR
  if (usuario.cargo === 'instrutor') {
    return (
      <>
        <header className="page-header">
          <h1>Olá, Instrutor {usuario.nome.split(' ')[0]}</h1>
          <p className="page-subtitle">Bem-vindo ao seu painel.</p>
        </header>
        <main className="main-content" style={{ borderRadius: '0 0 0.75rem 0', padding: '1.5rem' }}>
          <div className="card">
            <h2>Gestão de Alunos</h2>
            <p>Utilize o menu lateral para gerenciar seus alunos e treinos.</p>
          </div>
        </main>
      </>
    );
  }

  // RENDERIZAÇÃO PADRÃO (ALUNO)
  return (
    <>
      <header className="page-header">
        <h1>Olá, {usuario.nome.split(' ')[0]}</h1>
        <p className="page-subtitle">
          {usuario.cargo ? <span style={{ textTransform: 'capitalize', fontWeight: 'bold', color: '#4F46E5', marginRight: '0.5rem' }}>{usuario.cargo}</span> : null}
          {usuario.nome_instrutor && (
            <span style={{ fontSize: '0.9rem', color: '#6B7280', display: 'block', marginTop: '0.25rem' }}>
              Instrutor: <strong>{usuario.nome_instrutor}</strong>
            </span>
          )}
          {!usuario.nome_instrutor && <br />}
          Vamos treinar hoje?
        </p>

        <div className="header-card">
          <h2>Resumo Semanal</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Treinos Realizados:</strong> {resumo.realizados} / {resumo.meta}
            </li>
            {(() => {
              if (resumo.realizados === 7) {
                return (
                  <li style={{
                    backgroundColor: '#D1FAE5',
                    color: '#065F46',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #6EE7B7',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 'bold'
                  }}>
                    <span>🏆</span> Incrível! Você treinou todos os dias!
                  </li>
                );
              } else if (resumo.realizados >= resumo.meta) {
                return (
                  <li style={{
                    backgroundColor: '#D1FAE5',
                    color: '#065F46',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #6EE7B7',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 'bold'
                  }}>
                    <span>🎉</span> Meta batida! Parabéns!
                  </li>
                );
              } else if (resumo.realizados >= 3) {
                return (
                  <li style={{
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #FCD34D',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>⚠️</span> Faltam {resumo.meta - resumo.realizados} treinos para a meta!
                  </li>
                );
              } else {
                return (
                  <li style={{
                    backgroundColor: '#FEE2E2',
                    color: '#991B1B',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #F87171',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>🚨</span> Cuidado! Você está longe da meta.
                  </li>
                );
              }
            })()}
          </ul>
        </div>
      </header>

      <main className="main-content" style={{ borderRadius: '0 0 0.75rem 0' }}>
        <section className="week-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h2>Sua Semana</h2>

          {agenda.map((item, idx) => {
            // Definir estilos baseados no status
            let iconContent = '?';
            let iconClass = 'icon-gray';
            let progressWidth = '0%';
            let progressColor = '#E5E7EB';
            let statusText = 'Agendado';

            // Link fixo para "Meus Treinos" conforme solicitado
            let linkTo = '/meus-treinos';

            if (item.status === 'done') {
              iconContent = '✓';
              iconClass = 'icon-green';
              progressWidth = '100%';
              statusText = 'Concluído';
            } else if (item.status === 'pending') {
              iconContent = '!';
              iconClass = 'icon-red';
              progressWidth = '0%';
              statusText = 'Pendente';
            } else if (item.status === 'missed') {
              iconContent = '✕';
              iconClass = 'icon-red';
              statusText = 'Não realizado';
            } else if (item.status === 'rest') {
              iconContent = '';
              statusText = 'Descanso';
            }

            const CardContent = (
              <div className={`week-list-item ${item.isToday ? 'today' : ''}`}>
                <div className="week-list-item-icon">
                  <div className={`icon-circle ${iconClass}`}>{iconContent}</div>
                  <span className="day">{item.diaNome}</span>
                  <span className="date">{item.diaMes}</span>
                </div>
                <div className="week-list-item-content">
                  <p>{item.label}</p>
                  <div className="progress-bar">
                    <div style={{ width: progressWidth, backgroundColor: item.status === 'done' ? '#10B981' : progressColor }}></div>
                  </div>
                  <div className="progress-text">
                    <span className="subtext">{statusText}</span>
                    {item.status === 'done' && <span className="percent">100%</span>}
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            );

            return (
              <Link to={linkTo} className="week-list-item-link" key={idx}>
                {CardContent}
              </Link>
            );
          })}

        </section>
      </main>
    </>
  );
}
export default HomePage;