import React, { useState } from 'react';
import api from '../lib/api';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  parentId?: number | null;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ isOpen, onClose, onSuccess, parentId }) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/api/supply-chain/categories', {
        name,
        parentId: parentId || null
      });
      setName('');
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error al crear categoría');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-sm bg-glass-gradient rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold text-white mb-6 uppercase italic tracking-tight">
          {parentId ? 'Vincular Sub-Nodo' : 'Nueva Categoría Raíz'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Identificador Taxonómico</label>
            <input
              autoFocus
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
              placeholder="Ej: Electrónica, Consumibles..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Abortar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] py-3 px-4 bg-primary-gradient rounded-xl text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Transmitiendo...' : 'Confirmar Nodo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
