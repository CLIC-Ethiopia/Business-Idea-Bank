export interface Industry {
  id: string;
  name: string;
  icon: string;
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
}

export interface BusinessDetails {
  targetAudience: string;
  operationalRequirements: string[];
  pros: string[];
  cons: string[];
  marketingQuickTip: string;
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
  role: 'user' | 'admin';
  avatar?: string;
  profile?: UserProfile;
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
  ABOUT
}

export type Language = 'en' | 'am';