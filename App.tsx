import React, { useState, useEffect } from 'react';
import { INDUSTRIES } from './constants';
import { NeonCard, NeonButton, NeonInput, NeonTextArea, NeonSelect, LoadingScan, NeonModal } from './components/NeonUI';
import { generateIdeas, generateCanvas, generatePersonalizedIdeas, generateBusinessDetails, generateStressTest, generateFinancialEstimates, generateRoadmap, findMachineSuppliers, generateCreditRiskReport, generatePitchDeck, generateFundingMilestones } from './services/geminiService';
import { Industry, BusinessIdea, BusinessCanvas, AppState, UserProfile, Language, BusinessDetails, User, CommunityPost, StressTestAnalysis, FinancialEstimates, Roadmap, SourcingLink, LoanApplication, CreditRiskReport, PitchDeck, FundingMilestone } from './types';
import { TRANSLATIONS } from './locales';
import { Auth } from './components/Auth';
import { UserDashboard, AdminDashboard, LenderDashboard } from './components/Dashboards';
import { Community } from './components/Community';
import { About } from './components/About';
import { SimulationMode } from './components/SimulationMode';
import { supabase } from './services/supabaseClient';
import { ChatWidget } from './components/ChatWidget';
// @ts-ignore
import html2canvas from 'html2canvas';
// @ts-ignore
import { jsPDF } from 'jspdf';

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

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AdminIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const CommunityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const BankIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
);

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.LOGIN);
  const [language, setLanguage] = useState<Language>('en');
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [sortMethod, setSortMethod] = useState<'newest' | 'upvotes'>('newest');
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);
  const [canvas, setCanvas] = useState<BusinessCanvas | null>(null);
  const [canvasTheme, setCanvasTheme] = useState<'neon' | 'corporate'>('neon');
  const [error, setError] = useState<string | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Database State
  const [savedIdeas, setSavedIdeas] = useState<BusinessIdea[]>([]);
  const [customIdeas, setCustomIdeas] = useState<BusinessIdea[]>([]);
  
  // Community Posts State
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([
      {
          id: '1',
          userId: 'user_1',
          userName: 'CyberPunk_77',
          content: 'Has anyone found success sourcing the PET Plastic Recycling line from Alibaba? Shipping costs to West Africa seem high.',
          industryId: 'waste',
          likes: 12,
          comments: 3,
          timestamp: Date.now() - 3600000 
      },
      {
          id: '2',
          userId: 'user_2',
          userName: 'NeoFarmer',
          content: 'Looking for a partner to invest in a Hydroponic Vertical Farm unit. I have the space, need capital for the machine.',
          industryId: 'agri',
          likes: 8,
          comments: 1,
          timestamp: Date.now() - 7200000 
      },
       {
          id: '3',
          userId: 'user_3',
          userName: 'TechnoMage',
          content: 'The small scale CNC machine for jewelry making is a gold mine. ROI in 3 months.',
          industryId: 'heavy_mfg',
          likes: 24,
          comments: 6,
          timestamp: Date.now() - 86400000
      }
  ]);

  // Dashboard Recommendation State
  const [recommendedIdeas, setRecommendedIdeas] = useState<BusinessIdea[]>([]);
  const [isGeneratingRecs, setIsGeneratingRecs] = useState(false);

  // Details Modal State
  const [detailIdea, setDetailIdea] = useState<BusinessIdea | null>(null);
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // Stress Test & ROI & Supplier & Pitch Deck State
  const [activeDetailTab, setActiveDetailTab] = useState<'blueprint' | 'stress_test' | 'roi' | 'roadmap' | 'supplier' | 'pitch_deck'>('blueprint');
  const [stressTestResult, setStressTestResult] = useState<StressTestAnalysis | null>(null);
  const [loadingStressTest, setLoadingStressTest] = useState(false);
  
  // Financial Calculator State
  const [financials, setFinancials] = useState<FinancialEstimates | null>(null);
  const [loadingFinancials, setLoadingFinancials] = useState(false);
  // Landed Cost State
  const [landedCost, setLandedCost] = useState({
      shipping: 500,
      customs: 15,
      vat: 15,
      fees: 200,
      enabled: false
  });
  
  // Roadmap State
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [roadmapProgress, setRoadmapProgress] = useState<Record<string, boolean>>({});
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);

  // Supplier Links State
  const [sourcingLinks, setSourcingLinks] = useState<SourcingLink[] | null>(null);
  const [loadingSourcing, setLoadingSourcing] = useState(false);

  // Pitch Deck State
  const [pitchDeck, setPitchDeck] = useState<PitchDeck | null>(null);
  const [loadingPitchDeck, setLoadingPitchDeck] = useState(false);
  const [isDownloadingDeck, setIsDownloadingDeck] = useState(false);

  // User Profile State (for idea generation wizard)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    budget: '$1,000 - $5,000',
    skills: '',
    interests: '',
    education: '',
    experience: '',
    riskTolerance: 'Medium',
    timeCommitment: 'Part-time'
  });

  const t = TRANSLATIONS[language];

  // 1. Initialize Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoadingSession(false);
      if (session) {
        handleUserSession(session.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        handleUserSession(session.user);
      } else {
        // Only reset if we are NOT in guest mode
        // If we are guest, currentUser.id will be 'guest'
        setCurrentUser(prev => prev?.id === 'guest' ? prev : null);
        if (currentUser?.id !== 'guest') {
             setAppState(AppState.LOGIN);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGuestLogin = (role: 'admin' | 'lender' | 'student' = 'admin') => {
      const emailPrefix = role === 'lender' ? 'lender' : role === 'student' ? 'student' : 'guest';
      const name = role === 'lender' ? 'Credit Officer' : role === 'student' ? 'Cadet' : 'Guest Operative';
      
      const guestUser: User = {
          id: 'guest',
          email: `${emailPrefix}@fadlab.com`,
          name: name,
          role: role, 
          profile: {
            name: name,
            budget: '$1,000 - $5,000',
            skills: '',
            interests: '',
            education: '',
            experience: '',
            riskTolerance: 'Medium',
            timeCommitment: 'Part-time'
          }
      };
      setCurrentUser(guestUser);
      setUserProfile(guestUser.profile!);
      
      // Route based on role
      if (role === 'lender') setAppState(AppState.LENDER_DASHBOARD);
      else if (role === 'student') setAppState(AppState.SIMULATION_MODE);
      else setAppState(AppState.SELECT_INDUSTRY);
  };

  // 2. Fetch Profile & Saved Ideas when Session Exists
  const handleUserSession = async (authUser: any) => {
    // Fetch Profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    let finalProfile: UserProfile;

    if (profileData) {
      finalProfile = {
        name: profileData.name || authUser.email,
        budget: profileData.budget || '$1,000 - $5,000',
        skills: profileData.skills || '',
        interests: profileData.interests || '',
        education: profileData.education || '',
        experience: profileData.experience || '',
        riskTolerance: (profileData.risk_tolerance as any) || 'Medium',
        timeCommitment: (profileData.time_commitment as any) || 'Part-time',
      };
    } else {
      // Create default if missing (Trigger handles this usually, but fallback here)
      finalProfile = {
         name: authUser.user_metadata.name || authUser.email,
         budget: '$1,000 - $5,000',
         skills: '',
         interests: '',
         education: '',
         experience: '',
         riskTolerance: 'Medium',
         timeCommitment: 'Part-time'
      };
    }

    // Auto-detect admin role from email for simplicity
    const role = authUser.email?.toLowerCase().includes('admin') ? 'admin' : 'user';

    setCurrentUser({
      id: authUser.id,
      email: authUser.email,
      name: finalProfile.name,
      role: role, 
      profile: finalProfile
    });
    
    // Update local profile state
    setUserProfile(finalProfile);

    // Fetch Saved Ideas
    fetchSavedIdeas(authUser.id);

    // Move to selection screen if we were in login
    setAppState((prev) => prev === AppState.LOGIN ? AppState.SELECT_INDUSTRY : prev);
  };

  const fetchSavedIdeas = async (userId: string) => {
    if (userId === 'guest') {
        // Guest doesn't fetch from DB
        return;
    }

    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .eq('user_id', userId)
      .eq('is_saved', true)
      .order('created_at', { ascending: false });

    if (data) {
       // Map DB keys to frontend keys
       const mappedIdeas: BusinessIdea[] = data.map(item => ({
          id: item.id,
          machineName: item.machine_name,
          businessTitle: item.business_title,
          description: item.description,
          priceRange: item.price_range,
          platformSource: item.platform_source as any,
          potentialRevenue: item.potential_revenue,
          industryId: item.industry_id,
          skillRequirements: item.skill_requirements, // Map skills
          operationalRequirements: item.operational_requirements // Map Operational Reqs
       }));
       setSavedIdeas(mappedIdeas);
    }
  };

  const handleLogout = async () => {
      if (currentUser?.id !== 'guest') {
          await supabase.auth.signOut();
      }
      setCurrentUser(null);
      setAppState(AppState.LOGIN);
      reset();
  };

  const handleSaveIdea = async (idea: BusinessIdea) => {
      if (!currentUser) return;
      
      // Check if already saved in local state to avoid DB spam
      if (savedIdeas.find(i => i.businessTitle === idea.businessTitle)) return;

      if (currentUser.id === 'guest') {
          // Guest mode: Save to local state only
          setSavedIdeas(prev => [idea, ...prev]);
          alert("Idea saved locally (Guest Mode)");
          return;
      }

      const { data, error } = await supabase
        .from('ideas')
        .insert({
           user_id: currentUser.id,
           machine_name: idea.machineName,
           business_title: idea.businessTitle,
           description: idea.description,
           price_range: idea.priceRange,
           platform_source: idea.platformSource,
           potential_revenue: idea.potentialRevenue,
           industry_id: selectedIndustry?.id || 'custom',
           is_saved: true,
           skill_requirements: idea.skillRequirements || [], // Save skills if present
           operational_requirements: idea.operationalRequirements || [] // Save Operational Reqs
        })
        .select()
        .single();

      if (data) {
         setSavedIdeas(prev => [idea, ...prev]);
         // Also update ideas list to mark potential matches if needed
      } else if (error) {
         console.error("Error saving idea:", error);
         alert("Could not save to database.");
      }
  };

  const handleUpvote = (idea: BusinessIdea) => {
      // Optimistic update for the ideas list
      setIdeas(prev => prev.map(i => {
          if (i.businessTitle === idea.businessTitle) {
              const wasUpvoted = i.isUpvoted;
              return {
                  ...i,
                  upvotes: (i.upvotes || 0) + (wasUpvoted ? -1 : 1),
                  isUpvoted: !wasUpvoted
              };
          }
          return i;
      }));

      // Optimistic update for saved ideas
      setSavedIdeas(prev => prev.map(i => {
          if (i.id === idea.id) {
              const wasUpvoted = i.isUpvoted;
              return {
                  ...i,
                  upvotes: (i.upvotes || 0) + (wasUpvoted ? -1 : 1),
                  isUpvoted: !wasUpvoted
              };
          }
          return i;
      }));
  };

  const handleAdminAddIdea = (idea: BusinessIdea) => {
      setCustomIdeas(prev => [idea, ...prev]);
  };

  const handleGenerateRecommendations = async (profile: UserProfile) => {
      if (!currentUser) return;
      
      setUserProfile(profile);
      setCurrentUser({ ...currentUser, profile });

      if (currentUser.id !== 'guest') {
        // Save profile updates to DB
        await supabase.from('profiles').update({
            education: profile.education,
            experience: profile.experience,
            skills: profile.skills,
            interests: profile.interests,
            budget: profile.budget,
            time_commitment: profile.timeCommitment,
            risk_tolerance: profile.riskTolerance
        }).eq('id', currentUser.id);
      }

      setIsGeneratingRecs(true);
      try {
        const recs = await generatePersonalizedIdeas(profile, language);
        setRecommendedIdeas(recs);
      } catch (e) {
          console.error(e);
      } finally {
          setIsGeneratingRecs(false);
      }
  };
  
  const handleAnalyzeCreditRisk = async (application: LoanApplication): Promise<CreditRiskReport | null> => {
      return await generateCreditRiskReport(application, language);
  };
  
  const handleGetFundingPlan = async (idea: BusinessIdea, amount: number): Promise<FundingMilestone[] | null> => {
      return await generateFundingMilestones(idea, amount, language);
  };

  // Community Post Handling
  const handleAddPost = (content: string, industryId: string) => {
      if (!currentUser) return;
      
      const newPost: CommunityPost = {
          id: Date.now().toString(),
          userId: currentUser.id,
          userName: currentUser.name,
          content: content,
          industryId: industryId,
          likes: 0,
          comments: 0,
          timestamp: Date.now()
      };
      
      setCommunityPosts(prev => [newPost, ...prev]);
  };

  const handleLikePost = (postId: string) => {
      setCommunityPosts(prev => prev.map(post => {
          if (post.id === postId) {
              return {
                  ...post,
                  likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                  isLiked: !post.isLiked
              };
          }
          return post;
      }));
  };

  // Navigation Logic
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'am' : 'en');
  };

  const handleIndustrySelect = async (industry: Industry) => {
    setSelectedIndustry(industry);
    setAppState(AppState.LOADING_IDEAS);
    setError(null);
    try {
      const industryName = t.industries[industry.id] || industry.name;
      const generatedIdeas = await generateIdeas(industryName, language);
      
      const relevantCustomIdeas = customIdeas.filter(i => i.industryId === industry.id);
      const allIdeas = [...relevantCustomIdeas, ...generatedIdeas];

      if (allIdeas.length === 0) {
        setError(t.errors.noIdeas);
        setAppState(AppState.SELECT_INDUSTRY);
      } else {
        // Initialize with 0 upvotes for fresh ideas
        const ideasWithVotes = allIdeas.map(i => ({...i, upvotes: i.upvotes || 0}));
        setIdeas(ideasWithVotes);
        setAppState(AppState.SELECT_IDEA);
      }
    } catch (e) {
      setError(t.errors.connection);
      setAppState(AppState.SELECT_INDUSTRY);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppState(AppState.LOADING_PROFILE_IDEAS);
    setError(null);
    
    // Save profile to DB on wizard submit
    if (currentUser && currentUser.id !== 'guest') {
       await supabase.from('profiles').update({
        name: userProfile.name,
        education: userProfile.education,
        experience: userProfile.experience,
        skills: userProfile.skills,
        interests: userProfile.interests,
        budget: userProfile.budget,
        time_commitment: userProfile.timeCommitment,
        risk_tolerance: userProfile.riskTolerance
      }).eq('id', currentUser.id);
    }

    try {
      const generatedIdeas = await generatePersonalizedIdeas(userProfile, language);
      if (generatedIdeas.length === 0) {
        setError(t.errors.noIdeas);
        setAppState(AppState.USER_PROFILE);
      } else {
        const ideasWithVotes = generatedIdeas.map(i => ({...i, upvotes: i.upvotes || 0}));
        setIdeas(ideasWithVotes);
        setSelectedIndustry({ id: 'custom', name: t.industries['custom'], icon: '🎯' });
        setAppState(AppState.SELECT_IDEA);
      }
    } catch (e) {
      setError(t.errors.connection);
      setAppState(AppState.USER_PROFILE);
    }
  };
  
  const handleGenerateMore = async () => {
    setIsLoadingMore(true);
    setError(null);
    try {
        let newIdeas: BusinessIdea[] = [];
        
        if (selectedIndustry?.id === 'custom') {
             newIdeas = await generatePersonalizedIdeas(userProfile, language);
        } else if (selectedIndustry) {
             const industryName = t.industries[selectedIndustry.id] || selectedIndustry.name;
             newIdeas = await generateIdeas(industryName, language);
        }

        if (newIdeas.length === 0) {
            // No new ideas found
        } else {
            // Append new ideas to the existing list, avoiding duplicates by business title
            setIdeas(prev => {
                const existingTitles = new Set(prev.map(i => i.businessTitle));
                const filteredNew = newIdeas.filter(i => !existingTitles.has(i.businessTitle));
                const filteredNewWithVotes = filteredNew.map(i => ({...i, upvotes: 0}));
                return [...prev, ...filteredNewWithVotes];
            });
        }
    } catch (e) {
        console.error("Error generating more ideas:", e);
        setError(t.errors.connection);
    } finally {
        setIsLoadingMore(false);
    }
  };

  const handleViewDetails = async (idea: BusinessIdea) => {
    setDetailIdea(idea);
    setBusinessDetails(null);
    setStressTestResult(null);
    setFinancials(null);
    setRoadmap(null);
    setPitchDeck(null); // Reset pitch deck
    setRoadmapProgress({}); // Reset progress state when viewing new idea
    setSourcingLinks(null); // Reset sourcing links
    // Reset landed cost default enabled state
    setLandedCost(prev => ({ ...prev, enabled: false }));
    setActiveDetailTab('blueprint');
    setLoadingDetails(true);
    
    try {
      const details = await generateBusinessDetails(idea, language);
      if (!details) {
        setLoadingDetails(false);
      } else {
        // If the Idea object itself has skills (from Admin/DB), prioritize them
        if (idea.skillRequirements && idea.skillRequirements.length > 0) {
            details.skillRequirements = idea.skillRequirements;
        }
        // If the Idea object has Operational Reqs (from Admin/DB), prioritize them
        if (idea.operationalRequirements && idea.operationalRequirements.length > 0) {
            details.operationalRequirements = idea.operationalRequirements;
        }
        setBusinessDetails(details);
        setLoadingDetails(false);
      }
    } catch (e) {
      console.error(e);
      setLoadingDetails(false);
    }
  };

  const handleRunStressTest = async () => {
    if (!detailIdea) return;
    setActiveDetailTab('stress_test');
    
    if (stressTestResult) return; // Already loaded

    setLoadingStressTest(true);
    try {
        const result = await generateStressTest(detailIdea, language);
        setStressTestResult(result);
    } catch (e) {
        console.error("Stress test failed", e);
    } finally {
        setLoadingStressTest(false);
    }
  };
  
  const handleLoadFinancials = async () => {
      if (!detailIdea) return;
      setActiveDetailTab('roi');
      
      if (financials) return; // Already loaded

      setLoadingFinancials(true);
      try {
          const result = await generateFinancialEstimates(detailIdea, language);
          setFinancials(result);
      } catch (e) {
          console.error("Financials failed", e);
      } finally {
          setLoadingFinancials(false);
      }
  };
  
  const getRoadmapStorageKey = (idea: BusinessIdea) => {
      // Create a stable key for local storage based on business title
      return `fad_roadmap_${idea.businessTitle.replace(/\s+/g, '_')}`;
  };

  const handleLoadRoadmap = async () => {
      if (!detailIdea) return;
      setActiveDetailTab('roadmap');
      
      // Check local storage first
      const storageKey = getRoadmapStorageKey(detailIdea);
      try {
          const cached = localStorage.getItem(storageKey);
          if (cached) {
              const { roadmap: cachedRoadmap, progress } = JSON.parse(cached);
              if (cachedRoadmap && Array.isArray(cachedRoadmap)) {
                  setRoadmap(cachedRoadmap);
                  setRoadmapProgress(progress || {});
                  return;
              }
          }
      } catch (e) {
          console.error("Failed to load cached roadmap", e);
      }
      
      if (roadmap) return; // Already loaded in memory

      setLoadingRoadmap(true);
      try {
          const result = await generateRoadmap(detailIdea, language);
          setRoadmap(result);
          setRoadmapProgress({});
          
          // Persist the newly generated roadmap immediately
          if (result) {
              localStorage.setItem(storageKey, JSON.stringify({
                  roadmap: result,
                  progress: {}
              }));
          }
      } catch (e) {
          console.error("Roadmap failed", e);
      } finally {
          setLoadingRoadmap(false);
      }
  };

  const toggleRoadmapStep = (phaseIdx: number, stepIdx: number) => {
      const key = `${phaseIdx}-${stepIdx}`;
      const newProgress = { ...roadmapProgress, [key]: !roadmapProgress[key] };
      setRoadmapProgress(newProgress);

      // Persist update
      if (detailIdea && roadmap) {
          const storageKey = getRoadmapStorageKey(detailIdea);
          localStorage.setItem(storageKey, JSON.stringify({
              roadmap: roadmap,
              progress: newProgress
          }));
      }
  };

  const handleLoadSourcing = async () => {
      if (!detailIdea) return;
      setActiveDetailTab('supplier');
      
      if (sourcingLinks) return; // Already loaded or previously empty

      setLoadingSourcing(true);
      try {
          const links = await findMachineSuppliers(detailIdea.machineName);
          setSourcingLinks(links);
      } catch (e) {
          console.error("Sourcing failed", e);
      } finally {
          setLoadingSourcing(false);
      }
  };

  const handleLoadPitchDeck = async () => {
      if (!detailIdea) return;
      setActiveDetailTab('pitch_deck');
      
      if (pitchDeck) return;

      setLoadingPitchDeck(true);
      try {
          const deck = await generatePitchDeck(detailIdea, language);
          setPitchDeck(deck);
      } catch (e) {
          console.error("Pitch Deck failed", e);
      } finally {
          setLoadingPitchDeck(false);
      }
  };

  const downloadPitchDeckPDF = async () => {
      const element = document.getElementById('pitch-deck-container');
      if (!element) return;

      setIsDownloadingDeck(true);
      try {
          const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape A4
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          
          // Get all slide elements
          const slides = element.querySelectorAll('.pitch-slide');
          
          for (let i = 0; i < slides.length; i++) {
              const slide = slides[i] as HTMLElement;
              
              // We need to temporarily make sure the element is visible and captured properly
              // html2canvas works best on visible elements. The container should be visible.
              
              const canvas = await html2canvas(slide, {
                  scale: 2,
                  useCORS: true,
                  backgroundColor: '#050505'
              });
              
              const imgData = canvas.toDataURL('image/png');
              
              if (i > 0) pdf.addPage();
              pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          }
          
          pdf.save(`${detailIdea?.businessTitle.replace(/\s+/g, '_')}_PitchDeck.pdf`);
      } catch (err) {
          console.error("Failed to generate deck PDF", err);
          alert("Error generating PDF.");
      } finally {
          setIsDownloadingDeck(false);
      }
  };

  const closeDetails = () => {
    setDetailIdea(null);
    setBusinessDetails(null);
    setStressTestResult(null);
    setFinancials(null);
    setRoadmap(null);
    setPitchDeck(null);
    setRoadmapProgress({});
    setSourcingLinks(null);
    setLoadingDetails(false);
    setLoadingStressTest(false);
    setLoadingFinancials(false);
    setLoadingRoadmap(false);
    setLoadingSourcing(false);
    setLoadingPitchDeck(false);
  };

  const handleIdeaSelect = async (idea: BusinessIdea) => {
    if (detailIdea) closeDetails();
    
    setSelectedIdea(idea);
    setAppState(AppState.LOADING_CANVAS);
    setError(null);
    setCanvasTheme('neon'); // Reset theme
    try {
      const generatedCanvas = await generateCanvas(idea, language);
      if (!generatedCanvas) {
        setError(t.errors.canvasFail);
        setAppState(AppState.SELECT_IDEA);
      } else {
        setCanvas(generatedCanvas);
        setAppState(AppState.VIEW_CANVAS);
      }
    } catch (e) {
      setError(t.errors.connection);
      setAppState(AppState.SELECT_IDEA);
    }
  };
  
  const saveCanvasToLocal = () => {
    if (!selectedIdea || !canvas) return;

    try {
        const key = 'fad_saved_blueprints';
        const existingStr = localStorage.getItem(key);
        let existing = existingStr ? JSON.parse(existingStr) : [];
        
        // Remove existing entry for this idea if present to update it
        existing = existing.filter((item: any) => item.idea.businessTitle !== selectedIdea.businessTitle);
        
        existing.push({
            idea: selectedIdea,
            canvas: canvas,
            timestamp: Date.now()
        });
        
        localStorage.setItem(key, JSON.stringify(existing));
        alert(t.canvasSavedMsg);
    } catch (e) {
        console.error("Failed to save to local storage", e);
    }
  };

  const downloadCanvasAsPDF = async () => {
      const input = document.getElementById('canvas-pdf-export');
      if (!input) return;
      
      setIsDownloadingPdf(true);
      try {
          const canvas = await html2canvas(input, {
              scale: 2, // High resolution
              backgroundColor: canvasTheme === 'corporate' ? '#ffffff' : '#050505', // Context-aware background
              useCORS: true
          });
          
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape, millimeters, A4
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`${selectedIdea?.businessTitle.replace(/\s+/g, '_')}_Blueprint.pdf`);
      } catch (err) {
          console.error("Failed to generate PDF", err);
          alert("Error generating PDF. Please try again.");
      } finally {
          setIsDownloadingPdf(false);
      }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
        alert(t.supplier.copied);
    });
  };

  const openSearch = (platform: string, machine: string) => {
    let url = '';
    const encodedMachine = encodeURIComponent(machine);
    
    if (platform === 'Alibaba') {
        url = `https://www.alibaba.com/trade/search?SearchText=${encodedMachine}`;
    } else if (platform === 'Amazon') {
        url = `https://www.amazon.com/s?k=${encodedMachine}`;
    } else if (platform === 'Global Sources') {
        url = `https://www.globalsources.com/searchSites/trade/gs/search?searchString=${encodedMachine}`;
    } else {
        // Fallback to Google Shopping
        url = `https://www.google.com/search?q=${encodedMachine}&tbm=shop`;
    }
    
    window.open(url, '_blank');
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

  // Calculations for ROI & Landed Cost
  const calculateMetrics = () => {
      if (!financials) return null;
      
      let initialInvestment = financials.initialInvestment;

      // Apply landed cost adjustment if enabled
      if (landedCost.enabled) {
          const basePrice = financials.initialInvestment;
          const duty = basePrice * (landedCost.customs / 100);
          const taxableAmount = basePrice + duty + landedCost.shipping; // Simplified base for VAT
          const vat = taxableAmount * (landedCost.vat / 100);
          initialInvestment = basePrice + landedCost.shipping + duty + vat + landedCost.fees;
      }
      
      const margin = financials.pricePerUnit - financials.costPerUnit;
      const monthlyProfit = (margin * financials.estimatedMonthlySales) - financials.monthlyFixedCosts;
      const breakEvenUnits = margin > 0 ? Math.ceil(financials.monthlyFixedCosts / margin) : Infinity;
      const breakEvenMonths = monthlyProfit > 0 ? Math.ceil(initialInvestment / monthlyProfit) : Infinity;

      return { margin, monthlyProfit, breakEvenUnits, breakEvenMonths, adjustedInvestment: initialInvestment };
  };

  const metrics = calculateMetrics();

  // Calculate Roadmap Progress Percentage
  const calculateRoadmapProgress = () => {
      if (!roadmap) return 0;
      let totalSteps = 0;
      let completedSteps = 0;
      roadmap.forEach((phase, idx) => {
          phase.steps.forEach((_, sIdx) => {
              totalSteps++;
              if (roadmapProgress[`${idx}-${sIdx}`]) completedSteps++;
          });
      });
      return totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);
  };

  // Render Functions

  const renderNavBar = () => {
      return (
          <div className="flex justify-between items-center p-4 bg-black border-b border-gray-900 sticky top-0 z-20 backdrop-blur-md bg-opacity-80">
              <div className="flex items-center gap-4">
                  <span className="font-orbitron font-bold text-xl tracking-tighter cursor-pointer" onClick={() => currentUser ? setAppState(AppState.SELECT_INDUSTRY) : setAppState(AppState.LOGIN)}>
                      <span className="text-white">FAD</span>
                      <span className="text-neon-blue"> LAB</span>
                  </span>
                  
                  {/* Nav Links */}
                  <div className="flex items-center gap-6 ml-8 flex-wrap">
                     {/* Show Home/Profile only if logged in */}
                     {currentUser && (
                        <>
                        <button 
                            onClick={() => setAppState(AppState.SELECT_INDUSTRY)}
                            className={`text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1 ${appState === AppState.SELECT_INDUSTRY ? 'text-neon-blue' : 'text-gray-500'}`}
                        >
                            <HomeIcon /> {t.nav.home}
                        </button>
                        <button 
                            onClick={() => setAppState(AppState.DASHBOARD)}
                            className={`text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1 ${appState === AppState.DASHBOARD ? 'text-neon-blue' : 'text-gray-500'}`}
                        >
                            <UserIcon /> {t.nav.profile}
                        </button>
                        <button 
                            onClick={() => setAppState(AppState.COMMUNITY)}
                            className={`text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1 ${appState === AppState.COMMUNITY ? 'text-neon-blue' : 'text-gray-500'}`}
                        >
                            <CommunityIcon /> {t.nav.community}
                        </button>
                        {currentUser.role === 'admin' && (
                            <button 
                                onClick={() => setAppState(AppState.ADMIN_DASHBOARD)}
                                className={`text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1 ${appState === AppState.ADMIN_DASHBOARD ? 'text-neon-blue' : 'text-gray-500'}`}
                            >
                                <AdminIcon /> {t.nav.admin}
                            </button>
                        )}
                        {currentUser.role === 'lender' && (
                            <button 
                                onClick={() => setAppState(AppState.LENDER_DASHBOARD)}
                                className={`text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1 ${appState === AppState.LENDER_DASHBOARD ? 'text-neon-yellow' : 'text-gray-500'}`}
                            >
                                <BankIcon /> {t.nav.lender}
                            </button>
                        )}
                        </>
                     )}
                     {/* Always show About */}
                     <button 
                      onClick={() => setAppState(AppState.ABOUT)}
                      className={`text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1 ${appState === AppState.ABOUT ? 'text-neon-blue' : 'text-gray-500'}`}
                    >
                        <InfoIcon /> {t.nav.about}
                    </button>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <button onClick={toggleLanguage} className="text-gray-400 hover:text-white flex items-center gap-1">
                      <GlobeIcon /> <span className="text-xs uppercase">{language}</span>
                  </button>
                  {currentUser ? (
                     // User is logged in (Guest or Real)
                     currentUser.id === 'guest' ? (
                        <button onClick={handleLogout} className="text-neon-blue hover:text-white text-xs uppercase font-bold tracking-widest border border-neon-blue px-3 py-1 rounded shadow-[0_0_10px_#00d4ff33] hover:shadow-[0_0_15px_#00d4ff66] transition-all">
                             {t.nav.login}
                        </button>
                     ) : (
                        <button onClick={handleLogout} className="text-red-500 hover:text-red-400 text-xs uppercase font-bold tracking-widest border border-red-900 px-3 py-1 rounded">
                            {t.nav.logout}
                        </button>
                     )
                  ) : (
                     // User is logged out
                     <button onClick={() => setAppState(AppState.LOGIN)} className="text-neon-blue hover:text-white text-xs uppercase font-bold tracking-widest border border-neon-blue px-3 py-1 rounded shadow-[0_0_10px_#00d4ff33] hover:shadow-[0_0_15px_#00d4ff66] transition-all">
                         {t.nav.login}
                     </button>
                  )}
              </div>
          </div>
      )
  }

  const renderIndustrySelection = () => (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-end mb-4 gap-4">
        <NeonButton onClick={() => setAppState(AppState.USER_PROFILE)} color="green" className="flex items-center gap-2">
          <UserIcon />
          <span>{t.buildProfileBtn}</span>
        </NeonButton>
      </div>

      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter">
          <span className="text-white">FAD</span>
          <span className="text-neon-blue"> {t.appTitle}</span>
        </h1>
        <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
          {t.appSubtitle}
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
              {t.industries[ind.id] || ind.name}
            </h3>
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-neon-blue text-sm uppercase tracking-widest">
              {t.scanBtn} &rarr;
            </div>
          </NeonCard>
        ))}
      </div>
      {error && <div className="text-red-500 text-center mt-8 text-xl font-bold">{error}</div>}
    </div>
  );

  const renderUserProfile = () => (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex justify-between items-center mb-8">
        <button onClick={reset} className="flex items-center text-gray-400 hover:text-white transition-colors">
          <ArrowLeftIcon />
          <span className="ml-2 uppercase tracking-widest">{t.backToHome}</span>
        </button>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl text-neon-green font-bold mb-2">{t.profileTitle}</h2>
        <p className="text-gray-400">{t.profileSubtitle}</p>
      </div>

      <NeonCard color="green" className="p-8" hoverEffect={false}>
        <form onSubmit={handleProfileSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NeonInput 
              label={t.labels.name} 
              placeholder={t.placeholders.name} 
              value={userProfile.name} 
              onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
              required
            />
            <NeonSelect 
              label={t.labels.budget} 
              options={[
                { value: 'Under $1,000', label: t.options.budget['Under $1,000'] },
                { value: '$1,000 - $5,000', label: t.options.budget['$1,000 - $5,000'] },
                { value: '$5,000 - $20,000', label: t.options.budget['$5,000 - $20,000'] },
                { value: '$20,000+', label: t.options.budget['$20,000+'] }
              ]}
              value={userProfile.budget}
              onChange={(e) => setUserProfile({...userProfile, budget: e.target.value})}
            />
          </div>

          <NeonTextArea 
            label={t.labels.skills} 
            placeholder={t.placeholders.skills}
            value={userProfile.skills}
            onChange={(e) => setUserProfile({...userProfile, skills: e.target.value})}
            required
          />

          <NeonTextArea 
            label={t.labels.interests} 
            placeholder={t.placeholders.interests}
            value={userProfile.interests}
            onChange={(e) => setUserProfile({...userProfile, interests: e.target.value})}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NeonSelect 
              label={t.labels.risk} 
              options={[
                { value: 'Low', label: t.options.risk['Low'] },
                { value: 'Medium', label: t.options.risk['Medium'] },
                { value: 'High', label: t.options.risk['High'] }
              ]}
              value={userProfile.riskTolerance}
              onChange={(e) => setUserProfile({...userProfile, riskTolerance: e.target.value as any})}
            />
            <NeonSelect 
              label={t.labels.time} 
              options={[
                { value: 'Part-time', label: t.options.time['Part-time'] },
                { value: 'Full-time', label: t.options.time['Full-time'] }
              ]}
              value={userProfile.timeCommitment}
              onChange={(e) => setUserProfile({...userProfile, timeCommitment: e.target.value as any})}
            />
          </div>

          <div className="mt-8">
            <NeonButton type="submit" fullWidth color="green">
              {t.submitProfileBtn}
            </NeonButton>
          </div>
        </form>
      </NeonCard>
      
      {error && <div className="text-red-500 text-center mt-8 text-xl font-bold">{error}</div>}
    </div>
  );

  const renderIdeaSelection = () => {
    // Sort logic
    const sortedIdeas = [...ideas].sort((a, b) => {
        if (sortMethod === 'upvotes') {
            return (b.upvotes || 0) - (a.upvotes || 0);
        }
        return 0; // Default to natural order (newest generated usually)
    });

    return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex gap-4 items-center">
            <button onClick={reset} className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeftIcon />
            <span className="ml-2 uppercase tracking-widest">{t.backToSectors}</span>
            </button>
        </div>
        
        {/* Sorting Controls */}
        <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs uppercase font-bold">{t.upvote.sort}</span>
            <div className="flex bg-dark-card border border-gray-800 rounded p-1">
                <button 
                    onClick={() => setSortMethod('newest')}
                    className={`px-3 py-1 text-xs uppercase font-bold rounded transition-colors ${sortMethod === 'newest' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-white'}`}
                >
                    {t.upvote.sortNew}
                </button>
                <button 
                    onClick={() => setSortMethod('upvotes')}
                    className={`px-3 py-1 text-xs uppercase font-bold rounded transition-colors ${sortMethod === 'upvotes' ? 'bg-neon-green text-black' : 'text-gray-500 hover:text-white'}`}
                >
                    {t.upvote.sortPopular}
                </button>
            </div>
        </div>

        <div className="text-right">
          <h2 className="text-neon-blue text-xl font-bold uppercase">{selectedIndustry?.id === 'custom' ? t.industries['custom'] : (selectedIndustry ? t.industries[selectedIndustry.id] : '')}</h2>
          <p className="text-xs text-gray-500">{t.scanComplete(ideas.length)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {sortedIdeas.map((idea, idx) => {
          const isSaved = savedIdeas.some(i => i.businessTitle === idea.businessTitle || i.id === idea.id);
          const uniqueKey = idea.id || `${idea.businessTitle.replace(/\s+/g, '')}-${idx}`;
          
          return (
            <NeonCard key={uniqueKey} color="pink" className="flex flex-col h-full" hoverEffect={false}>
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden border border-gray-800">
                <img 
                  src={idea.imageUrl || `https://picsum.photos/400/300?random=${idx}`}
                  alt={idea.machineName} 
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                  onError={(e) => {
                      e.currentTarget.src = `https://picsum.photos/400/300?random=${idx}`;
                      e.currentTarget.onerror = null; // Prevent infinite loop
                  }}
                />
                <div className="absolute top-2 right-2 bg-black/80 text-neon-pink text-xs font-bold px-2 py-1 rounded border border-neon-pink">
                  {idea.platformSource}
                </div>
                
                {/* Upvote Badge Overlay */}
                <div className="absolute top-2 left-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleUpvote(idea); }}
                        className={`
                            flex flex-col items-center justify-center w-10 h-10 rounded border 
                            backdrop-blur-md transition-all active:scale-95
                            ${idea.isUpvoted 
                                ? 'bg-neon-green/20 border-neon-green text-neon-green' 
                                : 'bg-black/60 border-gray-600 text-gray-400 hover:border-white hover:text-white'}
                        `}
                        title={t.upvote.tooltip}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
                        <span className="text-[10px] font-bold leading-none">{idea.upvotes || 0}</span>
                    </button>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{idea.businessTitle} business</h3>
              <div className="text-neon-blue text-sm font-bold mb-4 uppercase tracking-wider">
                {idea.machineName}
              </div>
              
              <p className="text-gray-400 text-sm flex-grow mb-6 leading-relaxed">
                {idea.description}
              </p>

              <div className="border-t border-gray-800 pt-4 mt-auto space-y-3">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <div className="text-xs text-gray-500 uppercase">{t.investment}</div>
                    <div className="text-neon-green font-bold">{idea.priceRange}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase">{t.potential}</div>
                    <div className="text-white font-bold">{idea.potentialRevenue}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <NeonButton color="blue" onClick={() => handleViewDetails(idea)} className="text-xs py-2 px-1 col-span-1">
                    {t.detailsBtn}
                  </NeonButton>
                  <NeonButton color="pink" onClick={() => handleIdeaSelect(idea)} className="text-xs py-2 px-1 col-span-1">
                    {t.analyzeBtn}
                  </NeonButton>
                  <NeonButton 
                    color="green" 
                    onClick={() => handleSaveIdea(idea)} 
                    disabled={!!isSaved}
                    className={`text-xs py-2 px-1 col-span-1 ${isSaved ? 'opacity-50' : ''}`}
                  >
                    {isSaved ? t.savedBtn : t.saveBtn}
                  </NeonButton>
                </div>
              </div>
            </NeonCard>
          );
        })}
      </div>
      
      <div className="flex justify-center mb-8">
        <NeonButton 
            color="green" 
            onClick={handleGenerateMore} 
            disabled={isLoadingMore}
            className="flex items-center gap-2"
        >
            {isLoadingMore ? (
                <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>{t.loading.scanningWeb}</span>
                </>
            ) : (
                <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    <span>{t.generateMoreBtn}</span>
                </>
            )}
        </NeonButton>
      </div>
      
    </div>
  )};

  const renderCanvasView = () => {
    if (!canvas || !selectedIdea) return null;

    const isCorporate = canvasTheme === 'corporate';

    // Helper classes based on theme
    const containerClass = isCorporate 
        ? "bg-white border-2 border-black rounded-none shadow-none text-black p-8" 
        : "bg-dark-card border border-neon-blue rounded-xl p-4 shadow-[0_0_30px_rgba(0,212,255,0.1)] text-white";
        
    const boxClass = (baseColor: string) => isCorporate
        ? "border border-gray-300 bg-gray-50 rounded-none p-4"
        : `border border-gray-700 bg-black/40 rounded-lg p-4`;

    const titleClass = (color: string) => isCorporate
        ? "text-black font-bold uppercase mb-4 text-sm tracking-wider font-sans border-b border-gray-300 pb-2"
        : `text-${color} font-bold uppercase mb-4 text-sm tracking-wider`;

    const listClass = isCorporate
        ? "list-disc list-inside text-black text-sm space-y-2 font-sans"
        : "list-disc list-inside text-gray-300 text-sm space-y-2";

    return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-[fadeIn_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
            <button onClick={goBackToIdeas} className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeftIcon />
            <span className="ml-2 uppercase tracking-widest">{t.backToIdeas}</span>
            </button>
        </div>
        
        {/* Toggle Switch */}
        <div className="flex items-center gap-3 bg-gray-900 rounded-full px-4 py-2 border border-gray-700">
            <span className={`text-xs font-bold ${!isCorporate ? 'text-neon-blue' : 'text-gray-500'}`}>LAB</span>
            <button 
                onClick={() => setCanvasTheme(prev => prev === 'neon' ? 'corporate' : 'neon')}
                className={`w-10 h-5 rounded-full p-1 transition-colors relative ${isCorporate ? 'bg-white' : 'bg-gray-700'}`}
            >
                <div className={`w-3 h-3 rounded-full shadow-md transition-transform transform ${isCorporate ? 'translate-x-5 bg-black' : 'translate-x-0 bg-neon-blue'}`}></div>
            </button>
            <span className={`text-xs font-bold ${isCorporate ? 'text-white' : 'text-gray-500'}`}>BANK</span>
        </div>

        <div className="flex gap-4">
             <NeonButton 
                color="green" 
                onClick={saveCanvasToLocal}
                className="text-xs"
             >
                {t.saveCanvasLocal}
             </NeonButton>
             <NeonButton 
                color="purple" 
                onClick={downloadCanvasAsPDF}
                disabled={isDownloadingPdf}
                className="text-xs flex items-center gap-2"
             >
                {isDownloadingPdf ? (
                    <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {t.downloading}
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        {t.downloadPdf}
                    </>
                )}
             </NeonButton>
        </div>
      </div>

      <div id="canvas-pdf-export" className={containerClass}>
        {/* Header for Corporate Mode */}
        {isCorporate && (
            <div className="text-center mb-8 border-b-2 border-black pb-4">
                <h1 className="text-3xl font-bold text-black uppercase mb-1 font-sans">{selectedIdea.businessTitle}</h1>
                <p className="text-gray-600 text-sm uppercase tracking-widest font-sans">Business Model Blueprint Strategy</p>
                <div className="mt-2 text-xs text-gray-500">Generated by Fad Business Lab AI • {new Date().toLocaleDateString()}</div>
            </div>
        )}

        {/* Top Row: Key Partners, Activities, Resources, Value Prop, Customer Rel, Channels, Segments */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-[600px]">
          
          {/* Left Block (Partners) */}
          <div className={`lg:col-span-1 flex flex-col ${boxClass('gray-700')}`}>
            <h3 className={titleClass('neon-pink')}>{t.canvasSections.keyPartners}</h3>
            <ul className={`${listClass} flex-grow`}>
              {canvas.keyPartners.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>

          {/* Left-Mid Block (Activities & Resources) */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className={`${boxClass('gray-700')} flex-grow`}>
              <h3 className={titleClass('neon-green')}>{t.canvasSections.keyActivities}</h3>
              <ul className={listClass}>
                {canvas.keyActivities.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div className={`${boxClass('gray-700')} flex-grow`}>
              <h3 className={titleClass('neon-green')}>{t.canvasSections.keyResources}</h3>
              <ul className={listClass}>
                {canvas.keyResources.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>

          {/* Center Block (Value Propositions) */}
          <div className={`lg:col-span-1 flex flex-col ${isCorporate ? boxClass('black') : 'border border-neon-blue bg-neon-blue/5 p-4 rounded-lg'}`}>
            <h3 className={isCorporate ? titleClass('black') : "text-white font-bold uppercase mb-4 text-sm tracking-wider flex items-center gap-2"}>
               {!isCorporate && <span className="text-2xl">🎁</span>} {t.canvasSections.valuePropositions}
            </h3>
            <ul className={`${isCorporate ? listClass : 'list-disc list-inside text-white text-sm space-y-3 flex-grow font-medium'}`}>
              {canvas.valuePropositions.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>

          {/* Right-Mid Block (Relationships & Channels) */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className={`${boxClass('gray-700')} flex-grow`}>
              <h3 className={titleClass('neon-purple')}>{t.canvasSections.customerRelationships}</h3>
              <ul className={listClass}>
                {canvas.customerRelationships.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div className={`${boxClass('gray-700')} flex-grow`}>
              <h3 className={titleClass('neon-purple')}>{t.canvasSections.channels}</h3>
              <ul className={listClass}>
                {canvas.channels.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>

          {/* Right Block (Customer Segments) */}
          <div className={`lg:col-span-1 flex flex-col ${boxClass('gray-700')}`}>
            <h3 className={titleClass('neon-yellow')}>{t.canvasSections.customerSegments}</h3>
            <ul className={`${listClass} flex-grow`}>
              {canvas.customerSegments.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>

        </div>

        {/* Bottom Row: Cost & Revenue */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className={isCorporate ? boxClass('red-900') : "border border-red-900/50 bg-red-900/10 p-4 rounded-lg"}>
            <h3 className={isCorporate ? titleClass('black') : "text-red-400 font-bold uppercase mb-4 text-sm tracking-wider"}>{t.canvasSections.costStructure}</h3>
            <ul className={listClass}>
              {canvas.costStructure.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
          <div className={isCorporate ? boxClass('green-900') : "border border-green-900/50 bg-green-900/10 p-4 rounded-lg"}>
            <h3 className={isCorporate ? titleClass('black') : "text-green-400 font-bold uppercase mb-4 text-sm tracking-wider"}>{t.canvasSections.revenueStreams}</h3>
            <ul className={listClass}>
              {canvas.revenueStreams.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )};
  
  const renderDetailModal = () => (
    <NeonModal 
      isOpen={!!detailIdea} 
      onClose={closeDetails} 
      title={detailIdea?.businessTitle}
    >
      {loadingDetails ? (
        <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neon-blue animate-pulse">{t.loading.details}</p>
        </div>
      ) : businessDetails && detailIdea ? (
        <div className="space-y-6">
            
            {/* Tabs */}
            <div className="flex border-b border-gray-700 mb-4 overflow-x-auto">
                <button 
                    onClick={() => setActiveDetailTab('blueprint')}
                    className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeDetailTab === 'blueprint' ? 'text-neon-blue border-b-2 border-neon-blue' : 'text-gray-500 hover:text-white'}`}
                >
                    {t.stressTest.blueprintTab}
                </button>
                <button 
                    onClick={() => { setActiveDetailTab('stress_test'); handleRunStressTest(); }}
                    className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeDetailTab === 'stress_test' ? 'text-neon-pink border-b-2 border-neon-pink' : 'text-gray-500 hover:text-white'}`}
                >
                    {t.stressTest.tabTitle}
                </button>
                <button 
                    onClick={() => { setActiveDetailTab('roi'); handleLoadFinancials(); }}
                    className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeDetailTab === 'roi' ? 'text-neon-green border-b-2 border-neon-green' : 'text-gray-500 hover:text-white'}`}
                >
                    {t.roi.tabTitle}
                </button>
                <button 
                    onClick={() => { setActiveDetailTab('roadmap'); handleLoadRoadmap(); }}
                    className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeDetailTab === 'roadmap' ? 'text-neon-purple border-b-2 border-neon-purple' : 'text-gray-500 hover:text-white'}`}
                >
                    {t.roadmap.tabTitle}
                </button>
                <button 
                    onClick={() => { setActiveDetailTab('pitch_deck'); handleLoadPitchDeck(); }}
                    className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeDetailTab === 'pitch_deck' ? 'text-white border-b-2 border-white' : 'text-gray-500 hover:text-white'}`}
                >
                    {t.pitchDeck.tabTitle}
                </button>
                <button 
                    onClick={() => { setActiveDetailTab('supplier'); handleLoadSourcing(); }}
                    className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeDetailTab === 'supplier' ? 'text-neon-yellow border-b-2 border-neon-yellow' : 'text-gray-500 hover:text-white'}`}
                >
                    {t.supplier.tabTitle}
                </button>
            </div>

            {/* TAB CONTENT: BLUEPRINT */}
            {activeDetailTab === 'blueprint' && (
                <div className="animate-[fadeIn_0.3s_ease-out]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-neon-pink font-bold uppercase mb-2 text-sm">{t.detailsSections.audience}</h4>
                      <p className="text-gray-300 text-sm mb-4">{businessDetails.targetAudience}</p>
                      
                      <h4 className="text-neon-green font-bold uppercase mb-2 text-sm">{t.detailsSections.marketing}</h4>
                      <p className="text-gray-300 text-sm italic border-l-2 border-neon-green pl-3">{businessDetails.marketingQuickTip}</p>
                    </div>
                    <div>
                      <h4 className="text-white font-bold uppercase mb-2 text-sm">{t.detailsSections.requirements}</h4>
                      <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 mb-4">
                        {businessDetails.operationalRequirements.map((req, i) => <li key={i}>{req}</li>)}
                      </ul>

                      <h4 className="text-white font-bold uppercase mb-2 text-sm">{t.detailsSections.skillRequirements}</h4>
                      <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                        {businessDetails.skillRequirements.map((skill, i) => <li key={i}>{skill}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-800">
                     <div>
                        <h4 className="text-neon-blue font-bold uppercase mb-2 text-sm">{t.detailsSections.pros}</h4>
                        <ul className="space-y-1">
                           {businessDetails.pros.map((pro, i) => (
                             <li key={i} className="flex items-start text-sm text-gray-300">
                               <span className="text-neon-blue mr-2">✓</span> {pro}
                             </li>
                           ))}
                        </ul>
                     </div>
                     <div>
                        <h4 className="text-red-400 font-bold uppercase mb-2 text-sm">{t.detailsSections.cons}</h4>
                        <ul className="space-y-1">
                           {businessDetails.cons.map((con, i) => (
                             <li key={i} className="flex items-start text-sm text-gray-300">
                               <span className="text-red-400 mr-2">⚠</span> {con}
                             </li>
                           ))}
                        </ul>
                     </div>
                  </div>
                </div>
            )}

            {/* TAB CONTENT: STRESS TEST */}
            {activeDetailTab === 'stress_test' && (
                <div className="animate-[fadeIn_0.3s_ease-out]">
                    {!stressTestResult ? (
                         loadingStressTest ? (
                            <div className="p-8 text-center">
                                <div className="w-8 h-8 border-2 border-neon-pink border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                <p className="text-neon-pink animate-pulse">{t.loading.stressTest}</p>
                            </div>
                         ) : (
                             <div className="text-center py-8">
                                <NeonButton onClick={handleRunStressTest} color="pink">{t.stressTest.runSimBtn}</NeonButton>
                             </div>
                         )
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-red-900/10 border border-red-900/50 p-4 rounded-lg">
                                <h4 className="text-red-500 font-bold uppercase mb-1 text-xs tracking-widest">{t.stressTest.failureMode}</h4>
                                <p className="text-white text-lg font-bold">{stressTestResult.failureMode}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-gray-400 font-bold uppercase mb-2 text-xs tracking-widest">{t.stressTest.saturation}</h4>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`h-2 flex-grow rounded-full ${
                                            stressTestResult.saturationLevel === 'High' ? 'bg-red-500' :
                                            stressTestResult.saturationLevel === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                                        }`}></div>
                                        <span className="text-white font-bold">{stressTestResult.saturationLevel}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">{stressTestResult.saturationReason}</p>
                                </div>
                                <div>
                                    <h4 className="text-gray-400 font-bold uppercase mb-2 text-xs tracking-widest">{t.stressTest.competitorEdge}</h4>
                                    <p className="text-neon-blue text-sm">{stressTestResult.competitorEdge}</p>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-gray-400 font-bold uppercase mb-2 text-xs tracking-widest">{t.stressTest.hiddenCosts}</h4>
                                <ul className="list-disc list-inside text-sm text-gray-300">
                                    {stressTestResult.hiddenCosts.map((cost, i) => <li key={i}>{cost}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {/* TAB CONTENT: ROI CALCULATOR */}
            {activeDetailTab === 'roi' && (
                <div className="animate-[fadeIn_0.3s_ease-out]">
                    {!financials ? (
                         loadingFinancials ? (
                            <div className="p-8 text-center">
                                <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                <p className="text-neon-green animate-pulse">{t.loading.financials}</p>
                            </div>
                         ) : (
                             <div className="text-center py-8">
                                <NeonButton onClick={handleLoadFinancials} color="green">{t.roi.aiEstimateBtn}</NeonButton>
                             </div>
                         )
                    ) : (
                        <div className="space-y-6">
                            {/* Inputs Section */}
                            <div>
                                <h4 className="text-gray-500 text-xs font-bold uppercase mb-4 border-b border-gray-800 pb-1">{t.roi.inputsTitle}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] text-gray-400 uppercase">{t.roi.labels.investment}</label>
                                        <input 
                                            type="number" 
                                            value={financials.initialInvestment} 
                                            onChange={(e) => setFinancials({...financials, initialInvestment: Number(e.target.value)})}
                                            className="w-full bg-black/30 border border-gray-700 rounded p-2 text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-400 uppercase">{t.roi.labels.fixedCost}</label>
                                        <input 
                                            type="number" 
                                            value={financials.monthlyFixedCosts} 
                                            onChange={(e) => setFinancials({...financials, monthlyFixedCosts: Number(e.target.value)})}
                                            className="w-full bg-black/30 border border-gray-700 rounded p-2 text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-400 uppercase">{t.roi.labels.costPerUnit}</label>
                                        <input 
                                            type="number" 
                                            value={financials.costPerUnit} 
                                            onChange={(e) => setFinancials({...financials, costPerUnit: Number(e.target.value)})}
                                            className="w-full bg-black/30 border border-gray-700 rounded p-2 text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-400 uppercase">{t.roi.labels.pricePerUnit}</label>
                                        <input 
                                            type="number" 
                                            value={financials.pricePerUnit} 
                                            onChange={(e) => setFinancials({...financials, pricePerUnit: Number(e.target.value)})}
                                            className="w-full bg-black/30 border border-gray-700 rounded p-2 text-white text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] text-gray-400 uppercase">{t.roi.labels.estSales}</label>
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="1000" 
                                            value={financials.estimatedMonthlySales} 
                                            onChange={(e) => setFinancials({...financials, estimatedMonthlySales: Number(e.target.value)})}
                                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <div className="text-right text-neon-green font-bold text-sm">{financials.estimatedMonthlySales} {t.roi.metrics.units}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Landed Cost Toggle Section */}
                            <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-xs text-neon-yellow font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={landedCost.enabled} 
                                            onChange={(e) => setLandedCost({...landedCost, enabled: e.target.checked})}
                                            className="form-checkbox h-4 w-4 text-neon-yellow bg-gray-800 border-gray-600 rounded focus:ring-0 focus:ring-offset-0"
                                        />
                                        {t.roi.landedCost.toggle}
                                    </label>
                                </div>
                                
                                {landedCost.enabled && (
                                    <div className="grid grid-cols-2 gap-4 animate-[fadeIn_0.3s_ease-out]">
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase">{t.roi.landedCost.shipping}</label>
                                            <input 
                                                type="number" 
                                                value={landedCost.shipping} 
                                                onChange={(e) => setLandedCost({...landedCost, shipping: Number(e.target.value)})}
                                                className="w-full bg-black/50 border border-gray-700 rounded p-1 text-white text-xs"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase">{t.roi.landedCost.customs}</label>
                                            <input 
                                                type="number" 
                                                value={landedCost.customs} 
                                                onChange={(e) => setLandedCost({...landedCost, customs: Number(e.target.value)})}
                                                className="w-full bg-black/50 border border-gray-700 rounded p-1 text-white text-xs"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase">{t.roi.landedCost.vat}</label>
                                            <input 
                                                type="number" 
                                                value={landedCost.vat} 
                                                onChange={(e) => setLandedCost({...landedCost, vat: Number(e.target.value)})}
                                                className="w-full bg-black/50 border border-gray-700 rounded p-1 text-white text-xs"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase">{t.roi.landedCost.fees}</label>
                                            <input 
                                                type="number" 
                                                value={landedCost.fees} 
                                                onChange={(e) => setLandedCost({...landedCost, fees: Number(e.target.value)})}
                                                className="w-full bg-black/50 border border-gray-700 rounded p-1 text-white text-xs"
                                            />
                                        </div>
                                        <div className="col-span-2 border-t border-gray-700 pt-2 flex justify-between items-center">
                                            <span className="text-xs text-gray-400 uppercase">{t.roi.landedCost.total}:</span>
                                            <span className="text-neon-yellow font-bold text-sm">
                                                {financials.currency}
                                                {metrics?.adjustedInvestment.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Results Section */}
                            {metrics && (
                                <div className="bg-neon-green/10 border border-neon-green/30 p-4 rounded-lg">
                                    <h4 className="text-neon-green text-xs font-bold uppercase mb-4 border-b border-neon-green/30 pb-1">{t.roi.resultsTitle}</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-2 bg-black/20 rounded">
                                            <div className="text-xs text-gray-400 uppercase">{t.roi.metrics.margin}</div>
                                            <div className="text-white font-bold">{financials.currency}{metrics.margin.toFixed(2)}</div>
                                        </div>
                                        <div className="text-center p-2 bg-black/20 rounded">
                                            <div className="text-xs text-gray-400 uppercase">{t.roi.metrics.monthlyProfit}</div>
                                            <div className={`font-bold ${metrics.monthlyProfit >= 0 ? 'text-neon-green' : 'text-red-500'}`}>
                                                {financials.currency}{metrics.monthlyProfit.toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="text-center p-2 bg-black/20 rounded">
                                            <div className="text-xs text-gray-400 uppercase">{t.roi.metrics.breakEven}</div>
                                            <div className="text-white font-bold">{metrics.breakEvenUnits === Infinity ? '∞' : metrics.breakEvenUnits} {t.roi.metrics.units}</div>
                                        </div>
                                        <div className="text-center p-2 bg-black/20 rounded">
                                            <div className="text-xs text-gray-400 uppercase">{t.roi.metrics.breakEvenTime}</div>
                                            <div className="text-white font-bold">{metrics.breakEvenMonths === Infinity ? '∞' : metrics.breakEvenMonths} {t.roi.metrics.months}</div>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-[9px] text-center text-gray-500 uppercase">{t.roi.disclaimer}</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            
            {/* TAB CONTENT: ROADMAP */}
            {activeDetailTab === 'roadmap' && (
                <div className="animate-[fadeIn_0.3s_ease-out]">
                    {!roadmap ? (
                         loadingRoadmap ? (
                            <div className="p-8 text-center">
                                <div className="w-8 h-8 border-2 border-neon-purple border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                <p className="text-neon-purple animate-pulse">{t.loading.roadmap}</p>
                            </div>
                         ) : (
                             <div className="text-center py-8">
                                <NeonButton onClick={handleLoadRoadmap} color="purple">{t.roadmap.genBtn}</NeonButton>
                             </div>
                         )
                    ) : (
                        <div className="relative border-l-2 border-gray-800 ml-4 space-y-8 py-2">
                             <div className="absolute top-[-20px] right-0 text-xs font-bold text-neon-purple uppercase">
                                Progress: {calculateRoadmapProgress()}%
                             </div>
                             {roadmap.map((phase, idx) => (
                                 <div key={idx} className="relative pl-8">
                                     <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-black border-2 border-neon-purple shadow-[0_0_10px_#bc13fe]"></div>
                                     <h4 className="text-neon-purple font-bold uppercase text-sm mb-1">{t.roadmap.phase} {idx + 1}: {phase.phaseName}</h4>
                                     <div className="text-xs text-gray-500 font-mono mb-2 uppercase tracking-widest">{phase.duration}</div>
                                     <ul className="space-y-2">
                                         {phase.steps.map((step, sIdx) => {
                                             const isChecked = !!roadmapProgress[`${idx}-${sIdx}`];
                                             return (
                                                 <li 
                                                    key={sIdx} 
                                                    className={`
                                                        text-sm p-2 rounded border-l-2 cursor-pointer flex items-start gap-3 transition-all
                                                        ${isChecked 
                                                            ? 'text-gray-500 border-gray-700 bg-gray-900/20' 
                                                            : 'text-gray-300 border-neon-purple/50 bg-gray-900/50 hover:bg-gray-900'}
                                                    `}
                                                    onClick={() => toggleRoadmapStep(idx, sIdx)}
                                                 >
                                                     <div className={`mt-0.5 w-4 h-4 flex-shrink-0 border rounded flex items-center justify-center transition-colors ${isChecked ? 'bg-neon-purple border-neon-purple' : 'border-gray-500'}`}>
                                                        {isChecked && <svg className="w-3 h-3 text-black font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                     </div>
                                                     <span className="line-through opacity-50">{step}</span>
                                                 </li>
                                             );
                                         })}
                                     </ul>
                                 </div>
                             ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB CONTENT: PITCH DECK */}
            {activeDetailTab === 'pitch_deck' && (
                <div className="animate-[fadeIn_0.3s_ease-out]">
                    {!pitchDeck ? (
                         loadingPitchDeck ? (
                            <div className="p-8 text-center">
                                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                <p className="text-white animate-pulse">{t.loading.pitchDeck}</p>
                            </div>
                         ) : (
                             <div className="text-center py-8">
                                <NeonButton onClick={handleLoadPitchDeck} className="bg-white text-black hover:bg-gray-200 shadow-white border-white">{t.pitchDeck.genBtn}</NeonButton>
                             </div>
                         )
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-end">
                                <NeonButton 
                                    onClick={downloadPitchDeckPDF} 
                                    disabled={isDownloadingDeck}
                                    className="text-xs py-2 px-4 bg-white text-black hover:bg-gray-200 border-white"
                                >
                                    {isDownloadingDeck ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                            <span>{t.downloading}</span>
                                        </div>
                                    ) : (
                                        t.pitchDeck.downloadPdf
                                    )}
                                </NeonButton>
                            </div>
                            
                            <div id="pitch-deck-container" className="space-y-8">
                                {pitchDeck.slides.map((slide, idx) => (
                                    <div key={idx} className="pitch-slide aspect-video bg-black border-2 border-white p-8 relative overflow-hidden flex flex-col justify-center">
                                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-neon-blue via-neon-pink to-neon-purple"></div>
                                        
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Slide {idx + 1}</div>
                                        
                                        <h3 className="text-4xl font-bold text-white uppercase mb-2 font-orbitron">{slide.title}</h3>
                                        <p className="text-neon-blue text-lg font-bold mb-8 uppercase tracking-widest">{slide.subtitle}</p>
                                        
                                        <div className="space-y-4">
                                            {slide.bullets.map((bullet, bIdx) => (
                                                <div key={bIdx} className="flex items-start gap-4">
                                                    <div className="w-2 h-2 bg-white rotate-45 mt-2 flex-shrink-0"></div>
                                                    <p className="text-gray-300 text-lg leading-relaxed">{bullet}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                            <span className="text-xs font-bold text-gray-600 uppercase">Fad ventures</span>
                                            <div className="w-4 h-4 bg-neon-blue rounded-sm"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB CONTENT: SUPPLIER OUTREACH */}
            {activeDetailTab === 'supplier' && (
                <div className="animate-[fadeIn_0.3s_ease-out] space-y-6">
                    {/* Verified Links Section */}
                    <div>
                        <h4 className="text-neon-yellow font-bold uppercase mb-4 text-xs tracking-widest border-b border-gray-800 pb-1">
                            {t.supplier.verifiedSources}
                        </h4>
                        
                        {loadingSourcing ? (
                            <div className="py-8 text-center">
                                <div className="w-6 h-6 border-2 border-neon-yellow border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                <p className="text-neon-yellow text-xs animate-pulse">{t.loading.sourcing}</p>
                            </div>
                        ) : sourcingLinks && sourcingLinks.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2">
                                {sourcingLinks.map((link, idx) => (
                                    <a 
                                        key={idx} 
                                        href={link.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex justify-between items-center bg-black/40 border border-gray-700 hover:border-neon-yellow p-3 rounded transition-colors group"
                                    >
                                        <div className="truncate pr-4">
                                            <div className="text-white font-bold text-sm truncate">{link.title}</div>
                                            <div className="text-xs text-gray-500 uppercase">{link.source}</div>
                                        </div>
                                        <div className="text-neon-yellow group-hover:translate-x-1 transition-transform">
                                            ↗
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-500 text-sm italic py-4 text-center border border-dashed border-gray-800 rounded">
                                {t.supplier.noLinks}
                            </div>
                        )}
                    </div>

                    <div className="bg-neon-yellow/10 border border-neon-yellow/30 p-4 rounded-lg text-center mt-6">
                        <p className="text-sm text-gray-300 mb-4">{t.supplier.intro}</p>
                        <button 
                            onClick={() => openSearch(detailIdea.platformSource, detailIdea.machineName)}
                            className="bg-neon-yellow text-black font-bold uppercase text-sm px-6 py-3 rounded-lg hover:bg-white hover:scale-105 transition-all shadow-[0_0_15px_#f9f871]"
                        >
                            {t.supplier.findBtn(detailIdea.platformSource)} 
                            <span className="ml-2">↗</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Subject Line</label>
                                <button 
                                    onClick={() => copyToClipboard(t.supplier.template.subject(detailIdea.machineName))}
                                    className="text-xs text-neon-blue hover:text-white uppercase font-bold"
                                >
                                    {t.supplier.copySubjectBtn}
                                </button>
                            </div>
                            <div className="bg-black/40 border border-gray-700 rounded p-3 text-sm text-white font-mono select-all">
                                {t.supplier.template.subject(detailIdea.machineName)}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Message Body</label>
                                <button 
                                    onClick={() => copyToClipboard(t.supplier.template.body(detailIdea.platformSource, detailIdea.machineName, currentUser?.name || "Global Buyer"))}
                                    className="text-xs text-neon-blue hover:text-white uppercase font-bold"
                                >
                                    {t.supplier.copyBodyBtn}
                                </button>
                            </div>
                            <div className="bg-black/40 border border-gray-700 rounded p-3 text-sm text-gray-300 font-mono whitespace-pre-wrap select-all h-64 overflow-y-auto custom-scrollbar">
                                {t.supplier.template.body(detailIdea.platformSource, detailIdea.machineName, currentUser?.name || "Global Buyer")}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 pt-4 border-t border-gray-800 flex justify-end items-center gap-4">
               <NeonButton 
                   color="pink" 
                   onClick={() => handleIdeaSelect(detailIdea)}
                   className="text-xs py-2 px-6"
               >
                   {t.analyzeBtn}
               </NeonButton>
               <button onClick={closeDetails} className="text-gray-400 hover:text-white text-sm font-bold uppercase tracking-widest px-4 py-2">
                   {t.closeBtn}
               </button>
            </div>
        </div>
      ) : null}
    </NeonModal>
  );

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <LoadingScan text="INITIALIZING SYSTEM..." />
      </div>
    );
  }

  // Auth Screen
  if (appState === AppState.LOGIN) {
    return <Auth t={t} error={error} onGuestLogin={handleGuestLogin} />;
  }
  
  // NEW: Simulation Mode Screen
  if (appState === AppState.SIMULATION_MODE && currentUser) {
      return (
          <div className="min-h-screen bg-black text-white font-sans selection:bg-neon-green selection:text-black">
              {renderNavBar()}
              <SimulationMode 
                  user={currentUser} 
                  language={language}
                  onExit={() => {
                      // Exit simulation logic: logout or return to home
                      handleLogout(); 
                  }}
                  t={t}
              />
          </div>
      );
  }

  // Dashboard Screen
  if (appState === AppState.DASHBOARD && currentUser) {
      return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-neon-pink selection:text-white">
           {renderNavBar()}
           <UserDashboard 
              user={currentUser} 
              savedIdeas={savedIdeas}
              recommendedIdeas={recommendedIdeas}
              onViewIdea={handleViewDetails}
              onGenerateRecommendations={handleGenerateRecommendations}
              onGetFundingPlan={handleGetFundingPlan}
              onSaveIdea={handleSaveIdea}
              isGeneratingRecs={isGeneratingRecs}
              t={t}
           />
           {renderDetailModal()}
           <ChatWidget 
              appState={appState} 
              selectedIndustry={selectedIndustry} 
              selectedIdea={selectedIdea || detailIdea} 
              currentUser={currentUser}
              t={t}
              language={language}
           />
        </div>
      )
  }

  // Admin Dashboard Screen
  if (appState === AppState.ADMIN_DASHBOARD && currentUser && currentUser.role === 'admin') {
      return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-neon-pink selection:text-white">
           {renderNavBar()}
           <AdminDashboard 
              user={currentUser} 
              onAddIdea={handleAdminAddIdea}
              t={t}
           />
        </div>
      )
  }

  // Lender Dashboard Screen
  if (appState === AppState.LENDER_DASHBOARD && currentUser && currentUser.role === 'lender') {
      return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-neon-pink selection:text-white">
           {renderNavBar()}
           <LenderDashboard 
              user={currentUser} 
              onAnalyze={handleAnalyzeCreditRisk}
              t={t}
           />
        </div>
      )
  }

  // Community Screen
  if (appState === AppState.COMMUNITY && currentUser) {
      return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-neon-pink selection:text-white">
           {renderNavBar()}
           <Community 
              user={currentUser} 
              posts={communityPosts}
              onAddPost={handleAddPost}
              onLikePost={handleLikePost}
              t={t}
           />
           <ChatWidget 
              appState={appState} 
              selectedIndustry={null} 
              selectedIdea={null} 
              currentUser={currentUser}
              t={t}
              language={language}
           />
        </div>
      )
  }

  // About Screen
  if (appState === AppState.ABOUT) {
      return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-neon-pink selection:text-white">
           {renderNavBar()}
           <About t={t} onBack={() => currentUser ? setAppState(AppState.SELECT_INDUSTRY) : setAppState(AppState.LOGIN)} />
        </div>
      )
  }

  // Main App Flow
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-neon-pink selection:text-white overflow-x-hidden">
      {renderNavBar()}

      {appState === AppState.SELECT_INDUSTRY && renderIndustrySelection()}
      
      {appState === AppState.USER_PROFILE && renderUserProfile()}

      {appState === AppState.LOADING_PROFILE_IDEAS && <LoadingScan text={t.loading.profile} />}

      {appState === AppState.LOADING_IDEAS && <LoadingScan text={t.loading.scanning(selectedIndustry?.name || '')} />}
      
      {appState === AppState.SELECT_IDEA && renderIdeaSelection()}
      
      {appState === AppState.LOADING_CANVAS && <LoadingScan text={t.loading.canvas} />}
      
      {appState === AppState.VIEW_CANVAS && renderCanvasView()}

      {/* Detail Modal (available in multiple states if triggered) */}
      {renderDetailModal()}

      {/* Global Chat Widget */}
      <ChatWidget 
         appState={appState} 
         selectedIndustry={selectedIndustry} 
         selectedIdea={selectedIdea || detailIdea} 
         currentUser={currentUser}
         t={t}
         language={language}
      />

    </div>
  );
};

export default App;