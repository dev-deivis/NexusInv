import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="text-slate-300 antialiased selection:bg-primary selection:text-white overflow-hidden h-screen flex bg-background-dark">
      {/* Decorative background blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] opacity-30"></div>
      </div>

      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden z-10">
        <Header />
        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
