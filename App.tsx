import React, { useState, useEffect } from 'react';
import { INDUSTRIES } from './constants';
import { NeonCard, NeonButton, NeonInput, NeonTextArea, NeonSelect, LoadingScan, NeonModal } from './components/NeonUI';
import { generateIdeas, generateCanvas, generatePersonalizedIdeas, generateBusinessDetails } from './services/geminiService';
import { Industry, BusinessIdea, BusinessCanvas, AppState, UserProfile, Language, BusinessDetails, User } from './types';
import { TRANSLATIONS } from './locales';
import { Auth } from './components/Auth';
import { UserDashboard, AdminDashboard } from './components/Dashboards';
import { About } from './components/About';
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

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.LOGIN);
  const [language, setLanguage] = useState<Language>('en');
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);
  const [canvas, setCanvas] = useState<BusinessCanvas | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Database State
  const [savedIdeas, setSavedIdeas] = useState<BusinessIdea[]>([]);
  const [customIdeas, setCustomIdeas] = useState<BusinessIdea[]>([]);
  
  // Dashboard Recommendation State
  const [recommendedIdeas, setRecommendedIdeas] = useState<BusinessIdea[]>([]);
  const [isGeneratingRecs, setIsGeneratingRecs] = useState(false);

  // Details Modal State
  const [detailIdea, setDetailIdea] = useState<BusinessIdea | null>(null);
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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

  const handleGuestLogin = () => {
      const guestUser: User = {
          id: 'guest',
          email: 'guest@neon.com',
          name: 'Guest Operative',
          role: 'user',
          profile: {
            name: 'Guest Operative',
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
      setAppState(AppState.SELECT_INDUSTRY);
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

    setCurrentUser({
      id: authUser.id,
      email: authUser.email,
      name: finalProfile.name,
      role: 'user', // Basic role for now
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
          industryId: item.industry_id
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
           is_saved: true
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
        setIdeas(allIdeas);
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
        setIdeas(generatedIdeas);
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
                return [...prev, ...filteredNew];
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
    setLoadingDetails(true);
    
    try {
      const details = await generateBusinessDetails(idea, language);
      if (!details) {
        setLoadingDetails(false);
      } else {
        setBusinessDetails(details);
        setLoadingDetails(false);
      }
    } catch (e) {
      console.error(e);
      setLoadingDetails(false);
    }
  };

  const closeDetails = () => {
    setDetailIdea(null);
    setBusinessDetails(null);
    setLoadingDetails(false);
  };

  const handleIdeaSelect = async (idea: BusinessIdea) => {
    if (detailIdea) closeDetails();
    
    setSelectedIdea(idea);
    setAppState(AppState.LOADING_CANVAS);
    setError(null);
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
        const key = 'neon_saved_canvases';
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
              backgroundColor: '#050505', // Force dark background
              useCORS: true
          });
          
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape, millimeters, A4
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`${selectedIdea?.businessTitle.replace(/\s+/g, '_')}_Canvas.pdf`);
      } catch (err) {
          console.error("Failed to generate PDF", err);
          alert("Error generating PDF. Please try again.");
      } finally {
          setIsDownloadingPdf(false);
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

  const renderNavBar = () => {
      // Logic modified to show NavBar container even when logged out
      return (
          <div className="flex justify-between items-center p-4 bg-black border-b border-gray-900 sticky top-0 z-20 backdrop-blur-md bg-opacity-80">
              <div className="flex items-center gap-4">
                  <span className="font-orbitron font-bold text-xl tracking-tighter cursor-pointer" onClick={() => currentUser ? setAppState(AppState.SELECT_INDUSTRY) : setAppState(AppState.LOGIN)}>
                      <span className="text-white">NEON</span>
                      <span className="text-neon-blue">ID</span>
                  </span>
                  
                  {/* Nav Links */}
                  <div className="hidden md:flex items-center gap-6 ml-8">
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
                            <UserIcon /> {currentUser.role === 'admin' ? t.nav.admin : t.nav.profile}
                        </button>
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
          <span className="text-white">NEON</span>
          <span className="text-neon-blue">{t.appTitle}</span>
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

  const renderIdeaSelection = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4 items-center">
            <button onClick={reset} className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeftIcon />
            <span className="ml-2 uppercase tracking-widest">{t.backToSectors}</span>
            </button>
        </div>
        <div className="text-right">
          <h2 className="text-neon-blue text-xl font-bold uppercase">{selectedIndustry?.id === 'custom' ? t.industries['custom'] : (selectedIndustry ? t.industries[selectedIndustry.id] : '')}</h2>
          <p className="text-xs text-gray-500">{t.scanComplete(ideas.length)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {ideas.map((idea, idx) => {
          const isSaved = savedIdeas.some(i => i.businessTitle === idea.businessTitle || i.id === idea.id);
          return (
            <NeonCard key={idx} color="pink" className="flex flex-col h-full" hoverEffect={false}>
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
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{idea.businessTitle}</h3>
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
  );

  const renderBusinessCanvas = () => {
    if (!canvas || !selectedIdea) return null;

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
          <div className="flex items-center gap-4 mb-4 md:mb-0">
              <button onClick={goBackToIdeas} className="flex items-center text-gray-400 hover:text-white transition-colors">
                <ArrowLeftIcon />
                <span className="ml-2 uppercase tracking-widest">{t.backToIdeas}</span>
              </button>
              
              <NeonButton color="purple" onClick={saveCanvasToLocal} className="text-xs py-2 px-3">
                  {t.saveCanvasLocal}
              </NeonButton>

              <NeonButton 
                  color="blue" 
                  onClick={downloadCanvasAsPDF} 
                  className="text-xs py-2 px-3 flex items-center gap-2"
                  disabled={isDownloadingPdf}
              >
                  {isDownloadingPdf ? (
                      <>
                          <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
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
          <div className="text-right">
            <h2 className="text-3xl font-bold text-white">{selectedIdea.businessTitle}</h2>
            <p className="text-neon-blue font-mono">{selectedIdea.machineName}</p>
          </div>
        </div>

        {/* Canvas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-grow min-h-0 overflow-y-auto pb-8">
          {/* Left Col */}
          <div className="grid grid-rows-2 gap-4 md:col-span-1">
             <CanvasBlock title={t.canvasSections.keyPartners} items={canvas.keyPartners} color="purple" />
             <CanvasBlock title={t.canvasSections.costStructure} items={canvas.costStructure} color="pink" />
          </div>
          {/* Left-Mid Col */}
          <div className="grid grid-rows-2 gap-4 md:col-span-1">
             <CanvasBlock title={t.canvasSections.keyActivities} items={canvas.keyActivities} color="blue" />
             <CanvasBlock title={t.canvasSections.keyResources} items={canvas.keyResources} color="blue" />
          </div>
          {/* Center Col */}
          <div className="md:col-span-1">
             <CanvasBlock title={t.canvasSections.valuePropositions} items={canvas.valuePropositions} color="green" className="h-full border-neon-green shadow-neon-green border-opacity-30" />
          </div>
          {/* Right-Mid Col */}
          <div className="grid grid-rows-2 gap-4 md:col-span-1">
             <CanvasBlock title={t.canvasSections.customerRelationships} items={canvas.customerRelationships} color="blue" />
             <CanvasBlock title={t.canvasSections.channels} items={canvas.channels} color="blue" />
          </div>
           {/* Right Col */}
           <div className="grid grid-rows-2 gap-4 md:col-span-1">
             <CanvasBlock title={t.canvasSections.customerSegments} items={canvas.customerSegments} color="purple" />
             <CanvasBlock title={t.canvasSections.revenueStreams} items={canvas.revenueStreams} color="pink" />
          </div>
        </div>

        {/* Hidden Print View for PDF Generation - Optimized for A4 Landscape */}
        <div 
            id="canvas-pdf-export" 
            className="fixed top-0 left-[-9999px] bg-dark-bg p-8 text-white w-[1122px] h-auto min-h-[793px]"
            style={{ 
                fontFamily: "'Rajdhani', sans-serif",
                background: '#050505'
            }}
        >
            {/* Header / Summary */}
            <div className="mb-6 border-b border-gray-800 pb-4">
                <div className="flex justify-between items-start mb-4">
                     <div>
                        <h1 className="text-4xl font-bold text-white mb-2 font-orbitron">{selectedIdea.businessTitle}</h1>
                        <h2 className="text-2xl text-neon-blue font-mono">{selectedIdea.machineName}</h2>
                     </div>
                     <div className="text-right opacity-50">
                         <div className="text-sm">GENERATED BY NEON VENTURES</div>
                         <div className="text-xs font-mono">{new Date().toLocaleDateString()}</div>
                     </div>
                </div>
                <div className="bg-dark-card border border-gray-800 p-4 rounded-lg">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Business Summary</h3>
                    <p className="text-gray-300">{selectedIdea.description}</p>
                </div>
            </div>

            {/* Canvas Grid - Fixed Aspect Ratio for Print */}
            <div className="grid grid-cols-5 gap-4 h-[600px]">
                {/* Left Col */}
                <div className="grid grid-rows-2 gap-4 col-span-1">
                    <CanvasBlock title={t.canvasSections.keyPartners} items={canvas.keyPartners} color="purple" className="overflow-visible" />
                    <CanvasBlock title={t.canvasSections.costStructure} items={canvas.costStructure} color="pink" className="overflow-visible" />
                </div>
                {/* Left-Mid Col */}
                <div className="grid grid-rows-2 gap-4 col-span-1">
                    <CanvasBlock title={t.canvasSections.keyActivities} items={canvas.keyActivities} color="blue" className="overflow-visible" />
                    <CanvasBlock title={t.canvasSections.keyResources} items={canvas.keyResources} color="blue" className="overflow-visible" />
                </div>
                {/* Center Col */}
                <div className="col-span-1">
                    <CanvasBlock title={t.canvasSections.valuePropositions} items={canvas.valuePropositions} color="green" className="h-full border-neon-green overflow-visible" />
                </div>
                {/* Right-Mid Col */}
                <div className="grid grid-rows-2 gap-4 col-span-1">
                    <CanvasBlock title={t.canvasSections.customerRelationships} items={canvas.customerRelationships} color="blue" className="overflow-visible" />
                    <CanvasBlock title={t.canvasSections.channels} items={canvas.channels} color="blue" className="overflow-visible" />
                </div>
                {/* Right Col */}
                <div className="grid grid-rows-2 gap-4 col-span-1">
                    <CanvasBlock title={t.canvasSections.customerSegments} items={canvas.customerSegments} color="purple" className="overflow-visible" />
                    <CanvasBlock title={t.canvasSections.revenueStreams} items={canvas.revenueStreams} color="pink" className="overflow-visible" />
                </div>
            </div>
        </div>
      </div>
    );
  };

  if (loadingSession) {
    return (
       <div className="min-h-screen bg-dark-bg flex items-center justify-center">
          <LoadingScan text="Initializing Connection..." />
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200 selection:bg-neon-pink selection:text-white relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue rounded-full opacity-5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-purple rounded-full opacity-5 blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {renderNavBar()}

        <main className="flex-grow">
          {appState === AppState.LOGIN && (
              <Auth t={t} onGuestLogin={handleGuestLogin} />
          )}

          {appState === AppState.ABOUT && (
              <About t={t} onBack={() => currentUser ? setAppState(AppState.SELECT_INDUSTRY) : setAppState(AppState.LOGIN)} />
          )}

          {appState === AppState.DASHBOARD && currentUser && (
              currentUser.role === 'admin' 
                  ? <AdminDashboard user={currentUser} onAddIdea={handleAdminAddIdea} t={t} />
                  : <UserDashboard 
                      user={currentUser} 
                      savedIdeas={savedIdeas} 
                      recommendedIdeas={recommendedIdeas}
                      onViewIdea={handleViewDetails} 
                      onGenerateRecommendations={handleGenerateRecommendations}
                      isGeneratingRecs={isGeneratingRecs}
                      t={t} 
                    />
          )}

          {appState === AppState.SELECT_INDUSTRY && renderIndustrySelection()}
          
          {appState === AppState.USER_PROFILE && renderUserProfile()}

          {(appState === AppState.LOADING_IDEAS || appState === AppState.LOADING_PROFILE_IDEAS) && (
            <LoadingScan text={
              appState === AppState.LOADING_PROFILE_IDEAS 
              ? t.loading.profile 
              : t.loading.scanning(selectedIndustry ? (t.industries[selectedIndustry.id] || selectedIndustry.name) : '')
            } />
          )}
          
          {appState === AppState.SELECT_IDEA && renderIdeaSelection()}
          
          {appState === AppState.LOADING_CANVAS && (
            <LoadingScan text={t.loading.canvas} />
          )}
          
          {appState === AppState.VIEW_CANVAS && renderBusinessCanvas()}

          {/* Global Details Modal */}
          <NeonModal 
            isOpen={!!detailIdea} 
            onClose={closeDetails} 
            title={detailIdea?.businessTitle}
          >
            {loadingDetails ? (
               <div className="py-12">
                 <LoadingScan text={t.loading.details} />
               </div>
            ) : businessDetails ? (
               <div className="space-y-6">
                  <div>
                    <h4 className="text-neon-blue font-bold uppercase mb-2 text-sm">{t.detailsSections.audience}</h4>
                    <p className="text-gray-300">{businessDetails.targetAudience}</p>
                  </div>
                  <div>
                    <h4 className="text-neon-purple font-bold uppercase mb-2 text-sm">{t.detailsSections.requirements}</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {businessDetails.operationalRequirements.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-green-900/20 p-4 rounded border border-green-900">
                        <h4 className="text-neon-green font-bold uppercase mb-2 text-sm">{t.detailsSections.pros}</h4>
                        <ul className="space-y-1">
                          {businessDetails.pros.map((p, i) => <li key={i} className="text-sm text-gray-300 flex items-start"><span className="text-neon-green mr-2">+</span>{p}</li>)}
                        </ul>
                     </div>
                     <div className="bg-red-900/20 p-4 rounded border border-red-900">
                        <h4 className="text-red-400 font-bold uppercase mb-2 text-sm">{t.detailsSections.cons}</h4>
                         <ul className="space-y-1">
                          {businessDetails.cons.map((c, i) => <li key={i} className="text-sm text-gray-300 flex items-start"><span className="text-red-400 mr-2">-</span>{c}</li>)}
                        </ul>
                     </div>
                  </div>
                  <div>
                    <h4 className="text-neon-pink font-bold uppercase mb-2 text-sm">{t.detailsSections.marketing}</h4>
                    <p className="text-gray-300 italic border-l-2 border-neon-pink pl-4">{businessDetails.marketingQuickTip}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-700 flex justify-end gap-4">
                     <button onClick={closeDetails} className="text-gray-400 hover:text-white uppercase text-sm font-bold tracking-wider px-4">
                       {t.closeBtn}
                     </button>
                     <NeonButton color="pink" onClick={() => detailIdea && handleIdeaSelect(detailIdea)}>
                       {t.analyzeBtn}
                     </NeonButton>
                  </div>
               </div>
            ) : (
              <div className="text-red-500">{t.errors.detailsFail}</div>
            )}
          </NeonModal>
        </main>

        {/* Chat Widget - Always rendered but only visible if currentUser is present */}
        {currentUser && (
            <ChatWidget 
                appState={appState} 
                selectedIndustry={selectedIndustry} 
                selectedIdea={selectedIdea} 
                currentUser={currentUser}
                t={t}
                language={language}
            />
        )}
      </div>
    </div>
  );
};

export default App;