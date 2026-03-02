import React, { useState, useEffect } from 'react';
import api from '../lib/api';

interface Category {
  id: number;
  name: string;
  subCategories: Category[];
}

interface Supplier {
  id: number;
  companyName: string;
}

interface Product {
  id: number;
  sku: string;
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
    sku: '',
    description: '',
    unitPrice: 0,
    currentStock: 0,
    minStock: 0,
    maxStock: 100,
    categoryId: '',
    supplierId: ''
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchSuppliers();
      if (productToEdit) {
        setFormData({
          name: productToEdit.name,
          sku: productToEdit.sku,
          description: productToEdit.description || '',
          unitPrice: productToEdit.unitPrice,
          currentStock: productToEdit.currentStock || 0,
          minStock: productToEdit.minStock,
          maxStock: productToEdit.maxStock || 100,
          categoryId: productToEdit.categoryId?.toString() || '',
          supplierId: productToEdit.supplierId?.toString() || ''
        });
      } else {
        generateNextSku();
      }
    }
  }, [isOpen, productToEdit]);

  const generateNextSku = async () => {
    try {
      const res = await api.get('/api/products');
      const products: Product[] = res.data;
      
      // Lógica de Negocio: NEX- + (Número de productos + 1)
      // Buscamos el número más alto actual que empiece con NEX-
      const lastNum = products.reduce((acc, p) => {
        if (!p.sku || !p.sku.startsWith('NEX-')) return acc;
        const num = parseInt(p.sku.replace('NEX-', ''));
        return !isNaN(num) && num > acc ? num : acc;
      }, 0);
      
      const nextNum = (lastNum + 1).toString().padStart(4, '0');
      
      setFormData(prev => ({ 
        ...prev, 
        name: '', 
        sku: `NEX-${nextNum}`, 
        description: '', 
        unitPrice: 0, 
        currentStock: 0,
        minStock: 0, 
        maxStock: 100,
        categoryId: '',
        supplierId: ''
      }));
    } catch (err) {
      setFormData(prev => ({ ...prev, sku: 'NEX-0001' }));
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/supply-chain/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error al cargar categorías');
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/api/supply-chain/suppliers');
      setSuppliers(res.data);
    } catch (err) {
      console.error('Error al cargar proveedores');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      ...formData,
      categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      supplierId: formData.supplierId ? parseInt(formData.supplierId) : null,
    };

    try {
      if (productToEdit) {
        await api.put(`/api/products/${productToEdit.id}`, payload);
      } else {
        await api.post('/api/products', payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCategoryOptions = (cats: Category[], depth = 0): JSX.Element[] => {
    return cats.flatMap(cat => [
      <option key={cat.id} value={cat.id}>
        {'\u00A0'.repeat(depth * 4)}{depth > 0 ? '↳ ' : ''}{cat.name}
      </option>,
      ...renderCategoryOptions(cat.subCategories || [], depth + 1)
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl bg-glass-gradient rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200 my-8">
        <h2 className="text-xl font-bold text-white mb-6 uppercase italic tracking-tight flex items-center gap-2">
          <div className="w-2 h-6 bg-primary rounded-full"></div>
          {productToEdit ? 'Actualizar Matriz de Activo' : 'Vincular Nuevo Activo'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
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
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">SKU (Generado por Sistema)</label>
              <input
                type="text"
                readOnly
                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-slate-400 font-mono focus:outline-none cursor-not-allowed opacity-80"
                value={formData.sku}
                placeholder="Calculando SKU..."
              />
              <p className="text-[9px] text-slate-600 ml-1 italic">Identificador único inmutable</p>
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
                {renderCategoryOptions(categories)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Proveedor Asignado</label>
              <select
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-all cursor-pointer"
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              >
                <option value="">Seleccionar Proveedor...</option>
                {suppliers.map(sup => (
                  <option key={sup.id} value={sup.id}>{sup.companyName}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Precio Unitario ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-primary transition-all"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Stock Inicial</label>
              <input
                type="number"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-primary transition-all"
                value={formData.currentStock}
                onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 text-red-400">Umbral Mínimo (Alerta)</label>
              <input
                type="number"
                min="0"
                className="w-full bg-white/5 border border-red-500/30 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-red-500 transition-all"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1 text-emerald-400">Umbral Máximo (Exceso)</label>
              <input
                type="number"
                min="1"
                className="w-full bg-white/5 border border-emerald-500/30 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500 transition-all"
                value={formData.maxStock}
                onChange={(e) => setFormData({ ...formData, maxStock: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Especificaciones Técnicas / Notas</label>
            <textarea
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-all resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex gap-4 pt-4">
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
