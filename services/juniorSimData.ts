export interface JuniorKit {
    id: string;
    title: string;
    description: string;
    icon: string;
    industry: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    machines: JuniorAsset[];
    potentialSuppliers: JuniorAsset[];
    potentialMarkets: JuniorAsset[];
}

export interface JuniorAsset {
    id: string;
    name: string;
    description: string;
    icon: string;
    cost?: number;
    bonus?: string;
}

export interface JuniorCrew {
    id: string;
    name: string;
    role: string;
    icon: string;
    description: string;
    buff: string;
}

export const JUNIOR_KITS: JuniorKit[] = [
    {
        id: 'juice_lab',
        title: 'The Juice Lab',
        description: 'Transform fresh fruits into high-energy lab elixirs!',
        icon: '🥤',
        industry: 'agri',
        difficulty: 'Easy',
        machines: [
            { id: 'm1', name: 'Cold Presser 2000', description: 'Extracts every drop of nutrients.', icon: '🦾', cost: 400 },
            { id: 'm2', name: 'Nano Blender', description: 'Super smooth textures for premium pricing.', icon: '🌪️', cost: 300 }
        ],
        potentialSuppliers: [
            { id: 's1', name: 'Green Roof Farm', description: 'Fresh local organics.', icon: '🥬' },
            { id: 's2', name: 'Global Fruit Uplink', description: 'Exotic bulk imports.', icon: '🚢' }
        ],
        potentialMarkets: [
            { id: 't1', name: 'Gym Warriors', description: 'They need energy after training!', icon: '🏋️' },
            { id: 't2', name: 'School Lunchers', description: 'Healthy snacks for students.', icon: '🎒' }
        ]
    },
    {
        id: 'sticker_forge',
        title: 'The Sticker Forge',
        description: 'Design and print custom vinyl stickers for the local gear.',
        icon: '🎨',
        industry: 'light_mfg',
        difficulty: 'Medium',
        machines: [
            { id: 'm3', name: 'Vinyl Cutter Pro', description: 'Precision cutting for complex shapes.', icon: '✂️', cost: 500 },
            { id: 'm4', name: 'Thermal Printer', description: 'Super fast printing with zero ink costs.', icon: '📠', cost: 450 }
        ],
        potentialSuppliers: [
            { id: 's3', name: 'Adhesive Valley', description: 'Premium sticky rolls.', icon: '🎞️' },
            { id: 's4', name: 'Neon Pigments', description: 'Glow-in-the-dark specialized inks.', icon: '🧪' }
        ],
        potentialMarkets: [
            { id: 't3', name: 'Cyber Gamers', description: 'They love stickers on their laptops.', icon: '🎮' },
            { id: 't4', name: 'Local Cafe Owners', description: 'Branding for their takeaway cups.', icon: '☕' }
        ]
    },
    {
        id: 'cyber_mechanic',
        title: 'The Tech Repair Bay',
        description: 'Restore broken gadgets to their former glory.',
        icon: '🔧',
        industry: 'services',
        difficulty: 'Hard',
        machines: [
            { id: 'm5', name: 'Micro-Solder Station', description: 'Fix the smallest connections.', icon: '🔌', cost: 600 },
            { id: 'm6', name: 'Logic Board Scanner', description: 'Instantly find the tech glitch.', icon: '📡', cost: 700 }
        ],
        potentialSuppliers: [
            { id: 's5', name: 'Silicon Alley Parts', description: 'Rare chips and screens.', icon: '💾' },
            { id: 's6', name: 'Scrap Mine Hub', description: 'Cheap reclaimed tech for parts.', icon: '🏗️' }
        ],
        potentialMarkets: [
            { id: 't5', name: 'Shattered Screeners', description: 'People who drop their phones.', icon: '📱' },
            { id: 't6', name: 'Vintage PC Collectors', description: 'Fixing 90s tech for enthusiasts.', icon: '📼' }
        ]
    }
];

export const JUNIOR_CREW: JuniorCrew[] = [
    { id: 'zane', name: 'Zane', role: 'The Maker', icon: '👷', description: 'Expert at fixing things.', buff: 'Machines never break down.' },
    { id: 'maya', name: 'Maya', role: 'The Hustler', icon: '😎', description: 'Can sell ice to an Eskimo.', buff: 'Earn +20% more from sales.' },
    { id: 'pixel', name: 'Pixel', role: 'The Designer', icon: '👾', description: 'Makes everything look cool.', buff: 'Marketing costs are halved.' }
];
