import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [alertCount, setAlertCount] = useState(0);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'EMPLOYEE';

  useEffect(() => {
    const fetchAlertCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/api/alerts/count', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAlertCount(res.data.count);
      } catch (err) {
        console.error('Error al cargar conteo de alertas');
      }
    };
    fetchAlertCount();
  }, [location.pathname]);
  
  // Definición de ítems del menú con sus roles permitidos
  const allMenuItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { name: 'Matriz de Productos', icon: 'inventory_2', path: '/products', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { name: 'Movimientos', icon: 'swap_horiz', path: '/movements', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { name: 'Cadena de Suministro', icon: 'hub', path: '/supply-chain', roles: ['ADMIN', 'MANAGER'] },
    { name: 'Centro de Alertas', icon: 'warning', path: '/alerts', badge: alertCount, roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { name: 'Analytics Hub', icon: 'analytics', path: '/reports', roles: ['ADMIN', 'MANAGER'] },
    { name: 'Acceso de Equipo', icon: 'manage_accounts', path: '/team', roles: ['ADMIN'] },
  ];

  // Filtrar ítems según el rol del usuario actual
  const menuItems = allMenuItems.filter(item => item.roles.includes(role));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="w-[260px] flex-shrink-0 h-full glass-panel border-r border-white/10 z-20 flex flex-col justify-between">
      <div>
        {/* Brand */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-white/5">
          <div className="bg-gradient-to-br from-primary to-purple-600 aspect-square rounded-xl size-10 flex items-center justify-center shadow-[0_0_15px_rgba(46,117,182,0.3)]">
            <span className="material-symbols-outlined text-white">dataset</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-base font-bold tracking-tight">NEXUS INV</h1>
            <p className="text-primary text-[9px] font-bold uppercase tracking-widest">{role}</p>
          </div>
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
              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto bg-amber-500/20 text-amber-500 text-[10px] px-1.5 py-0.5 rounded font-mono border border-amber-500/20 animate-pulse">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group" onClick={handleLogout}>
          <div className="size-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center border border-white/10">
            <span className="material-symbols-outlined text-xs text-white">person</span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] font-semibold text-white truncate">{user.name}</span>
            <span className="text-[8px] text-text-secondary truncate">{user.email}</span>
          </div>
          <span className="material-symbols-outlined text-text-secondary ml-auto text-lg group-hover:text-red-400 transition-colors">logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
