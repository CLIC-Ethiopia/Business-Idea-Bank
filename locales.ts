import { Language } from './types';

interface LocaleStrings {
  appTitle: string;
  appSubtitle: string;
  buildProfileBtn: string;
  scanBtn: string;
  backToSectors: string;
  backToHome: string;
  backToIdeas: string;
  scanComplete: (count: number) => string;
  investment: string;
  potential: string;
  analyzeBtn: string;
  detailsBtn: string;
  closeBtn: string;
  profileTitle: string;
  profileSubtitle: string;
  labels: {
    name: string;
    budget: string;
    skills: string;
    interests: string;
    risk: string;
    time: string;
  };
  placeholders: {
    name: string;
    skills: string;
    interests: string;
  };
  options: {
    budget: Record<string, string>;
    risk: Record<string, string>;
    time: Record<string, string>;
  };
  submitProfileBtn: string;
  loading: {
    scanning: (sector: string) => string;
    profile: string;
    canvas: string;
    details: string;
  };
  industries: Record<string, string>;
  canvasSections: Record<string, string>;
  detailsSections: {
    audience: string;
    requirements: string;
    pros: string;
    cons: string;
    marketing: string;
  };
  errors: {
    noIdeas: string;
    connection: string;
    canvasFail: string;
    detailsFail: string;
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
    scanComplete: (c) => `Scan Complete: ${c} Opportunities Found`,
    investment: "Investment",
    potential: "Potential",
    analyzeBtn: "Analyze Model",
    detailsBtn: "View Details",
    closeBtn: "Close",
    profileTitle: "ENTREPRENEUR PROFILE",
    profileSubtitle: "Calibrate the AI to match your capabilities with market opportunities.",
    labels: {
      name: "Name",
      budget: "Estimated Budget",
      skills: "Key Skills",
      interests: "Interests & Hobbies",
      risk: "Risk Tolerance",
      time: "Time Commitment"
    },
    placeholders: {
      name: "Enter your alias",
      skills: "e.g. Graphic Design, Welding, Coding...",
      interests: "e.g. 3D Printing, Outdoors..."
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
      pros: "Pros",
      cons: "Cons",
      marketing: "Marketing Quick Tip"
    },
    errors: {
      noIdeas: "AI could not generate ideas. Please try again.",
      connection: "Connection error. Check API Key.",
      canvasFail: "Failed to generate canvas.",
      detailsFail: "Failed to load details."
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
    scanComplete: (c) => `ፍተሻ ተጠናቋል: ${c} እድሎች ተገኝተዋል`,
    investment: "መነሻ ካፒታል",
    potential: "ይቻላል ገቢ",
    analyzeBtn: "ሞዴሉን ይተንትኑ",
    detailsBtn: "ዝርዝር ይመልከቱ",
    closeBtn: "ዝጋ",
    profileTitle: "የኢንተርፕረነር መገለጫ",
    profileSubtitle: "ችሎታዎን ከገበያ እድሎች ጋር ለማዛመድ AI ያስተካክሉ።",
    labels: {
      name: "ስም",
      budget: "የተገመተ በጀት",
      skills: "ቁልፍ ክህሎቶች",
      interests: "ፍላጎቶች እና በትርፍ ጊዜ ማሳለፊያዎች",
      risk: "የአደጋ መቻቻል",
      time: "የጊዜ ቁርጠኝነት"
    },
    placeholders: {
      name: "የእርስዎን ስም ያስገቡ",
      skills: "ለምሳሌ ግራፊክ ዲዛይን ፣ ብየዳ ፣ ኮዲንግ...",
      interests: "ለምሳሌ 3D ህትመት ፣ ፋሽን..."
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
      pros: "ጥቅሞች",
      cons: "ጉዳቶች",
      marketing: "የግብይት ጠቃሚ ምክር"
    },
    errors: {
      noIdeas: "AI ሀሳቦችን ማመንጨት አልቻለም። እባክዎ እንደገና ይሞክሩ።",
      connection: "የግንኙነት ችግር። እባክዎ የበይነመረብ ግንኙነትዎን ያረጋግጡ።",
      canvasFail: "የንግድ ሞዴል ማመንጨት አልተሳካም።",
      detailsFail: "ዝርዝር መረጃን መጫን አልተሳካም።"
    }
  }
};