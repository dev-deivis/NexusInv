import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  department: string;
  canEditProducts: boolean;
  canDeleteProducts: boolean;
}

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userToEdit?: User | null;
}

const UserForm: React.FC<UserFormProps> = ({ isOpen, onClose, onSuccess, userToEdit }) => {
  const [formData, setFormData] = useState<User>({
    name: '',
    email: '',
    password: '',
    role: 'EMPLOYEE',
    department: '',
    canEditProducts: false,
    canDeleteProducts: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        setFormData({ ...userToEdit, password: '' });
      } else {
        setFormData({ 
          name: '', 
          email: '', 
          password: '', 
          role: 'EMPLOYEE', 
          department: '', 
          canEditProducts: false, 
          canDeleteProducts: false 
        });
      }
    }
  }, [isOpen, userToEdit]);

  // Manejar cambio de rol
  const handleRoleChange = (newRole: string) => {
    setFormData(prev => ({
      ...prev,
      role: newRole,
      // Si cambia a ADMIN, forzamos true (aunque se oculte)
      // Si cambia a otro, reseteamos a false para asignar de nuevo
      canEditProducts: newRole === 'ADMIN',
      canDeleteProducts: newRole === 'ADMIN'
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (userToEdit?.id) {
        await axios.put(`http://localhost:8080/api/users/${userToEdit.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:8080/api/users', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error en la operación de red.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md bg-glass-gradient rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight uppercase italic">
            {userToEdit ? 'Modificar Protocolos' : 'Vincular Miembro'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Nombre Completo</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Email de Red</label>
            <input
              type="email"
              className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-all font-mono ${userToEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              readOnly={!!userToEdit}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              {userToEdit ? 'Nueva Clave (Opcional)' : 'Clave de Acceso'}
            </label>
            <input
              type="password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-all font-mono"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!userToEdit}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Nivel de Acceso</label>
              <select
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-all cursor-pointer"
                value={formData.role}
                onChange={(e) => handleRoleChange(e.target.value)}
              >
                <option value="ADMIN">ADMINISTRADOR</option>
                <option value="MANAGER">GERENTE</option>
                <option value="EMPLOYEE">STAFF OPERATIVO</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Departamento</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-all"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
          </div>

          {/* Solo mostrar si NO es ADMIN */}
          {formData.role !== 'ADMIN' && (
            <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-white/5 animate-in slide-in-from-top-2 duration-300">
              <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-2 text-glow">Configuración de Privilegios</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Permitir Edición de Productos</span>
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, canEditProducts: !formData.canEditProducts })}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all focus:outline-none cursor-pointer ${
                    formData.canEditProducts 
                      ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]' 
                      : 'bg-slate-700'
                  }`}
                >
                  <span className={`inline-block h-3 h-3 transform rounded-full bg-white transition-all shadow-md ${
                    formData.canEditProducts ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Permitir Eliminación de Productos</span>
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, canDeleteProducts: !formData.canDeleteProducts })}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all focus:outline-none cursor-pointer ${
                    formData.canDeleteProducts 
                      ? 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)]' 
                      : 'bg-slate-700'
                  }`}
                >
                  <span className={`inline-block h-3 h-3 transform rounded-full bg-white transition-all shadow-md ${
                    formData.canDeleteProducts ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          )}

          {error && <p className="text-red-400 text-[10px] italic font-mono uppercase tracking-tight">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-primary-gradient rounded-xl text-white font-bold text-xs tracking-widest uppercase shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isLoading ? 'Actualizando Red...' : userToEdit ? 'Confirmar Cambios' : 'Confirmar Autorización'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
