import React, { useState, useEffect } from 'react';
import { NeonCard, NeonButton, NeonInput, NeonTextArea, NeonSelect, NeonText, LoadingScan, NeonModal } from './NeonUI';
import { User, BusinessIdea, Industry, UserProfile, LoanApplication, CreditRiskReport, AnalyticsData, FundingMilestone, Language } from '../types';
import { INDUSTRIES } from '../constants';
import { supabase } from '../services/supabaseClient';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface UserDashboardProps {
  user: User;
  savedIdeas: BusinessIdea[];
  recommendedIdeas: BusinessIdea[];
  onViewIdea: (idea: BusinessIdea) => void;
  onGenerateRecommendations: (profile: UserProfile) => void;
  onGetFundingPlan: (idea: BusinessIdea, amount: number) => Promise<FundingMilestone[] | null>;
  isGeneratingRecs: boolean;
  t: any;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ 
  user, 
  savedIdeas, 
  recommendedIdeas, 
  onViewIdea, 
  onGenerateRecommendations,
  onGetFundingPlan,
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

  const [activeLoan, setActiveLoan] = useState<LoanApplication | null>(null);

  // Funding Wizard State
  const [fundingIdea, setFundingIdea] = useState<BusinessIdea | null>(null);
  const [fundingAmount, setFundingAmount] = useState<number>(5000);
  const [generatedMilestones, setGeneratedMilestones] = useState<FundingMilestone[] | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const handleUpdate = () => {
    onGenerateRecommendations(profile);
  };

  const openFundingWizard = (e: React.MouseEvent, idea: BusinessIdea) => {
      e.stopPropagation();
      setFundingIdea(idea);
      // Heuristic to extract number from price range string like "$2,000 - $5,000"
      const priceString = idea.priceRange.replace(/[^0-9-]/g, '');
      const parts = priceString.split('-');
      const maxPrice = parts.length > 1 ? parseInt(parts[1]) : parseInt(parts[0]);
      setFundingAmount(maxPrice || 5000);
      setGeneratedMilestones(null);
      setIsWizardOpen(true);
  };

  const handleGeneratePlan = async () => {
      if (!fundingIdea) return;
      setIsGeneratingPlan(true);
      const plan = await onGetFundingPlan(fundingIdea, fundingAmount);
      setGeneratedMilestones(plan);
      setIsGeneratingPlan(false);
  };

  const confirmFundingApplication = () => {
      if (!fundingIdea || !generatedMilestones) return;
      
      const newLoan: LoanApplication = {
          id: `LOAN-${Date.now().toString().slice(-6)}`,
          applicantName: user.name,
          businessIdea: fundingIdea,
          loanAmount: fundingAmount,
          downPayment: Math.floor(fundingAmount * 0.2), // 20% down
          creditScore: 720,
          status: 'Active',
          timestamp: Date.now(),
          milestones: generatedMilestones
      };
      
      setActiveLoan(newLoan);
      setIsWizardOpen(false);
      alert("Application sent to Lender Network. Active tracking enabled.");
  };

  const handleSubmitMilestoneProof = (mId: string) => {
      if (!activeLoan || !activeLoan.milestones) return;
      
      const updatedMilestones = activeLoan.milestones.map(m => {
          if (m.id === mId) {
              return { ...m, status: 'In Review' as const };
          }
          return m;
      });
      
      setActiveLoan({ ...activeLoan, milestones: updatedMilestones });
      alert(t.dashboard.proofSubmitted);
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
          
          {/* Active Capital Campaigns Section (Milestone Release) */}
          {activeLoan && activeLoan.milestones && (
              <div className="animate-[fadeIn_0.5s_ease-out]">
                  <h3 className="text-xl font-bold text-neon-yellow mb-4 uppercase flex items-center gap-2">
                      <span className="w-2 h-2 bg-neon-yellow rounded-full animate-pulse"></span>
                      {t.dashboard.activeFunding}
                  </h3>
                  <NeonCard color="yellow" className="flex flex-col gap-4">
                      <div className="flex justify-between items-start border-b border-gray-800 pb-4">
                          <div>
                              <h4 className="font-bold text-white text-lg">{activeLoan.businessIdea.businessTitle}</h4>
                              <p className="text-neon-yellow font-mono text-sm">{activeLoan.id}</p>
                          </div>
                          <div className="text-right">
                              <div className="text-xs text-gray-500 uppercase">Total Loan</div>
                              <div className="font-bold text-white">${activeLoan.loanAmount.toLocaleString()}</div>
                          </div>
                      </div>

                      <div className="space-y-4">
                          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.dashboard.milestoneTracker}</h5>
                          {activeLoan.milestones.map((m, i) => (
                              <div key={m.id} className={`p-4 rounded border flex flex-col md:flex-row justify-between items-center gap-4 ${
                                  m.status === 'Released' ? 'bg-green-900/10 border-green-900/50' : 
                                  m.status === 'Locked' ? 'bg-black/30 border-gray-800 opacity-50' : 'bg-gray-900/30 border-gray-700'
                              }`}>
                                  <div className="flex items-start gap-3 flex-grow">
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                          m.status === 'Released' ? 'bg-neon-green text-black' : 
                                          m.status === 'In Review' ? 'bg-neon-yellow text-black' : 'bg-gray-700 text-gray-400'
                                      }`}>
                                          {i + 1}
                                      </div>
                                      <div>
                                          <div className="text-white font-bold text-sm">{m.phaseName}</div>
                                          <div className="text-gray-400 text-xs mb-1">{m.description}</div>
                                          <div className="text-neon-yellow font-mono text-sm">${m.amount.toLocaleString()}</div>
                                      </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 min-w-[120px] justify-end">
                                      {m.status === 'Released' ? (
                                          <span className="text-neon-green text-xs font-bold uppercase border border-neon-green px-2 py-1 rounded">{t.dashboard.fundsReleased}</span>
                                      ) : m.status === 'Locked' ? (
                                          <span className="text-gray-500 text-xs font-bold uppercase"><span className="mr-1">🔒</span> Locked</span>
                                      ) : m.status === 'In Review' ? (
                                          <span className="text-neon-yellow text-xs font-bold uppercase animate-pulse">In Review</span>
                                      ) : (
                                          <button 
                                              onClick={() => handleSubmitMilestoneProof(m.id)}
                                              className="text-xs bg-neon-blue text-black font-bold uppercase px-3 py-2 rounded hover:bg-white transition-colors"
                                          >
                                              {t.dashboard.submitProof}
                                          </button>
                                      )}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </NeonCard>
              </div>
          )}

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
                      <div className="mt-auto flex gap-2">
                        <NeonButton color="purple" fullWidth onClick={() => onViewIdea(idea)} className="text-xs py-1.5">
                            {t.detailsBtn}
                        </NeonButton>
                        <button 
                            onClick={(e) => openFundingWizard(e, idea)}
                            className="bg-gray-800 hover:bg-neon-yellow hover:text-black text-neon-yellow border border-neon-yellow px-2 rounded text-xs uppercase font-bold transition-colors"
                            title={t.dashboard.requestFunding}
                        >
                            $
                        </button>
                      </div>
                   </NeonCard>
                 ))}
              </div>
            )}
          </div>

        </div>
      </div>
      
      {/* Funding Wizard Modal */}
      <NeonModal 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
        title={t.fundingWizard.title}
      >
        <div className="space-y-8 p-4">
            <div className="text-center">
                <p className="text-neon-yellow font-bold uppercase tracking-widest">{fundingIdea?.businessTitle}</p>
                <p className="text-gray-400 text-sm">{t.fundingWizard.subtitle}</p>
            </div>

            {/* Step 1: Confirm Amount */}
            <div className={`transition-opacity ${generatedMilestones ? 'opacity-50' : 'opacity-100'}`}>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-6 rounded-full bg-neon-blue text-black font-bold flex items-center justify-center text-xs">1</div>
                    <h4 className="text-white font-bold uppercase">{t.fundingWizard.step1Title}</h4>
                </div>
                <div className="ml-9">
                    <p className="text-xs text-gray-500 mb-2">{t.fundingWizard.step1Desc}</p>
                    <div className="flex items-center gap-4">
                        <label className="text-xs text-gray-400 uppercase">{t.fundingWizard.confirmAmount}:</label>
                        <input 
                            type="number" 
                            value={fundingAmount}
                            onChange={(e) => setFundingAmount(Number(e.target.value))}
                            className="bg-black border border-neon-blue rounded px-3 py-2 text-white font-mono"
                        />
                    </div>
                </div>
            </div>

            {/* Action Button: Generate */}
            {!generatedMilestones && (
                <div className="flex justify-center pt-4">
                     <NeonButton 
                        color="blue" 
                        onClick={handleGeneratePlan}
                        disabled={isGeneratingPlan}
                     >
                        {isGeneratingPlan ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                {t.fundingWizard.generating}
                            </div>
                        ) : t.fundingWizard.generatePlan}
                     </NeonButton>
                </div>
            )}

            {/* Step 2: Review Milestones */}
            {generatedMilestones && (
                <div className="animate-[fadeIn_0.5s_ease-out]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-6 h-6 rounded-full bg-neon-green text-black font-bold flex items-center justify-center text-xs">2</div>
                        <h4 className="text-white font-bold uppercase">{t.fundingWizard.reviewPlan}</h4>
                    </div>
                    
                    <div className="ml-9 space-y-3 mb-8">
                        {generatedMilestones.map((m, idx) => (
                            <div key={idx} className="bg-gray-900 border border-gray-700 p-3 rounded flex justify-between items-center">
                                <div>
                                    <div className="text-neon-green text-sm font-bold">{idx + 1}. {m.phaseName}</div>
                                    <div className="text-gray-400 text-xs">{m.description}</div>
                                </div>
                                <div className="text-white font-mono font-bold">${m.amount.toLocaleString()}</div>
                            </div>
                        ))}
                        <div className="flex justify-between items-center border-t border-gray-700 pt-2 mt-2">
                            <span className="text-gray-500 text-xs uppercase">Total</span>
                            <span className="text-neon-yellow font-bold">${generatedMilestones.reduce((acc, m) => acc + m.amount, 0).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-end">
                        <button 
                            onClick={() => setIsWizardOpen(false)}
                            className="text-gray-500 hover:text-white uppercase font-bold text-xs"
                        >
                            {t.fundingWizard.cancel}
                        </button>
                        <NeonButton color="green" onClick={confirmFundingApplication}>
                            {t.fundingWizard.submitApp}
                        </NeonButton>
                    </div>
                </div>
            )}
        </div>
      </NeonModal>
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
  const [activeTab, setActiveTab] = useState<'database' | 'analytics'>('database');
  const [formData, setFormData] = useState<Partial<BusinessIdea> & { rawSkills?: string, rawOperationalReqs?: string }>({
      platformSource: 'Alibaba',
      priceRange: '',
      potentialRevenue: '',
      industryId: INDUSTRIES[0].id,
      rawSkills: '',
      rawOperationalReqs: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [liveLogs, setLiveLogs] = useState<string[]>([]);

  useEffect(() => {
      fetchIdeas();
  }, []);

  // Simulate real-time analytics data generation based on DB state or Filler
  useEffect(() => {
      if (activeTab === 'analytics') {
          // Generate Industry Distribution
          let distData: { name: string; value: number; color: string }[] = [];
          const colors = ['#00d4ff', '#ff00ff', '#0aff0a', '#bc13fe', '#f9f871', '#ff4d4d'];

          if (dbIdeas.length > 0) {
              const industryCounts: Record<string, number> = {};
              dbIdeas.forEach(idea => {
                  const ind = idea.industryId || 'custom';
                  industryCounts[ind] = (industryCounts[ind] || 0) + 1;
              });
              distData = Object.entries(industryCounts).map(([name, value], i) => ({
                  name: t.industries[name] || name,
                  value: value,
                  color: colors[i % colors.length]
              }));
          } else {
              // FILLER DATA if DB is empty (Simulating a populated system)
              distData = [
                  { name: 'Agriculture', value: 35, color: '#00d4ff' },
                  { name: 'Manufacturing', value: 25, color: '#ff00ff' },
                  { name: 'Services', value: 20, color: '#0aff0a' },
                  { name: 'Tech', value: 15, color: '#bc13fe' },
                  { name: 'Waste Mgmt', value: 5, color: '#f9f871' },
              ];
          }

          // Mock Weekly Activity (Always show robust filler for visualization)
          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          const activityData = days.map(d => ({
              name: d,
              scans: Math.floor(Math.random() * 50) + 20,
              saves: Math.floor(Math.random() * 15) + 5
          }));

          // Mock Trending Keywords
          const keywords = [
              { text: "Plastic Recycling", value: 98 },
              { text: "Vertical Farming", value: 85 },
              { text: "CNC Laser", value: 72 },
              { text: "Coffee Roaster", value: 65 },
              { text: "Drone Delivery", value: 55 },
              { text: "Solar Bakery", value: 48 },
              { text: "Mobile Car Wash", value: 42 },
              { text: "3D Printing", value: 35 }
          ];

          setAnalyticsData({
              industryDistribution: distData,
              weeklyActivity: activityData,
              trendingKeywords: keywords
          });

          // Start Live Logs Simulation
          const actions = ["scanned", "saved idea", "generated canvas", "exported PDF", "requested funding"];
          const sectors = INDUSTRIES.map(i => i.name);
          
          // Initial filler logs
          setLiveLogs([
              `[${new Date().toLocaleTimeString()}] SYSTEM_INIT: Analytics Module Online`,
              `[${new Date().toLocaleTimeString()}] NETWORK: 1,240 Nodes Connected`,
              `[${new Date().toLocaleTimeString()}] DB_SYNC: Connection Stable`
          ]);

          const interval = setInterval(() => {
              const action = actions[Math.floor(Math.random() * actions.length)];
              const sector = sectors[Math.floor(Math.random() * sectors.length)];
              const userHash = Math.random().toString(36).substring(7).toUpperCase();
              const log = `[${new Date().toLocaleTimeString()}] OPERATIVE_${userHash} ${action} in ${sector}`;
              
              setLiveLogs(prev => [log, ...prev].slice(0, 8)); // Keep last 8 logs
          }, 2000);

          return () => clearInterval(interval);
      }
  }, [activeTab, dbIdeas]);

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

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-800 pb-1">
          <button 
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2 font-bold uppercase tracking-wider text-sm transition-colors ${activeTab === 'database' ? 'text-neon-blue border-b-2 border-neon-blue' : 'text-gray-500 hover:text-white'}`}
          >
              {t.admin.tabs.database}
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-bold uppercase tracking-wider text-sm transition-colors ${activeTab === 'analytics' ? 'text-neon-pink border-b-2 border-neon-pink' : 'text-gray-500 hover:text-white'}`}
          >
              {t.admin.tabs.analytics}
          </button>
      </div>

      {activeTab === 'database' ? (
      /* Database Management Area */
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
      ) : (
      /* Global Intelligence Analytics Area */
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-[fadeIn_0.5s_ease-out]">
          
          {/* Sector Popularity (Pie Chart) */}
          <div className="lg:col-span-1">
              <NeonCard color="pink" hoverEffect={false} className="h-full">
                  <h3 className="text-neon-pink font-bold uppercase mb-4 text-sm tracking-wider border-b border-gray-800 pb-2">
                      {t.admin.analytics.sectorPop}
                  </h3>
                  <div className="h-64">
                      {analyticsData && (
                          <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                  <Pie
                                      data={analyticsData.industryDistribution}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={60}
                                      outerRadius={80}
                                      paddingAngle={5}
                                      dataKey="value"
                                  >
                                      {analyticsData.industryDistribution.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                      ))}
                                  </Pie>
                                  <Tooltip 
                                      contentStyle={{ backgroundColor: '#121212', border: '1px solid #333', borderRadius: '4px' }}
                                      itemStyle={{ color: '#fff', fontSize: '12px' }}
                                  />
                              </PieChart>
                          </ResponsiveContainer>
                      )}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      {analyticsData?.industryDistribution.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                              <span className="text-gray-400 truncate">{item.name}</span>
                          </div>
                      ))}
                  </div>
              </NeonCard>
          </div>

          {/* Activity Timeline (Area Chart) */}
          <div className="lg:col-span-2">
              <NeonCard color="blue" hoverEffect={false} className="h-full">
                  <h3 className="text-neon-blue font-bold uppercase mb-4 text-sm tracking-wider border-b border-gray-800 pb-2">
                      {t.admin.analytics.activity}
                  </h3>
                  <div className="h-64">
                      {analyticsData && (
                          <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={analyticsData.weeklyActivity}>
                                  <defs>
                                      <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8}/>
                                          <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                                      </linearGradient>
                                      <linearGradient id="colorSaves" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#bc13fe" stopOpacity={0.8}/>
                                          <stop offset="95%" stopColor="#bc13fe" stopOpacity={0}/>
                                      </linearGradient>
                                  </defs>
                                  <XAxis dataKey="name" stroke="#666" tick={{fontSize: 10}} />
                                  <YAxis stroke="#666" tick={{fontSize: 10}} />
                                  <Tooltip 
                                      contentStyle={{ backgroundColor: '#121212', border: '1px solid #333' }}
                                      labelStyle={{ color: '#aaa' }}
                                  />
                                  <Area type="monotone" dataKey="scans" stroke="#00d4ff" fillOpacity={1} fill="url(#colorScans)" name={t.admin.analytics.scans} />
                                  <Area type="monotone" dataKey="saves" stroke="#bc13fe" fillOpacity={1} fill="url(#colorSaves)" name={t.admin.analytics.saves} />
                              </AreaChart>
                          </ResponsiveContainer>
                      )}
                  </div>
              </NeonCard>
          </div>

          {/* Trending Keywords (Word Cloud Simulation) */}
          <div className="lg:col-span-2">
              <NeonCard color="green" hoverEffect={false} className="h-full">
                  <h3 className="text-neon-green font-bold uppercase mb-4 text-sm tracking-wider border-b border-gray-800 pb-2">
                      {t.admin.analytics.keywords}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                      {analyticsData?.trendingKeywords.map((kw, idx) => (
                          <div 
                              key={idx}
                              className={`
                                  px-4 py-2 rounded-full border border-gray-800 
                                  bg-gray-900/50 text-white
                                  hover:border-neon-green hover:text-neon-green hover:scale-105 transition-all cursor-default
                              `}
                              style={{ 
                                  fontSize: `${Math.max(0.8, kw.value / 40)}rem`,
                                  opacity: Math.max(0.5, kw.value / 100)
                              }}
                          >
                              {kw.text}
                          </div>
                      ))}
                  </div>
              </NeonCard>
          </div>

          {/* Live Live Logs */}
          <div className="lg:col-span-1">
              <NeonCard color="purple" hoverEffect={false} className="h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      <h3 className="text-white font-bold uppercase text-sm tracking-wider">
                          {t.admin.analytics.liveLog}
                      </h3>
                  </div>
                  <div className="flex-grow overflow-hidden relative">
                      <div className="space-y-2">
                          {liveLogs.map((log, idx) => (
                              <div key={idx} className="text-[10px] font-mono text-neon-blue truncate animate-[fadeIn_0.3s_ease-out]">
                                  {log}
                              </div>
                          ))}
                      </div>
                      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-dark-card to-transparent pointer-events-none"></div>
                  </div>
              </NeonCard>
          </div>

      </div>
      )}
    </div>
  );
};

interface LenderDashboardProps {
    user: User;
    onAnalyze: (application: LoanApplication) => Promise<CreditRiskReport | null>;
    t: any;
}

export const LenderDashboard: React.FC<LenderDashboardProps> = ({ user, onAnalyze, t }) => {
    // Mock Data for Applications
    const [applications, setApplications] = useState<LoanApplication[]>([
        {
            id: 'app-001',
            applicantName: 'Sarah Connor',
            businessIdea: {
                id: 'idea-1',
                machineName: 'Industrial Laser Cutter 150W',
                businessTitle: 'Custom Metal Fabrication Shop',
                description: 'Using a high-power laser cutter to create custom signage, parts, and decor. High margin potential with local businesses.',
                priceRange: '$4,500 - $6,000',
                platformSource: 'Alibaba',
                potentialRevenue: '$8,000/month',
                operationalRequirements: ['3-phase power', 'Ventilation', 'Industrial Zone'],
            },
            loanAmount: 8500,
            downPayment: 1500,
            creditScore: 720,
            status: 'Pending',
            timestamp: Date.now() - 86400000
        },
        {
            id: 'app-002',
            applicantName: 'John Wick',
            businessIdea: {
                id: 'idea-2',
                machineName: 'Mobile Concrete Mixer Truck (Mini)',
                businessTitle: 'Rapid Response Concrete Service',
                description: 'Small batch concrete delivery for residential projects. Fills a gap left by large mix trucks.',
                priceRange: '$12,000 - $18,000',
                platformSource: 'Global Sources',
                potentialRevenue: '$15,000/month',
                operationalRequirements: ['CDL License', 'Parking Yard', 'Water Source'],
            },
            loanAmount: 16000,
            downPayment: 4000,
            creditScore: 650,
            status: 'Pending',
            timestamp: Date.now() - 3600000
        }
    ]);

    const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
    const [report, setReport] = useState<CreditRiskReport | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSelect = (app: LoanApplication) => {
        setSelectedApp(app);
        setReport(null); // Reset report when selecting new app
    };

    const handleAnalyze = async () => {
        if (!selectedApp) return;
        setLoading(true);
        const result = await onAnalyze(selectedApp);
        setReport(result);
        setLoading(false);
    };

    const handleApproveWithMilestones = () => {
        if (!selectedApp) return;
        
        const newMilestones: FundingMilestone[] = [
            {
                id: 'm1',
                phaseName: 'Phase 1: Procurement',
                description: 'Initial machine purchase',
                amount: Math.floor(selectedApp.loanAmount * 0.4),
                status: 'Released'
            },
            {
                id: 'm2',
                phaseName: 'Phase 2: Operations',
                description: 'Site setup and licensing',
                amount: Math.floor(selectedApp.loanAmount * 0.4),
                status: 'Pending'
            },
            {
                id: 'm3',
                phaseName: 'Phase 3: Growth',
                description: 'Marketing and scaling',
                amount: Math.ceil(selectedApp.loanAmount * 0.2),
                status: 'Locked'
            }
        ];

        const updatedApp = { 
            ...selectedApp, 
            status: 'Approved' as const, 
            milestones: newMilestones 
        };

        setApplications(prev => prev.map(a => a.id === selectedApp.id ? updatedApp : a));
        setSelectedApp(updatedApp);
        setReport(null); // Clear report to show milestone view
    };

    const handleReleaseFund = (mId: string) => {
        if (!selectedApp || !selectedApp.milestones) return;

        const updatedMilestones = selectedApp.milestones.map(m => {
            if (m.id === mId) return { ...m, status: 'Released' as const };
            if (m.id === 'm2' && mId === 'm1') return { ...m, status: 'Pending' as const }; // Unlock next
            if (m.id === 'm3' && mId === 'm2') return { ...m, status: 'Pending' as const }; // Unlock next
            return m;
        });

        const updatedApp = { ...selectedApp, milestones: updatedMilestones };
        setApplications(prev => prev.map(a => a.id === selectedApp.id ? updatedApp : a));
        setSelectedApp(updatedApp);
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-neon-yellow mb-2 tracking-widest">{t.lender.dashboardTitle}</h2>
                    <p className="text-gray-400 font-mono text-sm">{t.dashboard.welcome(user.name)} | {t.lender.queue}: {applications.length}</p>
                </div>
                <div className="text-right">
                    <div className="text-xs text-neon-yellow border border-neon-yellow px-2 py-1 rounded font-bold uppercase">Authorized Access Only</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: List */}
                <div className="lg:col-span-4 space-y-4">
                    {applications.length === 0 ? (
                        <div className="text-gray-500 italic p-4 border border-dashed border-gray-800 rounded">{t.lender.emptyQueue}</div>
                    ) : (
                        applications.map(app => (
                            <div 
                                key={app.id} 
                                onClick={() => handleSelect(app)}
                                className={`p-4 rounded border cursor-pointer transition-all ${selectedApp?.id === app.id ? 'bg-neon-yellow/10 border-neon-yellow' : 'bg-dark-card border-gray-800 hover:border-gray-600'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-neon-yellow font-bold text-sm">{app.id}</span>
                                    <span className="text-[10px] text-gray-500">{new Date(app.timestamp).toLocaleDateString()}</span>
                                </div>
                                <h4 className="text-white font-bold mb-1">{app.applicantName}</h4>
                                <div className="text-xs text-gray-400 mb-2">{app.businessIdea.businessTitle}</div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">{t.lender.requested}:</span>
                                    <span className="text-white font-mono">${app.loanAmount.toLocaleString()}</span>
                                </div>
                                {app.status === 'Approved' && (
                                    <div className="mt-2 text-center text-[10px] bg-green-500 text-black font-bold uppercase rounded">Approved</div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Right Column: Detail & Analysis */}
                <div className="lg:col-span-8">
                    {selectedApp ? (
                        <NeonCard color="yellow" hoverEffect={false} className="h-full">
                            <div className="flex justify-between items-start mb-6 border-b border-gray-800 pb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-1">{selectedApp.applicantName}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <span>Credit Score: <span className="text-neon-yellow font-bold">{selectedApp.creditScore}</span></span>
                                        <span>|</span>
                                        <span>Down Payment: <span className="text-white font-bold">${selectedApp.downPayment.toLocaleString()}</span></span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-500 uppercase">Loan Amount</div>
                                    <div className="text-3xl font-bold text-neon-yellow">${selectedApp.loanAmount.toLocaleString()}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-black/30 p-4 rounded border border-gray-800">
                                    <h4 className="text-neon-blue text-xs font-bold uppercase mb-2">Business Asset</h4>
                                    <p className="text-white font-bold mb-1">{selectedApp.businessIdea.businessTitle}</p>
                                    <p className="text-gray-400 text-xs mb-2">{selectedApp.businessIdea.machineName}</p>
                                    <p className="text-gray-500 text-xs leading-relaxed">{selectedApp.businessIdea.description}</p>
                                </div>
                                
                                {selectedApp.status === 'Approved' && selectedApp.milestones ? (
                                    <div className="flex flex-col justify-center items-center p-4 bg-green-900/20 border border-green-900 rounded">
                                        <h4 className="text-green-500 font-bold uppercase text-sm mb-2">Loan Active</h4>
                                        <p className="text-xs text-gray-400 text-center">Funds are distributed according to the milestone plan.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col justify-center items-center">
                                        {!report ? (
                                            <NeonButton color="yellow" onClick={handleAnalyze} disabled={loading} className="w-full h-full flex flex-col items-center justify-center gap-2">
                                                {loading ? (
                                                    <>
                                                        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                                        <span>{t.loading.riskReport}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-2xl">⚡</span>
                                                        <span>{t.lender.analyzeBtn}</span>
                                                    </>
                                                )}
                                            </NeonButton>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-neon-yellow/5 border border-neon-yellow/30 rounded text-center">
                                                <div className="text-xs text-neon-yellow uppercase font-bold mb-1">{t.lender.score}</div>
                                                <div className="text-5xl font-bold text-white mb-2">{report.score}</div>
                                                <div className={`text-sm font-bold px-3 py-1 rounded uppercase ${
                                                    report.verdict === 'Approved' ? 'bg-green-500 text-black' : 
                                                    report.verdict === 'Conditional' ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'
                                                }`}>
                                                    {report.verdict}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Risk Report View */}
                            {report && selectedApp.status !== 'Approved' && (
                                <div className="animate-[fadeIn_0.5s_ease-out] space-y-6 border-t border-gray-800 pt-6">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                        <div className="bg-black/40 p-2 rounded">
                                            <div className="text-[10px] text-gray-500 uppercase">Risk Level</div>
                                            <div className="font-bold text-white">{report.riskLevel}</div>
                                        </div>
                                        <div className="bg-black/40 p-2 rounded">
                                            <div className="text-[10px] text-gray-500 uppercase">DSCR</div>
                                            <div className="font-bold text-neon-yellow">{report.dscr}x</div>
                                        </div>
                                        <div className="bg-black/40 p-2 rounded">
                                            <div className="text-[10px] text-gray-500 uppercase">LTV</div>
                                            <div className="font-bold text-neon-yellow">{report.ltv}%</div>
                                        </div>
                                        <div className="bg-black/40 p-2 rounded">
                                            <div className="text-[10px] text-gray-500 uppercase">{t.lender.maxLoan}</div>
                                            <div className="font-bold text-white">${report.maxLoanAmount.toLocaleString()}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-green-500 text-xs font-bold uppercase mb-2">{t.lender.strengths}</h4>
                                            <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                                                {report.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-red-500 text-xs font-bold uppercase mb-2">{t.lender.weaknesses}</h4>
                                            <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                                                {report.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                            </ul>
                                        </div>
                                    </div>

                                    {report.stipulations.length > 0 && (
                                        <div className="bg-yellow-900/20 border border-yellow-900/50 p-4 rounded">
                                            <h4 className="text-yellow-500 text-xs font-bold uppercase mb-2">{t.lender.stipulations}</h4>
                                            <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                                                {report.stipulations.map((s, i) => <li key={i}>{s}</li>)}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="text-center pt-4">
                                        <NeonButton color="green" onClick={handleApproveWithMilestones}>
                                            {t.lender.constructMilestones}
                                        </NeonButton>
                                    </div>
                                </div>
                            )}

                            {/* Milestone View (For Approved Apps) */}
                            {selectedApp.status === 'Approved' && selectedApp.milestones && (
                                <div className="animate-[fadeIn_0.5s_ease-out] space-y-4 border-t border-gray-800 pt-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-neon-yellow text-sm font-bold uppercase">{t.lender.milestonePlan}</h4>
                                        <span className="text-xs text-gray-500">Total Released: ${selectedApp.milestones.filter(m => m.status === 'Released').reduce((acc, m) => acc + m.amount, 0).toLocaleString()}</span>
                                    </div>
                                    
                                    {selectedApp.milestones.map((m, i) => (
                                        <div key={m.id} className="bg-black/30 border border-gray-800 rounded p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                                            <div className="flex items-start gap-3 flex-grow">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                                    m.status === 'Released' ? 'bg-neon-green text-black' : 'bg-gray-800 text-gray-400'
                                                }`}>
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold">{m.phaseName}</div>
                                                    <div className="text-xs text-gray-400">{m.description}</div>
                                                    <div className="text-neon-yellow font-mono text-sm mt-1">${m.amount.toLocaleString()}</div>
                                                </div>
                                            </div>
                                            <div>
                                                {m.status === 'Released' ? (
                                                    <div className="text-neon-green text-xs font-bold uppercase border border-neon-green px-3 py-1 rounded">Funds Released</div>
                                                ) : m.status === 'Locked' ? (
                                                    <div className="text-gray-600 text-xs font-bold uppercase flex items-center gap-1"><span className="text-base">🔒</span> Locked</div>
                                                ) : (
                                                    <NeonButton color="green" onClick={() => handleReleaseFund(m.id)} className="text-xs py-2 px-4">
                                                        {t.lender.release}
                                                    </NeonButton>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </NeonCard>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500 border border-dashed border-gray-800 rounded">
                            Select an application to view details
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};