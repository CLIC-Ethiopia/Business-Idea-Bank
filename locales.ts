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
    lender: string;
    community: string;
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
    lenderBtn: string;
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
    requestFunding: string;
  };
  admin: {
    tabs: {
        database: string;
        analytics: string;
    };
    analytics: {
        sectorPop: string;
        activity: string;
        keywords: string;
        liveLog: string;
        scans: string;
        saves: string;
    }
  };
  lender: {
      dashboardTitle: string;
      queue: string;
      riskAnalysis: string;
      analyzeBtn: string;
      score: string;
      verdict: string;
      approved: string;
      conditional: string;
      rejected: string;
      strengths: string;
      weaknesses: string;
      stipulations: string;
      maxLoan: string;
      emptyQueue: string;
      applicationDate: string;
      applicant: string;
      requested: string;
  };
  community: {
    title: string;
    subtitle: string;
    feed: string;
    channels: string;
    createPost: string;
    postPlaceholder: string;
    postBtn: string;
    connectBtn: string;
    generalChannel: string;
    filterBy: string;
    noPosts: string;
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
    stressTest: string;
    financials: string;
    roadmap: string;
    sourcing: string;
    riskReport: string;
    pitchDeck: string;
  };
  industries: Record<string, string>;
  canvasSections: Record<string, string>;
  canvasControls: {
    bankMode: string;
    bankModeDesc: string;
  };
  detailsSections: {
    audience: string;
    requirements: string;
    skillRequirements: string;
    pros: string;
    cons: string;
    marketing: string;
  };
  stressTest: {
    tabTitle: string;
    blueprintTab: string;
    saturation: string;
    failureMode: string;
    hiddenCosts: string;
    competitorEdge: string;
    runSimBtn: string;
  };
  roi: {
    tabTitle: string;
    aiEstimateBtn: string;
    inputsTitle: string;
    resultsTitle: string;
    labels: {
        investment: string;
        fixedCost: string;
        costPerUnit: string;
        pricePerUnit: string;
        estSales: string;
    };
    metrics: {
        margin: string;
        breakEven: string;
        monthlyProfit: string;
        breakEvenTime: string;
        months: string;
        units: string;
    };
    landedCost: {
        toggle: string;
        shipping: string;
        customs: string;
        vat: string;
        fees: string;
        total: string;
    };
    disclaimer: string;
  };
  roadmap: {
    tabTitle: string;
    genBtn: string;
    phase: string;
  };
  pitchDeck: {
    tabTitle: string;
    genBtn: string;
    downloadPdf: string;
  };
  upvote: {
        count: string;
        tooltip: string;
        sort: string;
        sortNew: string;
        sortPopular: string;
  };
  supplier: {
    tabTitle: string;
    intro: string;
    verifiedSources: string;
    findBtn: (source: string) => string;
    copySubjectBtn: string;
    copyBodyBtn: string;
    copied: string;
    noLinks: string;
    template: {
        subject: (machine: string) => string;
        body: (platform: string, machine: string, user: string) => string;
    }
  };
  errors: {
    noIdeas: string;
    connection: string;
    canvasFail: string;
    detailsFail: string;
    loginFail: string;
    stressTestFail: string;
    financialsFail: string;
    roadmapFail: string;
    riskReportFail: string;
    pitchDeckFail: string;
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
      lender: "Lender Console",
      community: "Community",
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
      guestBtn: "Enter as Admin (Guest)",
      lenderBtn: "Enter as Lender (Guest)"
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
      systemLogs: "System Logs",
      requestFunding: "Request Funding"
    },
    admin: {
        tabs: {
            database: "Database Management",
            analytics: "Global Intelligence"
        },
        analytics: {
            sectorPop: "Sector Popularity Protocol",
            activity: "Operative Activity (7 Days)",
            keywords: "Trending Search Matrix",
            liveLog: "Live Network Traffic",
            scans: "Scans",
            saves: "Saves"
        }
    },
    lender: {
        dashboardTitle: "CREDIT RISK CONSOLE",
        queue: "Application Queue",
        riskAnalysis: "AI Risk Analysis",
        analyzeBtn: "Run Credit Risk Model",
        score: "Risk Score",
        verdict: "AI Verdict",
        approved: "APPROVED",
        conditional: "CONDITIONAL",
        rejected: "REJECTED",
        strengths: "Key Strengths",
        weaknesses: "Risk Factors",
        stipulations: "Stipulations",
        maxLoan: "Max Loan Cap",
        emptyQueue: "Queue Empty. Waiting for applications.",
        applicationDate: "Date Applied",
        applicant: "Applicant",
        requested: "Requested"
    },
    community: {
      title: "NEON HIVE",
      subtitle: "Collaborate with other operatives. Share intel and form alliances.",
      feed: "Global Feed",
      channels: "Active Frequencies",
      createPost: "Transmit Signal",
      postPlaceholder: "Share your business concept, ask for advice, or look for partners...",
      postBtn: "Broadcast",
      connectBtn: "Connect",
      generalChannel: "General Frequency",
      filterBy: "Filter Protocol",
      noPosts: "No signals detected on this frequency."
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
      details: "Fetching Business Intelligence...",
      stressTest: "Running Failure Simulations...",
      financials: "Estimating Financial Data...",
      roadmap: "Constructing Mission Timeline...",
      sourcing: "Locating Verified Suppliers...",
      riskReport: "Analyzing Credit Risk Models...",
      pitchDeck: "Generating Pitch Deck Assets..."
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
    canvasControls: {
      bankMode: "Bank Mode (Print)",
      bankModeDesc: "Switch to a clean, white corporate layout for official use."
    },
    detailsSections: {
      audience: "Target Audience",
      requirements: "Operational Requirements",
      skillRequirements: "Skill Requirements",
      pros: "Pros",
      cons: "Cons",
      marketing: "Marketing Quick Tip"
    },
    stressTest: {
      tabTitle: "Simulation: Stress Test",
      blueprintTab: "Operational Blueprint",
      saturation: "Market Saturation",
      failureMode: "CRITICAL FAILURE MODE",
      hiddenCosts: "Hidden Costs",
      competitorEdge: "Competitive Edge",
      runSimBtn: "Run Simulation"
    },
    roi: {
      tabTitle: "ROI Calculator",
      aiEstimateBtn: "Auto-Estimate with AI",
      inputsTitle: "Financial Inputs (Editable)",
      resultsTitle: "Projected Outcomes",
      labels: {
          investment: "Initial Investment (Machine + Setup)",
          fixedCost: "Monthly Fixed Costs (Rent, Marketing)",
          costPerUnit: "Cost Per Unit (Material + Labor)",
          pricePerUnit: "Selling Price Per Unit",
          estSales: "Est. Monthly Sales (Units)"
      },
      metrics: {
          margin: "Profit Margin / Unit",
          breakEven: "Break-Even Sales",
          monthlyProfit: "Est. Monthly Net Profit",
          breakEvenTime: "Time to Break-Even",
          months: "Months",
          units: "Units"
      },
      landedCost: {
          toggle: "Enable Local Context (Import & Tax)",
          shipping: "Shipping Cost",
          customs: "Customs Duty (%)",
          vat: "VAT / Tax (%)",
          fees: "Clearance / Misc Fees",
          total: "Total Landed Investment"
      },
      disclaimer: "Figures are estimates for simulation purposes only."
    },
    roadmap: {
      tabTitle: "Mission Timeline",
      genBtn: "Generate Execution Roadmap",
      phase: "Phase"
    },
    pitchDeck: {
      tabTitle: "Pitch Deck",
      genBtn: "Generate AI Pitch Deck",
      downloadPdf: "Download Deck (PDF)"
    },
    upvote: {
        count: "Upvotes",
        tooltip: "Validate this idea (Signal Demand)",
        sort: "Sort By:",
        sortNew: "Newest",
        sortPopular: "Most Upvoted"
    },
    supplier: {
        tabTitle: "Supplier Outreach",
        intro: "Use this template to professionally contact suppliers. International trade usually requires communication in English.",
        verifiedSources: "Verified Suppliers (AI Detected)",
        findBtn: (source) => `Find on ${source}`,
        copySubjectBtn: "Copy Subject",
        copyBodyBtn: "Copy Message",
        copied: "Copied!",
        noLinks: "No direct links verified. Try a manual search.",
        template: {
            subject: (machine) => `Inquiry regarding ${machine} - Request for Quotation (RFQ)`,
            body: (platform, machine, user) => `Dear ${platform} Supplier,

I am interested in purchasing the "${machine}" listed on your platform. I am currently evaluating suppliers for long-term cooperation.

Could you please provide a quotation for the following:
1. FOB Price for 1 unit (Sample order).
2. FOB Price for 5-10 units.
3. Estimated shipping cost to [My Location].
4. Lead time for manufacturing and delivery.
5. Standard warranty terms.

I am looking to finalize a supplier within the next 2 weeks.

Best regards,

${user}`
        }
    },
    errors: {
      noIdeas: "AI could not generate ideas. Please try again.",
      connection: "Connection error. Check API Key.",
      canvasFail: "Failed to generate canvas.",
      detailsFail: "Failed to load details.",
      loginFail: "Authentication Failed. Use 'admin'/'admin' or 'user'/'user'.",
      stressTestFail: "Simulation failed. Neural link unstable.",
      financialsFail: "Could not generate estimates.",
      roadmapFail: "Timeline construction failed.",
      riskReportFail: "Risk Analysis Model failed to converge.",
      pitchDeckFail: "Pitch Deck generation failed."
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
      lender: "አበዳሪ",
      community: "ማህበረሰብ",
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
      guestBtn: "እንደ እንግዳ ይግቡ (Admin)",
      lenderBtn: "እንደ አበዳሪ ይግቡ"
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
      systemLogs: "የስርዓት ምዝግብ ማስታወሻዎች",
      requestFunding: "የገንዘብ ድጋፍ ይጠይቁ"
    },
    admin: {
        tabs: {
            database: "Database Management",
            analytics: "Global Intelligence"
        },
        analytics: {
            sectorPop: "Sector Popularity Protocol",
            activity: "Operative Activity (7 Days)",
            keywords: "Trending Search Matrix",
            liveLog: "Live Network Traffic",
            scans: "Scans",
            saves: "Saves"
        }
    },
    lender: {
        dashboardTitle: "የብድር ስጋት መቆጣጠሪያ",
        queue: "የማመልከቻዎች ዝርዝር",
        riskAnalysis: "AI የስጋት ትንተና",
        analyzeBtn: "የስጋት ሞዴሉን ያሂዱ",
        score: "የስጋት ውጤት",
        verdict: "AI ውሳኔ",
        approved: "ፀድቋል",
        conditional: "በቅድመ ሁኔታ",
        rejected: "ተቀባይነት የለውም",
        strengths: "ጥንካሬዎች",
        weaknesses: "የስጋት ምክንያቶች",
        stipulations: "ቅድመ ሁኔታዎች",
        maxLoan: "ከፍተኛ የብድር መጠን",
        emptyQueue: "ምንም ማመልከቻ የለም።",
        applicationDate: "የማመልከቻ ቀን",
        applicant: "አመልካች",
        requested: "የተጠየቀው"
    },
    community: {
      title: "NEON HIVE",
      subtitle: "ከሌሎች ኦፕሬተሮች ጋር ይተባበሩ። መረጃዎችን ያካፍሉ።",
      feed: "ዓለም አቀፍ ግድግዳ",
      channels: "ንቁ ድግግሞሾች",
      createPost: "መልዕክት አስተላልፍ",
      postPlaceholder: "የንግድ ፅንሰ-ሀሳብዎን ያጋሩ፣ ምክር ይጠይቁ፣ ወይም አጋሮችን ይፈልጉ...",
      postBtn: "አሰራጭ",
      connectBtn: "ተገናኝ",
      generalChannel: "ጠቅላላ ድግግሞሽ",
      filterBy: "ማጣሪያ",
      noPosts: "በዚህ ድግግሞሽ ላይ ምንም ምልክት የለም።"
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
      details: "የንግድ መረጃን በማምጣት ላይ...",
      stressTest: "ሽንፈት ማስመሰሎችን በማስኬድ ላይ...",
      financials: "የፋይናንስ መረጃን በማምጣት ላይ...",
      roadmap: "የተልዕኮ ጊዜን በመገንባት ላይ...",
      sourcing: "የተረጋገጡ አቅራቢዎችን በመፈለግ ላይ...",
      riskReport: "የብድር ስጋት ሞዴሎችን በመተንተን ላይ...",
      pitchDeck: "የዝግጅት አቀራረብ ንብረቶችን በማመንጨት ላይ..."
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
    canvasControls: {
      bankMode: "የባንክ ሞድ (ህትመት)",
      bankModeDesc: "ወደ ንጹህ፣ ነጭ የኮርፖሬት አቀማመጥ ቀይር።"
    },
    detailsSections: {
      audience: "የታለመ ደንበኛ",
      requirements: "የክወና መስፈርቶች",
      skillRequirements: "የክህሎት መስፈርቶች",
      pros: "ጥቅሞች",
      cons: "ጉዳቶች",
      marketing: "የግብይት ጠቃሚ ምክር"
    },
    stressTest: {
      tabTitle: "ማስመሰል: የጭንቀት ሙከራ",
      blueprintTab: "የክወና ብሉፕሪንት",
      saturation: "የገበያ ሙሌት",
      failureMode: "ወሳኝ የውድቀት ሁኔታ",
      hiddenCosts: "የተደበቁ ወጪዎች",
      competitorEdge: "ተወዳዳሪነት",
      runSimBtn: "ማስመሰልን ያሂዱ"
    },
    roi: {
      tabTitle: "ROI ማስያ",
      aiEstimateBtn: "በ AI ግምት",
      inputsTitle: "የፋይናንስ ግብዓቶች (ሊስተካከል የሚችል)",
      resultsTitle: "የተተነበዩ ውጤቶች",
      labels: {
          investment: "መነሻ ካፒታል (ማሽን + ዝግጅት)",
          fixedCost: "ወርሃዊ ቋሚ ወጪዎች (ኪራይ ፣ ማስታወቂያ)",
          costPerUnit: "አንድ ክፍል ወጪ (ቁሳቁስ + ጉልበት)",
          pricePerUnit: "የመሸጫ ዋጋ",
          estSales: "የተገመተ ወርሃዊ ሽያጭ (ብዛት)"
      },
      metrics: {
          margin: "የትርፍ ህዳግ / ክፍል",
          breakEven: "ወጪ መመለሻ ነጥብ (ብዛት)",
          monthlyProfit: "የተገመተ ወርሃዊ የተጣራ ትርፍ",
          breakEvenTime: "ወጪ ለመመለስ የሚፈጀው ጊዜ",
          months: "ወራት",
          units: "ብዛት"
      },
      landedCost: {
          toggle: "አካባቢያዊ ሁኔታን አንቃ (ግብር እና ታክስ)",
          shipping: "የትራንስፖርት ወጪ",
          customs: "የጉምሩክ ቀረጥ (%)",
          vat: "ተጨማሪ እሴት ታክስ (%)",
          fees: "ሌሎች ክፍያዎች",
          total: "ጠቅላላ ወጪ"
      },
      disclaimer: "አሃዞች ለማስመሰል ዓላማዎች የተሰጡ ግምቶች ናቸው።"
    },
    roadmap: {
      tabTitle: "የተልዕኮ ጊዜ",
      genBtn: "የተግባር ፍኖተ ካርታን ያመንጩ",
      phase: "ምዕራፍ"
    },
    pitchDeck: {
      tabTitle: "የዝግጅት አቀራረብ",
      genBtn: "AI የዝግጅት አቀራረብን ያመንጩ",
      downloadPdf: "አቀራረቡን አውርድ (PDF)"
    },
    upvote: {
        count: "ድጋፎች",
        tooltip: "ይህንን ሀሳብ ያረጋግጡ (የፍላጎት ምልክት)",
        sort: "ደርድር በ:",
        sortNew: "አዲስ",
        sortPopular: "ብዙ ድጋፍ ያገኘ"
    },
    supplier: {
        tabTitle: "አቅራቢን ያግኙ",
        intro: "አቅራቢዎችን በብቃት ለማነጋገር ይህንን ቅጽ ይጠቀሙ። ዓለም አቀፍ ንግድ ብዙውን ጊዜ በእንግሊዝኛ ግንኙነት ይፈልጋል።",
        verifiedSources: "የተረጋገጡ አቅራቢዎች (በ AI የተገኙ)",
        findBtn: (source) => `በ ${source} ላይ ይፈልጉ`,
        copySubjectBtn: "ርዕሱን ቅዳ",
        copyBodyBtn: "መልዕክቱን ቅዳ",
        copied: "ተቀድቷል!",
        noLinks: "ምንም ቀጥተኛ አገናኞች አልተገኙም። በእጅ ፍለጋ ይሞክሩ።",
        template: {
            subject: (machine) => `Inquiry regarding ${machine} - Request for Quotation (RFQ)`,
            body: (platform, machine, user) => `Dear ${platform} Supplier,

I am interested in purchasing the "${machine}" listed on your platform. I am currently evaluating suppliers for long-term cooperation.

Could you please provide a quotation for the following:
1. FOB Price for 1 unit (Sample order).
2. FOB Price for 5-10 units.
3. Estimated shipping cost to [My Location].
4. Lead time for manufacturing and delivery.
5. Standard warranty terms.

I am looking to finalize a supplier within the next 2 weeks.

Best regards,

${user}`
        }
    },
    errors: {
      noIdeas: "AI ሀሳቦችን ማመንጨት አልቻለም። እባክዎ እንደገና ይሞክሩ።",
      connection: "የግንኙነት ችግር። እባክዎ የበይነመረብ ግንኙነትዎን ያረጋግጡ።",
      canvasFail: "የንግድ ሞዴል ማመንጨት አልተሳካም።",
      detailsFail: "ዝርዝር መረጃን መጫን አልተሳካም።",
      loginFail: "የተሳሳተ መረጃ። 'admin'/'admin' ወይም 'user'/'user' ይጠቀሙ።",
      stressTestFail: "ማስመሰል አልተሳካም።",
      financialsFail: "ግምቶችን ማመንጨት አልተቻለም።",
      roadmapFail: "የጊዜ ሰሌዳ ግንባታ አልተሳካም።",
      riskReportFail: "የብድር ስጋት ትንተና አልተሳካም።",
      pitchDeckFail: "የዝግጅት አቀራረብ ማመንጨት አልተሳካም።"
    }
  }
};
