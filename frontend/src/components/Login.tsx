import React, { useState } from 'react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });

      const { token, name, role, email: userEmail, canEditProducts, canDeleteProducts } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ name, role, email: userEmail, canEditProducts, canDeleteProducts }));
      
      navigate('/dashboard');
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciales inválidas. Acceso denegado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden flex items-center justify-center relative bg-background-dark font-display">
      {/* Ambient Background Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-blue-800/30 rounded-full blur-3xl opacity-50 animate-blob-spin"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] translate-y-1/2 translate-x-1/4"></div>
      </div>

      <main className="relative z-10 w-full max-w-[400px] mx-4">
        <div className={`glass-panel bg-glass-gradient rounded-2xl p-8 flex flex-col items-center ${error ? 'animate-shake' : ''}`}>
          {/* Logo Section */}
          <div className="mb-8 flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-blue-900/20">
              <span className="material-symbols-outlined text-background-dark !text-[32px]">
                inventory_2
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1">NEXUS INV</h1>
            <p className="text-text-secondary text-sm font-normal">Acceso al Centro de Comando</p>
          </div>

          {/* Login Form */}
          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            <div className="relative group">
              <input
                autoComplete="off"
                type="email"
                id="operatorId"
                className="floating-input block py-2.5 px-0 w-full text-base text-white bg-transparent border-0 border-b border-white/20 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer font-mono"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label 
                htmlFor="operatorId"
                className="absolute text-sm text-text-secondary duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6"
              >
                ID de Operador (Email)
              </label>
            </div>

            <div className="relative group">
              <input
                type="password"
                id="accessKey"
                className="floating-input block py-2.5 px-0 w-full text-base text-white bg-transparent border-0 border-b border-white/20 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label 
                htmlFor="accessKey"
                className="absolute text-sm text-text-secondary duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6"
              >
                Clave de Acceso
              </label>
            </div>

            <div className="flex items-center justify-between text-xs mt-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="remember-me" 
                  className="w-4 h-4 text-primary bg-white/5 border-white/20 rounded focus:ring-primary focus:ring-offset-0 focus:bg-primary transition-colors cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 text-text-secondary cursor-pointer select-none">Recordar dispositivo</label>
              </div>
              <a href="#" className="text-primary hover:text-blue-400 transition-colors font-medium">¿Restablecer Clave?</a>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-8 rounded-lg bg-primary-gradient text-white font-medium text-sm tracking-wide shadow-lg shadow-blue-900/50 hover:shadow-blue-600/30 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:transform-none"
            >
              <span>{isLoading ? 'ESTABLECIENDO VÍNCULO...' : 'INICIAR SESIÓN'}</span>
              {!isLoading && (
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 text-red-400 text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">warning</span>
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 w-full text-center">
            <p className="text-xs text-text-secondary/60">
              Acceso Restringido. Solo Personal Autorizado. <br/>
              <span className="font-mono mt-1 inline-block">v2.4.0-build.892</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
