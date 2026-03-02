import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useLocation } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  sku: string;
}

interface Movement {
  id: number;
  productName: string;
  productSku: string;
  type: string;
  quantity: number;
  userName: string;
  createdAt: string;
  reason: string;
}

const MovementRegistry: React.FC = () => {
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [history, setHistory] = useState<Movement[]>([]);
  const [formData, setFormData] = useState({
    productId: '',
    type: 'ENTRY',
    quantity: 1,
    reason: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchHistory();
  }, []);

  useEffect(() => {
    if (location.state && location.state.productId && products.length > 0) {
      setFormData(prev => ({
        ...prev,
        productId: location.state.productId.toString(),
        type: location.state.type || 'ENTRY'
      }));
    }
  }, [location.state, products]);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error al cargar productos');
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get('/api/movements');
      setHistory(res.data);
    } catch (err) {
      console.error('Error al cargar historial');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/api/movements', formData);
      setFormData({ ...formData, quantity: 1, reason: '' });
      fetchHistory();
    } catch (err) {
      alert('Error en el registro del movimiento.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">history</span>
          Registro de Movimientos
        </h2>
        <p className="text-sm text-slate-400 mt-1">Bitácora de entradas, salidas y ajustes de stock.</p>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left Panel: Form */}
        <div className="w-[30%] min-w-[320px] flex flex-col h-full glass-panel rounded-2xl overflow-hidden border border-white/5">
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-white font-medium text-lg italic">Nueva Transacción</h3>
            <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">Manual Stock Log</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
            {/* Toggle Type */}
            <div className="grid grid-cols-2 p-1 bg-black/40 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'ENTRY' })}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  formData.type === 'ENTRY' ? 'bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-900/20' : 'text-slate-500'
                }`}
              >
                <span className="material-symbols-outlined text-sm">arrow_upward</span> ENTRADA
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'EXIT' })}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  formData.type === 'EXIT' ? 'bg-amber-500/20 text-amber-400 shadow-lg shadow-amber-900/20' : 'text-slate-500'
                }`}
              >
                <span className="material-symbols-outlined text-sm">arrow_downward</span> SALIDA
              </button>
            </div>

            {/* Product Select */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Producto / Activo</label>
              <select
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                required
              >
                <option value="">Seleccionar SKU...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Cantidad</label>
              <div className="relative group">
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}
                  className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <input
                  type="number"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-4 text-3xl font-bold font-mono text-center text-white focus:outline-none focus:border-primary transition-all"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, quantity: formData.quantity + 1 })}
                  className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>

            {/* Reference */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Motivo / Referencia</label>
              <input
                type="text"
                placeholder="Ej: Orden de compra #123"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-auto w-full bg-primary-gradient py-4 rounded-xl text-white text-xs font-bold tracking-[0.2em] uppercase shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isLoading ? 'Transmitiendo...' : 'Confirmar Operación'}
            </button>
          </form>
        </div>

        {/* Right Panel: History */}
        <div className="flex-1 flex flex-col h-full glass-panel rounded-2xl overflow-hidden border border-white/5">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div>
              <h3 className="text-white font-medium text-lg italic">Historial de Red</h3>
              <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">Real-time Movement Log</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white border border-white/5 transition-all">
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
              </button>
              <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white border border-white/5 transition-all">
                <span className="material-symbols-outlined text-[20px]">download</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#0F1117]/95 backdrop-blur-md z-10 border-b border-white/5">
                <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Sincronización</th>
                  <th className="px-6 py-4">Activo</th>
                  <th className="px-6 py-4 text-right">Cantidad</th>
                  <th className="px-6 py-4 text-right">Operador</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {history.map((m) => (
                  <tr key={m.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`size-8 rounded-full flex items-center justify-center border ${
                          m.type === 'ENTRY' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}>
                          <span className="material-symbols-outlined text-[18px]">
                            {m.type === 'ENTRY' ? 'arrow_upward' : 'arrow_downward'}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold uppercase ${m.type === 'ENTRY' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {m.type === 'ENTRY' ? 'In' : 'Out'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">
                      <div className="flex flex-col">
                        <span className="text-white">
                          {new Date(m.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-[10px]">
                          {new Date(m.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{m.productName}</span>
                        <span className="text-[10px] text-primary font-mono uppercase tracking-tighter">{m.productSku}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-mono font-bold px-2 py-1 rounded bg-white/5 ${m.type === 'ENTRY' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {m.type === 'ENTRY' ? '+' : '-'}{m.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <span className="text-xs text-slate-400 font-medium">{m.userName}</span>
                        <div className="size-7 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                          <span className="material-symbols-outlined text-sm text-primary">person</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-slate-600 italic font-mono text-xs tracking-widest uppercase opacity-20">
                      Sin registros de tráfico en la red
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovementRegistry;
