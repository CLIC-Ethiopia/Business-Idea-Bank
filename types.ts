
export interface Industry {
  id: string;
  name: string;
  icon: string;
}

export interface SourcingLink {
  title: string;
  url: string;
  source: string;
}

export interface BusinessIdea {
  id: string;
  machineName: string;
  businessTitle: string;
  description: string;
  priceRange: string;
  platformSource: 'Alibaba' | 'Amazon' | 'Global Sources';
  potentialRevenue: string;
  industryId?: string; // Optional linkage to industry
  imageUrl?: string;
  skillRequirements?: string[];
  operationalRequirements?: string[];
  upvotes?: number;
  isUpvoted?: boolean; // Local state for user interaction
}

export interface BusinessDetails {
  targetAudience: string;
  operationalRequirements: string[];
  skillRequirements: string[];
  pros: string[];
  cons: string[];
  marketingQuickTip: string;
}

export interface StressTestAnalysis {
  saturationLevel: 'Low' | 'Medium' | 'High';
  saturationReason: string;
  hiddenCosts: string[];
  failureMode: string;
  competitorEdge: string;
}

export interface FinancialEstimates {
  initialInvestment: number;
  monthlyFixedCosts: number;
  costPerUnit: number;
  pricePerUnit: number;
  estimatedMonthlySales: number;
  currency: string;
}

export interface CreditRiskReport {
  score: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  dscr: number;
  ltv: number;
  strengths: string[];
  weaknesses: string[];
  stipulations: string[];
  verdict: 'Approved' | 'Conditional' | 'Rejected';
  maxLoanAmount: number;
}

export interface FundingMilestone {
  id: string;
  phaseName: string;
  description: string;
  amount: number;
  status: 'Locked' | 'Pending' | 'In Review' | 'Released';
  evidence?: string;
}

export interface LoanApplication {
  id: string;
  applicantName: string;
  businessIdea: BusinessIdea;
  loanAmount: number;
  downPayment: number;
  creditScore: number; // Self-reported for simulation
  status: 'Pending' | 'Reviewing' | 'Approved' | 'Rejected' | 'Active';
  timestamp: number;
  milestones?: FundingMilestone[];
}

export interface RoadmapPhase {
  phaseName: string;
  duration: string;
  steps: string[];
}

export type Roadmap = RoadmapPhase[];

export interface PitchDeckSlide {
  title: string;
  subtitle: string;
  bullets: string[];
}

export interface PitchDeck {
  slides: PitchDeckSlide[];
}

export interface BusinessCanvas {
  keyPartners: string[];
  keyActivities: string[];
  keyResources: string[];
  valuePropositions: string[];
  customerRelationships: string[];
  channels: string[];
  customerSegments: string[];
  costStructure: string[];
  revenueStreams: string[];
}

export interface UserProfile {
  name: string;
  budget: string;
  skills: string;
  interests: string;
  education: string;
  experience: string;
  riskTolerance: 'Low' | 'Medium' | 'High';
  timeCommitment: 'Part-time' | 'Full-time';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'lender' | 'student';
  avatar?: string;
  profile?: UserProfile;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  content: string;
  industryId: string; // 'general' or specific industry ID
  likes: number;
  comments: number;
  timestamp: number;
  isLiked?: boolean;
}

export interface AnalyticsData {
  industryDistribution: { name: string; value: number; color: string }[];
  weeklyActivity: { name: string; scans: number; saves: number }[];
  trendingKeywords: { text: string; value: number }[];
}

export enum AppState {
  LOGIN,
  DASHBOARD,
  SELECT_INDUSTRY,
  USER_PROFILE,
  LOADING_PROFILE_IDEAS,
  LOADING_IDEAS,
  SELECT_IDEA,
  LOADING_CANVAS,
  VIEW_CANVAS,
  ABOUT,
  ADMIN_DASHBOARD,
  LENDER_DASHBOARD,
  COMMUNITY,
  SIMULATION_MODE
}

export type Language = 'en' | 'am';

// --- Simulation / RPG Types ---

export interface SimulationState {
    turn: number; // Month 1-12
    maxTurns: number;
    cash: number;
    morale: number; // 0-100
    log: string[];
    isGameOver: boolean;
    gameResult?: 'Success' | 'Bankruptcy' | 'Burnout';
}

export interface SimulationEvent {
    scenario: string;
    choices: {
        id: 'a' | 'b' | 'c';
        label: string;
        description: string;
        cashImpact: number;
        moraleImpact: number;
        outcomeText: string;
    }[];
}
