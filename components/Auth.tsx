import React, { useState } from 'react';
import { NeonCard, NeonButton, NeonInput } from './NeonUI';
import { supabase } from '../services/supabaseClient';

interface AuthProps {
  t: any;
  error?: string | null;
  onGuestLogin: (role: 'admin' | 'lender' | 'student' | 'user') => void;
}

type LoginStep = 'ROLE_SELECTION' | 'AUTH_METHOD';
type UserRole = 'admin' | 'lender' | 'student' | 'user';

export const Auth: React.FC<AuthProps> = ({ t, error: propError, onGuestLogin }) => {
  const [step, setStep] = useState<LoginStep>('ROLE_SELECTION');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('AUTH_METHOD');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setLocalError(null);

    // If it's a "guest" flow for the purpose of the demo app
    if (email.includes('guest')) {
        onGuestLogin(selectedRole || 'user');
        setIsProcessing(false);
        return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: email.split('@')[0], role: selectedRole } }
        });
        if (error) throw error;
        alert("Registration successful! Please check your email or log in.");
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      console.error(err);
      setLocalError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderRoleSelection = () => (
    <div className="animate-[fadeIn_0.4s_ease-out] space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white uppercase tracking-widest border-b border-gray-800 pb-4">
          Select Operative Type
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button 
          onClick={() => handleRoleSelect('user')}
          className="group relative bg-black border border-neon-pink hover:bg-neon-pink/10 p-6 rounded-xl text-left transition-all hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">🚀</div>
          <div className="text-neon-pink font-bold uppercase text-xs tracking-widest mb-1">Operative</div>
          <div className="text-white font-bold text-lg">ENTREPRENEUR</div>
          <div className="text-gray-500 text-xs mt-2">Build profiles and scan for market opportunities.</div>
        </button>

        <button 
          onClick={() => handleRoleSelect('student')}
          className="group relative bg-black border border-neon-green hover:bg-neon-green/10 p-6 rounded-xl text-left transition-all hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">🎓</div>
          <div className="text-neon-green font-bold uppercase text-xs tracking-widest mb-1">Cadet</div>
          <div className="text-white font-bold text-lg">STUDENT SIM</div>
          <div className="text-gray-500 text-xs mt-2">Run the FAD VENTURE SIM for educational credit.</div>
        </button>

        <button 
          onClick={() => handleRoleSelect('lender')}
          className="group relative bg-black border border-neon-yellow hover:bg-neon-yellow/10 p-6 rounded-xl text-left transition-all hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">🏦</div>
          <div className="text-neon-yellow font-bold uppercase text-xs tracking-widest mb-1">Partner</div>
          <div className="text-white font-bold text-lg">LENDER</div>
          <div className="text-gray-500 text-xs mt-2">Review risk models and release capital tranches.</div>
        </button>

        <button 
          onClick={() => handleRoleSelect('admin')}
          className="group relative bg-black border border-neon-blue hover:bg-neon-blue/10 p-6 rounded-xl text-left transition-all hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">🛠️</div>
          <div className="text-neon-blue font-bold uppercase text-xs tracking-widest mb-1">Authority</div>
          <div className="text-white font-bold text-lg">ADMINISTRATOR</div>
          <div className="text-gray-500 text-xs mt-2">Global database management and system analytics.</div>
        </button>
      </div>
    </div>
  );

  const renderAuthMethod = () => (
    <div className="animate-[fadeIn_0.4s_ease-out] space-y-6">
      <div className="text-center mb-6">
        <button 
          onClick={() => setStep('ROLE_SELECTION')}
          className="text-[10px] text-gray-500 hover:text-white uppercase font-bold tracking-[0.2em] mb-4 flex items-center justify-center gap-2 mx-auto"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          Back to Roles
        </button>
        <h2 className="text-2xl font-bold text-white uppercase tracking-widest">
          {isSignUp ? "Register Identity" : "Identity Uplink"}
        </h2>
        <p className="text-[10px] text-neon-blue font-bold uppercase mt-1">Accessing as {selectedRole?.toUpperCase()}</p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <NeonInput 
          label="Email / Operative ID" 
          type="email" 
          placeholder="id@fadlab.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <NeonInput 
          label="Security Key" 
          type="password" 
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        {(localError || propError) && (
          <div className="text-red-500 text-xs text-center bg-red-900/20 border border-red-900 p-2 rounded">
            {localError || propError}
          </div>
        )}

        <NeonButton type="submit" fullWidth color="blue" disabled={isProcessing}>
           {isProcessing ? 'SYNCHRONIZING...' : (isSignUp ? "INITIALIZE ID" : "TERMINAL LOGIN")}
        </NeonButton>
      </form>

      <div className="text-center">
        <button 
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-gray-500 text-[10px] uppercase font-bold tracking-widest hover:text-white"
        >
          {isSignUp ? "Existing User? Return to Login" : "New User? Create Lab Identity"}
        </button>
      </div>

      <div className="my-6 flex items-center justify-between text-gray-700 text-[10px] uppercase font-bold tracking-[0.3em]">
          <span className="w-full border-t border-gray-800"></span>
          <span className="px-4">UPLINK</span>
          <span className="w-full border-t border-gray-800"></span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => onGuestLogin(selectedRole!)} className="flex items-center justify-center gap-2 bg-gray-900/50 border border-gray-700 py-3 rounded hover:bg-white hover:text-black transition-all text-xs font-bold uppercase tracking-wider">
          <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" alt="Google" />
          Google
        </button>
        <button onClick={() => onGuestLogin(selectedRole!)} className="flex items-center justify-center gap-2 bg-gray-900/50 border border-gray-700 py-3 rounded hover:bg-blue-600 transition-all text-xs font-bold uppercase tracking-wider">
          <img src="https://www.svgrepo.com/show/303114/facebook-3.svg" className="w-4 h-4" alt="FB" />
          Facebook
        </button>
        <button onClick={() => onGuestLogin(selectedRole!)} className="flex items-center justify-center gap-2 bg-gray-900/50 border border-gray-700 py-3 rounded hover:bg-gradient-to-tr hover:from-purple-600 hover:to-pink-600 transition-all text-xs font-bold uppercase tracking-wider">
          <img src="https://www.svgrepo.com/show/303145/instagram-2-1.svg" className="w-4 h-4" alt="Insta" />
          Instagram
        </button>
        <button onClick={() => onGuestLogin(selectedRole!)} className="flex items-center justify-center gap-2 bg-gray-900/50 border border-gray-700 py-3 rounded hover:bg-neon-green hover:text-black transition-all text-xs font-bold uppercase tracking-wider">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1H7c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          Phone
        </button>
      </div>

      <div className="pt-4">
        <button 
          onClick={() => onGuestLogin(selectedRole!)}
          className="w-full bg-transparent border border-neon-blue text-neon-blue font-bold py-3 rounded flex items-center justify-center hover:bg-neon-blue hover:text-black transition-all uppercase tracking-[0.2em] text-xs shadow-[0_0_15px_rgba(0,212,255,0.1)]"
        >
           Enter as {selectedRole} (Guest Mode)
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#050505] selection:bg-neon-blue selection:text-black">
      <div className="mb-12 text-center">
        <div className="inline-block p-3 rounded-full bg-dark-card border border-neon-blue mb-4 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
            <span className="text-4xl">🧪</span>
        </div>
        <h1 className="text-5xl font-black tracking-tighter mb-2 font-orbitron">
            <span className="text-white">FAD</span>
            <span className="text-neon-blue"> LAB</span>
        </h1>
        <p className="text-gray-500 font-mono text-xs tracking-[0.5em] uppercase">
            Business Intelligence Terminal
        </p>
      </div>

      <div className="w-full max-w-lg bg-dark-card border border-gray-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50"></div>
        {step === 'ROLE_SELECTION' ? renderRoleSelection() : renderAuthMethod()}
      </div>
      
      <div className="mt-8 text-gray-600 text-[10px] font-mono uppercase tracking-[0.3em]">
        Connection Secure • RSA-4096 Encrypted
      </div>
    </div>
  );
};