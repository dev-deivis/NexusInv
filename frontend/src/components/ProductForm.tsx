import React, { useState, useEffect } from 'react';
import api from '../lib/api';

interface Category {
  id: number;
  name: string;
  subCategories: Category[];
}

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productToEdit?: any | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, onSuccess, productToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unitPrice: 0,
    minStock: 0,
    categoryId: ''
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (productToEdit) {
        setFormData({
          name: productToEdit.name,
          description: productToEdit.description || '',
          unitPrice: productToEdit.unitPrice,
          minStock: productToEdit.minStock,
          categoryId: productToEdit.categoryId?.toString() || ''
        });
      } else {
        setFormData({ name: '', description: '', unitPrice: 0, minStock: 0, categoryId: '' });
      }
    }
  }, [isOpen, productToEdit]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/supply-chain/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error al cargar categorías');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (productToEdit) {
        await api.put(`/api/products/${productToEdit.id}`, formData);
      } else {
        await api.post('/api/products', formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error al guardar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-lg bg-glass-gradient rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold text-white mb-6 uppercase italic tracking-tight">
          {productToEdit ? 'Actualizar Matriz de Activo' : 'Vincular Nuevo Activo'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Nombre del Activo</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Precio Unitario ($)</label>
              <input
                type="number"
                step="0.01"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-primary transition-all"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Umbral Mínimo</label>
              <input
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-primary transition-all"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Clasificación Taxonómica</label>
            <select
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-all cursor-pointer"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
            >
              <option value="">Seleccionar Categoría...</option>
              {categories.map(cat => (
                <optgroup key={cat.id} label={cat.name}>
                  {cat.subCategories.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Especificaciones Técnicas</label>
            <textarea
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-all resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-4 rounded-xl border border-white/10 text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] py-4 px-4 bg-primary-gradient rounded-xl text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Sincronizando...' : 'Confirmar Protocolo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
