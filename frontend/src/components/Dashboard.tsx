import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Stats {
  totalValue: number;
  activeAlerts: number;
  totalProducts: number;
  turnoverRate: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8080/api/reports/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error('Error al cargar estadísticas');
      }
    };
    fetchStats();
  }, []);

  const currentDate = new Date().toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Title */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight uppercase italic">Centro de Comando</h2>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-[0.2em] font-bold">Resumen operativo en tiempo real • {currentDate}</p>
        </div>
        <button className="px-4 py-2 bg-primary hover:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2 transition-all">
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          Acción Rápida
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <div className="glass-panel rounded-xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-primary">
            <span className="material-symbols-outlined text-4xl">paid</span>
          </div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Valor Total Inventario</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-bold text-white tracking-tight font-mono">
              ${stats ? stats.totalValue.toLocaleString() : '---'}
            </h3>
            <span className="text-emerald-400 text-[9px] font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center">
              <span className="material-symbols-outlined text-[12px] mr-0.5">trending_up</span> 12%
            </span>
          </div>
          <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full w-2/3 shadow-[0_0_10px_rgba(46,117,182,0.5)]"></div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-panel rounded-xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-indigo-400">
            <span className="material-symbols-outlined text-4xl">inventory</span>
          </div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Activos en Red</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-bold text-white tracking-tight font-mono">
              {stats ? stats.totalProducts : '---'}
            </h3>
            <span className="text-emerald-400 text-[9px] font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center">
              <span className="material-symbols-outlined text-[12px] mr-0.5">trending_up</span> 3%
            </span>
          </div>
          <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full w-1/2 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel rounded-xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-cyan-400">
            <span className="material-symbols-outlined text-4xl">sync_alt</span>
          </div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Tasa de Rotación</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-bold text-white tracking-tight font-mono">
              {stats ? stats.turnoverRate : '---'}
            </h3>
            <span className="text-emerald-400 text-[9px] font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center">
              <span className="material-symbols-outlined text-[12px] mr-0.5">trending_up</span> 5%
            </span>
          </div>
          <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full rounded-full w-1/3 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="glass-panel rounded-xl p-5 relative overflow-hidden group border-amber-500/30 bg-amber-500/[0.02]">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity text-amber-500">
            <span className="material-symbols-outlined text-4xl">warning</span>
          </div>
          <p className="text-amber-200/70 text-[10px] font-bold uppercase tracking-widest">Alertas de Stock</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-bold text-white tracking-tight font-mono text-red-400">
              {stats ? stats.activeAlerts : '---'}
            </h3>
            <span className="text-amber-400 text-[9px] font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center">
              <span className="material-symbols-outlined text-[12px] mr-0.5 animate-pulse">notification_important</span> CRÍTICO
            </span>
          </div>
          <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full w-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
          </div>
        </div>
      </div>

      {/* Bottom Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        {/* Weekly Movement Area */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-6 flex flex-col relative overflow-hidden border border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Tráfico de Red Semanal</h3>
            <div className="flex gap-4">
              <span className="flex items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <div className="size-2 rounded-full bg-primary mr-2 shadow-[0_0_5px_rgba(46,117,182,0.5)]"></div> Entrada
              </span>
              <span className="flex items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <div className="size-2 rounded-full bg-purple-500 mr-2 shadow-[0_0_5px_rgba(168,85,247,0.5)]"></div> Salida
              </span>
            </div>
          </div>
          <div className="flex-1 w-full relative flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/20">
            <p className="text-slate-600 text-[10px] italic font-mono tracking-[0.3em] uppercase">Visualización de Flujo Encriptada</p>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="lg:col-span-1 glass-panel rounded-xl flex flex-col overflow-hidden border border-white/5 bg-white/[0.01]">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] italic">Alertas Recientes</h3>
            <button className="text-[10px] font-bold text-primary hover:text-blue-300 transition-colors uppercase tracking-widest">Sincronizar</button>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {stats && stats.activeAlerts > 0 ? (
              <div className="group px-4 py-4 hover:bg-amber-500/5 transition-colors cursor-pointer flex gap-3 items-start border-l-2 border-l-transparent hover:border-l-amber-500">
                <div className="mt-0.5 text-amber-500 bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20">
                  <span className="material-symbols-outlined text-[18px]">warning</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Activos en nivel crítico</p>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tight">Hay {stats.activeAlerts} productos por debajo del umbral mínimo de seguridad.</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <span className="material-symbols-outlined text-4xl mb-2">shield_check</span>
                <p className="text-[10px] font-bold uppercase tracking-widest">Red Asegurada</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
