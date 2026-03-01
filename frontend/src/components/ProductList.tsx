import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import ConfirmModal from './ConfirmModal';

interface Product {
  id: number;
  name: string;
  sku: string;
  unitPrice: number;
  currentStock: number;
  minStock: number;
  description: string;
  categoryName: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{id: number, name: string} | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Permisos del usuario actual
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const canEdit = currentUser.role === 'ADMIN' || currentUser.canEditProducts;
  const canDelete = currentUser.role === 'ADMIN' || currentUser.canDeleteProducts;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (err) {
      console.error('Error al cargar productos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductToEdit(null);
  };

  const handleDeleteProduct = (id: number, name: string) => {
    setProductToDelete({ id, name });
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/products/${productToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      console.error('Error al eliminar el activo');
    } finally {
      setIsConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  const getStatusBadge = (current: number, min: number) => {
    if (current === 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20">
          <span className="size-1.5 rounded-full bg-red-500"></span>
          Sin Stock
        </span>
      );
    }
    if (current <= min) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <span className="size-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          Stock Bajo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
        <span className="size-1.5 rounded-full bg-emerald-500"></span>
        En Stock
      </span>
    );
  };

  if (isLoading) return <div className="text-center p-10 text-slate-500 font-mono text-xs tracking-[0.3em] uppercase animate-pulse">Sincronizando Matriz...</div>;

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Area */}
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-white tracking-tight">Matriz de Productos</h2>
        <p className="text-sm text-slate-400 mt-1">Gestiona SKUs, niveles de stock y estado de inventario.</p>
      </div>

      <div className="glass-panel rounded-2xl flex flex-col overflow-hidden border border-white/5 bg-white/[0.01]">
        {/* Toolbar */}
        <div className="p-5 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 bg-white/[0.02]">
          <div className="flex items-center gap-3 flex-1 min-w-[300px]">
            <div className="relative w-[320px] group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </span>
              <input 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/20 border border-white/5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all" 
                placeholder="Buscar por SKU, Nombre..." 
                type="text"
              />
            </div>
            <div className="h-6 w-[1px] bg-white/10 mx-2"></div>
            <select className="bg-black/20 border border-white/5 text-slate-300 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-primary/50 cursor-pointer">
              <option>Todas las Categorías</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Exportar
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="pl-3 pr-4 py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white text-sm font-bold tracking-tight shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Añadir Producto
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                <th className="px-6 py-4">Detalles del Producto</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4 text-right">Nivel de Stock</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {products.map((product) => (
                <tr key={product.id} className="group hover:bg-primary/[0.03] transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-primary/30 transition-colors text-slate-600">
                        <span className="material-symbols-outlined text-xl">inventory_2</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-medium group-hover:text-primary transition-colors">{product.name}</span>
                        <span className="text-slate-500 text-[11px] font-mono mt-0.5 uppercase tracking-tighter">{product.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-400 font-medium">{product.categoryName}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-white font-mono font-bold">{product.currentStock} unidades</span>
                      <span className="text-[10px] text-slate-500">Mín: {product.minStock}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(product.currentStock, product.minStock)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      {canEdit && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleEditProduct(product); }}
                          className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Editar Producto"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                      )}
                      {canDelete && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id, product.name); }}
                          className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Eliminar Producto"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <span className="material-symbols-outlined text-5xl mb-2">database_off</span>
                      <p className="text-sm italic font-mono tracking-widest uppercase">Sin registros en la matriz</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">
            Mostrando <span className="text-white font-bold">{products.length}</span> activos de la red
          </span>
          <div className="flex items-center gap-2">
            <button className="size-8 rounded-lg border border-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-colors disabled:opacity-30" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="size-8 rounded-lg bg-primary text-white text-[10px] font-bold shadow-lg shadow-primary/20">1</button>
            <button className="size-8 rounded-lg border border-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-colors disabled:opacity-30" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <ProductForm 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSuccess={fetchProducts} 
        productToEdit={productToEdit}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Confirmar Purga"
        message={`¿Está seguro de que desea eliminar el activo "${productToDelete?.name}" de la red? Esta acción es irreversible.`}
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        confirmText="Confirmar"
        cancelText="Cancelar"
        isCritical={true}
      />
    </div>
  );
};

export default ProductList;
