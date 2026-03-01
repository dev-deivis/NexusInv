import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="h-16 sticky top-0 z-10 flex items-center justify-between px-8 border-b border-white/5 glass-panel bg-opacity-60">
      {/* Search */}
      <div className="relative w-96 group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-slate-500 group-focus-within:text-primary transition-colors">search</span>
        </div>
        <input 
          className="block w-full pl-10 pr-3 py-2 border-transparent rounded-full leading-5 bg-white/5 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-primary focus:border-primary/50 sm:text-sm transition-all" 
          placeholder="Buscar por SKU, Nombre o ID de Orden..." 
          type="text"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <button className="relative text-slate-400 hover:text-white transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#0F1117]"></span>
        </button>
        
        <div className="h-6 w-px bg-white/10"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{user.name || 'Operador'}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user.role || 'Invitado'}</p>
          </div>
          <div className="relative group cursor-pointer" onClick={handleLogout} title="Cerrar Sesión">
            <img 
              alt="Perfil" 
              className="h-9 w-9 rounded-full ring-2 ring-white/10 object-cover hover:ring-primary/50 transition-all" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZMOMgXzilx_Y_E_3uOzccCaOgw-HXZ_ahAyB0GzrIzbNkKU2ddP1GiyAksnFOdftI11s2I7Hr4phckoKShGbfq-nHPQM4blzpRm7QHP0JLdc-qU4plB37wq0-pvzU5HV9cU2zHe5zVkO3mtzextAWr5bYoVFz-s93EyR3RKKGD1ow0rT8s1MwUjhOywSigFJLsVZZuK3mFLO6kg8aSPk-rgnuORAzlPIfry4B7bZ7BUZCFWEQrn4Mi_JsC7XiSxsyRxiClLKL9H8"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-white text-sm">logout</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
