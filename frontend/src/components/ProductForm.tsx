import React, { useState, useEffect } from 'react';
import api from '../lib/api';

interface Product {
  id?: number;
  name: string;
  sku: string;
  description: string;
  unitPrice: number;
  currentStock: number;
  minStock: number;
}

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productToEdit?: Product | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, onSuccess, productToEdit }) => {
  const [formData, setFormData] = useState<Product>({
    name: '',
    sku: '',
    description: '',
    unitPrice: 0,
    currentStock: 0,
    minStock: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        setFormData(productToEdit);
      } else {
        setFormData({ name: '', sku: '', description: '', unitPrice: 0, currentStock: 0, minStock: 0 });
        fetchNextSku();
      }
    }
  }, [isOpen, productToEdit]);

  const fetchNextSku = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/products/next-sku', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData(prev => ({ ...prev, sku: response.data.sku }));
    } catch (err) {
      console.error('Error al obtener SKU');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (productToEdit?.id) {
        await api.put(`/api/products/${productToEdit.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.post('/api/products', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error en la transmisión de datos.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md bg-glass-gradient rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight uppercase">
            {productToEdit ? 'Actualizar Activo' : 'Registrar Nuevo Activo'}
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Nombre del Activo</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Código SKU</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-primary font-mono text-sm focus:outline-none cursor-not-allowed opacity-80"
                value={formData.sku}
                readOnly
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Valor Unitario</label>
              <input
                type="number"
                step="0.01"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-primary transition-colors"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Existencia Actual</label>
              <input
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-primary transition-colors"
                value={formData.currentStock}
                onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Umbral Mínimo</label>
              <input
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-primary transition-colors"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Especificaciones Técnicas</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-xs h-20 focus:outline-none focus:border-primary transition-colors resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {error && <p className="text-red-400 text-[10px] italic font-mono uppercase tracking-tight">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary-gradient rounded-xl text-white font-bold text-xs tracking-[0.2em] uppercase hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Sincronizando...' : productToEdit ? 'Confirmar Actualización' : 'Ejecutar Registro'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
