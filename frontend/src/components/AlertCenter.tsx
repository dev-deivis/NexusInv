import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Alert {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  currentStock: number;
  minStock: number;
  alertType: string;
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
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/alerts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(response.data);
    } catch (err) {
      console.error('Error al cargar alertas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestock = (productId: number) => {
    navigate('/movements', { state: { productId, type: 'ENTRY' } });
  };

  const handleIgnore = (alertId: number) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  if (isLoading) return <div className="text-center p-10 text-slate-500 font-mono text-xs tracking-widest uppercase animate-pulse">Escaneando Perímetros de Red...</div>;

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-500">warning</span>
          Centro de Alertas
        </h2>
        <p className="text-sm text-slate-400 mt-1 uppercase tracking-tighter">Protocolos de emergencia y stock crítico</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-6">
        {alerts.map(alert => (
          <div key={alert.id} className="glass-panel rounded-2xl p-6 border-amber-500/30 bg-amber-500/[0.02] flex flex-col relative overflow-hidden group hover:border-amber-500/50 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-4xl text-amber-500">error</span>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 rounded-[4px] text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 tracking-widest">CRÍTICO</span>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Detectado: {new Date(alert.createdAt).toLocaleString()}</span>
            </div>

            <div className="mb-6">
              <h3 className="text-white font-bold text-lg leading-tight group-hover:text-amber-400 transition-colors">{alert.productName}</h3>
              <p className="text-primary font-mono text-xs uppercase tracking-widest mt-1">{alert.productSku}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Stock Actual</p>
                <p className="text-xl font-mono font-bold text-red-400">{alert.currentStock}</p>
              </div>
              <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1">Umbral Mínimo</p>
                <p className="text-xl font-mono font-bold text-white">{alert.minStock}</p>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/5 flex gap-3">
              <button 
                onClick={() => handleIgnore(alert.id)}
                className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-amber-500/20 transition-all"
              >
                Ignorar
              </button>
              <button 
                onClick={() => handleRestock(alert.productId)}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-amber-900/20 transition-all transform hover:-translate-y-0.5"
              >
                Reabastecer
              </button>
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center opacity-20">
            <span className="material-symbols-outlined text-7xl mb-4 text-emerald-500">verified_user</span>
            <p className="text-lg italic font-mono tracking-widest uppercase text-white">Perímetro Asegurado</p>
            <p className="text-sm">No se detectan activos por debajo del umbral mínimo</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertCenter;
