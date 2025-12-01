import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaDumbbell, FaUser, FaUsers, FaBell } from 'react-icons/fa'; // Ícones que já usamos

// Importa os estilos que definem a sidebar.
// Pelo que vi nos seus arquivos, os estilos da sidebar
// estão principalmente em 'base.css' e 'header.css'.
import '../styles/base.css';
import '../styles/header.css';

function Sidebar() {
  return (
    // Esta estrutura foi copiada do seu 'meus-treinos.html'
    <nav className="sidebar-nav">
      <div className="logo">Meu App</div>
      <div style={{ textAlign: 'center', marginBottom: '1rem', color: '#aaa', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        {localStorage.getItem('cargo') || 'Visitante'}
      </div>
      <ul className="sidebar-nav-list">
        <li>
          {/* O NavLink é a versão do React Router para o <a>.
              Ele adiciona a classe 'active' automaticamente. */}
          <NavLink to="/">
            <FaHome /> {/* Ícone */}
            <span>Início</span>
          </NavLink>
        </li>
        {localStorage.getItem('cargo') === 'adm' ? (
          <>
            <li>
              <NavLink to="/usuarios">
                <FaUser /> {/* Ícone de usuário para gestão */}
                <span>Usuários</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/academias">
                <FaDumbbell /> {/* Reusing dumbbell icon or maybe a building icon if available */}
                <span>Academias</span>
              </NavLink>
            </li>
          </>
        ) : (
          <>
            {localStorage.getItem('cargo') !== 'instrutor' && (
              <li>
                <NavLink to="/treinos">
                  <FaDumbbell /> {/* Ícone */}
                  <span>Meus Treinos</span>
                </NavLink>
              </li>
            )}
            {localStorage.getItem('cargo') === 'instrutor' && (
              <li>
                <NavLink to="/meus-alunos">
                  <FaUsers /> {/* Ícone */}
                  <span>Meus Alunos</span>
                </NavLink>
              </li>
            )}
          </>
        )}
        <li>
          <NavLink to="/noticias">
            <FaBell />
            <span>Notícias</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/perfil">
            <FaUser /> {/* Ícone */}
            <span>Minha Conta</span>
          </NavLink>
        </li>
        {/* Adicione outros links aqui se precisar */}
      </ul>
    </nav>
  );
}

export default Sidebar;