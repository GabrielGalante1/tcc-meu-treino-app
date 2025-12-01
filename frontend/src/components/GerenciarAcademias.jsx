import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Importa os estilos da página
import '../styles/index.css';
import '../styles/header.css';
import '../styles/base.css';

function GerenciarAcademias() {
    const [academias, setAcademias] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para gerenciamento
    const [selectedIds, setSelectedIds] = useState([]);
    const [modalOpen, setModalOpen] = useState(null); // 'create', 'edit'
    const [currentAcademia, setCurrentAcademia] = useState(null);
    const [formData, setFormData] = useState({});
    const [loadingAction, setLoadingAction] = useState(false);

    useEffect(() => {
        const fetchAcademias = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const headers = { 'Authorization': `Bearer ${token}` };
                const res = await axios.get('/api/academias', { headers });
                setAcademias(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao carregar academias", error);
                setLoading(false);
            }
        };

        fetchAcademias();
    }, []);

    const handleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedIds.length === academias.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(academias.map(a => a.id));
        }
    };

    const handleOpenModal = (type) => {
        setModalOpen(type);
        setFormData({});
        if (type === 'edit') {
            const academiaToEdit = academias.find(a => a.id === selectedIds[0]);
            setCurrentAcademia(academiaToEdit);
            setFormData({ nome: academiaToEdit.nome, endereco: academiaToEdit.endereco });
        }
    };

    const handleCloseModal = () => {
        setModalOpen(null);
        setCurrentAcademia(null);
        setFormData({});
    };

    const refreshAcademias = async () => {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        const res = await axios.get('/api/academias', { headers });
        setAcademias(res.data);
        setSelectedIds([]);
    };

    const handleSave = async () => {
        setLoadingAction(true);
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            if (modalOpen === 'create') {
                await axios.post('/api/academias', formData, { headers });
                alert('Academia criada com sucesso!');
            } else if (modalOpen === 'edit') {
                await axios.put(`/api/academias/${currentAcademia.id}`, formData, { headers });
                alert('Academia atualizada com sucesso!');
            }
            handleCloseModal();
            refreshAcademias();
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar: ' + (error.response?.data?.erro || error.message));
        } finally {
            setLoadingAction(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Tem certeza que deseja deletar ${selectedIds.length} academias?`)) return;

        setLoadingAction(true);
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            for (const id of selectedIds) {
                await axios.delete(`/api/academias/${id}`, { headers });
            }
            alert('Academias deletadas com sucesso!');
            setSelectedIds([]);
            refreshAcademias();
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
                        <h1>Gerenciar Academias</h1>
                        <p className="page-subtitle">Administração do sistema.</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button
                                className="btn btn-primary"
                                style={{ marginTop: 0, padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '0.25rem', width: 'auto' }}
                                onClick={() => handleOpenModal('create')}
                            >
                                + Nova
                            </button>
                            <button
                                className="btn btn-primary"
                                style={{ marginTop: 0, padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '0.25rem', width: 'auto', cursor: selectedIds.length !== 1 ? 'not-allowed' : 'pointer', opacity: selectedIds.length !== 1 ? 0.6 : 1 }}
                                disabled={selectedIds.length !== 1}
                                onClick={() => handleOpenModal('edit')}
                            >
                                Editar
                            </button>
                            <button
                                className="btn"
                                style={{ marginTop: 0, padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '0.25rem', width: 'auto', position: 'static', maxWidth: 'none', cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer', backgroundColor: '#EF4444', color: 'white', opacity: selectedIds.length === 0 ? 0.6 : 1 }}
                                disabled={selectedIds.length === 0}
                                onClick={handleDelete}
                            >
                                Deletar
                            </button>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: 0 }}>
                            {selectedIds.length === 0 ? 'Selecione uma academia na lista para habilitar as ações.' : `${selectedIds.length} academia(s) selecionada(s).`}
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
                            <strong>⚠️ Atenção:</strong> Modificações incorretas podem causar inconsistências no sistema. Verifique as informações antes de salvar.
                        </div>
                    </div>
                </div>
            </header>

            <main className="main-content" style={{ borderRadius: '0 0 0.75rem 0', padding: '1.5rem' }}>
                <div className="card">
                    <h2>Academias Cadastradas</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                                    <th style={{ padding: '0.5rem', width: '40px', textAlign: 'left' }}>
                                        <input type="checkbox" onChange={handleSelectAll} checked={academias.length > 0 && selectedIds.length === academias.length} />
                                    </th>
                                    <th style={{ padding: '0.5rem', width: '80px', textAlign: 'left' }}>ID</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Nome</th>
                                </tr>
                            </thead>
                            <tbody>
                                {academias.map(a => (
                                    <tr key={a.id} style={{ borderBottom: '1px solid #F3F4F6', backgroundColor: selectedIds.includes(a.id) ? '#F3F4F6' : 'transparent' }}>
                                        <td style={{ padding: '0.5rem', textAlign: 'left' }}>
                                            <input type="checkbox" checked={selectedIds.includes(a.id)} onChange={() => handleSelect(a.id)} />
                                        </td>
                                        <td style={{ padding: '0.5rem', color: '#6B7280', textAlign: 'left' }}>#{a.id}</td>
                                        <td style={{ padding: '0.5rem', fontWeight: '500', textAlign: 'left' }}>{a.nome}</td>
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
                        {/* Gray Header for Academies */}
                        <div style={{
                            backgroundColor: '#4B5563',
                            padding: '1.5rem',
                            textAlign: 'center',
                            color: 'white'
                        }}>
                            <h2 style={{ margin: 0, color: 'white', fontSize: '1.5rem' }}>
                                {modalOpen === 'create' ? 'Nova Academia' : 'Editar Academia'}
                            </h2>
                        </div>

                        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button className="btn btn-secondary" style={{ marginTop: 0, width: 'auto' }} onClick={handleCloseModal}>Cancelar</button>
                                <button className="btn btn-primary" style={{ marginTop: 0, width: 'auto' }} onClick={handleSave} disabled={loadingAction}>
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

export default GerenciarAcademias;
