import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

interface Alert {
  id: number;
  productName: string;
  productSku: string;
  currentStock: number;
  minStock: number;
  createdAt: string;
}

const AlertCenter: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/api/alerts/active');
      setAlerts(res.data);
    } catch (err) {
      console.error('Error al cargar alertas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = (productId: number) => {
    navigate('/movements', { state: { productId, type: 'ENTRY' } });
  };

  if (isLoading) return <div className="text-center p-10 text-slate-500 font-mono text-xs animate-pulse uppercase tracking-widest">Escaneando Perímetro de Seguridad...</div>;

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined text-critical">report_problem</span>
          Centro de Alertas
        </h2>
        <p className="text-sm text-slate-400 mt-1 uppercase tracking-tighter">Protocolos de emergencia y ruptura de stock</p>
      </div>

      <div className="glass-panel flex-1 rounded-2xl flex flex-col overflow-hidden border border-white/5 bg-white/[0.01]">
        <div className="p-6 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${alerts.length > 0 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
              {alerts.length} Amenazas Detectadas
            </div>
          </div>
          <button 
            onClick={fetchAlerts}
            className="p-2 hover:bg-white/10 rounded-lg text-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">sync</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
            {alerts.map((alert) => (
              <div key={alert.id} className="glass-panel p-5 rounded-xl border border-red-500/20 bg-red-500/[0.02] hover:bg-red-500/[0.05] transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <span className="material-symbols-outlined text-6xl text-red-500">warning</span>
                </div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Stock Crítico</span>
                    <h3 className="text-white font-bold text-lg leading-tight">{alert.productName}</h3>
                    <span className="text-[10px] font-mono text-slate-500 uppercase mt-1">{alert.productSku}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                    <p className="text-[9px] uppercase font-bold text-slate-500 mb-1">Actual</p>
                    <p className="text-xl font-mono font-bold text-white leading-none">{alert.currentStock}</p>
                  </div>
                  <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                    <p className="text-[9px] uppercase font-bold text-slate-500 mb-1">Mínimo</p>
                    <p className="text-xl font-mono font-bold text-slate-400 leading-none">{alert.minStock}</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleResolve(alert.id)} // En un sistema real usaríamos el productId, asumimos alert.id por ahora o ajustamos
                  className="w-full py-3 bg-white/5 hover:bg-red-500 hover:text-white border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] transition-all"
                >
                  Ejecutar Reabastecimiento
                </button>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-20">
                <span className="material-symbols-outlined text-6xl mb-4">shield_check</span>
                <p className="text-sm font-mono tracking-[0.3em] uppercase">Perímetro Asegurado • Sin Amenazas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertCenter;
