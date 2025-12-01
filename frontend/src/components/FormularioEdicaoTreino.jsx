import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';
import '../styles/criarTreino.css'; // 1. Reutiliza o CSS da página de criação

// Recebe o ID do treino a ser editado e a função para fechar (onEdicaoConcluida)
function FormularioEdicaoTreino({ }) {
  const navigate = useNavigate();

  // Estados para os campos do formulário
  const [nomeTreino, setNomeTreino] = useState('');
  const [diaTreino, setDiaTreino] = useState('');
  const [exercicios, setExercicios] = useState([]);
  const [catalogoExercicios, setCatalogoExercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const { treinoId } = useParams();
  const [exerciciosFiltrados, setExerciciosFiltrados] = useState([]); // O que aparece no dropdown
  const [gruposMusculares, setGruposMusculares] = useState([]);       // Lista de grupos (Peito, Costas...)
  const [filtroGrupo, setFiltroGrupo] = useState('todos');

  // 2. LÓGICA DE EDIÇÃO: Buscar os dados do treino para preencher o formulário
  useEffect(() => {
    const token = localStorage.getItem('token');

    // Função para buscar o catálogo (igual ao do CriarTreino)
    // Função para buscar o catálogo e configurar filtros
    const buscarCatalogo = async () => {
      try {
        const response = await axios.get('/api/exercicios', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const catalogo = response.data;
        setCatalogoExercicios(catalogo);

        // ★ Inicializa os filtrados com TUDO
        setExerciciosFiltrados(catalogo);

        // ★ Extrai os grupos musculares únicos
        const grupos = catalogo.map(ex => ex.grupo_muscular).filter(Boolean);
        const gruposUnicos = [...new Set(grupos)];
        setGruposMusculares(gruposUnicos.sort());

      } catch (error) { console.error("Erro ao buscar catálogo", error); }
    };


    // Função para buscar os dados DO TREINO específico
    const buscarTreinoParaEditar = async () => {
      try {
        const response = await axios.get(`/api/treinos/${treinoId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // Preenche os estados com os dados do treino
        const treinoData = response.data;
        setNomeTreino(treinoData.nome);
        setDiaTreino(treinoData.dia);
        setExercicios(treinoData.exercicios);
        setLoading(false); // Termina o carregamento
      } catch (error) {
        console.error("Erro ao buscar dados do treino", error);
        alert("Não foi possível carregar os dados do treino.");
        handleVoltar(); // Fecha o formulário se der erro
      }
    };

    buscarCatalogo();
    buscarTreinoParaEditar();
  }, [treinoId]); // Roda sempre que o ID do treino mudar

  useEffect(() => {
    if (filtroGrupo === 'todos') {
      setExerciciosFiltrados(catalogoExercicios);
    } else {
      const filtrados = catalogoExercicios.filter(ex => ex.grupo_muscular === filtroGrupo);
      setExerciciosFiltrados(filtrados);
    }
  }, [filtroGrupo, catalogoExercicios]);

  const handleVoltar = () => {
    navigate('/treinos');
  };

  // 3. Funções de manipulação do formulário (idênticas ao CriarTreino)
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

  // 4. LÓGICA DE ENVIO (PUT para ATUALIZAR)
  const handleSubmit = async (event) => {
    alert('Treino atualizado com sucesso!');
    navigate('/treinos');
    event.preventDefault();
    const token = localStorage.getItem('token');
    // Filtra os exercícios para enviar apenas o que a API precisa
    const exerciciosParaEnviar = exercicios.map(ex => ({
      exercicio_id: ex.exercicio_id,
      series: ex.series,
      repeticoes: ex.repeticoes,
      descanso_seg: ex.descanso_seg,
      peso: ex.peso
    }));

    const treinoAtualizado = { nome: nomeTreino, dia: diaTreino, exercicios: exerciciosParaEnviar };

    try {
      // A única diferença: axios.put e a URL com o ID
      await axios.put(`/api/treinos/${treinoId}`, treinoAtualizado, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      handleVoltar(); // Chama a função para fechar o formulário
    } catch (error) {
      console.error("Erro ao atualizar treino", error);
      alert('Erro ao atualizar treino.');
    }
  };

  // Estilo inline para o GIF (idêntico ao CriarTreino)
  const gifStyle = {
    width: '150px',
    height: '150px',
    borderRadius: '8px',
    display: 'block',
    margin: '15px auto 5px auto',
    backgroundColor: '#f0f0f0'
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Carregando dados para edição...</p>
      </div>
    );
  }

  // 5. O JSX é uma "tradução" do CriarTreino.html, mas com os valores pré-preenchidos
  return (
    <>
      <header className="page-header" style={{ borderRadius: '0.75rem 0.75rem 0 0' }}>
        {/* Usamos um <button> para chamar a função de fechar, em vez de <Link> */}
        <button onClick={handleVoltar} className="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <h1>Editar Treino</h1> {/* Título Modificado */}
      </header>

      <form id="editar-treino-form" className="form-container" onSubmit={handleSubmit}>

        <section className="form-section" style={{ borderRadius: '0 0 0.75rem 0.75rem' }}>
          <label htmlFor="treino-nome" className="form-label">Nome do Treino</label>
          <input
            type="text"
            id="treino-nome"
            className="form-input"
            value={nomeTreino} // <-- Valor pré-preenchido
            onChange={(e) => setNomeTreino(e.target.value)}
            required
          />

          <label htmlFor="treino-dia" className="form-label">Dia/Grupo</label>
          <input
            type="text"
            id="treino-dia"
            className="form-input"
            value={diaTreino} // <-- Valor pré-preenchido
            onChange={(e) => setDiaTreino(e.target.value)}
          />
        </section>

        <h2 className="section-title">Exercícios</h2>
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
        <div id="exercicio-lista">

          {exercicios.map((ex, index) => {
            const exercicioSelecionado = catalogoExercicios.find(catEx => catEx.id == ex.exercicio_id);
            return (
              <div className="exercicio-card" key={index}>
                <div className="form-group">
                  <label htmlFor={`exercicio-select-${index}`} className="form-label-sm">Exercício</label>
                  <select
                    id={`exercicio-select-${index}`}
                    name="exercicio_id"
                    className="form-select"
                    value={ex.exercicio_id} // <-- Valor pré-preenchido
                    onChange={(e) => handleExercicioChange(index, e)}
                    required
                  >
                    <option value="">Selecione um exercício...</option>
                    {exerciciosFiltrados.map(catEx => (
                      <option key={catEx.id} value={catEx.id}>{catEx.nome}</option>
                    ))}
                  </select>
                </div>

                {exercicioSelecionado && exercicioSelecionado.gif_url && (
                  <img src={exercicioSelecionado.gif_url} alt={exercicioSelecionado.nome} style={gifStyle} />
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor={`series-${index}`} className="form-label-sm">Séries</label>
                    <input
                      type="text"
                      id={`series-${index}`}
                      name="series"
                      className="form-input"
                      value={ex.series} // <-- Valor pré-preenchido
                      onChange={(e) => handleExercicioChange(index, e)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`repeticoes-${index}`} className="form-label-sm">Repetições</label>
                    <input
                      type="text"
                      id={`repeticoes-${index}`}
                      name="repeticoes"
                      className="form-input"
                      value={ex.repeticoes} // <-- Valor pré-preenchido
                      onChange={(e) => handleExercicioChange(index, e)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor={`descanso-${index}`} className="form-label-sm">Descanso (segundos)</label>
                  <input
                    type="number"
                    id={`descanso-${index}`}
                    name="descanso_seg"
                    className="form-input"
                    value={ex.descanso_seg} // <-- Valor pré-preenchido
                    onChange={(e) => handleExercicioChange(index, e)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`peso-${index}`} className="form-label-sm">Peso (opcional)</label>
                  <input
                    type="text"
                    id={`peso-${index}`}
                    name="peso"
                    className="form-input"
                    value={ex.peso || ''} // <-- Valor pré-preenchido (|| '' para evitar erro de 'undefined')
                    onChange={(e) => handleExercicioChange(index, e)}
                  />
                </div>

                {index > 0 && (
                  <button type="button" className="btn-remove" onClick={() => removerExercicio(index)}>
                    Remover Exercício
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <button type="button" id="add-exercicio-btn" className="btn-secondary-outline" onClick={adicionarExercicio}>
          + Adicionar Exercício
        </button>
        <button type="submit" className="btn btn-primary">
          Salvar Alterações
        </button>
        <button type="button" className="btn-secondary" onClick={handleVoltar} style={{ marginTop: '10px' }}>
          Cancelar
        </button>
      </form>
    </>
  );
}

export default FormularioEdicaoTreino;