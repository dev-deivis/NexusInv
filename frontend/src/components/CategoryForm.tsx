import React, { useState } from 'react';
import axios from 'axios';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  parentId?: number | null;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ isOpen, onClose, onSuccess, parentId }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/supply-chain/categories', {
        name,
        description,
        parentId: parentId || null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess();
      onClose();
      setName('');
      setDescription('');
    } catch (err) {
      alert('Error al crear la categoría');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-sm bg-glass-gradient rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white tracking-tight uppercase italic">
            {parentId ? 'Nueva Subcategoría' : 'Nueva Categoría Raíz'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Nombre</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Descripción</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-xs h-20 focus:outline-none focus:border-primary transition-all resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary-gradient rounded-xl text-white font-bold text-xs tracking-widest uppercase shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Registrando...' : 'Confirmar Nodo'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
