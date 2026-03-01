import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoryForm from './CategoryForm';
import SupplierForm from './SupplierForm';

interface Category {
  id: number;
  name: string;
  subCategories: Category[];
}

interface Supplier {
  id: number;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
}

const SupplyChain: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isSupModalOpen, setIsSupModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [catRes, supRes] = await Promise.all([
        axios.get('http://localhost:8080/api/supply-chain/categories', { headers }),
        axios.get('http://localhost:8080/api/supply-chain/suppliers', { headers })
      ]);

      setCategories(catRes.data);
      setSuppliers(supRes.data);
    } catch (err) {
      console.error('Error al cargar datos de la cadena de suministro');
    } finally {
      setIsLoading(false);
    }
  };

  const openAddSubcategory = (parentId: number) => {
    setSelectedParentId(parentId);
    setIsCatModalOpen(true);
  };

  const openAddRootCategory = () => {
    setSelectedParentId(null);
    setIsCatModalOpen(true);
  };

  if (isLoading) return <div className="text-center p-10 text-slate-500 font-mono text-xs tracking-widest uppercase animate-pulse">Sincronizando Nodos de Red...</div>;

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex items-center gap-4">
        <div className="p-2 bg-white/5 rounded-lg border border-white/10">
          <span className="material-symbols-outlined text-white text-[20px]">hub</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight uppercase italic">Gestión de Cadena de Suministro</h2>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            <span>Vista General</span>
            <span className="text-slate-700">/</span>
            <span className="text-primary">Taxonomía y Proveedores</span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden pb-4">
        {/* Left Panel: Categories */}
        <section className="glass-panel rounded-2xl flex flex-col h-full overflow-hidden border border-white/5 bg-white/[0.01]">
          <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <div>
              <h3 className="text-white font-semibold text-sm flex items-center gap-2 uppercase tracking-wider">
                <span className="material-symbols-outlined text-primary text-[18px]">category</span>
                Categorías de Productos
              </h3>
              <p className="text-slate-500 text-[10px] mt-0.5 uppercase tracking-tighter">Gestión de jerarquía taxonómica</p>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-lg text-slate-500 transition-colors">
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {categories.map(cat => (
              <div key={cat.id} className="flex flex-col gap-1">
                <div className="flex items-center justify-between p-2 rounded-lg cursor-pointer group hover:bg-primary/10 border border-transparent transition-all">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[20px]">folder_open</span>
                    <span className="text-sm text-white font-medium">{cat.name}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openAddSubcategory(cat.id)}
                      className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-primary"
                      title="Añadir Subcategoría"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </button>
                  </div>
                </div>
                {/* Subcategories */}
                <div className="pl-8 flex flex-col gap-1 border-l border-white/5 ml-4 mt-1">
                  {cat.subCategories.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between p-2 rounded-lg cursor-pointer group hover:bg-white/5 border border-transparent transition-all">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-sky-400/80 text-[18px]">subdirectory_arrow_right</span>
                        <span className="text-xs text-slate-300">{sub.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-center py-10 text-slate-600 italic text-xs uppercase tracking-widest opacity-30">Sin categorías en la red</p>
            )}
          </div>

          <div className="p-4 border-t border-white/10 bg-white/[0.01]">
            <button 
              onClick={openAddRootCategory}
              className="w-full py-3 rounded-xl border border-dashed border-white/20 text-slate-500 hover:text-white hover:border-primary hover:bg-primary/10 transition-all flex items-center justify-center gap-2 group"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">add_circle</span>
              <span className="text-xs font-bold uppercase tracking-widest">Añadir Categoría Raíz</span>
            </button>
          </div>
        </section>

        {/* Right Panel: Suppliers */}
        <section className="glass-panel rounded-2xl flex flex-col h-full overflow-hidden border border-white/5 bg-white/[0.01]">
          <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <div>
              <h3 className="text-white font-semibold text-sm flex items-center gap-2 uppercase tracking-wider">
                <span className="material-symbols-outlined text-emerald-500 text-[18px]">local_shipping</span>
                Directorio de Proveedores
              </h3>
              <p className="text-slate-500 text-[10px] mt-0.5 uppercase tracking-tighter">Información de contacto y vínculos</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsSupModalOpen(true)}
                className="px-3 py-1.5 bg-primary hover:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center gap-1 shadow-lg shadow-blue-500/20"
              >
                <span className="material-symbols-outlined text-[16px]">add</span> NUEVO
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {suppliers.map(sup => (
              <div key={sup.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-start gap-4 cursor-pointer group hover:bg-primary/5 transition-all relative overflow-hidden">
                <div className="size-10 rounded-full bg-black/40 flex items-center justify-center border border-white/10 flex-shrink-0 text-primary font-bold text-sm">
                  {sup.companyName.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-bold text-sm tracking-wide">{sup.companyName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded-[4px] text-[8px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">ACTIVO</span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">ID: VND-{sup.id.toString().padStart(4, '0')}</span>
                      </div>
                    </div>
                    <button className="text-slate-600 hover:text-white transition-colors p-1 rounded opacity-0 group-hover:opacity-100">
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
                  </div>
                  <div className="mt-3 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="material-symbols-outlined text-[14px] text-slate-600">person</span>
                      {sup.contactName}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-primary hover:underline">
                      <span className="material-symbols-outlined text-[14px] text-slate-600">mail</span>
                      {sup.email}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {suppliers.length === 0 && (
              <p className="text-center py-10 text-slate-600 italic text-xs uppercase tracking-widest opacity-30">Sin proveedores vinculados</p>
            )}
          </div>
        </section>
      </div>

      <CategoryForm 
        isOpen={isCatModalOpen} 
        onClose={() => setIsCatModalOpen(false)} 
        onSuccess={fetchData} 
        parentId={selectedParentId}
      />

      <SupplierForm 
        isOpen={isSupModalOpen} 
        onClose={() => setIsSupModalOpen(false)} 
        onSuccess={fetchData} 
      />
    </div>
  );
};

export default SupplyChain;
