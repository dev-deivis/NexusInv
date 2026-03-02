import React, { useState, useEffect } from 'react';
import api from '../lib/api';

interface Stat {
  totalValue: number;
  activeAlerts: number;
  totalProducts: number;
  turnoverRate: number;
}

const AnalyticsHub: React.FC = () => {
  const [stats, setStats] = useState<Stat | null>(null);
  const [reportType, setReportType] = useState('movements');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    generateReport();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/reports/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error al cargar estadísticas');
    }
  };

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/api/reports/${reportType}`);
      setData(res.data);
    } catch (err) {
      console.error('Error al generar reporte');
    } finally {
      setIsLoading(false);
    }
  };

  if (!stats) return <div className="text-center p-10 text-slate-500 font-mono text-xs animate-pulse uppercase tracking-widest">Iniciando Núcleo de Análisis...</div>;

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-white tracking-tight uppercase italic">Centro de Análisis</h2>
        <p className="text-sm text-slate-400 mt-1 uppercase tracking-tighter">Inteligencia de red y reportes operativos</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-[64px] text-primary">inventory_2</span>
          </div>
          <h3 className="text-text-secondary text-xs font-bold uppercase tracking-widest mb-1">Activos Procesados</h3>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-text-primary tracking-tight font-mono">{stats.totalProducts}</span>
            <span className="flex items-center text-[10px] font-bold text-success bg-success/10 px-1.5 py-0.5 rounded border border-success/20">
              <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span> 12%
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-tighter">Sincronización en tiempo real</p>
        </div>

        <div className="glass-panel p-5 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-[64px] text-success">attach_money</span>
          </div>
          <h3 className="text-text-secondary text-xs font-bold uppercase tracking-widest mb-1">Valoración Neta</h3>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-text-primary tracking-tight font-mono">${stats.totalValue.toLocaleString()}</span>
            <span className="flex items-center text-[10px] font-bold text-success bg-success/10 px-1.5 py-0.5 rounded border border-success/20">
              <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span> 5.4%
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-tighter">Impulsado por activos críticos</p>
        </div>

        <div className="glass-panel p-5 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-[64px] text-warning">sync_alt</span>
          </div>
          <h3 className="text-text-secondary text-xs font-bold uppercase tracking-widest mb-1">Tasa de Rotación</h3>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-text-primary tracking-tight font-mono">{stats.turnoverRate}</span>
            <span className="flex items-center text-[10px] font-bold text-critical bg-critical/10 px-1.5 py-0.5 rounded border border-critical/20">
              <span className="material-symbols-outlined text-[14px] mr-0.5">trending_down</span> 1.1%
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-tighter">Velocidad de flujo de red</p>
        </div>
      </div>

      {/* Controls Row */}
      <div className="glass-panel p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 border border-white/5">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Tipo de Reporte</label>
            <select 
              className="bg-black/20 border border-white/10 rounded-lg h-10 px-3 text-sm text-white focus:outline-none focus:border-primary min-w-[200px]"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="movements">Historial de Movimientos</option>
              <option value="valuation">Valoración de Stock</option>
              <option value="low-stock">Alertas Críticas</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 pt-5">
            <button 
              onClick={generateReport}
              className="h-10 px-6 rounded-lg bg-primary hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span> Generar
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end">
          <button className="h-10 px-3 rounded-lg border border-dashed border-white/10 text-slate-400 hover:text-white transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-red-400 text-[20px]">picture_as_pdf</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Exportar PDF</span>
          </button>
          <button className="h-10 px-3 rounded-lg border border-dashed border-white/10 text-slate-400 hover:text-white transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400 text-[20px]">table_view</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Report Preview */}
      <div className="glass-panel flex-1 rounded-xl flex flex-col overflow-hidden min-h-[400px] border border-white/5">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest italic">Previsualización de Datos</h3>
            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-tighter">Registros detectados: {data.length}</span>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-slate-600 font-mono text-xs animate-pulse">Sincronizando registros...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#0F1117] z-10 border-b border-white/5">
                <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                  <th className="px-6 py-3">Identificador</th>
                  <th className="px-6 py-3">Referencia</th>
                  <th className="px-6 py-3 text-right">Métrica</th>
                  <th className="px-6 py-3 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {data.map((item, idx) => (
                  <tr key={idx} className="hover:bg-primary/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{item.productName || item.name}</span>
                        <span className="text-[10px] text-primary font-mono tracking-tighter uppercase">{item.productSku || item.sku}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 uppercase tracking-widest">
                      {item.type || item.categoryName || 'SISTEMA'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-mono font-bold text-white">
                        {item.quantity !== undefined ? item.quantity : (item.unitPrice ? `$${item.unitPrice}` : item.currentStock)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[10px] font-bold bg-white/5 px-2 py-1 rounded text-slate-500 border border-white/5 uppercase">
                        {item.userName || item.status || 'ACTIVO'}
                      </span>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-slate-600 italic font-mono text-xs tracking-widest uppercase opacity-20">
                      Sin datos en el sector seleccionado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHub;
