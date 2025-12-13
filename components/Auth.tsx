import React, { useState } from 'react';
import { NeonCard, NeonButton, NeonInput, NeonText } from './NeonUI';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  t: any;
  error?: string | null;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, t, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Mock Authentication Logic
    setTimeout(() => {
      setIsProcessing(false);
      if (email === 'admin' && password === 'admin') {
        onLogin({
          id: 'admin-1',
          name: 'System Admin',
          email: 'admin@neon.com',
          role: 'admin',
          savedIdeas: []
        });
      } else if (email === 'user' && password === 'user') {
        onLogin({
          id: 'user-1',
          name: 'Operative One',
          email: 'user@neon.com',
          role: 'user',
          savedIdeas: []
        });
      } else if (email && password) {
         // Generic Login for other inputs
        onLogin({
          id: `user-${Date.now()}`,
          name: email.split('@')[0],
          email: email,
          role: 'user',
          savedIdeas: []
        });
      } else {
        // Simple error handling done in parent or ignored for mock
      }
    }, 1000);
  };

  const socialLogin = (provider: string) => {
    setIsProcessing(true);
    setTimeout(() => {
        setIsProcessing(false);
        onLogin({
            id: `${provider}-${Date.now()}`,
            name: `${provider} User`,
            email: `user@${provider.toLowerCase()}.com`,
            role: 'user',
            savedIdeas: []
        });
    }, 1500);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold tracking-tighter mb-2">
            <span className="text-white">NEON</span>
            <span className="text-neon-blue">ID</span>
        </h1>
        <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">
            {t.login.subtitle}
        </p>
      </div>

      <NeonCard color="blue" className="w-full max-w-md p-8" hoverEffect={false}>
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white uppercase">{t.login.title}</h2>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <NeonInput 
            label={t.login.emailLabel} 
            type="text" 
            placeholder={t.placeholders.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <NeonInput 
            label={t.login.passLabel} 
            type="password" 
            placeholder={t.placeholders.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <NeonButton type="submit" fullWidth color="blue" disabled={isProcessing}>
             {isProcessing ? '...' : t.login.loginBtn}
          </NeonButton>
        </form>

        <div className="my-6 flex items-center justify-between text-gray-500 text-xs uppercase tracking-widest">
            <span className="w-full border-t border-gray-800"></span>
            <span className="px-4">OR</span>
            <span className="w-full border-t border-gray-800"></span>
        </div>

        <div className="space-y-3">
            <button 
                onClick={() => socialLogin('Google')}
                disabled={isProcessing}
                className="w-full bg-white text-black font-bold py-3 rounded flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
               <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"/></svg>
               {t.login.googleBtn}
            </button>
            <button 
                 onClick={() => socialLogin('Facebook')}
                 disabled={isProcessing}
                 className="w-full bg-[#1877F2] text-white font-bold py-3 rounded flex items-center justify-center hover:bg-[#166fe5] transition-colors"
            >
               <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
               {t.login.fbBtn}
            </button>
        </div>
      </NeonCard>
    </div>
  );
};