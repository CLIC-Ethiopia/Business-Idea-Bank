import React, { useState } from 'react';
import { INDUSTRIES } from './constants';
import { NeonCard, NeonButton, NeonInput, NeonTextArea, NeonSelect, LoadingScan } from './components/NeonUI';
import { generateIdeas, generateCanvas, generatePersonalizedIdeas } from './services/geminiService';
import { Industry, BusinessIdea, BusinessCanvas, AppState, UserProfile } from './types';

// Icons
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SELECT_INDUSTRY);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);
  const [canvas, setCanvas] = useState<BusinessCanvas | null>(null);
  const [error, setError] = useState<string | null>(null);

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    budget: '$1,000 - $5,000',
    skills: '',
    interests: '',
    riskTolerance: 'Medium',
    timeCommitment: 'Part-time'
  });

  const handleIndustrySelect = async (industry: Industry) => {
    setSelectedIndustry(industry);
    setAppState(AppState.LOADING_IDEAS);
    setError(null);
    try {
      const generatedIdeas = await generateIdeas(industry.name);
      if (generatedIdeas.length === 0) {
        setError("AI could not generate ideas. Please try again.");
        setAppState(AppState.SELECT_INDUSTRY);
      } else {
        setIdeas(generatedIdeas);
        setAppState(AppState.SELECT_IDEA);
      }
    } catch (e) {
      setError("Connection error. Check API Key.");
      setAppState(AppState.SELECT_INDUSTRY);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppState(AppState.LOADING_PROFILE_IDEAS);
    setError(null);
    try {
      const generatedIdeas = await generatePersonalizedIdeas(userProfile);
      if (generatedIdeas.length === 0) {
        setError("AI could not generate ideas based on your profile. Try adjusting your inputs.");
        setAppState(AppState.USER_PROFILE);
      } else {
        setIdeas(generatedIdeas);
        // We set selectedIndustry to null or a special value to indicate profile mode
        setSelectedIndustry({ id: 'custom', name: 'Personalized Matches', icon: '🎯' });
        setAppState(AppState.SELECT_IDEA);
      }
    } catch (e) {
      setError("Connection error during profile analysis.");
      setAppState(AppState.USER_PROFILE);
    }
  };

  const handleIdeaSelect = async (idea: BusinessIdea) => {
    setSelectedIdea(idea);
    setAppState(AppState.LOADING_CANVAS);
    setError(null);
    try {
      const generatedCanvas = await generateCanvas(idea);
      if (!generatedCanvas) {
        setError("Failed to generate canvas.");
        setAppState(AppState.SELECT_IDEA);
      } else {
        setCanvas(generatedCanvas);
        setAppState(AppState.VIEW_CANVAS);
      }
    } catch (e) {
      setError("Connection error.");
      setAppState(AppState.SELECT_IDEA);
    }
  };

  const reset = () => {
    setAppState(AppState.SELECT_INDUSTRY);
    setSelectedIndustry(null);
    setIdeas([]);
    setSelectedIdea(null);
    setCanvas(null);
  };

  const goBackToIdeas = () => {
    setAppState(AppState.SELECT_IDEA);
    setCanvas(null);
    setSelectedIdea(null);
  };

  // Render Functions
  const renderIndustrySelection = () => (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-end mb-4">
        <NeonButton onClick={() => setAppState(AppState.USER_PROFILE)} color="green" className="flex items-center gap-2">
          <UserIcon />
          <span>Build Entrepreneur Profile</span>
        </NeonButton>
      </div>

      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter">
          <span className="text-white">NEON</span>
          <span className="text-neon-blue">VENTURES</span>
        </h1>
        <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
          Select an industry sector to initialize the scanning protocol. 
          We will locate machine-based business opportunities for you.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {INDUSTRIES.map((ind) => (
          <NeonCard 
            key={ind.id} 
            color="blue" 
            onClick={() => handleIndustrySelect(ind)}
            className="group flex flex-col items-center justify-center min-h-[200px] text-center"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              {ind.icon}
            </div>
            <h3 className="text-2xl font-bold text-white group-hover:text-neon-blue transition-colors">
              {ind.name}
            </h3>
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-neon-blue text-sm uppercase tracking-widest">
              Scan Sector &rarr;
            </div>
          </NeonCard>
        ))}
      </div>
      {error && <div className="text-red-500 text-center mt-8 text-xl font-bold">{error}</div>}
    </div>
  );

  const renderUserProfile = () => (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <button onClick={reset} className="flex items-center text-gray-400 hover:text-white transition-colors">
          <ArrowLeftIcon />
          <span className="ml-2 uppercase tracking-widest">Back to Home</span>
        </button>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl text-neon-green font-bold mb-2">ENTREPRENEUR PROFILE</h2>
        <p className="text-gray-400">Calibrate the AI to match your capabilities with market opportunities.</p>
      </div>

      <NeonCard color="green" className="p-8" hoverEffect={false}>
        <form onSubmit={handleProfileSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NeonInput 
              label="Name" 
              placeholder="Enter your alias" 
              value={userProfile.name} 
              onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
              required
            />
            <NeonSelect 
              label="Estimated Budget" 
              options={[
                { value: 'Under $1,000', label: 'Under $1,000 (Micro)' },
                { value: '$1,000 - $5,000', label: '$1,000 - $5,000 (Small)' },
                { value: '$5,000 - $20,000', label: '$5,000 - $20,000 (Medium)' },
                { value: '$20,000+', label: '$20,000+ (Large)' }
              ]}
              value={userProfile.budget}
              onChange={(e) => setUserProfile({...userProfile, budget: e.target.value})}
            />
          </div>

          <NeonTextArea 
            label="Key Skills" 
            placeholder="e.g. Graphic Design, Welding, Coding, Sales, Baking..." 
            value={userProfile.skills}
            onChange={(e) => setUserProfile({...userProfile, skills: e.target.value})}
            required
          />

          <NeonTextArea 
            label="Interests & Hobbies" 
            placeholder="e.g. 3D Printing, Outdoors, Fashion, Gaming..." 
            value={userProfile.interests}
            onChange={(e) => setUserProfile({...userProfile, interests: e.target.value})}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NeonSelect 
              label="Risk Tolerance" 
              options={[
                { value: 'Low', label: 'Low (Safe Bets)' },
                { value: 'Medium', label: 'Medium (Calculated)' },
                { value: 'High', label: 'High (Moonshots)' }
              ]}
              value={userProfile.riskTolerance}
              onChange={(e) => setUserProfile({...userProfile, riskTolerance: e.target.value as any})}
            />
            <NeonSelect 
              label="Time Commitment" 
              options={[
                { value: 'Part-time', label: 'Part-time / Side Hustle' },
                { value: 'Full-time', label: 'Full-time' }
              ]}
              value={userProfile.timeCommitment}
              onChange={(e) => setUserProfile({...userProfile, timeCommitment: e.target.value as any})}
            />
          </div>

          <div className="mt-8">
            <NeonButton type="submit" fullWidth color="green">
              Analyze & Generate Matches
            </NeonButton>
          </div>
        </form>
      </NeonCard>
      
      {error && <div className="text-red-500 text-center mt-8 text-xl font-bold">{error}</div>}
    </div>
  );

  const renderIdeaSelection = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <button onClick={reset} className="flex items-center text-gray-400 hover:text-white transition-colors">
          <ArrowLeftIcon />
          <span className="ml-2 uppercase tracking-widest">Back to Sectors</span>
        </button>
        <div className="text-right">
          <h2 className="text-neon-blue text-xl font-bold uppercase">{selectedIndustry?.name}</h2>
          <p className="text-xs text-gray-500">Scan Complete: {ideas.length} Opportunities Found</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ideas.map((idea, idx) => (
          <NeonCard key={idx} color="pink" className="flex flex-col h-full" hoverEffect={false}>
            <div className="relative h-48 mb-4 rounded-lg overflow-hidden border border-gray-800">
               {/* Using simulated images since we can't real-time scrape */}
              <img 
                src={`https://picsum.photos/400/300?random=${idx}`} 
                alt={idea.machineName} 
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
              />
              <div className="absolute top-2 right-2 bg-black/80 text-neon-pink text-xs font-bold px-2 py-1 rounded border border-neon-pink">
                {idea.platformSource}
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{idea.businessTitle}</h3>
            <div className="text-neon-blue text-sm font-bold mb-4 uppercase tracking-wider">
              {idea.machineName}
            </div>
            
            <p className="text-gray-400 text-sm flex-grow mb-6 leading-relaxed">
              {idea.description}
            </p>

            <div className="border-t border-gray-800 pt-4 mt-auto">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase">Investment</div>
                  <div className="text-neon-green font-bold">{idea.priceRange}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase">Potential</div>
                  <div className="text-white font-bold">{idea.potentialRevenue}</div>
                </div>
              </div>
              <NeonButton fullWidth color="pink" onClick={() => handleIdeaSelect(idea)}>
                Analyze Business Model
              </NeonButton>
            </div>
          </NeonCard>
        ))}
      </div>
    </div>
  );

  const renderBusinessCanvas = () => {
    if (!canvas || !selectedIdea) return null;

    // Helper to render a canvas block
    const CanvasBlock = ({ title, items, color = 'blue', className = '' }: { title: string, items: string[], color?: 'blue'|'pink'|'green'|'purple', className?: string }) => (
      <div className={`bg-dark-card border border-gray-800 p-4 h-full flex flex-col hover:border-neon-${color} transition-colors duration-300 ${className}`}>
        <h4 className={`text-neon-${color} font-bold uppercase tracking-widest text-sm mb-4 border-b border-gray-800 pb-2`}>
          {title}
        </h4>
        <ul className="space-y-2 overflow-y-auto custom-scrollbar flex-grow">
          {items.map((item, i) => (
            <li key={i} className="text-sm text-gray-300 flex items-start">
              <span className={`inline-block w-1.5 h-1.5 rounded-full bg-neon-${color} mt-1.5 mr-2 flex-shrink-0`}></span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    );

    return (
      <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 shrink-0">
          <button onClick={goBackToIdeas} className="flex items-center text-gray-400 hover:text-white transition-colors mb-4 md:mb-0">
            <ArrowLeftIcon />
            <span className="ml-2 uppercase tracking-widest">Back to Ideas</span>
          </button>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-white">{selectedIdea.businessTitle}</h2>
            <p className="text-neon-blue font-mono">{selectedIdea.machineName}</p>
          </div>
        </div>

        {/* Canvas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-grow min-h-0 overflow-y-auto pb-8">
          
          {/* Left Col */}
          <div className="grid grid-rows-2 gap-4 md:col-span-1">
             <CanvasBlock title="Key Partners" items={canvas.keyPartners} color="purple" />
             <CanvasBlock title="Cost Structure" items={canvas.costStructure} color="pink" />
          </div>

          {/* Left-Mid Col */}
          <div className="grid grid-rows-2 gap-4 md:col-span-1">
             <CanvasBlock title="Key Activities" items={canvas.keyActivities} color="blue" />
             <CanvasBlock title="Key Resources" items={canvas.keyResources} color="blue" />
          </div>

          {/* Center Col */}
          <div className="md:col-span-1">
             <CanvasBlock title="Value Propositions" items={canvas.valuePropositions} color="green" className="h-full border-neon-green shadow-neon-green border-opacity-30" />
          </div>

          {/* Right-Mid Col */}
          <div className="grid grid-rows-2 gap-4 md:col-span-1">
             <CanvasBlock title="Customer Relationships" items={canvas.customerRelationships} color="blue" />
             <CanvasBlock title="Channels" items={canvas.channels} color="blue" />
          </div>

           {/* Right Col */}
           <div className="grid grid-rows-2 gap-4 md:col-span-1">
             <CanvasBlock title="Customer Segments" items={canvas.customerSegments} color="purple" />
             <CanvasBlock title="Revenue Streams" items={canvas.revenueStreams} color="pink" />
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200 selection:bg-neon-pink selection:text-white relative overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue rounded-full opacity-5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-purple rounded-full opacity-5 blur-[120px]"></div>
      </div>

      <div className="relative z-10">
        {appState === AppState.SELECT_INDUSTRY && renderIndustrySelection()}
        
        {appState === AppState.USER_PROFILE && renderUserProfile()}

        {(appState === AppState.LOADING_IDEAS || appState === AppState.LOADING_PROFILE_IDEAS) && (
          <LoadingScan text={
            appState === AppState.LOADING_PROFILE_IDEAS 
            ? "Analyzing Profile & Matching Technology..." 
            : `Scanning Global Markets for ${selectedIndustry?.name}...`
          } />
        )}
        
        {appState === AppState.SELECT_IDEA && renderIdeaSelection()}
        
        {appState === AppState.LOADING_CANVAS && (
          <LoadingScan text={`Generating Business Model Strategy...`} />
        )}
        
        {appState === AppState.VIEW_CANVAS && renderBusinessCanvas()}
      </div>
    </div>
  );
};

export default App;