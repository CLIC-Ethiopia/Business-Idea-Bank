import React, { useState, useEffect, useRef } from 'react';
import { User, BusinessIdea, SimulationState, SimulationEvent, Language } from '../types';
import { NeonCard, NeonButton, LoadingScan } from './NeonUI';
import { generateIdeas, generateSimulationEvent } from '../services/geminiService';

interface SimulationModeProps {
    user: User;
    onExit: () => void;
    t: any;
    language: Language;
}

// Fallback data in case API fails or returns empty
const FALLBACK_IDEAS: BusinessIdea[] = [
    {
        id: 'sim-1',
        machineName: '3D Printer Fleet',
        businessTitle: 'Rapid Prototyping Hub',
        description: 'A local manufacturing hub producing custom parts for engineers and hobbyists using high-speed 3D printers.',
        priceRange: '$3,500',
        platformSource: 'Amazon',
        potentialRevenue: '$5,000/mo'
    },
    {
        id: 'sim-2',
        machineName: 'Laser Engraver 50W',
        businessTitle: 'Custom Gift Studio',
        description: 'Personalized engraving service for wood, leather, and metal items. High margin personalized gifts.',
        priceRange: '$2,800',
        platformSource: 'Alibaba',
        potentialRevenue: '$4,500/mo'
    },
    {
        id: 'sim-3',
        machineName: 'Vinyl Cutter Pro',
        businessTitle: 'Vehicle Branding Shop',
        description: 'Design and apply vinyl wraps and decals for local delivery fleets and small businesses.',
        priceRange: '$1,200',
        platformSource: 'Amazon',
        potentialRevenue: '$3,500/mo'
    }
];

const FALLBACK_EVENT: SimulationEvent = {
    scenario: "Unexpected Supply Chain Disruption! Your primary material supplier has halted shipments due to a raw material shortage.",
    choices: [
        {
            id: 'a',
            label: 'Pay Premium for Expedited Shipping',
            description: 'Secure materials from a competitor at a 50% markup.',
            cashImpact: -800,
            moraleImpact: 5,
            outcomeText: "You secured the materials, but your profit margins took a severe hit this month."
        },
        {
            id: 'b',
            label: 'Delay Orders',
            description: 'Wait for the shortage to pass.',
            cashImpact: 0,
            moraleImpact: -15,
            outcomeText: "Customers were unhappy with the delays. Your reputation and morale suffered."
        },
        {
            id: 'c',
            label: 'Pivot to Recycled Materials',
            description: 'Try a cheaper, eco-friendly alternative.',
            cashImpact: -200,
            moraleImpact: 10,
            outcomeText: "It was a gamble, but customers loved the eco-friendly angle! You saved cash."
        }
    ]
};

export const SimulationMode: React.FC<SimulationModeProps> = ({ user, onExit, language }) => {
    const [gameState, setGameState] = useState<'SETUP' | 'PICK_IDEA' | 'PLAYING' | 'GAMEOVER'>('SETUP');
    
    // Character Setup
    const [avatarName, setAvatarName] = useState(user.name || '');
    const [archetype, setArchetype] = useState<'Hacker' | 'Hustler' | 'Maker'>('Hacker');

    // Game Data
    const [selectedSimIdea, setSelectedSimIdea] = useState<BusinessIdea | null>(null);
    const [simIdeas, setSimIdeas] = useState<BusinessIdea[]>([]);
    const [loadingIdeas, setLoadingIdeas] = useState(false);
    
    // Core Loop State
    const [simState, setSimState] = useState<SimulationState>({
        turn: 1,
        maxTurns: 12,
        cash: 10000,
        morale: 100,
        log: [
            `[SYSTEM]: User ${user.name} logged in.`,
            "[SYSTEM]: Simulation Protocol Initiated.",
            "[SYSTEM]: Waiting for business selection..."
        ],
        isGameOver: false
    });
    
    const [currentEvent, setCurrentEvent] = useState<SimulationEvent | null>(null);
    const [loadingEvent, setLoadingEvent] = useState(false);
    const logContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll log
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [simState.log, currentEvent]);

    const handleStartSetup = () => {
        setGameState('PICK_IDEA');
        fetchSimIdeas();
    };

    const fetchSimIdeas = async () => {
        setLoadingIdeas(true);
        try {
            // Attempt AI generation
            const ideas = await generateIdeas("Light Manufacturing", language);
            if (ideas && ideas.length > 0) {
                setSimIdeas(ideas.slice(0, 3));
            } else {
                setSimIdeas(FALLBACK_IDEAS);
            }
        } catch (e) {
            console.error("Simulation Idea Fetch Error", e);
            setSimIdeas(FALLBACK_IDEAS);
        } finally {
            setLoadingIdeas(false);
        }
    };

    const selectIdea = (idea: BusinessIdea) => {
        setSelectedSimIdea(idea);
        setGameState('PLAYING');
        setSimState(prev => ({
            ...prev,
            log: [...prev.log, `[GAME]: Business selected: ${idea.businessTitle}`, `[GAME]: Starting Year 1. Month 1.`]
        }));
        // Initial Event
        triggerTurn(1, 10000);
    };

    const triggerTurn = async (turn: number, cash: number) => {
        if (!selectedSimIdea) return;
        setLoadingEvent(true);
        setCurrentEvent(null);

        try {
            const event = await generateSimulationEvent(selectedSimIdea, turn, cash, language);
            if (event) {
                setCurrentEvent(event);
                setSimState(prev => ({
                    ...prev,
                    log: [...prev.log, `[MONTH ${turn}]: ${event.scenario}`]
                }));
            } else {
                throw new Error("No event generated");
            }
        } catch (e) {
            // Fallback Event
            console.warn("Using fallback event");
            setCurrentEvent(FALLBACK_EVENT);
            setSimState(prev => ({
                ...prev,
                log: [...prev.log, `[MONTH ${turn}]: ${FALLBACK_EVENT.scenario}`]
            }));
        } finally {
            setLoadingEvent(false);
        }
    };

    const handleChoice = (choice: SimulationEvent['choices'][0]) => {
        // Apply Archetype Bonuses
        let finalCashImpact = choice.cashImpact;
        let finalMoraleImpact = choice.moraleImpact;

        if (archetype === 'Hacker' && choice.id === 'a') finalCashImpact = Math.floor(finalCashImpact * 0.8); // 20% discount on safe choices
        if (archetype === 'Hustler' && finalCashImpact > 0) finalCashImpact = Math.floor(finalCashImpact * 1.2); // 20% bonus on gains
        if (archetype === 'Maker' && finalMoraleImpact < 0) finalMoraleImpact = Math.floor(finalMoraleImpact * 0.5); // 50% resilience

        const newCash = simState.cash + finalCashImpact;
        const newMorale = Math.min(100, Math.max(0, simState.morale + finalMoraleImpact));
        const newTurn = simState.turn + 1;

        // Log the outcome
        const logEntry = `> DECISION: ${choice.label} \n> RESULT: ${choice.outcomeText} \n> UPDATE: Cash ${finalCashImpact >= 0 ? '+' : ''}${finalCashImpact} | Morale ${finalMoraleImpact >= 0 ? '+' : ''}${finalMoraleImpact}`;
        
        let gameOver = false;
        let result: SimulationState['gameResult'];

        if (newCash <= 0) {
            gameOver = true;
            result = 'Bankruptcy';
        } else if (newMorale <= 0) {
            gameOver = true;
            result = 'Burnout';
        } else if (newTurn > simState.maxTurns) {
            gameOver = true;
            result = 'Success';
        }

        setSimState(prev => ({
            ...prev,
            cash: newCash,
            morale: newMorale,
            turn: newTurn,
            log: [...prev.log, logEntry],
            isGameOver: gameOver,
            gameResult: result
        }));

        if (!gameOver) {
            setTimeout(() => triggerTurn(newTurn, newCash), 1000); // Slight delay for pacing
        } else {
            setGameState('GAMEOVER');
        }
    };

    // --- RENDER HELPERS ---

    const renderSetup = () => (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 max-w-2xl mx-auto text-center animate-[fadeIn_0.5s_ease-out]">
            <h1 className="text-6xl font-bold text-neon-green font-orbitron mb-2 tracking-tighter drop-shadow-[0_0_10px_rgba(10,255,10,0.5)]">NEON TYCOON</h1>
            <p className="text-gray-400 mb-12 font-mono uppercase tracking-widest text-sm">Educational Business Simulation Protocol v1.0</p>
            
            <NeonCard color="green" className="w-full text-left p-8 border-2 border-neon-green bg-black" hoverEffect={false}>
                <div className="mb-6">
                    <label className="text-neon-green font-bold font-mono uppercase text-sm mb-2 block">Operative Name</label>
                    <input 
                        type="text" 
                        className="w-full bg-gray-900 border border-gray-700 text-white p-3 rounded font-mono focus:border-neon-green outline-none"
                        value={avatarName}
                        onChange={(e) => setAvatarName(e.target.value)}
                        placeholder="Enter name..."
                    />
                </div>
                <div className="mb-8">
                    <label className="text-neon-green font-bold font-mono uppercase text-sm mb-2 block">Select Archetype</label>
                    <div className="grid grid-cols-3 gap-4">
                        {['Hacker', 'Hustler', 'Maker'].map(arch => (
                            <button
                                key={arch}
                                onClick={() => setArchetype(arch as any)}
                                className={`p-4 border rounded font-bold uppercase text-xs sm:text-sm transition-all ${archetype === arch ? 'bg-neon-green text-black border-neon-green' : 'bg-transparent text-gray-500 border-gray-700 hover:border-gray-500'}`}
                            >
                                {arch}
                            </button>
                        ))}
                    </div>
                    <p className="mt-4 text-xs text-gray-400 font-mono border-l-2 border-gray-600 pl-2">
                        {archetype === 'Hacker' && "BONUS: Optimization Code. Technology upgrades cost 20% less."}
                        {archetype === 'Hustler' && "BONUS: Smooth Talker. Revenue events generate 20% more cash."}
                        {archetype === 'Maker' && "BONUS: Iron Will. Morale loss reduced by 50%."}
                    </p>
                </div>
                <NeonButton fullWidth color="green" onClick={handleStartSetup} disabled={!avatarName}>
                    INITIALIZE SIMULATION &gt;&gt;
                </NeonButton>
            </NeonCard>
        </div>
    );

    const renderPickIdea = () => (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-neon-green font-orbitron mb-2">SELECT TARGET BUSINESS</h2>
                <p className="text-gray-500 font-mono text-xs">SCANNING SECTOR: LIGHT MANUFACTURING</p>
            </div>
            
            {loadingIdeas ? (
                <LoadingScan text="ANALYZING MARKET OPPORTUNITIES..." />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {simIdeas.map((idea, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => selectIdea(idea)}
                            className="bg-black border-2 border-gray-800 hover:border-neon-green p-6 rounded cursor-pointer transition-all hover:-translate-y-2 group flex flex-col h-full"
                        >
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform text-center">🏭</div>
                            <h3 className="text-xl font-bold text-white mb-2">{idea.businessTitle}</h3>
                            <div className="text-neon-green text-xs font-mono mb-2">{idea.machineName}</div>
                            <p className="text-gray-500 text-xs font-mono mb-6 flex-grow leading-relaxed">{idea.description}</p>
                            
                            <div className="border-t border-gray-800 pt-4 mt-auto">
                                <div className="flex justify-between text-xs text-gray-400 mb-2">
                                    <span>Startup:</span>
                                    <span className="text-white">{idea.priceRange}</span>
                                </div>
                                <div className="text-center bg-gray-900 text-neon-green text-xs font-bold uppercase py-2 rounded border border-gray-700 group-hover:bg-neon-green group-hover:text-black transition-colors">
                                    START SIMULATION
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderGameLoop = () => (
        <div className="h-screen flex flex-col bg-black text-green-500 font-mono overflow-hidden">
            {/* HUD */}
            <div className="border-b-2 border-neon-green bg-gray-900 p-4 flex justify-between items-center shadow-[0_0_20px_rgba(10,255,10,0.2)] z-10 relative">
                <div className="flex gap-8">
                    <div>
                        <span className="text-gray-500 text-[10px] uppercase tracking-widest block">Liquid Assets</span>
                        <div className={`text-2xl font-bold ${simState.cash < 2000 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                            ${simState.cash.toLocaleString()}
                        </div>
                    </div>
                    <div>
                        <span className="text-gray-500 text-[10px] uppercase tracking-widest block">Timeline</span>
                        <div className="text-2xl font-bold text-white">Month {simState.turn} <span className="text-gray-600 text-sm">/ {simState.maxTurns}</span></div>
                    </div>
                </div>
                <div className="w-1/3 max-w-md">
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1 uppercase tracking-widest">
                        <span>Founder Morale</span>
                        <span>{simState.morale}%</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden border border-gray-700">
                        <div 
                            className={`h-full transition-all duration-500 ${simState.morale > 50 ? 'bg-neon-green' : 'bg-red-500'}`} 
                            style={{width: `${simState.morale}%`}}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Terminal Log */}
            <div 
                ref={logContainerRef}
                className="flex-grow overflow-y-auto p-6 space-y-4 bg-black bg-opacity-90 relative"
                style={{ 
                    backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))', 
                    backgroundSize: '100% 4px, 6px 100%' 
                }}
            >
                {simState.log.map((entry, i) => (
                    <div key={i} className={`font-mono text-sm leading-relaxed ${entry.startsWith('>') ? 'text-yellow-500 pl-4 border-l border-yellow-500 whitespace-pre-wrap' : 'text-neon-green'}`}>
                        {entry}
                    </div>
                ))}
                {loadingEvent && (
                    <div className="text-neon-green animate-pulse mt-4">
                        &gt; AI DUNGEON MASTER GENERATING SCENARIO...
                    </div>
                )}
            </div>

            {/* Action Deck */}
            <div className="border-t-2 border-neon-green bg-gray-900 p-6 min-h-[300px]">
                {currentEvent && !loadingEvent && (
                    <div className="max-w-5xl mx-auto animate-[fadeIn_0.3s_ease-out]">
                        <h3 className="text-white text-md font-bold mb-6 uppercase tracking-widest border-b border-gray-700 pb-2 flex justify-between">
                            <span>DECISION REQUIRED</span>
                            <span className="text-neon-green text-xs">AI GENERATED EVENT</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {currentEvent.choices.map((choice, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleChoice(choice)}
                                    className="relative border border-gray-600 bg-black hover:bg-gray-800 hover:border-neon-green p-5 text-left transition-all group rounded flex flex-col h-full"
                                >
                                    <div className="absolute top-2 right-3 text-gray-700 font-bold text-4xl opacity-20 group-hover:opacity-40">{String.fromCharCode(65 + i)}</div>
                                    <div className="text-neon-green font-bold mb-2 group-hover:text-white uppercase text-sm tracking-wider">
                                        {choice.label}
                                    </div>
                                    <div className="text-gray-400 text-xs leading-relaxed group-hover:text-gray-300">{choice.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderGameOver = () => (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-center p-4">
            <h1 className={`text-6xl md:text-8xl font-bold mb-4 font-orbitron tracking-tighter ${simState.gameResult === 'Success' ? 'text-neon-green' : 'text-red-600'}`}>
                {simState.gameResult === 'Success' ? 'MISSION SUCCESS' : 'GAME OVER'}
            </h1>
            
            <div className="text-xl md:text-2xl text-white mb-12 max-w-2xl font-light">
                {simState.gameResult === 'Bankruptcy' && "Capital reserves depleted. In business, cash flow is oxygen. You suffocated."}
                {simState.gameResult === 'Burnout' && "Founder morale hit critical levels. You burned out before the business could take off. Mental health is an asset."}
                {simState.gameResult === 'Success' && "You survived the critical first year! The business is stable, and you have proven your worth."}
            </div>

            <div className="bg-gray-900 border border-gray-700 p-8 rounded-xl max-w-xl w-full mb-12 text-left font-mono text-sm shadow-2xl">
                <div className="flex justify-between mb-4 border-b border-gray-800 pb-2">
                    <span className="text-gray-500 uppercase tracking-widest">Final Cash</span>
                    <span className={`font-bold ${simState.cash > 0 ? 'text-neon-green' : 'text-red-500'}`}>${simState.cash.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-4 border-b border-gray-800 pb-2">
                    <span className="text-gray-500 uppercase tracking-widest">Survival Time</span>
                    <span className="text-white font-bold">{Math.min(12, simState.turn)} Months</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500 uppercase tracking-widest">Archetype</span>
                    <span className="text-neon-blue font-bold uppercase">{archetype}</span>
                </div>
            </div>

            <div className="flex gap-6">
                <NeonButton color="green" onClick={() => {
                    setSimState({
                        turn: 1,
                        maxTurns: 12,
                        cash: 10000,
                        morale: 100,
                        log: ["System reset...", "New simulation initialized."],
                        isGameOver: false
                    });
                    setGameState('SETUP');
                }}>
                    RESTART SIMULATION
                </NeonButton>
                <button onClick={onExit} className="text-gray-500 hover:text-white underline uppercase tracking-widest text-xs font-bold">
                    Exit to Main Menu
                </button>
            </div>
        </div>
    );

    switch (gameState) {
        case 'SETUP': return renderSetup();
        case 'PICK_IDEA': return renderPickIdea();
        case 'PLAYING': return renderGameLoop();
        case 'GAMEOVER': return renderGameOver();
        default: return <div className="text-red-500 text-center mt-20">System Error: Invalid State</div>;
    }
};