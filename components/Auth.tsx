import React, { useState } from 'react';
import { NeonCard, NeonButton, NeonInput } from './NeonUI';
import { supabase } from '../services/supabaseClient';

interface AuthProps {
  t: any;
  error?: string | null;
  onGuestLogin: (role?: 'admin' | 'lender' | 'student') => void;
}

export const Auth: React.FC<AuthProps> = ({ t, error: propError, onGuestLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setLocalError(null);

    try {
      if (isSignUp) {
        // Sign Up Logic
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: email.split('@')[0], // Default name
            }
          }
        });
        if (error) throw error;
        alert("Registration successful! Please check your email or log in.");
        setIsSignUp(false);
      } else {
        // Log In Logic
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      console.error(err);
      if (err.message.includes("provider is not enabled")) {
        setLocalError("Email login is not enabled in Supabase Dashboard. Try Guest Mode.");
      } else {
        setLocalError(err.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const socialLogin = async (provider: 'google' | 'facebook') => {
    setIsProcessing(true);
    setLocalError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
      });
      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      if (err.message.includes("provider is not enabled")) {
        setLocalError(`${provider.toUpperCase()} login is not configured in Supabase. Enable it in Authentication > Providers.`);
      } else {
        setLocalError(err.message);
      }
    } finally {
      setIsProcessing(false);
    }
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
            <h2 className="text-2xl font-bold text-white uppercase">
              {isSignUp ? "Create Identity" : t.login.title}
            </h2>
        </div>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <NeonInput 
            label={t.login.emailLabel} 
            type="email" 
            placeholder={t.placeholders.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <NeonInput 
            label={t.login.passLabel} 
            type="password" 
            placeholder={t.placeholders.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {(localError || propError) && (
            <div className="text-red-500 text-sm text-center bg-red-900/20 border border-red-900 p-2 rounded">
              {localError || propError}
            </div>
          )}

          <NeonButton type="submit" fullWidth color="blue" disabled={isProcessing}>
             {isProcessing ? 'Processing...' : (isSignUp ? "Register Operative" : t.login.loginBtn)}
          </NeonButton>
        </form>

        <div className="mt-4 text-center">
          <button 
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setLocalError(null); }}
            className="text-neon-blue text-sm uppercase tracking-wider hover:text-white underline"
          >
            {isSignUp ? "Already have an identity? Login" : "Need access? Register"}
          </button>
        </div>

        <div className="my-6 flex items-center justify-between text-gray-500 text-xs uppercase tracking-widest">
            <span className="w-full border-t border-gray-800"></span>
            <span className="px-4">OR</span>
            <span className="w-full border-t border-gray-800"></span>
        </div>

        <div className="space-y-3">
            <button 
              onClick={() => onGuestLogin('student')}
              className="w-full bg-black border-2 border-neon-green text-neon-green font-bold py-3 rounded flex items-center justify-center hover:bg-neon-green hover:text-black transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(10,255,10,0.3)] hover:shadow-[0_0_25px_rgba(10,255,10,0.6)]"
            >
               🎓 ENTER NEON TYCOON (STUDENT MODE)
            </button>

            <div className="grid grid-cols-2 gap-3">
                <button 
                onClick={() => onGuestLogin('admin')}
                className="w-full bg-transparent border border-gray-700 text-gray-400 text-xs font-bold py-3 rounded flex items-center justify-center hover:bg-gray-800 hover:text-white transition-colors uppercase tracking-widest"
                >
                {t.login.guestBtn}
                </button>

                <button 
                onClick={() => onGuestLogin('lender')}
                className="w-full bg-transparent border border-gray-700 text-neon-yellow text-xs font-bold py-3 rounded flex items-center justify-center hover:bg-neon-yellow hover:text-black transition-colors uppercase tracking-widest"
                >
                {t.login.lenderBtn}
                </button>
            </div>
        </div>
      </NeonCard>
    </div>
  );
};