import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';
import '../styles/criarTreino.css';
import '../styles/header.css'; // Import header styles

function FormularioTreino() {
  const navigate = useNavigate();
  const { treinoId } = useParams(); // Get ID if editing
  const [nomeTreino, setNomeTreino] = useState('');
  const [diaTreino, setDiaTreino] = useState('');
  const [exercicios, setExercicios] = useState([{ exercicio_id: '', series: '', repeticoes: '', descanso_seg: '', peso: '' }]);

  // --- ★★★ NOVOS ESTADOS ★★★ ---
  const [catalogoExercicios, setCatalogoExercicios] = useState([]); // Guarda a lista COMPLETA
  const [exerciciosFiltrados, setExerciciosFiltrados] = useState([]); // Guarda a lista que o usuário vê
  const [gruposMusculares, setGruposMusculares] = useState([]); // Para o <select> do filtro
  const [filtroGrupo, setFiltroGrupo] = useState('todos'); // O filtro atual
  // -----------------------------

  useEffect(() => {
    const buscarCatalogo = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await axios.get('/api/exercicios', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const catalogo = response.data;
        setCatalogoExercicios(catalogo); // Guarda a lista completa
        setExerciciosFiltrados(catalogo); // No início, mostra todos

        // --- Lógica para extrair os grupos musculares ---
        // Pega todos os grupos, ex: ["Peito", "Perna", "Costas", "Peito"]
        const grupos = catalogo.map(ex => ex.grupo_muscular).filter(Boolean); // .filter(Boolean) remove nulos
        // Cria uma lista única, ex: ["Peito", "Perna", "Costas"]
        const gruposUnicos = [...new Set(grupos)];
        setGruposMusculares(gruposUnicos.sort()); // Salva em ordem alfabética
        // ------------------------------------------------

      } catch (error) { console.error("Erro ao buscar catálogo", error); }
    };
    buscarCatalogo();
  }, []); // Roda só uma vez

  // --- ★★★ NOVO EFEITO PARA BUSCAR DADOS DO TREINO (EDIÇÃO) ★★★ ---
  useEffect(() => {
    if (!treinoId) return; // Only run if editing

    const buscarTreino = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`/api/treinos/${treinoId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const treino = response.data;
        setNomeTreino(treino.nome);
        setDiaTreino(treino.dia || '');
        // Ensure exercises have all fields
        const exerciciosFormatados = treino.exercicios.map(ex => ({
          exercicio_id: ex.exercicio_id || ex.id_exercicio, // Handle different API responses
          series: ex.series,
          repeticoes: ex.repeticoes,
          descanso_seg: ex.descanso_seg,
          peso: ex.peso
        }));
        setExercicios(exerciciosFormatados);
      } catch (error) {
        console.error("Erro ao buscar treino", error);
        alert("Erro ao carregar dados do treino.");
      }
    };
    buscarTreino();
  }, [treinoId]);
  // ----------------------------------------------------------------

  // --- ★★★ NOVO EFEITO PARA FILTRAR ★★★ ---
  // Roda toda vez que o usuário muda o filtro ou o catálogo é carregado
  useEffect(() => {
    if (filtroGrupo === 'todos') {
      setExerciciosFiltrados(catalogoExercicios); // Mostra todos
    } else {
      // Mostra apenas os exercícios que batem com o grupo selecionado
      const filtrados = catalogoExercicios.filter(ex => ex.grupo_muscular === filtroGrupo);
      setExerciciosFiltrados(filtrados);
    }
  }, [filtroGrupo, catalogoExercicios]); // Dependências
  // ------------------------------------

  const handleExercicioChange = (index, event) => {
    const { name, value } = event.target;
    const novosExercicios = [...exercicios];
    novosExercicios[index][name] = value;
    setExercicios(novosExercicios);
  };

  const adicionarExercicio = () => {
    setExercicios([...exercicios, { exercicio_id: '', series: '', repeticoes: '', descanso_seg: '', peso: '' }]);
  };

  const removerExercicio = (index) => {
    const novosExercicios = [...exercicios];
    novosExercicios.splice(index, 1);
    setExercicios(novosExercicios);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');

    // Check for alunoId in query params
    const searchParams = new URLSearchParams(window.location.search);
    const alunoId = searchParams.get('alunoId');

    const treinoDados = { nome: nomeTreino, dia: diaTreino, exercicios };
    if (alunoId) {
      treinoDados.user_id = alunoId;
    }

    try {
      if (treinoId) {
        // UPDATE (PUT)
        await axios.put(`/api/treinos/${treinoId}`, treinoDados, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        alert('Treino atualizado com sucesso!');
      } else {
        // CREATE (POST)
        await axios.post('/api/treinos', treinoDados, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        alert('Treino criado com sucesso!');
      }
      navigate('/treinos');
    } catch (error) {
      console.error("Erro ao salvar treino", error);
      alert('Erro ao salvar treino.');
    }
  };


  const gifStyle = {
    width: '150px',
    height: '150px',
    borderRadius: '8px',
    display: 'block',
    margin: '15px auto 5px auto',
    backgroundColor: '#f0f0f0'
  };

  return (
    <>
      <header className="page-header" style={{ borderRadius: '0.75rem 0.75rem 0 0' }}>
        <div className="header-title-wrapper">
          <Link to="/treinos" className="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          </Link>
          <h1>{treinoId ? 'Editar Treino' : 'Criar Novo Treino'}</h1>
        </div>
      </header>

      <form id="criar-treino-form" className="form-container" onSubmit={handleSubmit}>

        <section className="form-section" style={{ borderRadius: '0 0 0.75rem 0.75rem' }}>
          <label htmlFor="treino-nome" className="form-label">Nome do Treino</label>
          <input
            type="text"
            id="treino-nome"
            className="form-input"
            placeholder="Ex: Treino A - Foco em Peito"
            value={nomeTreino}
            onChange={(e) => setNomeTreino(e.target.value)}
            required
          />

          <label htmlFor="treino-dia" className="form-label">Dia da Semana</label>
          <select
            id="treino-dia"
            className="form-select" // Usamos a mesma classe de estilo dos outros selects
            value={diaTreino}
            onChange={(e) => setDiaTreino(e.target.value)}
            required // <--- Isso obriga o usuário a escolher uma opção
          >
            <option value="">Selecione o dia...</option>
            <option value="Segunda-feira">Segunda-feira</option>
            <option value="Terça-feira">Terça-feira</option>
            <option value="Quarta-feira">Quarta-feira</option>
            <option value="Quinta-feira">Quinta-feira</option>
            <option value="Sexta-feira">Sexta-feira</option>
            <option value="Sábado">Sábado</option>
            <option value="Domingo">Domingo</option>
          </select>
        </section>

        <h2 className="section-title">Exercícios</h2>

        {/* --- ★★★ NOVO FILTRO DROPDOWN ★★★ --- */}
        <div className="form-group" style={{ padding: '0 1rem' }}>
          <label htmlFor="filtro-grupo" className="form-label-sm">Filtrar por Grupo Muscular</label>
          <select
            id="filtro-grupo"
            className="form-select"
            value={filtroGrupo}
            onChange={(e) => setFiltroGrupo(e.target.value)}
          >
            <option value="todos">Todos os Grupos</option>
            {gruposMusculares.map(grupo => (
              <option key={grupo} value={grupo}>{grupo}</option>
            ))}
          </select>
        </div>
        {/* ------------------------------------- */}


        <div id="exercicio-lista">
          {exercicios.map((ex, index) => {
            // eslint-disable-next-line
            const exercicioSelecionado = catalogoExercicios.find(catEx => catEx.id == ex.exercicio_id); //NÂO MEXER NESSA LINHA
            return (
              <div className="exercicio-card" key={index}>
                <div className="form-group">
                  <label htmlFor={`exercicio-select-${index}`} className="form-label-sm">Exercício</label>
                  <select
                    id={`exercicio-select-${index}`}
                    name="exercicio_id"
                    className="form-select"
                    value={ex.exercicio_id}
                    onChange={(e) => handleExercicioChange(index, e)}
                    required
                  >
                    <option value="">Selecione um exercício...</option>

                    {/* --- ★★★ MUDANÇA AQUI ★★★ --- */}
                    {/* Mapeia a lista FILTRADA, não a completa */}
                    {exerciciosFiltrados.map(catEx => (
                      <option key={catEx.id} value={catEx.id}>{catEx.nome}</option>
                    ))}
                    {/* ----------------------------- */}

                  </select>
                </div>

                {exercicioSelecionado && exercicioSelecionado.gif_url && (
                  <img
                    src={exercicioSelecionado.gif_url}
                    alt={exercicioSelecionado.nome}
                    style={gifStyle}
                  />
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor={`series-${index}`} className="form-label-sm">Séries</label>
                    <input type="text" id={`series-${index}`}
                      name="series" className="form-input" placeholder="Ex: 3" value={ex.series} onChange={(e) =>
                        handleExercicioChange(index, e)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`repeticoes-${index}`}
                      className="form-label-sm">Repetições</label>
                    <input type="text" id={`repeticoes-${index}`} name="repeticoes" className="form-input" placeholder="Ex: 10-12" value={ex.repeticoes} onChange={(e) =>
                      handleExercicioChange(index, e)} /> </div> </div>
                <div className="form-group">
                  <label htmlFor={`descanso-${index}`} className="form-label-sm">Descanso (segundos)</label>
                  <input type="number" id={`descanso-${index}`} name="descanso_seg" className="form-input" placeholder="Ex: 60" value={ex.descanso_seg} onChange={(e) => handleExercicioChange(index, e)} />
                </div>
                <div className="form-group">
                  <label htmlFor={`peso-${index}`} className="form-label-sm">Peso (opcional)</label>
                  <input type="text" id={`peso-${index}`} name="peso" className="form-input" placeholder="Ex: 20kg" value={ex.peso} onChange={(e) => handleExercicioChange(index, e)} />
                </div>

                {index > 0 && (
                  <button
                    type="button"
                    className="btn-remover"
                    onClick={() => removerExercicio(index)}
                  >
                    Remover Exercício
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          id="add-exercicio-btn"
          className="btn-secondary-outline"
          onClick={adicionarExercicio}
        >
          + Adicionar Exercício
        </button>
        <button type="submit" className="btn btn-primary" style={{ marginBottom: '2rem' }}>
          {treinoId ? 'Salvar Alterações' : 'Salvar Treino'}
        </button>
      </form>
    </>
  );
}

export default FormularioTreino;