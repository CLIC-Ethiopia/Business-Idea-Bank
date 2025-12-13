import React, { useState, useEffect } from 'react';
import { NeonCard, NeonButton, NeonInput, NeonTextArea, NeonSelect, NeonText, LoadingScan } from './NeonUI';
import { User, BusinessIdea, Industry, UserProfile } from '../types';
import { INDUSTRIES } from '../constants';
import { supabase } from '../services/supabaseClient';

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
  const [dbIdeas, setDbIdeas] = useState<BusinessIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [formData, setFormData] = useState<Partial<BusinessIdea> & { rawSkills?: string, rawOperationalReqs?: string }>({
      platformSource: 'Alibaba',
      priceRange: '',
      potentialRevenue: '',
      industryId: INDUSTRIES[0].id,
      rawSkills: '',
      rawOperationalReqs: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
      fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
      setLoading(true);
      const { data, error } = await supabase
          .from('ideas')
          .select('*')
          .order('created_at', { ascending: false });

      if (data) {
          const mapped: BusinessIdea[] = data.map(item => ({
              id: item.id,
              machineName: item.machine_name,
              businessTitle: item.business_title,
              description: item.description,
              priceRange: item.price_range,
              platformSource: item.platform_source as any,
              potentialRevenue: item.potential_revenue,
              industryId: item.industry_id,
              imageUrl: item.image_url,
              skillRequirements: item.skill_requirements, // Map Supabase JSON/Array to frontend
              operationalRequirements: item.operational_requirements // Map Operational Reqs
          }));
          setDbIdeas(mapped);
      }
      setLoading(false);
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.businessTitle || !formData.machineName) return;

      const skillsArray = formData.rawSkills ? formData.rawSkills.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
      const operationalArray = formData.rawOperationalReqs ? formData.rawOperationalReqs.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];

      const payload = {
          user_id: user.id, // Admin owns this record
          machine_name: formData.machineName,
          business_title: formData.businessTitle,
          description: formData.description,
          price_range: formData.priceRange,
          platform_source: formData.platformSource,
          potential_revenue: formData.potentialRevenue,
          industry_id: formData.industryId || 'custom',
          is_saved: true, // Treat as a saved idea
          skill_requirements: skillsArray, // Save to DB
          operational_requirements: operationalArray // Save to DB
      };

      try {
          if (isEditing && formData.id) {
             const { error } = await supabase
                 .from('ideas')
                 .update(payload)
                 .eq('id', formData.id);
             if (error) throw error;
          } else {
             const { error } = await supabase
                 .from('ideas')
                 .insert(payload);
             if (error) throw error;
          }
          
          alert(isEditing ? "Idea updated successfully!" : "Idea created successfully!");
          setViewMode('list');
          setFormData({ platformSource: 'Alibaba', priceRange: '', potentialRevenue: '', industryId: INDUSTRIES[0].id, rawSkills: '', rawOperationalReqs: '' });
          setIsEditing(false);
          fetchIdeas();

      } catch (err: any) {
          console.error("Error saving idea:", err);
          alert("Error saving idea: " + err.message);
      }
  };

  const handleDelete = async (id: string) => {
      if (!window.confirm("Are you sure you want to delete this idea? This cannot be undone.")) return;
      
      try {
          const { error } = await supabase.from('ideas').delete().eq('id', id);
          if (error) throw error;
          setDbIdeas(prev => prev.filter(i => i.id !== id));
      } catch (err: any) {
          alert("Error deleting idea: " + err.message);
      }
  };

  const startEdit = (idea: BusinessIdea) => {
      setFormData({
          ...idea,
          rawSkills: idea.skillRequirements ? idea.skillRequirements.join(', ') : '',
          rawOperationalReqs: idea.operationalRequirements ? idea.operationalRequirements.join(', ') : ''
      });
      setIsEditing(true);
      setViewMode('form');
  };

  const startCreate = () => {
      setFormData({
        platformSource: 'Alibaba',
        priceRange: '',
        potentialRevenue: '',
        industryId: INDUSTRIES[0].id,
        businessTitle: '',
        machineName: '',
        description: '',
        rawSkills: '',
        rawOperationalReqs: ''
      });
      setIsEditing(false);
      setViewMode('form');
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
        <StatCard label={t.dashboard.ideasGen} value={`${dbIdeas.length}`} color="pink" />
        <StatCard label={t.dashboard.activeSessions} value="12" color="green" />
      </div>

      {/* Management Area */}
      <NeonCard color="blue" hoverEffect={false} className="min-h-[500px]">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
             <h3 className="text-xl font-bold text-neon-blue uppercase tracking-wider">
                 {viewMode === 'list' ? 'Business Idea Database' : (isEditing ? 'Edit Idea Protocol' : 'New Idea Injection')}
             </h3>
             {viewMode === 'list' ? (
                 <NeonButton color="green" onClick={startCreate} className="py-2 px-4 text-xs">
                    + {t.dashboard.addIdea}
                 </NeonButton>
             ) : (
                 <NeonButton color="pink" onClick={() => setViewMode('list')} className="py-2 px-4 text-xs">
                    Cancel Operation
                 </NeonButton>
             )}
          </div>

          {loading ? (
              <div className="flex justify-center items-center h-64">
                  <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
              </div>
          ) : viewMode === 'list' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dbIdeas.length === 0 ? (
                      <div className="col-span-full text-center text-gray-500 py-12">No ideas found in the database.</div>
                  ) : (
                      dbIdeas.map(idea => (
                          <div key={idea.id} className="bg-black/30 border border-gray-800 rounded-lg p-4 hover:border-neon-blue transition-colors flex flex-col">
                              <div className="flex justify-between items-start mb-2">
                                  <div className="text-xs text-gray-500 uppercase font-mono">{idea.industryId}</div>
                                  <div className="text-[10px] text-neon-purple border border-neon-purple px-1 rounded">{idea.platformSource}</div>
                              </div>
                              <h4 className="text-white font-bold truncate mb-1" title={idea.businessTitle}>{idea.businessTitle}</h4>
                              <div className="text-neon-blue text-xs truncate mb-2">{idea.machineName}</div>
                              <p className="text-gray-500 text-xs line-clamp-2 mb-4 flex-grow">{idea.description}</p>
                              <div className="flex gap-2 mt-auto pt-4 border-t border-gray-800/50">
                                  <button onClick={() => startEdit(idea)} className="flex-1 text-xs bg-gray-800 hover:bg-gray-700 text-white py-1 rounded transition-colors">EDIT</button>
                                  <button onClick={() => handleDelete(idea.id)} className="flex-1 text-xs bg-red-900/20 hover:bg-red-900/50 text-red-500 py-1 rounded transition-colors">DELETE</button>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          ) : (
              <form onSubmit={handleCreateOrUpdate} className="max-w-3xl mx-auto space-y-6 animate-[fadeIn_0.3s_ease-out]">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <NeonInput 
                        label={t.placeholders.ideaTitle}
                        value={formData.businessTitle || ''}
                        onChange={e => setFormData({...formData, businessTitle: e.target.value})}
                        required
                    />
                    <NeonInput 
                        label={t.placeholders.machineName}
                        value={formData.machineName || ''}
                        onChange={e => setFormData({...formData, machineName: e.target.value})}
                        required
                    />
                 </div>

                 <NeonSelect 
                    label={t.labels.industry}
                    value={formData.industryId || INDUSTRIES[0].id}
                    onChange={(e) => setFormData({...formData, industryId: e.target.value})}
                    options={[...INDUSTRIES.map(i => ({ value: i.id, label: t.industries[i.id] || i.name })), { value: 'custom', label: 'Custom / Other' }]}
                 />

                 <NeonTextArea 
                    label={t.placeholders.desc}
                    value={formData.description || ''}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    required
                    className="h-24"
                 />
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <NeonTextArea 
                        label={t.detailsSections.requirements}
                        placeholder={t.placeholders.operationalReqs}
                        value={formData.rawOperationalReqs || ''}
                        onChange={e => setFormData({...formData, rawOperationalReqs: e.target.value})}
                        className="h-20"
                    />
                    <NeonTextArea 
                        label={t.detailsSections.skillRequirements}
                        placeholder={t.placeholders.skillReqs}
                        value={formData.rawSkills || ''}
                        onChange={e => setFormData({...formData, rawSkills: e.target.value})}
                        className="h-20"
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <NeonInput 
                        label={t.investment}
                        value={formData.priceRange || ''}
                        onChange={e => setFormData({...formData, priceRange: e.target.value})}
                        placeholder="$2,000 - $5,000"
                    />
                    <NeonInput 
                        label={t.potential}
                        value={formData.potentialRevenue || ''}
                        onChange={e => setFormData({...formData, potentialRevenue: e.target.value})}
                        placeholder="$5,000/mo"
                    />
                    <NeonSelect 
                        label="Sourcing Platform"
                        value={formData.platformSource || 'Alibaba'}
                        onChange={(e) => setFormData({...formData, platformSource: e.target.value as any})}
                        options={[
                            { value: 'Alibaba', label: 'Alibaba' },
                            { value: 'Amazon', label: 'Amazon' },
                            { value: 'Global Sources', label: 'Global Sources' }
                        ]}
                    />
                 </div>

                 <div className="pt-8 flex justify-end gap-4 border-t border-gray-800">
                     <button type="button" onClick={() => setViewMode('list')} className="text-gray-400 hover:text-white uppercase text-sm font-bold tracking-widest px-6">
                        Cancel
                     </button>
                     <NeonButton type="submit" color="blue" className="px-8">
                        {isEditing ? 'Update Protocol' : 'Inject Idea'}
                     </NeonButton>
                 </div>
              </form>
          )}
      </NeonCard>
    </div>
  );
};