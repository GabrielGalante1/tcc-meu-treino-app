import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import './App.css';

// Importe todos os seus componentes de página
import FormularioCadastro from './components/FormularioCadastro';
import FormularioLogin from './components/FormularioLogin';
import Perfil from './components/Perfil';
import ListaTreinos from './components/ListaTreinos';
import FormularioTreino from './components/FormularioTreino';
// O FormularioEdicaoTreino será chamado de dentro do ListaTreinos por enquanto
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav'; // <--- Importado

import HomePage from './components/HomePage';
import GerenciarUsuarios from './components/GerenciarUsuarios';
import GerenciarAcademias from './components/GerenciarAcademias';
import GerenciarAlunos from './components/GerenciarAlunos';
import ListaTreinosAluno from './components/ListaTreinosAluno';

import ExecucaoTreino from './components/ExecucaoTreino';
import MuralNoticias from './components/MuralNoticias';
import FormularioNoticia from './components/FormularioNoticia';
import VisualizarNoticia from './components/VisualizarNoticia';
function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem('token');
  const cargo = localStorage.getItem('cargo');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se houver restrição de roles e o cargo do usuário não estiver na lista
  if (allowedRoles && !allowedRoles.includes(cargo)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

// Layout Principal (com Sidebar e BottomNav)
function MainLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content-wrapper">
        <Outlet /> {/* Renderiza a página atual (Início, Treinos ou Perfil) */}
      </div>
      <BottomNav /> {/* <--- Adicionado */}
    </div>
  );
}

function App() {
  const location = useLocation();

  // Efeito para aplicar o tema baseado no cargo
  React.useEffect(() => {
    const cargo = localStorage.getItem('cargo');

    // Remove todos os temas primeiro
    document.body.classList.remove('admin-theme', 'instrutor-theme');

    if (cargo === 'adm') {
      document.body.classList.add('admin-theme');
    } else if (cargo === 'instrutor') {
      document.body.classList.add('instrutor-theme');
    }
  }, [location]); // Executa ao montar e a cada mudança de rota

  return (
    <div className="App">
      <main>
        <Routes>
          {/* --- ROTAS PÚBLICAS --- */}
          <Route path="/login" element={<FormularioLogin />} />
          <Route path="/cadastro" element={<FormularioCadastro />} />

          {/* --- ROTAS PROTEGIDAS (Todos os logados) --- */}
          <Route element={<ProtectedRoute />}>

            {/* Rotas COM o layout principal */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/noticias" element={<MuralNoticias />} />

              {/* Rotas específicas de Aluno */}
              <Route element={<ProtectedRoute allowedRoles={['aluno']} />}>
                <Route path="/meus-treinos" element={<ListaTreinos />} />
                {/* Mantendo /treinos como alias para compatibilidade ou redirecionando */}
                <Route path="/treinos" element={<ListaTreinos />} />
              </Route>

              {/* Rotas específicas de Instrutor */}
              <Route element={<ProtectedRoute allowedRoles={['instrutor', 'adm']} />}>
                <Route path="/meus-alunos" element={<GerenciarAlunos />} />
                <Route path="/alunos/:alunoId/treinos" element={<ListaTreinosAluno />} />
                <Route path="/painel-instrutor" element={<div style={{ padding: '2rem' }}><h2>Painel do Instrutor</h2><p>Funcionalidade em desenvolvimento.</p></div>} />
              </Route>

              {/* Rotas específicas de Admin */}
              <Route element={<ProtectedRoute allowedRoles={['adm']} />}>
                <Route path="/usuarios" element={<GerenciarUsuarios />} />
                <Route path="/academias" element={<GerenciarAcademias />} />
              </Route>
            </Route>

            {/* Rotas SEM o layout principal (Telas Cheias) */}
            <Route path="/criar-treino" element={<FormularioTreino />} />
            <Route path="/treinos/:treinoId/editar" element={<FormularioTreino />} />
            <Route path="/treinos/:treinoId/executar" element={<ExecucaoTreino />} />

            {/* Rota de Visualização de Notícia (Isolada) */}
            <Route path="/noticias/:id" element={<VisualizarNoticia />} />

            {/* Rotas de Notícias (Criação e Edição) */}
            <Route element={<ProtectedRoute allowedRoles={['adm']} />}>
              <Route path="/noticias/criar" element={<FormularioNoticia />} />
              <Route path="/noticias/:id/editar" element={<FormularioNoticia />} />
            </Route>

          </Route>

          {/* Rota Padrão */}
          <Route path="*" element={<Navigate to={localStorage.getItem('token') ? "/" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;