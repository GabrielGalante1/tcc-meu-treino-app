import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaDumbbell, FaUser, FaUsers, FaBuilding, FaBell } from 'react-icons/fa'; // Importa os ícones do Font Awesome
import './BottomNav.css'; // Criaremos este arquivo para estilizar a barra

function BottomNav() {
  const cargo = localStorage.getItem('cargo');

  if (cargo === 'adm') {
    return (
      <nav className="bottom-nav">
        <NavLink
          to="/"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <FaHome size={24} />
          <span>Início</span>
        </NavLink>

        <NavLink
          to="/usuarios"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <FaUsers size={24} />
          <span>Usuários</span>
        </NavLink>

        <NavLink
          to="/academias"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <FaBuilding size={24} />
          <span>Academias</span>
        </NavLink>

        <NavLink
          to="/noticias"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <FaBell size={24} />
          <span>Notícias</span>
        </NavLink>

        <NavLink
          to="/perfil"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <FaUser size={24} />
          <span>Perfil</span>
        </NavLink>
      </nav>
    );
  }

  return (
    <nav className="bottom-nav">
      <NavLink
        to="/"
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        <FaHome size={24} /> {/* Ícone de Casa */}
        <span>Início</span>
      </NavLink>

      {/* ATENÇÃO: A rota para treinos precisa ser definida no App.js. 
          Usarei "/treinos" como exemplo, mas ajuste se necessário. */}
      {cargo !== 'instrutor' && (
        <NavLink
          to="/treinos"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <FaDumbbell size={24} /> {/* Ícone de Halter */}
          <span>Treinos</span>
        </NavLink>
      )}

      {cargo === 'instrutor' && (
        <NavLink
          to="/meus-alunos"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <FaUsers size={24} /> {/* Ícone de Usuários */}
          <span>Alunos</span>
        </NavLink>
      )}

      <NavLink
        to="/noticias"
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        <FaBell size={24} />
        <span>Notícias</span>
      </NavLink>

      {/* ATENÇÃO: A rota para perfil precisa ser definida no App.js. 
          Usarei "/perfil" como exemplo. */}
      <NavLink
        to="/perfil"
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        <FaUser size={24} /> {/* Ícone de Perfil */}
        <span>Perfil</span>
      </NavLink>
    </nav>
  );
}

export default BottomNav;