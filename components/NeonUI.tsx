import React, { ReactNode } from 'react';

interface NeonCardProps {
  children: ReactNode;
  color?: 'blue' | 'pink' | 'green' | 'purple' | 'yellow';
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const NeonCard: React.FC<NeonCardProps> = ({ 
  children, 
  color = 'blue', 
  className = '', 
  onClick,
  hoverEffect = true 
}) => {
  const borderColor = {
    blue: 'border-neon-blue',
    pink: 'border-neon-pink',
    green: 'border-neon-green',
    purple: 'border-neon-purple',
    yellow: 'border-neon-yellow',
  }[color];

  const shadowColor = {
    blue: 'hover:shadow-neon-blue',
    pink: 'hover:shadow-neon-pink',
    green: 'hover:shadow-neon-green',
    purple: 'hover:shadow-[0_0_10px_#bc13fe,0_0_20px_#bc13fe33]',
    yellow: 'hover:shadow-neon-yellow',
  }[color];

  return (
    <div 
      onClick={onClick}
      className={`
        relative bg-dark-card border border-opacity-50 ${borderColor} 
        p-6 rounded-xl transition-all duration-300
        ${hoverEffect ? `${shadowColor} hover:-translate-y-1 hover:border-opacity-100 cursor-pointer` : ''}
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-10 rounded-xl transition-opacity pointer-events-none" />
      {children}
    </div>
  );
};

interface NeonButtonProps {
  children: ReactNode;
  onClick?: () => void;
  color?: 'blue' | 'pink' | 'green' | 'purple';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const NeonButton: React.FC<NeonButtonProps> = ({ 
  children, 
  onClick, 
  color = 'blue', 
  fullWidth = false,
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const colors = {
    blue: 'bg-neon-blue text-black shadow-neon-blue hover:bg-white',
    pink: 'bg-neon-pink text-white shadow-neon-pink hover:bg-white hover:text-neon-pink',
    green: 'bg-neon-green text-black shadow-neon-green hover:bg-white',
    purple: 'bg-neon-purple text-white shadow-[0_0_15px_#bc13fe] hover:bg-white hover:text-neon-purple',
  }[color];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${fullWidth ? 'w-full' : ''}
        ${colors}
        font-bold py-3 px-6 rounded-lg
        uppercase tracking-widest
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_currentColor]
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export const NeonText: React.FC<{ children: ReactNode; color?: string; className?: string }> = ({ 
  children, 
  color = 'text-neon-blue',
  className = ''
}) => (
  <span className={`${color} drop-shadow-[0_0_2px_rgba(255,255,255,0.5)] ${className}`}>
    {children}
  </span>
);

export const LoadingScan: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center h-96 space-y-8">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 border-4 border-neon-blue rounded-full animate-ping opacity-20"></div>
        <div className="absolute inset-0 border-4 border-t-neon-blue border-r-transparent border-b-neon-purple border-l-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-4 border-4 border-t-transparent border-r-neon-pink border-b-transparent border-l-neon-green rounded-full animate-spin reverse"></div>
      </div>
      <h2 className="text-2xl font-bold animate-pulse text-neon-blue font-orbitron tracking-widest text-center">
        {text}
      </h2>
      <div className="w-64 h-2 bg-dark-border rounded overflow-hidden">
        <div className="h-full bg-neon-blue animate-[loading_2s_ease-in-out_infinite]" style={{width: '50%'}}></div>
      </div>
    </div>
  );
};

// Form Components

interface NeonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const NeonInput: React.FC<NeonInputProps> = ({ label, className = '', ...props }) => (
  <div className="mb-4">
    <label className="block text-neon-blue text-sm font-bold mb-2 uppercase tracking-wider font-orbitron">
      {label}
    </label>
    <input
      className={`
        w-full bg-dark-card border border-gray-700 rounded py-3 px-4 
        text-white focus:outline-none focus:border-neon-pink focus:shadow-neon-pink
        transition-all duration-300 placeholder-gray-600
        ${className}
      `}
      {...props}
    />
  </div>
);

interface NeonTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const NeonTextArea: React.FC<NeonTextAreaProps> = ({ label, className = '', ...props }) => (
  <div className="mb-4">
    <label className="block text-neon-blue text-sm font-bold mb-2 uppercase tracking-wider font-orbitron">
      {label}
    </label>
    <textarea
      className={`
        w-full bg-dark-card border border-gray-700 rounded py-3 px-4 
        text-white focus:outline-none focus:border-neon-pink focus:shadow-neon-pink
        transition-all duration-300 placeholder-gray-600 min-h-[100px]
        ${className}
      `}
      {...props}
    />
  </div>
);

interface NeonSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export const NeonSelect: React.FC<NeonSelectProps> = ({ label, options, className = '', ...props }) => (
  <div className="mb-4">
    <label className="block text-neon-blue text-sm font-bold mb-2 uppercase tracking-wider font-orbitron">
      {label}
    </label>
    <div className="relative">
      <select
        className={`
          w-full bg-dark-card border border-gray-700 rounded py-3 px-4 
          text-white focus:outline-none focus:border-neon-pink focus:shadow-neon-pink
          transition-all duration-300 appearance-none
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neon-blue">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  </div>
);

interface NeonModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export const NeonModal: React.FC<NeonModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-dark-card border border-neon-blue shadow-[0_0_50px_rgba(0,212,255,0.2)] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-[fadeIn_0.3s_ease-out]">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white uppercase tracking-wider font-orbitron">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};