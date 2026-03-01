import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    const fetchAlertCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8080/api/alerts/count', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAlertCount(res.data.count);
      } catch (err) {
        console.error('Error al cargar conteo de alertas');
      }
    };
    fetchAlertCount();
  }, [location.pathname]);
  
  const menuItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { name: 'Matriz de Productos', icon: 'inventory_2', path: '/products' },
    { name: 'Movimientos', icon: 'swap_horiz', path: '/movements' },
    { name: 'Cadena de Suministro', icon: 'hub', path: '/supply-chain' },
    { name: 'Centro de Alertas', icon: 'warning', path: '/alerts', badge: alertCount },
    { name: 'Analytics Hub', icon: 'analytics', path: '/reports' },
    { name: 'Acceso de Equipo', icon: 'manage_accounts', path: '/team' },
  ];

  return (
    <aside className="w-[260px] flex-shrink-0 h-full glass-panel border-r border-white/10 z-20 flex flex-col justify-between">
      <div>
        {/* Brand */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-white/5">
          <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="material-symbols-outlined text-white text-[20px]">hexagon</span>
          </div>
          <h1 className="text-white font-bold tracking-tight text-lg">NEXUS INV</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 flex flex-col gap-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative overflow-hidden ${
                location.pathname === item.path
                  ? 'bg-primary/20 text-white border border-primary/20 shadow-lg shadow-primary/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${
                location.pathname === item.path ? 'text-primary' : 'group-hover:text-primary transition-colors'
              }`}>
                {item.icon}
              </span>
              <span className="text-sm font-medium relative z-10">{item.name}</span>
              {item.badge && (
                <span className="ml-auto bg-amber-500/20 text-amber-500 text-[10px] px-1.5 py-0.5 rounded font-mono border border-amber-500/20">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* User/Settings Bottom */}
      <div className="p-4 border-t border-white/5">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors group mb-2">
          <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">settings</span>
          <span className="text-sm font-medium">Configuración</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
