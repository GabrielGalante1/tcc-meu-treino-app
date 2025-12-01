import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Importa os estilos da página
import '../styles/index.css';
import '../styles/header.css';
import '../styles/base.css';

function GerenciarUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para gerenciamento de usuários
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [modalOpen, setModalOpen] = useState(null); // 'create', 'edit', 'delete', 'password'
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({});
    const [loadingAction, setLoadingAction] = useState(false);

    useEffect(() => {
        const fetchUsuarios = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const headers = { 'Authorization': `Bearer ${token}` };
                const res = await axios.get('/api/usuarios', { headers });
                setUsuarios(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao carregar usuários", error);
                setLoading(false);
            }
        };

        fetchUsuarios();
    }, []);

    const handleSelectUser = (id) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(userId => userId !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === usuarios.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(usuarios.map(u => u.id));
        }
    };

    const handleOpenModal = (type) => {
        setModalOpen(type);
        setFormData({});
        if (type === 'edit' || type === 'password') {
            const userToEdit = usuarios.find(u => u.id === selectedUsers[0]);
            setCurrentUser(userToEdit);
            if (type === 'edit') {
                setFormData({ nome: userToEdit.nome, email: userToEdit.email, cargo: userToEdit.cargo });
            }
        } else if (type === 'create') {
            setFormData({ cargo: 'aluno' }); // Default
        }
    };

    const handleCloseModal = () => {
        setModalOpen(null);
        setCurrentUser(null);
        setFormData({});
    };

    const refreshUsers = async () => {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await axios.get('/api/usuarios', { headers });
        setUsuarios(res.data);
        setSelectedUsers([]);
    };

    const handleSaveUser = async () => {
        setLoadingAction(true);
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            if (modalOpen === 'create') {
                if (formData.senha && formData.senha !== formData.confirmarSenha) {
                    alert('As senhas não coincidem.');
                    setLoadingAction(false);
                    return;
                }
                const senhaFinal = formData.senha || '123';
                await axios.post('/api/usuarios', { ...formData, senha: senhaFinal });
                alert(`Usuário criado com sucesso! ${!formData.senha ? 'Senha padrão: 123' : ''}`);
            } else if (modalOpen === 'edit') {
                await axios.put(`/api/usuarios/${currentUser.id}`, formData, { headers });
                alert('Usuário atualizado com sucesso!');
            } else if (modalOpen === 'password') {
                await axios.put(`/api/usuarios/${currentUser.id}/senha`, { nova_senha: formData.nova_senha }, { headers });
                alert('Senha alterada com sucesso!');
            }
            handleCloseModal();
            refreshUsers();
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar: ' + (error.response?.data?.erro || error.message));
        } finally {
            setLoadingAction(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!window.confirm(`Tem certeza que deseja deletar ${selectedUsers.length} usuários?`)) return;

        setLoadingAction(true);
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            for (const id of selectedUsers) {
                await axios.delete(`/api/usuarios/${id}`, { headers });
            }
            alert('Usuários deletados com sucesso!');
            setSelectedUsers([]);
            refreshUsers();
        } catch (error) {
            console.error(error);
            alert('Erro ao deletar: ' + (error.response?.data?.erro || error.message));
        } finally {
            setLoadingAction(false);
        }
    };

    if (loading) return <div className="loading-container">Carregando...</div>;

    return (
        <>
            <header className="page-header">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center' }}>
                    <div>
                        <h1>Gerenciar Usuários</h1>
                        <p className="page-subtitle">Administração do sistema.</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button
                                className="btn btn-primary"
                                style={{ marginTop: 0, padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '0.25rem', width: 'auto' }}
                                onClick={() => handleOpenModal('create')}
                            >
                                + Novo
                            </button>
                            <button
                                className="btn btn-primary"
                                style={{ marginTop: 0, padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '0.25rem', width: 'auto', cursor: selectedUsers.length !== 1 ? 'not-allowed' : 'pointer', opacity: selectedUsers.length !== 1 ? 0.6 : 1 }}
                                disabled={selectedUsers.length !== 1}
                                onClick={() => handleOpenModal('edit')}
                            >
                                Editar
                            </button>
                            <button
                                className="btn btn-primary"
                                style={{ marginTop: 0, padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '0.25rem', width: 'auto', cursor: selectedUsers.length !== 1 ? 'not-allowed' : 'pointer', opacity: selectedUsers.length !== 1 ? 0.6 : 1 }}
                                disabled={selectedUsers.length !== 1}
                                onClick={() => handleOpenModal('password')}
                            >
                                Senha
                            </button>
                            <button
                                className="btn"
                                style={{ marginTop: 0, padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '0.25rem', width: 'auto', position: 'static', maxWidth: 'none', cursor: selectedUsers.length === 0 ? 'not-allowed' : 'pointer', backgroundColor: '#EF4444', color: 'white', opacity: selectedUsers.length === 0 ? 0.6 : 1 }}
                                disabled={selectedUsers.length === 0}
                                onClick={handleDeleteUser}
                            >
                                Deletar
                            </button>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: 0 }}>
                            {selectedUsers.length === 0 ? 'Selecione um usuário na lista para habilitar as ações.' : `${selectedUsers.length} usuário(s) selecionado(s).`}
                        </p>
                        <div style={{
                            backgroundColor: '#FEF3C7',
                            border: '1px solid #FCD34D',
                            color: '#92400E',
                            padding: '0.75rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.85rem',
                            marginTop: '0.5rem',
                            maxWidth: '600px'
                        }}>
                            <strong>⚠️ Atenção:</strong> Modificações incorretas nos dados dos usuários podem causar inconsistências no sistema ou perda de acesso. Verifique as informações antes de salvar.
                        </div>
                    </div>
                </div>
            </header>

            <main className="main-content" style={{ borderRadius: '0 0 0.75rem 0', padding: '1.5rem' }}>
                <div className="card">
                    <h2>Usuários Cadastrados</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                                    <th style={{ padding: '0.5rem', width: '40px', textAlign: 'left' }}>
                                        <input type="checkbox" onChange={handleSelectAll} checked={usuarios.length > 0 && selectedUsers.length === usuarios.length} />
                                    </th>
                                    <th style={{ padding: '0.5rem', width: '80px', textAlign: 'left' }}>ID</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Nome</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Email</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Cargo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(u => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid #F3F4F6', backgroundColor: selectedUsers.includes(u.id) ? '#F3F4F6' : 'transparent' }}>
                                        <td style={{ padding: '0.5rem', textAlign: 'left' }}>
                                            <input type="checkbox" checked={selectedUsers.includes(u.id)} onChange={() => handleSelectUser(u.id)} />
                                        </td>
                                        <td style={{ padding: '0.5rem', color: '#6B7280', textAlign: 'left' }}>#{u.id}</td>
                                        <td style={{ padding: '0.5rem', fontWeight: '500', textAlign: 'left' }}>{u.nome}</td>
                                        <td style={{ padding: '0.5rem', color: '#6B7280', textAlign: 'left' }}>{u.email}</td>
                                        <td style={{ padding: '0.5rem', textAlign: 'left' }}>
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                backgroundColor: u.cargo === 'adm' ? '#E5E7EB' : (u.cargo === 'instrutor' ? '#DBEAFE' : '#D1FAE5'),
                                                color: u.cargo === 'adm' ? '#374151' : (u.cargo === 'instrutor' ? '#1E40AF' : '#065F46')
                                            }}>
                                                {u.cargo.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* MODAL */}
            {modalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
                }}>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '0.75rem', width: '90%', maxWidth: '500px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', overflow: 'hidden', padding: 0
                    }}>
                        {/* Dynamic Header Color */}
                        <div style={{
                            backgroundColor: (formData.cargo === 'instrutor' || (currentUser && currentUser.cargo === 'instrutor')) ? '#1E40AF' :
                                (formData.cargo === 'adm' || (currentUser && currentUser.cargo === 'adm')) ? '#4B5563' : '#F97316',
                            padding: '1.5rem',
                            textAlign: 'center',
                            color: 'white'
                        }}>
                            <h2 style={{ margin: 0, color: 'white', fontSize: '1.5rem' }}>
                                {modalOpen === 'create' ? 'Novo Usuário' : (modalOpen === 'edit' ? 'Editar Usuário' : 'Alterar Senha')}
                            </h2>
                        </div>

                        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {modalOpen !== 'password' && (
                                <>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nome</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #D1D5DB' }}
                                            value={formData.nome || ''}
                                            onChange={e => setFormData({ ...formData, nome: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #D1D5DB' }}
                                            value={formData.email || ''}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Cargo</label>
                                        <select
                                            className="form-input"
                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #D1D5DB' }}
                                            value={formData.cargo || 'aluno'}
                                            onChange={e => setFormData({ ...formData, cargo: e.target.value })}
                                        >
                                            <option value="aluno">Aluno</option>
                                            <option value="instrutor">Instrutor</option>
                                            <option value="adm">Admin</option>
                                        </select>
                                    </div>
                                    {modalOpen === 'create' && (
                                        <>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <div style={{ flex: 1 }}>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Telefone</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #D1D5DB' }}
                                                        value={formData.tel || ''}
                                                        onChange={e => setFormData({ ...formData, tel: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <div style={{ flex: 1 }}>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Senha</label>
                                                    <input
                                                        type="password"
                                                        className="form-input"
                                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #D1D5DB' }}
                                                        value={formData.senha || ''}
                                                        onChange={e => setFormData({ ...formData, senha: e.target.value })}
                                                    />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Confirmar Senha</label>
                                                    <input
                                                        type="password"
                                                        className="form-input"
                                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #D1D5DB' }}
                                                        value={formData.confirmarSenha || ''}
                                                        onChange={e => setFormData({ ...formData, confirmarSenha: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Lista de Alunos Vinculados (Apenas para Instrutores na Edição) */}
                                    {modalOpen === 'edit' && currentUser && currentUser.cargo === 'instrutor' && (
                                        <div style={{ marginTop: '1rem', borderTop: '1px solid #E5E7EB', paddingTop: '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#374151' }}>Alunos Vinculados</h4>
                                            </div>

                                            {/* Área para vincular novo aluno */}
                                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                                <select
                                                    className="form-input"
                                                    style={{ flex: 1, padding: '0.4rem', fontSize: '0.85rem' }}
                                                    id="student-select"
                                                >
                                                    <option value="">Selecione um aluno para vincular...</option>
                                                    {usuarios
                                                        .filter(u => u.cargo === 'aluno' && u.id_instrutor !== currentUser.id)
                                                        .map(u => (
                                                            <option key={u.id} value={u.id}>
                                                                {u.nome} {u.id_instrutor ? '(Já possui instrutor)' : ''}
                                                            </option>
                                                        ))
                                                    }
                                                </select>
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ marginTop: 0, width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                                    onClick={async () => {
                                                        const select = document.getElementById('student-select');
                                                        const studentId = select.value;
                                                        if (!studentId) return;

                                                        try {
                                                            const token = localStorage.getItem('token');
                                                            await axios.put(`/api/usuarios/${studentId}`,
                                                                { id_instrutor: currentUser.id },
                                                                { headers: { 'Authorization': `Bearer ${token}` } }
                                                            );
                                                            alert('Aluno vinculado com sucesso!');
                                                            refreshUsers(); // Recarrega a lista
                                                            select.value = ""; // Limpa seleção
                                                        } catch (error) {
                                                            console.error(error);
                                                            alert('Erro ao vincular aluno.');
                                                        }
                                                    }}
                                                >
                                                    Vincular
                                                </button>
                                            </div>

                                            <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #F3F4F6', borderRadius: '0.375rem' }}>
                                                {usuarios.filter(u => u.cargo === 'aluno' && u.id_instrutor === currentUser.id).length > 0 ? (
                                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                        {usuarios.filter(u => u.cargo === 'aluno' && u.id_instrutor === currentUser.id).map(aluno => (
                                                            <li key={aluno.id} style={{ padding: '0.5rem', borderBottom: '1px solid #F3F4F6', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <span>{aluno.nome}</span>
                                                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                                    <span style={{ color: '#6B7280' }}>#{aluno.id}</span>
                                                                    <button
                                                                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.8rem', padding: '0 0.25rem' }}
                                                                        title="Desvincular"
                                                                        onClick={async () => {
                                                                            if (!window.confirm(`Desvincular ${aluno.nome}?`)) return;
                                                                            try {
                                                                                const token = localStorage.getItem('token');
                                                                                await axios.put(`/api/usuarios/${aluno.id}`,
                                                                                    { id_instrutor: null },
                                                                                    { headers: { 'Authorization': `Bearer ${token}` } }
                                                                                );
                                                                                refreshUsers();
                                                                            } catch (error) {
                                                                                console.error(error);
                                                                                alert('Erro ao desvincular.');
                                                                            }
                                                                        }}
                                                                    >
                                                                        ✕
                                                                    </button>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p style={{ padding: '0.5rem', color: '#9CA3AF', fontSize: '0.85rem', margin: 0 }}>Nenhum aluno vinculado.</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Exibir Instrutor Vinculado (Apenas para Alunos na Edição) */}
                                    {modalOpen === 'edit' && currentUser && currentUser.cargo === 'aluno' && (
                                        <div style={{ marginTop: '1rem', borderTop: '1px solid #E5E7EB', paddingTop: '1rem' }}>
                                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#374151' }}>Instrutor Vinculado</h4>
                                            {currentUser.id_instrutor ? (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F3F4F6', padding: '0.75rem', borderRadius: '0.375rem' }}>
                                                    <div>
                                                        <span style={{ fontWeight: 500, display: 'block', fontSize: '0.9rem' }}>
                                                            {usuarios.find(u => u.id === currentUser.id_instrutor)?.nome || 'Instrutor não encontrado'}
                                                        </span>
                                                        <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                                                            ID: #{currentUser.id_instrutor}
                                                        </span>
                                                    </div>
                                                    <button
                                                        className="btn"
                                                        style={{
                                                            backgroundColor: '#EF4444', color: 'white', padding: '0.25rem 0.75rem',
                                                            fontSize: '0.8rem', width: 'auto', marginTop: 0
                                                        }}
                                                        onClick={async () => {
                                                            if (!window.confirm(`Remover instrutor de ${currentUser.nome}?`)) return;
                                                            try {
                                                                const token = localStorage.getItem('token');
                                                                await axios.put(`/api/usuarios/${currentUser.id}`,
                                                                    { id_instrutor: null },
                                                                    { headers: { 'Authorization': `Bearer ${token}` } }
                                                                );
                                                                alert('Instrutor removido com sucesso!');
                                                                refreshUsers();
                                                                handleCloseModal(); // Fecha modal para atualizar estado do currentUser visualmente ou poderia atualizar localmente
                                                            } catch (error) {
                                                                console.error(error);
                                                                alert('Erro ao remover instrutor.');
                                                            }
                                                        }}
                                                    >
                                                        Remover
                                                    </button>
                                                </div>
                                            ) : (
                                                <p style={{ color: '#6B7280', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                                    Este aluno não possui instrutor vinculado.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}

                            {modalOpen === 'password' && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nova Senha</label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #D1D5DB' }}
                                        value={formData.nova_senha || ''}
                                        onChange={e => setFormData({ ...formData, nova_senha: e.target.value })}
                                    />
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button className="btn btn-secondary" style={{ marginTop: 0, width: 'auto' }} onClick={handleCloseModal}>Cancelar</button>
                                <button className="btn btn-primary" style={{ marginTop: 0, width: 'auto' }} onClick={handleSaveUser} disabled={loadingAction}>
                                    {loadingAction ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default GerenciarUsuarios;
