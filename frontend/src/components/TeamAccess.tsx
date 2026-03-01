import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import UserForm from './UserForm';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  active: boolean;
  canEditProducts: boolean;
  canDeleteProducts: boolean;
}

const TeamAccess: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserToEdit(null);
  };

  const handleToggleStatus = async (user: User) => {
    if (user.email === currentUser.email) {
      alert('Protocolo de Autopreservación: No puede desactivar su propia cuenta administrativa.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await api.patch(`/api/users/${user.id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      alert('Error al cambiar el estado del usuario');
    }
  };

  const filteredUsers = users.filter(u => {
    if (filter === 'ALL') return true;
    return u.role === filter;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)] uppercase">Admin</span>;
      case 'MANAGER':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-blue-300 border border-primary/30 shadow-[0_0_10px_rgba(46,117,182,0.2)] uppercase">Gerente</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-500/10 text-gray-300 border border-gray-500/30 uppercase">Staff</span>;
    }
  };

  if (isLoading) return <div className="text-center p-10 text-slate-500 font-mono text-xs tracking-widest uppercase animate-pulse">Sincronizando Protocolos de Equipo...</div>;

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase italic text-glow">Acceso de Equipo</h2>
          <p className="text-sm text-slate-400 mt-1 font-light uppercase tracking-tighter">Gestión de roles y permisos del sistema</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all shadow-lg shadow-primary/20 border border-white/10 active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Invitar Miembro
        </button>
      </header>

      <div className="glass-panel w-full rounded-2xl flex flex-col overflow-hidden min-h-[500px] border border-white/5 bg-white/[0.01]">
        {/* Tabs */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setFilter('ALL')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${filter === 'ALL' ? 'bg-white/10 text-white shadow-sm border border-white/5' : 'text-slate-500 hover:text-white'}`}
            >
              Todos <span className="ml-1 opacity-50">{users.length}</span>
            </button>
            <button 
              onClick={() => setFilter('ADMIN')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${filter === 'ADMIN' ? 'bg-white/10 text-white shadow-sm border border-white/5' : 'text-slate-500 hover:text-white'}`}
            >
              Admins
            </button>
            <button 
              onClick={() => setFilter('MANAGER')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${filter === 'MANAGER' ? 'bg-white/10 text-white shadow-sm border border-white/5' : 'text-slate-500 hover:text-white'}`}
            >
              Gerentes
            </button>
            <button 
              onClick={() => setFilter('EMPLOYEE')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${filter === 'EMPLOYEE' ? 'bg-white/10 text-white shadow-sm border border-white/5' : 'text-slate-500 hover:text-white'}`}
            >
              Staff
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-white/5 border-b border-white/10 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <div className="col-span-4 pl-2">Perfil de Usuario</div>
          <div className="col-span-2">Rol</div>
          <div className="col-span-2">Permisos</div>
          <div className="col-span-2 text-center">Estado</div>
          <div className="col-span-2 text-right">Acciones</div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col divide-y divide-white/5 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div key={user.id} className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors group ${!user.active ? 'opacity-50' : ''}`}>
              <div className="col-span-4 flex items-center gap-4 pl-2">
                <div className={`size-10 rounded-full border border-white/10 p-[1px] ${user.email === currentUser.email ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'bg-gradient-to-br from-primary to-purple-500/50'} flex items-center justify-center relative`}>
                  <span className="text-white font-bold text-xs">{user.name.substring(0, 2).toUpperCase()}</span>
                  {user.email === currentUser.email && (
                    <div className="absolute -top-1 -right-1 size-3 bg-amber-500 rounded-full border-2 border-background-dark animate-pulse" title="Tú (Control Maestro)" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white flex items-center gap-2">
                    {user.name}
                    {user.email === currentUser.email && <span className="text-[8px] bg-amber-500/20 text-amber-500 px-1 rounded border border-amber-500/30 tracking-tighter">YO</span>}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono lowercase">{user.email}</span>
                </div>
              </div>
              <div className="col-span-2">
                {getRoleBadge(user.role)}
              </div>
              <div className="col-span-2">
                <div className="flex gap-2">
                  <span className={`material-symbols-outlined text-lg ${user.canEditProducts ? 'text-primary shadow-[0_0_8px_rgba(46,117,182,0.4)]' : 'text-slate-700'}`} title="Edición">edit</span>
                  <span className={`material-symbols-outlined text-lg ${user.canDeleteProducts ? 'text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'text-slate-700'}`} title="Eliminación">delete</span>
                </div>
              </div>
              <div className="col-span-2 flex justify-center">
                <button 
                  onClick={() => handleToggleStatus(user)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none ${
                    user.email === currentUser.email ? 'opacity-20 cursor-not-allowed grayscale' : 'cursor-pointer'
                  } ${
                    user.active 
                      ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)] border border-emerald-400/50' 
                      : 'bg-slate-800 border border-white/5'
                  }`}
                  disabled={user.email === currentUser.email}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all shadow-md ${
                    user.active ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="col-span-2 text-right">
                <button 
                  onClick={() => handleEditUser(user)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100"
                  title="Configurar Protocolos"
                >
                  <span className="material-symbols-outlined text-[20px]">settings_accessibility</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <UserForm 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSuccess={fetchUsers} 
        userToEdit={userToEdit}
      />
    </div>
  );
};

export default TeamAccess;
