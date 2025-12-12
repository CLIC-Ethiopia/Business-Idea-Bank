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
  riskTolerance: 'Low' | 'Medium' | 'High';
  timeCommitment: 'Part-time' | 'Full-time';
}

export enum AppState {
  SELECT_INDUSTRY,
  USER_PROFILE,
  LOADING_PROFILE_IDEAS,
  LOADING_IDEAS,
  SELECT_IDEA,
  LOADING_CANVAS,
  VIEW_CANVAS
}