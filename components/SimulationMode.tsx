import React, { useState, useEffect, useRef } from 'react';
import { User, Language } from '../types';
import { NeonCard, NeonButton, LoadingScan } from './NeonUI';
import { JUNIOR_KITS, JUNIOR_CREW, JuniorKit, JuniorCrew, JuniorAsset } from '../services/juniorSimData';
import { streamChat, generateJuniorKits } from '../services/geminiService';
import { INDUSTRIES } from '../constants';

interface SimulationModeProps {
    user: User;
    onExit: () => void;
    t: any;
    language: Language;
}

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const SimulationMode: React.FC<SimulationModeProps> = ({ user, onExit, t, language }) => {
    const [currentStep, setCurrentStep] = useState<Step>(0);
    const [wallet, setWallet] = useState(0);
    const [businessName, setBusinessName] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
    const [availableKits, setAvailableKits] = useState<JuniorKit[]>([]);
    const [isGeneratingKits, setIsGeneratingKits] = useState(false);
    
    const [selectedKit, setSelectedKit] = useState<JuniorKit | null>(null);
    const [selectedCrew, setSelectedCrew] = useState<JuniorCrew | null>(null);
    const [selectedMachine, setSelectedMachine] = useState<JuniorAsset | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<JuniorAsset | null>(null);
    const [selectedMarket, setSelectedMarket] = useState<JuniorAsset | null>(null);
    const [isProfFadTyping, setIsProfFadTyping] = useState(false);
    const [profFadMessage, setProfFadMessage] = useState("Greetings, Cadet! I am Prof. Fad. Ready to launch your first Lab Venture?");
    
    const steps = [
        "Pick Industry", "Select Business", "Legal Reg", "Raise Funds", "Hire Crew", 
        "Buy Machine", "Find Supplier", "Find Market", "Launch!", "Success"
    ];

    const handleProfFadAdvice = async () => {
        setIsProfFadTyping(true);
        const context = `The student is currently at Step ${currentStep}: ${steps[currentStep]}. 
        Industry: ${selectedIndustry || 'None'}.
        Business: ${selectedKit?.title || 'None'}. 
        Crew: ${selectedCrew?.name || 'None'}. 
        Wallet: $${wallet}.`;
        
        const prompt = `Give me a short, encouraging hint (1-2 sentences) for this current step. Use kid-friendly science/lab words.`;
        
        try {
            let fullResponse = "";
            const stream = streamChat([], prompt, context, language);
            for await (const chunk of stream) {
                fullResponse += chunk;
                setProfFadMessage(fullResponse);
            }
        } catch (e) {
            setProfFadMessage("Keep going, Operative! You are doing great!");
        } finally {
            setIsProfFadTyping(false);
        }
    };

    // Step Actions
    const nextStep = () => setCurrentStep(prev => (prev + 1) as Step);

    const handleIndustrySelect = async (industryId: string) => {
        setSelectedIndustry(industryId);
        setIsGeneratingKits(true);
        setProfFadMessage(`Scanning the Hive for ${industryId} opportunities. Just a moment...`);
        
        const industryLabel = t.industries[industryId] || industryId;
        try {
            const kits = await generateJuniorKits(industryLabel, language);
            if (kits && kits.length > 0) {
                setAvailableKits(kits);
            } else {
                // Fallback to static data if AI fails
                setAvailableKits(JUNIOR_KITS.slice(0, 3));
            }
        } catch (e) {
            setAvailableKits(JUNIOR_KITS.slice(0, 3));
        } finally {
            setIsGeneratingKits(false);
            nextStep();
        }
    };

    const selectKit = (kit: JuniorKit) => {
        setSelectedKit(kit);
        setProfFadMessage(`Excellent choice! ${kit.title} has high potential in the Lab Hive.`);
        nextStep();
    };

    const handleLegal = (e: React.FormEvent) => {
        e.preventDefault();
        if (!businessName.trim()) return;
        setProfFadMessage(`"${businessName}" is now a registered entity! Your license is active.`);
        nextStep();
    };

    const addFunds = (amount: number, type: string) => {
        setWallet(amount);
        setProfFadMessage(`BZZZT! $${amount} injected into your wallet via ${type}. Use it wisely!`);
        nextStep();
    };

    const selectCrew = (crew: JuniorCrew) => {
        setSelectedCrew(crew);
        setProfFadMessage(`${crew.name} has joined your squad. Passive buff activated: ${crew.buff}`);
        nextStep();
    };

    const buyMachine = (machine: JuniorAsset) => {
        if (wallet < (machine.cost || 0)) {
            setProfFadMessage("Insufficient credits! Did you spend your grant on virtual snacks?");
            return;
        }
        setWallet(prev => prev - (machine.cost || 0));
        setSelectedMachine(machine);
        setProfFadMessage(`The ${machine.name} is installed at your workbench. It's beautiful!`);
        nextStep();
    };

    const selectSupplier = (supplier: JuniorAsset) => {
        setSelectedSupplier(supplier);
        setProfFadMessage(`Supply chain uplink established with ${supplier.name}. We have fuel!`);
        nextStep();
    };

    const selectMarket = (market: JuniorAsset) => {
        setSelectedMarket(market);
        setProfFadMessage(`Target identified: ${market.name}. They are hungry for your product!`);
        nextStep();
    };

    const finalizeLaunch = () => {
        const baseProfit = Math.floor(Math.random() * 500) + 500;
        const multiplier = selectedCrew?.id === 'maya' ? 1.2 : 1.0;
        const finalProfit = Math.floor(baseProfit * multiplier);
        setWallet(prev => prev + finalProfit);
        setProfFadMessage(`MISSION ACCOMPLISHED! Sales are booming! You earned $${finalProfit} in profit.`);
        nextStep();
    };

    // --- SUB-RENDERERS ---

    const renderProgressBar = () => (
        <div className="w-full max-w-4xl mx-auto mb-12">
            <div className="flex justify-between items-center relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -z-10 -translate-y-1/2"></div>
                {steps.map((s, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all duration-500 ${currentStep > i ? 'bg-neon-green border-neon-green text-black scale-110 shadow-neon-green' : currentStep === i ? 'bg-neon-blue border-neon-blue text-black scale-125 shadow-neon-blue animate-pulse' : 'bg-black border-gray-700 text-gray-500'}`}>
                            {i + 1}
                        </div>
                        <span className={`text-[8px] uppercase mt-2 font-bold tracking-tighter ${currentStep === i ? 'text-neon-blue' : 'text-gray-600'}`}>{s}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderProfFad = () => (
        <div className="fixed bottom-8 left-8 z-40 max-w-xs animate-[fadeIn_0.5s_ease-out]">
            <div className="bg-dark-card border border-neon-yellow p-4 rounded-2xl relative shadow-2xl">
                <div className="absolute -top-10 left-4 bg-neon-yellow text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
                    Prof. Fad Advisor
                </div>
                <div className="flex gap-4 items-start">
                    <div className="text-4xl">🤖</div>
                    <div>
                        <p className={`text-xs text-yellow-100 font-mono leading-relaxed ${isProfFadTyping ? 'animate-pulse' : ''}`}>
                            {profFadMessage}
                        </p>
                        <button 
                            onClick={handleProfFadAdvice}
                            className="mt-2 text-[9px] text-neon-blue hover:text-white uppercase font-bold tracking-widest flex items-center gap-1"
                        >
                            <span>Click for Hint</span> 💡
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white p-4 font-sans selection:bg-neon-blue selection:text-black pb-32">
            {/* Header */}
            <div className="flex justify-between items-center mb-12 max-w-6xl mx-auto border-b border-gray-900 pb-4">
                <div className="flex items-center gap-4">
                    <div className="bg-neon-green text-black font-bold px-3 py-1 rounded-sm text-sm tracking-tighter font-orbitron">CADET MODE</div>
                    <h2 className="text-xl font-bold font-orbitron tracking-widest">STUDENT VENTURE QUEST</h2>
                </div>
                <div className="flex items-center gap-8">
                    <div className="text-right">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Lab Credits</div>
                        <div className="text-2xl font-bold text-neon-green font-mono">${wallet.toLocaleString()}</div>
                    </div>
                    <button onClick={onExit} className="text-xs text-gray-500 hover:text-white uppercase font-bold border border-gray-800 px-4 py-2 rounded">Abort Mission</button>
                </div>
            </div>

            {isGeneratingKits ? (
                <div className="flex flex-col items-center justify-center py-24">
                     <LoadingScan text="PREPARING LAB MODULES..." />
                </div>
            ) : (
                <>
                {renderProgressBar()}

                <div className="max-w-5xl mx-auto animate-[fadeIn_0.5s_ease-out]">
                    
                    {/* STEP 0: SELECT INDUSTRY */}
                    {currentStep === 0 && (
                        <div className="space-y-8 text-center">
                            <h1 className="text-4xl font-bold text-white uppercase tracking-tighter">Choose Your Learning Path</h1>
                            <p className="text-gray-400">Select an industry to see which specialized ventures we can build together.</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {INDUSTRIES.map(ind => (
                                    <NeonCard 
                                        key={ind.id} 
                                        color="blue" 
                                        onClick={() => handleIndustrySelect(ind.id)}
                                        className="p-6 flex flex-col items-center group"
                                    >
                                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{ind.icon}</div>
                                        <h3 className="text-sm font-bold text-white text-center">{t.industries[ind.id] || ind.name}</h3>
                                    </NeonCard>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 1: CHOOSE BUSINESS */}
                    {currentStep === 1 && (
                        <div className="space-y-8 text-center">
                            <h1 className="text-4xl font-bold text-white uppercase tracking-tighter">Choose Your Starter Kit</h1>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {availableKits.map(kit => (
                                    <NeonCard 
                                        key={kit.id} 
                                        color="blue" 
                                        onClick={() => selectKit(kit)}
                                        className="group flex flex-col items-center p-8 border-2"
                                    >
                                        <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">{kit.icon}</div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{kit.title}</h3>
                                        <p className="text-gray-400 text-sm mb-6 flex-grow">{kit.description}</p>
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                            <span className="text-gray-500">Difficulty:</span>
                                            <span className={kit.difficulty === 'Easy' ? 'text-neon-green' : kit.difficulty === 'Medium' ? 'text-neon-yellow' : 'text-neon-pink'}>{kit.difficulty}</span>
                                        </div>
                                    </NeonCard>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: LEGAL REG */}
                    {currentStep === 2 && (
                        <div className="max-w-xl mx-auto space-y-8">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold text-white uppercase">Register Your Lab</h1>
                                <p className="text-gray-500 mt-2">Every operative needs an official identity.</p>
                            </div>
                            <NeonCard color="green" hoverEffect={false} className="p-8">
                                <form onSubmit={handleLegal} className="space-y-6">
                                    <div>
                                        <label className="block text-neon-green text-xs font-bold uppercase tracking-widest mb-3">Venture Name</label>
                                        <input 
                                            autoFocus
                                            type="text" 
                                            value={businessName}
                                            onChange={(e) => setBusinessName(e.target.value)}
                                            placeholder="e.g. Neon Juicery..."
                                            className="w-full bg-black border-2 border-neon-green text-2xl p-4 rounded text-white outline-none focus:shadow-neon-green"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        {['Home Lab', 'School Yard', 'Public Market'].map(zone => (
                                            <button key={zone} type="button" className="p-3 border border-gray-800 rounded text-[10px] uppercase font-bold text-gray-500 hover:border-white hover:text-white transition-colors">{zone}</button>
                                        ))}
                                    </div>
                                    <NeonButton fullWidth color="green" type="submit">Stamp Official License</NeonButton>
                                </form>
                            </NeonCard>
                        </div>
                    )}

                    {/* STEP 3: RAISE FUNDS */}
                    {currentStep === 3 && (
                        <div className="max-w-3xl mx-auto space-y-8 text-center">
                            <h1 className="text-4xl font-bold text-white uppercase">Power Up Your Wallet</h1>
                            <p className="text-gray-500">Choose where your starting capital comes from.</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <NeonCard color="yellow" onClick={() => addFunds(500, 'Family Grant')} className="p-6">
                                    <div className="text-4xl mb-4">🏠</div>
                                    <h3 className="font-bold text-white mb-2">Family Grant</h3>
                                    <div className="text-2xl font-bold text-neon-yellow mb-2">$500</div>
                                    <p className="text-xs text-gray-500">Easy funds, but you share chores!</p>
                                </NeonCard>
                                <NeonCard color="blue" onClick={() => addFunds(1000, 'Lab Scholarship')} className="p-6">
                                    <div className="text-4xl mb-4">🧪</div>
                                    <h3 className="font-bold text-white mb-2">Scholarship</h3>
                                    <div className="text-2xl font-bold text-neon-blue mb-2">$1,000</div>
                                    <p className="text-xs text-gray-500">Pass the quiz to unlock.</p>
                                </NeonCard>
                                <NeonCard color="pink" onClick={() => addFunds(1500, 'Crowdfunding')} className="p-6">
                                    <div className="text-4xl mb-4">🌍</div>
                                    <h3 className="font-bold text-white mb-2">Crowdfund</h3>
                                    <div className="text-2xl font-bold text-neon-pink mb-2">$1,500</div>
                                    <p className="text-xs text-gray-500">Get fans to support you!</p>
                                </NeonCard>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: HIRE CREW */}
                    {currentStep === 4 && (
                        <div className="max-w-4xl mx-auto space-y-8 text-center">
                            <h1 className="text-4xl font-bold text-white uppercase">Assemble Your Crew</h1>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {JUNIOR_CREW.map(crew => (
                                    <NeonCard key={crew.id} color="purple" onClick={() => selectCrew(crew)} className="p-6 flex flex-col items-center">
                                        <div className="w-20 h-20 rounded-full bg-gray-900 border-2 border-neon-purple flex items-center justify-center text-4xl mb-4">
                                            {crew.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-white">{crew.name}</h3>
                                        <div className="text-xs text-neon-purple font-bold uppercase mb-4">{crew.role}</div>
                                        <div className="bg-black/50 p-3 rounded text-[10px] text-gray-400 mb-6 flex-grow">
                                            <div className="text-neon-green font-bold mb-1 uppercase">Special Buff:</div>
                                            {crew.buff}
                                        </div>
                                        <NeonButton color="purple" fullWidth className="py-2 text-[10px]">Invite to Lab</NeonButton>
                                    </NeonCard>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 5: BUY MACHINE */}
                    {currentStep === 5 && selectedKit && (
                        <div className="max-w-4xl mx-auto space-y-8 text-center">
                            <h1 className="text-4xl font-bold text-white uppercase">Acquire Technology</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {selectedKit.machines.map(m => (
                                    <NeonCard key={m.id} color="blue" onClick={() => buyMachine(m)} className="p-8 flex items-center gap-6 text-left">
                                        <div className="text-6xl">{m.icon}</div>
                                        <div className="flex-grow">
                                            <h3 className="text-xl font-bold text-white mb-1">{m.name}</h3>
                                            <p className="text-xs text-gray-500 mb-4">{m.description}</p>
                                            <div className="text-2xl font-bold text-neon-blue font-mono">${m.cost}</div>
                                        </div>
                                        <div className="text-xs bg-gray-800 px-3 py-1 rounded font-bold uppercase hover:bg-neon-blue hover:text-black transition-colors">Buy</div>
                                    </NeonCard>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 6: FIND SUPPLIER */}
                    {currentStep === 6 && selectedKit && (
                        <div className="max-w-4xl mx-auto space-y-8 text-center">
                            <h1 className="text-4xl font-bold text-white uppercase">Material Sourcing</h1>
                            <div className="bg-gray-900 border-2 border-gray-800 h-64 rounded-2xl relative overflow-hidden mb-8">
                                {/* Simple Map Visualization */}
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                    <div className="text-3xl animate-bounce">📍</div>
                                    <div className="text-[8px] bg-white text-black font-bold px-1 uppercase mt-1">My Lab</div>
                                </div>
                                {selectedKit.potentialSuppliers.map((s, i) => (
                                    <div 
                                        key={s.id} 
                                        onClick={() => selectSupplier(s)}
                                        className={`absolute cursor-pointer group flex flex-col items-center ${i === 0 ? 'top-10 left-20' : 'bottom-10 right-20'}`}
                                    >
                                        <div className="text-3xl group-hover:scale-125 transition-transform">{s.icon}</div>
                                        <div className="text-[8px] text-neon-blue font-bold uppercase mt-1 opacity-0 group-hover:opacity-100">{s.name}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedKit.potentialSuppliers.map(s => (
                                    <button key={s.id} onClick={() => selectSupplier(s)} className="p-4 border border-gray-800 rounded bg-black hover:border-neon-blue transition-all flex items-center gap-4">
                                        <span className="text-3xl">{s.icon}</span>
                                        <div className="text-left">
                                            <div className="text-white font-bold">{s.name}</div>
                                            <div className="text-[10px] text-gray-500">{s.description}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 7: FIND MARKET */}
                    {currentStep === 7 && selectedKit && (
                        <div className="max-w-4xl mx-auto space-y-8 text-center">
                            <h1 className="text-4xl font-bold text-white uppercase">Identify Consumers</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {selectedKit.potentialMarkets.map(m => (
                                    <NeonCard key={m.id} color="pink" onClick={() => selectMarket(m)} className="p-8 flex flex-col items-center">
                                        <div className="text-6xl mb-4">{m.icon}</div>
                                        <h3 className="text-xl font-bold text-white mb-2">{m.name}</h3>
                                        <p className="text-xs text-gray-500">{m.description}</p>
                                        <div className="mt-6 w-full border-t border-gray-800 pt-4 text-[10px] text-neon-pink font-bold uppercase tracking-widest">Target Match: 98%</div>
                                    </NeonCard>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 8: SELL & LAUNCH */}
                    {currentStep === 8 && (
                        <div className="max-w-2xl mx-auto space-y-12 text-center">
                            <div className="animate-pulse">
                                <h1 className="text-5xl font-bold text-white uppercase tracking-widest">System Ready</h1>
                                <p className="text-neon-blue font-mono mt-4">Venture Launch Protocol Initialized</p>
                            </div>

                            <div className="bg-dark-card border-2 border-neon-blue p-8 rounded-2xl space-y-6">
                                <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                                    <span className="text-gray-500 uppercase text-xs">Venture:</span>
                                    <span className="text-white font-bold">{businessName}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                                    <span className="text-gray-500 uppercase text-xs">Operator:</span>
                                    <span className="text-neon-purple font-bold">{selectedCrew?.name}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                                    <span className="text-gray-500 uppercase text-xs">Asset:</span>
                                    <span className="text-neon-blue font-bold">{selectedMachine?.name}</span>
                                </div>
                                <div className="flex justify-between items-center pb-4">
                                    <span className="text-gray-500 uppercase text-xs">Target:</span>
                                    <span className="text-neon-pink font-bold">{selectedMarket?.name}</span>
                                </div>

                                <NeonButton fullWidth color="blue" onClick={finalizeLaunch} className="text-xl py-6 shadow-neon-blue animate-bounce">
                                    🚀 BLAST OFF & SELL!
                                </NeonButton>
                            </div>
                        </div>
                    )}

                    {/* STEP 9: SUMMARY / SUCCESS */}
                    {currentStep === 9 && (
                        <div className="max-w-4xl mx-auto space-y-12 text-center py-12 animate-[fadeIn_1s_ease-out]">
                            <div className="text-7xl mb-8">🏆</div>
                            <h1 className="text-6xl font-bold text-neon-green uppercase tracking-tighter">Mission Success</h1>
                            <p className="text-xl text-white font-light">You survived your first business quest in the Fad Lab!</p>

                            <div className="bg-white text-black p-12 rounded-none border-[12px] border-black inline-block relative">
                                <div className="absolute top-4 left-4 text-xs font-bold border border-black px-2 uppercase">Official Doc</div>
                                <div className="text-center">
                                    <div className="text-[10px] uppercase font-bold tracking-[0.3em] mb-4">Fad Venture Academy</div>
                                    <h2 className="text-4xl font-bold uppercase mb-2">CERTIFIED OPERATIVE</h2>
                                    <div className="w-48 h-0.5 bg-black mx-auto mb-6"></div>
                                    <p className="text-lg italic font-serif">This certifies that</p>
                                    <div className="text-3xl font-bold uppercase my-4 font-orbitron">{user.name}</div>
                                    <p className="text-lg italic font-serif">has successfully launched</p>
                                    <div className="text-2xl font-bold uppercase my-2">{businessName}</div>
                                    <div className="mt-8 flex justify-between items-end">
                                        <div className="text-left">
                                            <div className="text-[8px] uppercase">Final Wallet</div>
                                            <div className="text-xl font-bold">${wallet.toLocaleString()}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[8px] uppercase">Advisor Signature</div>
                                            <div className="text-xl font-serif italic">Prof. Fad</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-12 flex gap-6 justify-center">
                                <NeonButton color="green" onClick={() => setCurrentStep(0)}>Start New Quest</NeonButton>
                                <button onClick={onExit} className="text-gray-500 hover:text-white underline uppercase font-bold text-xs tracking-widest">Return to Dashboard</button>
                            </div>
                        </div>
                    )}

                </div>

                {currentStep < 9 && renderProfFad()}
                </>
            )}
        </div>
    );
};