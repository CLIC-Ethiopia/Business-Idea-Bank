import { Language } from './types';

interface LocaleStrings {
  appTitle: string;
  appSubtitle: string;
  buildProfileBtn: string;
  scanBtn: string;
  backToSectors: string;
  backToHome: string;
  backToIdeas: string;
  generateMoreBtn: string;
  saveCanvasLocal: string;
  downloadPdf: string;
  downloading: string;
  canvasSavedMsg: string;
  scanComplete: (count: number) => string;
  investment: string;
  potential: string;
  analyzeBtn: string;
  detailsBtn: string;
  saveBtn: string;
  savedBtn: string;
  closeBtn: string;
  profileTitle: string;
  profileSubtitle: string;
  nav: {
    home: string;
    profile: string;
    admin: string;
    about: string;
    logout: string;
    login: string;
  };
  login: {
    title: string;
    subtitle: string;
    emailLabel: string;
    passLabel: string;
    loginBtn: string;
    googleBtn: string;
    fbBtn: string;
    guestBtn: string;
  };
  dashboard: {
    title: string;
    welcome: (name: string) => string;
    savedIdeas: string;
    noSaved: string;
    adminStats: string;
    addIdea: string;
    totalUsers: string;
    ideasGen: string;
    activeSessions: string;
    createBtn: string;
    profileSection: string;
    education: string;
    experience: string;
    updateBtn: string;
    recommended: string;
    scanningRecs: string;
    updateProfileHint: string;
    recTag: string;
    systemLogs: string;
  };
  chat: {
    header: string;
    placeholder: string;
    greeting: string;
    error: string;
    suggestions: {
        risks: (title: string) => string;
        market: (name: string) => string;
        startup: string;
        profitable: string;
    }
  };
  about: {
    intro: string;
    missionTitle: string;
    missionText: string;
    step1Title: string;
    step1Text: string;
    step2Title: string;
    step2Text: string;
    step3Title: string;
    step3Text: string;
    featuresTitle: string;
    features: string[];
    backBtn: string;
  };
  labels: {
    name: string;
    budget: string;
    skills: string;
    interests: string;
    risk: string;
    time: string;
    industry: string;
  };
  placeholders: {
    name: string;
    skills: string;
    interests: string;
    email: string;
    password: string;
    ideaTitle: string;
    machineName: string;
    desc: string;
    price: string;
    revenue: string;
    education: string;
    experience: string;
    skillReqs: string;
    operationalReqs: string;
  };
  options: {
    budget: Record<string, string>;
    risk: Record<string, string>;
    time: Record<string, string>;
  };
  submitProfileBtn: string;
  loading: {
    scanning: (sector: string) => string;
    scanningWeb: string;
    profile: string;
    canvas: string;
    details: string;
  };
  industries: Record<string, string>;
  canvasSections: Record<string, string>;
  detailsSections: {
    audience: string;
    requirements: string;
    skillRequirements: string;
    pros: string;
    cons: string;
    marketing: string;
  };
  errors: {
    noIdeas: string;
    connection: string;
    canvasFail: string;
    detailsFail: string;
    loginFail: string;
  }
}

export const TRANSLATIONS: Record<Language, LocaleStrings> = {
  en: {
    appTitle: "VENTURES",
    appSubtitle: "Select an industry sector to initialize the scanning protocol. We will locate machine-based business opportunities for you.",
    buildProfileBtn: "Build Entrepreneur Profile",
    scanBtn: "Scan Sector",
    backToSectors: "Back to Sectors",
    backToHome: "Back to Home",
    backToIdeas: "Back to Ideas",
    generateMoreBtn: "Generate More Ideas",
    saveCanvasLocal: "Save Canvas (Local)",
    downloadPdf: "Download PDF",
    downloading: "Generating PDF...",
    canvasSavedMsg: "Canvas saved to local storage successfully.",
    scanComplete: (c) => `Scan Complete: ${c} Opportunities Found`,
    investment: "Investment",
    potential: "Potential",
    analyzeBtn: "Analyze Model",
    detailsBtn: "View Details",
    saveBtn: "Save Idea",
    savedBtn: "Saved",
    closeBtn: "Close",
    profileTitle: "ENTREPRENEUR PROFILE",
    profileSubtitle: "Calibrate the AI to match your capabilities with market opportunities.",
    nav: {
      home: "Scanner",
      profile: "Profile",
      admin: "Admin Deck",
      about: "About",
      logout: "Log Out",
      login: "Login"
    },
    login: {
      title: "ACCESS TERMINAL",
      subtitle: "Authenticate to access the Idea Bank",
      emailLabel: "Identity / Email",
      passLabel: "Access Code / Password",
      loginBtn: "Initialize Session",
      googleBtn: "Continue with Google",
      fbBtn: "Continue with Facebook",
      guestBtn: "Enter as Admin (Guest)"
    },
    dashboard: {
      title: "DASHBOARD",
      welcome: (n) => `Welcome back, Commander ${n}`,
      savedIdeas: "Saved Business Concepts",
      noSaved: "No concepts archived yet. Return to the Scanner.",
      adminStats: "System Statistics",
      addIdea: "Inject New Concept",
      totalUsers: "Total Operatives",
      ideasGen: "Concepts Generated",
      activeSessions: "Active Uplinks",
      createBtn: "Upload to Bank",
      profileSection: "Operative Data & Capabilities",
      education: "Education / Training",
      experience: "Professional Experience",
      updateBtn: "Update & Generate Recommendations",
      recommended: "AI Recommended Opportunities",
      scanningRecs: "Scanning Neural Network for Matches...",
      updateProfileHint: "Update your profile to receive AI-powered recommendations.",
      recTag: "REC",
      systemLogs: "System Logs"
    },
    chat: {
        header: "PROF. FAD AI",
        placeholder: "Ask Prof. Fad...",
        greeting: "Greetings, Operative! Prof. Fad here. Need a business breakthrough?",
        error: "System glitch! Re-aligning neural pathways...",
        suggestions: {
            risks: (title) => `What are the biggest risks for ${title}?`,
            market: (name) => `How do I market ${name}?`,
            startup: "Which industry has the lowest startup cost?",
            profitable: "What is the most profitable sector right now?"
        }
    },
    about: {
      intro: "NeonVentures is a futuristic intelligence platform designed to identify tangible, machine-based micro-business opportunities for the modern entrepreneur.",
      missionTitle: "The Mission",
      missionText: "Our core directive is to democratize access to manufacturing and service-based business models. By analyzing global supply chains (like Alibaba and Amazon) and correlating them with local market needs, we generate actionable business blueprints. We don't just give you an idea; we give you the machine, the strategy, and the roadmap.",
      step1Title: "Scan & Identify",
      step1Text: "Select a sector or build your profile. Our AI scans global marketplaces to find affordable machines that power high-margin businesses.",
      step2Title: "Analyze Model",
      step2Text: "Deep dive into the operational requirements. We generate a full Business Model Canvas, SWOT analysis, and marketing tips instantly.",
      step3Title: "Execute & Save",
      step3Text: "Save your favorite concepts to your dashboard. Review operational requirements and prepare for deployment.",
      featuresTitle: "System Features",
      features: [
        "AI-Powered Market Scanning",
        "Real-time Machine Sourcing Data",
        "Instant Business Model Canvas Generation",
        "Personalized Opportunity Matching",
        "Operational Requirement Analysis",
        "Cyberpunk UI for Enhanced Focus"
      ],
      backBtn: "Return to Terminal"
    },
    labels: {
      name: "Name",
      budget: "Estimated Budget",
      skills: "Key Skills",
      interests: "Interests & Hobbies",
      risk: "Risk Tolerance",
      time: "Time Commitment",
      industry: "Industry Sector"
    },
    placeholders: {
      name: "Enter your alias",
      skills: "e.g. Graphic Design, Welding, Coding...",
      interests: "e.g. 3D Printing, Outdoors...",
      email: "operative@neon.com",
      password: "••••••••",
      ideaTitle: "Business Title",
      machineName: "Machine Name",
      desc: "Brief description...",
      price: "$2,000 - $5,000",
      revenue: "$5,000/month",
      education: "e.g. BSc Mechanical Engineering, Self-taught Python",
      experience: "e.g. 5 years in automotive repair, 2 years retail",
      skillReqs: "e.g. Basic Welding, AutoCAD, Sales (Comma Separated)",
      operationalReqs: "e.g. 50sqm Space, 3-Phase Power, Food License (Comma Separated)"
    },
    options: {
      budget: {
        'Under $1,000': 'Under $1,000 (Micro)',
        '$1,000 - $5,000': '$1,000 - $5,000 (Small)',
        '$5,000 - $20,000': '$5,000 - $20,000 (Medium)',
        '$20,000+': '$20,000+ (Large)'
      },
      risk: {
        'Low': 'Low (Safe Bets)',
        'Medium': 'Medium (Calculated)',
        'High': 'High (Moonshots)'
      },
      time: {
        'Part-time': 'Part-time / Side Hustle',
        'Full-time': 'Full-time'
      }
    },
    submitProfileBtn: "Analyze & Generate Matches",
    loading: {
      scanning: (s) => `Scanning Global Markets for ${s}...`,
      scanningWeb: "Scanning Deep Web...",
      profile: "Analyzing Profile & Matching Technology...",
      canvas: "Generating Business Model Strategy...",
      details: "Fetching Business Intelligence..."
    },
    industries: {
      'agri': 'Agriculture & Farming',
      'food_bev': 'Food & Beverage Mfg',
      'light_mfg': 'Light Manufacturing (Textiles/Paper)',
      'heavy_mfg': 'Heavy Manufacturing (Metal/Machinery)',
      'construction': 'Construction & Utilities',
      'automotive': 'Automotive & Transport',
      'waste': 'Waste Management & Recycling',
      'services': 'Professional Services',
      'health': 'Health & Personal Care',
      'hospitality': 'Hospitality & Tourism',
      'ict': 'ICT & Electronics',
      'mining': 'Mining & Primary Materials',
      'custom': 'Personalized Matches'
    },
    canvasSections: {
      keyPartners: "Key Partners",
      keyActivities: "Key Activities",
      keyResources: "Key Resources",
      valuePropositions: "Value Propositions",
      customerRelationships: "Customer Relationships",
      channels: "Channels",
      customerSegments: "Customer Segments",
      costStructure: "Cost Structure",
      revenueStreams: "Revenue Streams"
    },
    detailsSections: {
      audience: "Target Audience",
      requirements: "Operational Requirements",
      skillRequirements: "Skill Requirements",
      pros: "Pros",
      cons: "Cons",
      marketing: "Marketing Quick Tip"
    },
    errors: {
      noIdeas: "AI could not generate ideas. Please try again.",
      connection: "Connection error. Check API Key.",
      canvasFail: "Failed to generate canvas.",
      detailsFail: "Failed to load details.",
      loginFail: "Authentication Failed. Use 'admin'/'admin' or 'user'/'user'."
    }
  },
  am: {
    appTitle: "ቬንቸርስ",
    appSubtitle: "የፍተሻ ፕሮቶኮሉን ለመጀመር የኢንዱስትሪ ዘርፍ ይምረጡ። በማሽን ላይ የተመሰረቱ የንግድ እድሎችን እንፈልግልዎታለን።",
    buildProfileBtn: "የኢንተርፕረነር መገለጫ ይገንቡ",
    scanBtn: "ዘርፉን ይቃኙ",
    backToSectors: "ወደ ዘርፎች ይመለሱ",
    backToHome: "ወደ መነሻ ገጽ ይመለሱ",
    backToIdeas: "ወደ ሀሳቦች ይመለሱ",
    generateMoreBtn: "ተጨማሪ ሀሳቦችን አፍልቅ",
    saveCanvasLocal: "ሸራውን አስቀምጥ (Local)",
    downloadPdf: "PDF አውርድ",
    downloading: "PDF በማዘጋጀት ላይ...",
    canvasSavedMsg: "የንግድ ሞዴል ሸራው በተሳካ ሁኔታ ተቀምጧል።",
    scanComplete: (c) => `ፍተሻ ተጠናቋል: ${c} እድሎች ተገኝተዋል`,
    investment: "መነሻ ካፒታል",
    potential: "ይቻላል ገቢ",
    analyzeBtn: "ሞዴሉን ይተንትኑ",
    detailsBtn: "ዝርዝር ይመልከቱ",
    saveBtn: "አስቀምጥ",
    savedBtn: "ተቀምጧል",
    closeBtn: "ዝጋ",
    profileTitle: "የኢንተርፕረነር መገለጫ",
    profileSubtitle: "ችሎታዎን ከገበያ እድሎች ጋር ለማዛመድ AI ያስተካክሉ።",
    nav: {
      home: "ስካነር",
      profile: "መገለጫ",
      admin: "አድሚን",
      about: "ስለ እኛ",
      logout: "ውጣ",
      login: "ግባት"
    },
    login: {
      title: "መግቢያ ተርሚናል",
      subtitle: "የሀሳብ ባንኩን ለመጠቀም ማንነትዎን ያረጋግጡ",
      emailLabel: "ኢሜይል",
      passLabel: "የይለፍ ቃል",
      loginBtn: "ወደ ውስጥ ግባ",
      googleBtn: "በ Google ይቀጥሉ",
      fbBtn: "በ Facebook ይቀጥሉ",
      guestBtn: "እንደ እንግዳ ይግቡ (Admin)"
    },
    dashboard: {
      title: "ዳሽቦርድ",
      welcome: (n) => `እንኳን በደህና መጡ፣ ${n}`,
      savedIdeas: "የተቀመጡ የንግድ ሀሳቦች",
      noSaved: "እስካሁን ምንም ሀሳቦች አልተቀመጡም። ወደ ስካነሩ ይመለሱ።",
      adminStats: "የስርዓት ስታቲስቲክስ",
      addIdea: "አዲስ ሀሳብ አስገባ",
      totalUsers: "ጠቅላላ ተጠቃሚዎች",
      ideasGen: "የተፈጠሩ ሀሳቦች",
      activeSessions: "ንቁ ተጠቃሚዎች",
      createBtn: "ወደ ባንክ ይጫኑ",
      profileSection: "የተጠቃሚ መረጃ እና ችሎታዎች",
      education: "ትምህርት / ስልጠና",
      experience: "የስራ ልምድ",
      updateBtn: "አዘምን እና ምክሮችን አግኝ",
      recommended: "AI የተጠቆሙ እድሎች",
      scanningRecs: "የነርቭ አውታረ መረብን ለተዛማጅ በመቃኘት ላይ...",
      updateProfileHint: "በ AI የተጎለበተ ምክሮችን ለማግኘት መገለጫዎን ያዘምኑ።",
      recTag: "ምክር",
      systemLogs: "የስርዓት ምዝግብ ማስታወሻዎች"
    },
    chat: {
        header: "ፕሮፌሰር ፋድ AI",
        placeholder: "ፕሮፌሰር ፋድን ይጠይቁ...",
        greeting: "ሰላም ኦፕሬቲቭ! ፕሮፌሰር ፋድ ነኝ። የንግድ ግኝት ይፈልጋሉ?",
        error: "የስርዓት ችግር! የነርቭ መስመሮችን እንደገና በማስተካከል ላይ...",
        suggestions: {
            risks: (title) => `ለ ${title} ዋና ዋና አደጋዎች ምንድን ናቸው?`,
            market: (name) => `${name}ን እንዴት ማስተዋወቅ እችላለሁ?`,
            startup: "ዝቅተኛ መነሻ ካፒታል የሚጠይቀው ዘርፍ የትኛው ነው?",
            profitable: "በአሁኑ ሰዓት እጅግ አትራፊ የሆነው ዘርፍ የትኛው ነው?"
        }
    },
    about: {
      intro: "ኒዮን ቬንቸርስ ለዘመናዊ ኢንተርፕረነሮች ተጨባጭ እና ማሽን ላይ የተመሰረቱ ጥቃቅን የንግድ እድሎችን ለመለየት የተነደፈ የወደፊት ኢንተለጀንስ መድረክ ነው።",
      missionTitle: "ተልዕኮ",
      missionText: "ዋናው አላማችን የማምረቻ እና የአገልግሎት ተኮር የንግድ ሞዴሎችን ተደራሽ ማድረግ ነው። ዓለም አቀፍ የአቅርቦት ሰንሰለቶችን (እንደ Alibaba እና Amazon ያሉ) በመተንተን እና ከአካባቢው ገበያ ፍላጎቶች ጋር በማዛመድ፣ ተግባራዊ የሆኑ የንግድ ንድፎችን እናመነጫለን። ሀሳብ ብቻ ሳይሆን ማሽኑን፣ ስልቱን እና ፍኖተ ካርታውን እንሰጥዎታለን።",
      step1Title: "ይቃኙ እና ይለዩ",
      step1Text: "ዘርፍ ይምረጡ ወይም መገለጫዎን ይገንቡ። የእኛ AI ከፍተኛ ገቢ የሚያስገኙ ንግዶችን የሚያንቀሳቅሱ ተመጣጣኝ ማሽኖችን ለማግኘት ዓለም አቀፍ ገበያዎችን ይቃኛል።",
      step2Title: "ሞዴሉን ይተንትኑ",
      step2Text: "የክወና መስፈርቶችን በጥልቀት ይመርምሩ። ሙሉ የንግድ ሞዴል ሸራ፣ የ SWOT ትንታኔ እና የግብይት ምክሮችን ወዲያውኑ እናመነጫለን።",
      step3Title: "ይተግብሩ እና ያስቀምጡ",
      step3Text: "የሚወዷቸውን ፅንሰ-ሀሳቦች በዳሽቦርድዎ ላይ ያስቀምጡ። የክወና መስፈርቶችን ይገምግሙ እና ለስራ ዝግጁ ይሁኑ።",
      featuresTitle: "የስርዓት ባህሪያት",
      features: [
        "በ AI የሚታገዝ የገበያ ቅኝት",
        "የእውነተኛ ጊዜ ማሽን መረጃ",
        "ፈጣን የንግድ ሞዴል ሸራ ማመንጨት",
        "ለእርስዎ የተበጁ እድሎች",
        "የክወና መስፈርቶች ትንታኔ",
        "ዘመናዊ ሳይበርፓንክ ዩዘር ኢንተርፌስ"
      ],
      backBtn: "ወደ ተርሚናል ተመለስ"
    },
    labels: {
      name: "ስም",
      budget: "የተገመተ በጀት",
      skills: "ቁልፍ ክህሎቶች",
      interests: "ፍላጎቶች እና በትርፍ ጊዜ ማሳለፊያዎች",
      risk: "የአደጋ መቻቻል",
      time: "የጊዜ ቁርጠኝነት",
      industry: "የኢንዱስትሪ ዘርፍ"
    },
    placeholders: {
      name: "የእርስዎን ስም ያስገቡ",
      skills: "ለምሳሌ ግራፊክ ዲዛይን ፣ ብየዳ ፣ ኮዲንግ...",
      interests: "ለምሳሌ 3D ህትመት ፣ ፋሽን...",
      email: "user@neon.com",
      password: "••••••••",
      ideaTitle: "የንግድ ስም",
      machineName: "የማሽን ስም",
      desc: "አጭር መግለጫ...",
      price: "$2,000 - $5,000",
      revenue: "$5,000/በወር",
      education: "ለምሳሌ BSc ምህንድስና",
      experience: "ለምሳሌ የ 5 ዓመት የተሽከርካሪ ጥገና",
      skillReqs: "ለምሳሌ መሰረታዊ ብየዳ ፣ ዲዛይን (በኮማ የተለየ)",
      operationalReqs: "ለምሳሌ 50 ካሬ ሜትር ቦታ፣ ባለ 3 ምዕራፍ ኃይል (በኮማ የተለየ)"
    },
    options: {
      budget: {
        'Under $1,000': 'ከ $1,000 በታች (ጥቃቅን)',
        '$1,000 - $5,000': '$1,000 - $5,000 (አነስተኛ)',
        '$5,000 - $20,000': '$5,000 - $20,000 (መካከለኛ)',
        '$20,000+': '$20,000+ (ትልቅ)'
      },
      risk: {
        'Low': 'ዝቅተኛ (ደህንነቱ የተጠበቀ)',
        'Medium': 'መካከለኛ (የተሰላ)',
        'High': 'ከፍተኛ (ደፋር)'
      },
      time: {
        'Part-time': 'የትርፍ ሰዓት / ተጨማሪ ስራ',
        'Full-time': 'ሙሉ ሰዓት'
      }
    },
    submitProfileBtn: "ተንትን እና ተዛማጅ ሀሳቦችን አፍልቅ",
    loading: {
      scanning: (s) => `ለ ${s} ዓለም አቀፍ ገበያዎችን በመቃኘት ላይ...`,
      scanningWeb: "ድብቅ ድርን በመቃኘት ላይ...",
      profile: "መገለጫን በመተንተን እና ቴክኖሎጂን በማዛመድ ላይ...",
      canvas: "የንግድ ሞዴል ስትራቴጂ በማመንጨት ላይ...",
      details: "የንግድ መረጃን በማምጣት ላይ..."
    },
    industries: {
      'agri': 'ግብርና እና እርሻ',
      'food_bev': 'ምግብ እና መጠጥ ማምረቻ',
      'light_mfg': 'ቀላል ማምረቻ (ጨርቃጨርቅ/ወረቀት)',
      'heavy_mfg': 'ከባድ ማምረቻ (ብረት/ማሽነሪ)',
      'construction': 'ኮንስትራክሽን እና መገልገያዎች',
      'automotive': 'አውቶሞቲቭ እና ትራንስፖርት',
      'waste': 'ቆሻሻ አያያዝ እና እንደገና ጥቅም ላይ ማዋል',
      'services': 'ሙያዊ አገልግሎቶች',
      'health': 'ጤና እና የግል እንክብካቤ',
      'hospitality': 'ሆቴል እና ቱሪዝም',
      'ict': 'ICT እና ኤሌክትሮኒክስ',
      'mining': 'ማዕድን እና ጥሬ ዕቃዎች',
      'custom': 'ለእርስዎ የተመረጡ'
    },
    canvasSections: {
      keyPartners: "ቁልፍ አጋሮች",
      keyActivities: "ቁልፍ ተግባራት",
      keyResources: "ቁልፍ ግብዓቶች",
      valuePropositions: "የሚቀርቡ እሴቶች",
      customerRelationships: "የደንበኞች ግንኙነት",
      channels: "ስርጭት መንገዶች",
      customerSegments: "የደንበኞች ክፍሎች",
      costStructure: "የወጪ መዋቅር",
      revenueStreams: "የገቢ ምንጮች"
    },
    detailsSections: {
      audience: "የታለመ ደንበኛ",
      requirements: "የክወና መስፈርቶች",
      skillRequirements: "የክህሎት መስፈርቶች",
      pros: "ጥቅሞች",
      cons: "ጉዳቶች",
      marketing: "የግብይት ጠቃሚ ምክር"
    },
    errors: {
      noIdeas: "AI ሀሳቦችን ማመንጨት አልቻለም። እባክዎ እንደገና ይሞክሩ።",
      connection: "የግንኙነት ችግር። እባክዎ የበይነመረብ ግንኙነትዎን ያረጋግጡ።",
      canvasFail: "የንግድ ሞዴል ማመንጨት አልተሳካም።",
      detailsFail: "ዝርዝር መረጃን መጫን አልተሳካም።",
      loginFail: "የተሳሳተ መረጃ። 'admin'/'admin' ወይም 'user'/'user' ይጠቀሙ።"
    }
  }
};