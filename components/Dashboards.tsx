import React, { useState } from 'react';
import { NeonCard, NeonButton, NeonInput, NeonTextArea, NeonSelect, NeonText } from './NeonUI';
import { User, BusinessIdea, Industry, UserProfile } from '../types';
import { INDUSTRIES } from '../constants';

interface UserDashboardProps {
  user: User;
  savedIdeas: BusinessIdea[];
  recommendedIdeas: BusinessIdea[];
  onViewIdea: (idea: BusinessIdea) => void;
  onGenerateRecommendations: (profile: UserProfile) => void;
  isGeneratingRecs: boolean;
  t: any;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ 
  user, 
  savedIdeas, 
  recommendedIdeas, 
  onViewIdea, 
  onGenerateRecommendations,
  isGeneratingRecs,
  t 
}) => {
  const [profile, setProfile] = useState<UserProfile>(user.profile || {
    name: user.name,
    budget: '$1,000 - $5,000',
    skills: '',
    interests: '',
    education: '',
    experience: '',
    riskTolerance: 'Medium',
    timeCommitment: 'Part-time'
  });

  const handleUpdate = () => {
    onGenerateRecommendations(profile);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
         <h2 className="text-3xl font-bold text-white mb-2">{t.dashboard.title}</h2>
         <p className="text-neon-blue font-mono">{t.dashboard.welcome(user.name)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile Details (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
           <NeonCard color="green" className="h-full" hoverEffect={false}>
             <h3 className="text-xl font-bold text-white mb-4 uppercase border-b border-gray-800 pb-2">
               {t.dashboard.profileSection}
             </h3>
             <div className="space-y-4">
                <NeonInput 
                  label={t.dashboard.education} 
                  placeholder={t.placeholders.education}
                  value={profile.education || ''}
                  onChange={(e) => setProfile({...profile, education: e.target.value})}
                />
                <NeonTextArea 
                  label={t.dashboard.experience}
                  placeholder={t.placeholders.experience}
                  value={profile.experience || ''}
                  onChange={(e) => setProfile({...profile, experience: e.target.value})}
                />
                <NeonTextArea 
                  label={t.labels.skills}
                  placeholder={t.placeholders.skills}
                  value={profile.skills}
                  onChange={(e) => setProfile({...profile, skills: e.target.value})}
                />
                <NeonTextArea 
                  label={t.labels.interests}
                  placeholder={t.placeholders.interests}
                  value={profile.interests}
                  onChange={(e) => setProfile({...profile, interests: e.target.value})}
                />
                
                <div className="grid grid-cols-2 gap-2">
                   <NeonSelect 
                      label={t.labels.budget}
                      options={Object.entries(t.options.budget).map(([k, v]) => ({ value: k, label: v as string }))}
                      value={profile.budget}
                      onChange={(e) => setProfile({...profile, budget: e.target.value})}
                   />
                   <NeonSelect 
                      label={t.labels.time}
                      options={Object.entries(t.options.time).map(([k, v]) => ({ value: k, label: v as string }))}
                      value={profile.timeCommitment}
                      onChange={(e) => setProfile({...profile, timeCommitment: e.target.value as any})}
                   />
                </div>

                <div className="pt-4">
                  <NeonButton fullWidth color="green" onClick={handleUpdate} disabled={isGeneratingRecs}>
                    {isGeneratingRecs ? 'Analyzing...' : t.dashboard.updateBtn}
                  </NeonButton>
                </div>
             </div>
           </NeonCard>
        </div>

        {/* Right Column: Recommendations & Saved (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Recommendations Section */}
          <div>
            <h3 className="text-xl font-bold text-neon-pink mb-4 uppercase flex items-center gap-2">
               <span className="w-2 h-2 bg-neon-pink rounded-full animate-pulse"></span>
               {t.dashboard.recommended}
            </h3>
            {isGeneratingRecs ? (
               <div className="h-48 flex items-center justify-center border border-gray-800 rounded-xl bg-dark-card">
                 <span className="text-neon-pink animate-pulse">{t.dashboard.scanningRecs}</span>
               </div>
            ) : recommendedIdeas.length === 0 ? (
               <div className="h-48 flex flex-col items-center justify-center border border-dashed border-gray-800 rounded-xl bg-dark-card text-gray-500">
                  <p className="mb-2">{t.dashboard.updateProfileHint}</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {recommendedIdeas.map((idea, idx) => (
                    <NeonCard key={`rec-${idx}`} color="pink" className="flex flex-col">
                       <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-white text-md">{idea.businessTitle}</h4>
                          <span className="text-[10px] bg-neon-pink text-white px-1.5 py-0.5 rounded uppercase">{t.dashboard.recTag}</span>
                       </div>
                       <p className="text-neon-blue text-xs mb-2">{idea.machineName}</p>
                       <p className="text-gray-400 text-xs mb-3 line-clamp-2">{idea.description}</p>
                       <NeonButton color="pink" fullWidth onClick={() => onViewIdea(idea)} className="mt-auto text-xs py-1.5">
                          {t.detailsBtn}
                       </NeonButton>
                    </NeonCard>
                 ))}
               </div>
            )}
          </div>

          {/* Saved Ideas Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 uppercase border-b border-gray-800 pb-2">
               {t.dashboard.savedIdeas}
            </h3>
            {savedIdeas.length === 0 ? (
              <div className="text-gray-500 italic py-8 text-center border border-dashed border-gray-800 rounded">
                  {t.dashboard.noSaved}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {savedIdeas.map((idea, idx) => (
                   <NeonCard key={idx} color="purple" className="flex flex-col h-full">
                      <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-white text-md">{idea.businessTitle}</h4>
                          <span className="text-xs bg-neon-purple text-black px-2 py-0.5 rounded font-bold">
                              {idea.platformSource}
                          </span>
                      </div>
                      <p className="text-neon-blue text-xs mb-2">{idea.machineName}</p>
                      <p className="text-gray-400 text-xs mb-3 line-clamp-2">{idea.description}</p>
                      <NeonButton color="purple" fullWidth onClick={() => onViewIdea(idea)} className="mt-auto text-xs py-1.5">
                          {t.detailsBtn}
                      </NeonButton>
                   </NeonCard>
                 ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

interface AdminDashboardProps {
    user: User;
    onAddIdea: (idea: BusinessIdea) => void;
    t: any;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onAddIdea, t }) => {
  const [newIdea, setNewIdea] = useState<Partial<BusinessIdea>>({
      platformSource: 'Alibaba',
      priceRange: '',
      potentialRevenue: ''
  });
  const [industry, setIndustry] = useState(INDUSTRIES[0].id);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (newIdea.businessTitle && newIdea.machineName && newIdea.description) {
          onAddIdea({
              id: `custom-${Date.now()}`,
              businessTitle: newIdea.businessTitle,
              machineName: newIdea.machineName,
              description: newIdea.description,
              priceRange: newIdea.priceRange || '$1,000 - $5,000',
              potentialRevenue: newIdea.potentialRevenue || '$5,000/mo',
              platformSource: newIdea.platformSource as any,
              industryId: industry
          } as BusinessIdea);
          // Reset
          setNewIdea({ platformSource: 'Alibaba', priceRange: '', potentialRevenue: '' });
          alert("Idea added to Bank!");
      }
  };

  const StatCard = ({ label, value, color }: { label: string, value: string, color: 'blue'|'pink'|'green' }) => (
      <NeonCard color={color} hoverEffect={false} className="text-center py-6">
          <div className="text-4xl font-bold text-white mb-2 font-orbitron">{value}</div>
          <div className="text-xs uppercase tracking-widest text-gray-400">{label}</div>
      </NeonCard>
  )

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="mb-8 flex justify-between items-end">
         <div>
            <h2 className="text-3xl font-bold text-white mb-2">ADMIN {t.dashboard.title}</h2>
            <p className="text-neon-green font-mono">{t.dashboard.welcome(user.name)}</p>
         </div>
         <div className="text-xs text-gray-500 font-mono">SYS.VER.2.4.9</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard label={t.dashboard.totalUsers} value="1,240" color="blue" />
        <StatCard label={t.dashboard.ideasGen} value="45.2K" color="pink" />
        <StatCard label={t.dashboard.activeSessions} value="12" color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-neon-blue mb-4 uppercase">{t.dashboard.addIdea}</h3>
            <NeonCard color="blue" hoverEffect={false}>
                <form onSubmit={handleSubmit}>
                    <NeonSelect 
                        label={t.labels.industry}
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        options={INDUSTRIES.map(i => ({ value: i.id, label: t.industries[i.id] || i.name }))}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <NeonInput 
                            label={t.placeholders.ideaTitle}
                            value={newIdea.businessTitle || ''}
                            onChange={e => setNewIdea({...newIdea, businessTitle: e.target.value})}
                            required
                        />
                        <NeonInput 
                            label={t.placeholders.machineName}
                            value={newIdea.machineName || ''}
                            onChange={e => setNewIdea({...newIdea, machineName: e.target.value})}
                            required
                        />
                    </div>
                    <NeonTextArea 
                        label={t.placeholders.desc}
                        value={newIdea.description || ''}
                        onChange={e => setNewIdea({...newIdea, description: e.target.value})}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <NeonInput 
                            label={t.investment}
                            value={newIdea.priceRange || ''}
                            onChange={e => setNewIdea({...newIdea, priceRange: e.target.value})}
                            placeholder={t.placeholders.price}
                        />
                         <NeonInput 
                            label={t.potential}
                            value={newIdea.potentialRevenue || ''}
                            onChange={e => setNewIdea({...newIdea, potentialRevenue: e.target.value})}
                            placeholder={t.placeholders.revenue}
                        />
                    </div>
                    <div className="mt-4">
                        <NeonButton type="submit" fullWidth color="blue">{t.dashboard.createBtn}</NeonButton>
                    </div>
                </form>
            </NeonCard>
          </div>
          
          <div className="opacity-50 pointer-events-none">
             {/* Placeholder for future charts/logs */}
             <h3 className="text-xl font-bold text-gray-500 mb-4 uppercase">{t.dashboard.systemLogs}</h3>
             <div className="bg-dark-card border border-gray-800 rounded-xl p-4 h-[400px] overflow-hidden font-mono text-xs text-green-900/50">
                {Array.from({length: 20}).map((_, i) => (
                    <div key={i} className="mb-2">> [SYSTEM] Generating node map for user_session_{Math.floor(Math.random()*1000)}... OK</div>
                ))}
             </div>
          </div>
      </div>
    </div>
  );
};