import { Industry } from './types';

// Extracted and consolidated from the provided PDF OCR data
export const INDUSTRIES: Industry[] = [
  { id: 'agri', name: 'Agriculture & Farming', icon: '🌾' },
  { id: 'food_bev', name: 'Food & Beverage Mfg', icon: '🍔' },
  { id: 'light_mfg', name: 'Light Manufacturing (Textiles/Paper)', icon: '👕' },
  { id: 'heavy_mfg', name: 'Heavy Manufacturing (Metal/Machinery)', icon: '🏭' },
  { id: 'construction', name: 'Construction & Utilities', icon: '🏗️' },
  { id: 'automotive', name: 'Automotive & Transport', icon: '🚗' },
  { id: 'waste', name: 'Waste Management & Recycling', icon: '♻️' },
  { id: 'services', name: 'Professional Services', icon: '💼' },
  { id: 'health', name: 'Health & Personal Care', icon: '⚕️' },
  { id: 'hospitality', name: 'Hospitality & Tourism', icon: '🏨' },
  { id: 'ict', name: 'ICT & Electronics', icon: '💻' },
  { id: 'mining', name: 'Mining & Primary Materials', icon: '⛏️' },
];

export const MOCK_IMAGES = [
  "https://picsum.photos/400/300?random=1",
  "https://picsum.photos/400/300?random=2",
  "https://picsum.photos/400/300?random=3",
  "https://picsum.photos/400/300?random=4",
  "https://picsum.photos/400/300?random=5",
  "https://picsum.photos/400/300?random=6",
];