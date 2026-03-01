import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isCritical?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isCritical = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-sm bg-glass-gradient rounded-2xl p-6 shadow-2xl border border-white/10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className={`size-10 rounded-lg flex items-center justify-center ${isCritical ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary'}`}>
            <span className="material-symbols-outlined">{isCritical ? 'warning' : 'help'}</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight uppercase italic">{title}</h3>
        </div>
        
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase text-slate-400 hover:text-white hover:bg-white/5 transition-all border border-white/5"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase text-white shadow-lg transition-all transform hover:-translate-y-0.5 ${
              isCritical 
                ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-red-900/20' 
                : 'bg-primary-gradient shadow-primary/20'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
