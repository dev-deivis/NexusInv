import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

interface Alert {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  alertType: 'LOW_STOCK' | 'EXCESS_STOCK';
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

  const handleResolve = (productId: number, type: 'ENTRY' | 'EXIT') => {
    navigate('/movements', { state: { productId, type } });
  };

  if (isLoading) return <div className="text-center p-10 text-slate-500 font-mono text-xs animate-pulse uppercase tracking-widest">Escaneando Perímetro de Seguridad...</div>;

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">notifications_active</span>
          Centro de Alertas
        </h2>
        <p className="text-sm text-slate-400 mt-1 uppercase tracking-tighter">Protocolos de emergencia y optimización de inventario</p>
      </div>

      <div className="glass-panel flex-1 rounded-2xl flex flex-col overflow-hidden border border-white/5 bg-white/[0.01]">
        <div className="p-6 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${alerts.length > 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
              {alerts.length} Notificaciones de Red
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
            {alerts.map((alert) => {
              const isLow = alert.alertType === 'LOW_STOCK';
              return (
                <div 
                  key={alert.id} 
                  className={`glass-panel p-5 rounded-2xl border transition-all group relative overflow-hidden ${
                    isLow ? 'border-red-500/30 bg-red-500/[0.03] hover:bg-red-500/[0.07]' : 'border-emerald-500/30 bg-emerald-500/[0.03] hover:bg-emerald-500/[0.07]'
                  }`}
                >
                  <div className="absolute -top-4 -right-4 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <span className="material-symbols-outlined text-[120px]">
                      {isLow ? 'warning' : 'inventory_2'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isLow ? 'text-red-400' : 'text-emerald-400'}`}>
                        {isLow ? 'Protocolo: Reabastecimiento' : 'Protocolo: Distribución'}
                      </span>
                      <h3 className="text-white font-bold text-lg leading-tight group-hover:text-primary transition-colors">{alert.productName}</h3>
                      <span className="text-[10px] font-mono text-slate-500 uppercase mt-1 tracking-tighter">{alert.productSku}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                    <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                      <p className="text-[9px] uppercase font-bold text-slate-500 mb-1">Stock Actual</p>
                      <p className="text-xl font-mono font-bold text-white leading-none">{alert.currentStock}</p>
                    </div>
                    <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                      <p className="text-[9px] uppercase font-bold text-slate-500 mb-1">
                        {isLow ? 'Umbral Mínimo' : 'Umbral Máximo'}
                      </p>
                      <p className="text-xl font-mono font-bold text-slate-400 leading-none">
                        {isLow ? alert.minStock : alert.maxStock}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 relative z-10">
                    <button 
                      onClick={() => handleResolve(alert.productId, isLow ? 'ENTRY' : 'EXIT')}
                      className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                        isLow 
                          ? 'bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border-red-500/20' 
                          : 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border-emerald-500/20'
                      }`}
                    >
                      {isLow ? 'Iniciar Entrada de Stock' : 'Iniciar Salida de Stock'}
                    </button>
                    <p className="text-[9px] text-center text-slate-600 font-medium">
                      Detectado: {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
            {alerts.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-20">
                <span className="material-symbols-outlined text-7xl mb-4 text-emerald-500">verified_user</span>
                <p className="text-sm font-mono tracking-[0.4em] uppercase text-center">
                  Perímetro Asegurado<br/>Sin Anomalías Detectadas
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertCenter;
