import React from 'react';
import { NeonCard } from './NeonUI';

interface AboutProps {
  t: any;
  onBack: () => void;
}

export const About: React.FC<AboutProps> = ({ t, onBack }) => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-[fadeIn_0.5s_ease-out]">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 tracking-tighter">
            <span className="text-white">ABOUT</span>
            <span className="text-neon-blue"> NEON</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto font-light text-lg">{t.about.intro}</p>
      </div>

      <div className="space-y-8">
        {/* Mission Section */}
        <NeonCard color="blue" hoverEffect={false} className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-widest border-b border-gray-800 pb-2">{t.about.missionTitle}</h2>
            <p className="text-gray-300 leading-relaxed text-lg">
                {t.about.missionText}
            </p>
        </NeonCard>

        {/* How it Works Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NeonCard color="green" hoverEffect={false} className="h-full relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 text-8xl font-bold text-white opacity-5 select-none group-hover:opacity-10 transition-opacity">01</div>
                <div className="text-4xl mb-4 text-neon-green">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t.about.step1Title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{t.about.step1Text}</p>
            </NeonCard>
            
            <NeonCard color="pink" hoverEffect={false} className="h-full relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 text-8xl font-bold text-white opacity-5 select-none group-hover:opacity-10 transition-opacity">02</div>
                <div className="text-4xl mb-4 text-neon-pink">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t.about.step2Title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{t.about.step2Text}</p>
            </NeonCard>

            <NeonCard color="purple" hoverEffect={false} className="h-full relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 text-8xl font-bold text-white opacity-5 select-none group-hover:opacity-10 transition-opacity">03</div>
                <div className="text-4xl mb-4 text-neon-purple">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t.about.step3Title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{t.about.step3Text}</p>
            </NeonCard>
        </div>

        {/* Features List */}
        <NeonCard color="purple" hoverEffect={false} className="p-8">
             <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest border-b border-gray-800 pb-2">{t.about.featuresTitle}</h2>
             <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                {t.about.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start text-gray-300">
                        <span className="w-2 h-2 bg-neon-purple rounded-full mr-3 mt-2 flex-shrink-0 shadow-[0_0_5px_currentColor]"></span>
                        <span>{feature}</span>
                    </li>
                ))}
             </ul>
        </NeonCard>

        <div className="text-center pt-8 pb-12">
            <button 
                onClick={onBack}
                className="text-neon-blue hover:text-white uppercase tracking-widest text-sm font-bold transition-colors border-b-2 border-neon-blue hover:border-white pb-1"
            >
                {t.about.backBtn}
            </button>
        </div>
      </div>
    </div>
  );
};