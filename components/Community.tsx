import React, { useState, useMemo } from 'react';
import { NeonCard, NeonButton, NeonInput, NeonTextArea, NeonSelect } from './NeonUI';
import { User, CommunityPost, LabNetworkNode, LabNetworkLink } from '../types';
import { INDUSTRIES } from '../constants';

interface CommunityProps {
  user: User;
  posts: CommunityPost[];
  onAddPost: (content: string, industryId: string) => void;
  onLikePost: (postId: string) => void;
  t: any;
}

export const Community: React.FC<CommunityProps> = ({ user, posts, onAddPost, onLikePost, t }) => {
  const [activeView, setActiveView] = useState<'feed' | 'network'>('feed');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostIndustry, setNewPostIndustry] = useState('general');
  const [selectedNode, setSelectedNode] = useState<LabNetworkNode | null>(null);

  const filteredPosts = activeFilter === 'all' 
    ? posts 
    : posts.filter(p => p.industryId === activeFilter);

  // --- Lab Network Logic ---
  const networkData = useMemo(() => {
    // Generate a set of nodes representing "Other Users" in the B2B Hive
    const nodes: LabNetworkNode[] = [
        { id: 'u1', userName: 'CyberRecycler', businessTitle: 'PET Flake Factory', industryId: 'waste', machineName: 'PET Plastic Recycling Line', x: 200, y: 150 },
        { id: 'u2', userName: 'MoldMaster', businessTitle: 'Precision Toy Mfg', industryId: 'light_mfg', machineName: 'Injection Molding Machine', x: 500, y: 150 },
        { id: 'u3', userName: 'GreenHarvest', businessTitle: 'Vertical Greens', industryId: 'agri', machineName: 'Hydroponic Farm Unit', x: 200, y: 400 },
        { id: 'u4', userName: 'VitalExtract', businessTitle: 'Organic Juicery', industryId: 'food_bev', machineName: 'Cold Press Extractor', x: 500, y: 400 },
        { id: 'u5', userName: 'IronSmith', businessTitle: 'Scrap Refinery', industryId: 'mining', machineName: 'Metal Melting Furnace', x: 800, y: 150 },
        { id: 'u6', userName: 'NeoPart', businessTitle: 'Industrial Spares', industryId: 'heavy_mfg', machineName: 'CNC Milling Center', x: 800, y: 400 },
        // The Current User Node
        { id: 'user', userName: user.name, businessTitle: 'My Lab Venture', industryId: 'custom', machineName: 'Fad Machine', x: 350, y: 275, isUser: true }
    ];

    const links: LabNetworkLink[] = [
        { source: 'u1', target: 'u2', synergyType: 'RAW_MATERIAL_FEED' }, // Recycling -> Molding
        { source: 'u3', target: 'u4', synergyType: 'SUPPLY_CHAIN_LINK' }, // Farm -> Juicery
        { source: 'u5', target: 'u6', synergyType: 'FEEDSTOCK_PARTNER' }, // Refinery -> CNC
        { source: 'u1', target: 'user', synergyType: 'SYNERGY_POTENTIAL' }, // Recycler could help user
        { source: 'user', target: 'u2', synergyType: 'SYNERGY_POTENTIAL' }  // User could help Molder
    ];

    return { nodes, links };
  }, [user]);

  const getPartnerColor = (indId: string) => {
      if (indId === 'waste') return '#0aff0a';
      if (indId === 'light_mfg') return '#ff00ff';
      if (indId === 'agri') return '#f9f871';
      if (indId === 'food_bev') return '#00d4ff';
      if (indId === 'heavy_mfg') return '#bc13fe';
      return '#ffffff';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    onAddPost(newPostContent, newPostIndustry);
    setNewPostContent('');
  };

  const getTimeAgo = (timestamp: number) => {
      const seconds = Math.floor((Date.now() - timestamp) / 1000);
      if (seconds < 60) return `${seconds}s ago`;
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-[fadeIn_0.5s_ease-out]">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tighter uppercase">
                    <span className="text-neon-pink">FAD</span> connect
                </h2>
                <p className="text-gray-400 font-mono text-sm">{t.community.subtitle}</p>
            </div>
            
            {/* View Switcher Tabs */}
            <div className="flex bg-dark-card border border-gray-800 p-1 rounded-lg">
                <button 
                    onClick={() => setActiveView('feed')}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-all ${activeView === 'feed' ? 'bg-neon-pink text-white shadow-neon-pink' : 'text-gray-500 hover:text-white'}`}
                >
                    {t.community.tabs.feed}
                </button>
                <button 
                    onClick={() => setActiveView('network')}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-all ${activeView === 'network' ? 'bg-neon-blue text-black shadow-neon-blue' : 'text-gray-500 hover:text-white'}`}
                >
                    {t.community.tabs.network}
                </button>
            </div>
        </div>

        {activeView === 'feed' ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar / Filters */}
                <div className="lg:col-span-1 space-y-6">
                    <NeonCard color="purple" hoverEffect={false}>
                        <h3 className="text-white font-bold uppercase mb-4 border-b border-gray-700 pb-2 text-sm tracking-wider">
                            {t.community.channels}
                        </h3>
                        <div className="space-y-2">
                            <button 
                                onClick={() => setActiveFilter('all')}
                                className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${activeFilter === 'all' ? 'bg-neon-purple text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                            >
                            # {t.community.generalChannel}
                            </button>
                            {INDUSTRIES.map(ind => (
                                <button 
                                    key={ind.id}
                                    onClick={() => setActiveFilter(ind.id)}
                                    className={`w-full text-left px-3 py-2 rounded text-sm transition-all flex items-center gap-2 ${activeFilter === ind.id ? 'bg-neon-purple text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                                >
                                <span>{ind.icon}</span> {t.industries[ind.id] || ind.name}
                                </button>
                            ))}
                        </div>
                    </NeonCard>
                </div>

                {/* Main Feed */}
                <div className="lg:col-span-3 space-y-6">
                    <NeonCard color="blue" hoverEffect={false}>
                        <h3 className="text-neon-blue font-bold uppercase mb-4 text-sm tracking-wider">
                            {t.community.createPost}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <NeonTextArea 
                                label="" 
                                placeholder={t.community.postPlaceholder}
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                className="h-24 mb-4"
                            />
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="w-full md:w-1/2">
                                    <NeonSelect 
                                        label=""
                                        value={newPostIndustry}
                                        onChange={(e) => setNewPostIndustry(e.target.value)}
                                        options={[
                                            { value: 'general', label: t.community.generalChannel },
                                            ...INDUSTRIES.map(i => ({ value: i.id, label: t.industries[i.id] || i.name }))
                                        ]}
                                    />
                                </div>
                                <div className="mt-2 md:mt-0">
                                    <NeonButton type="submit" color="blue" className="px-8 py-2 text-sm">
                                        {t.community.postBtn}
                                    </NeonButton>
                                </div>
                            </div>
                        </form>
                    </NeonCard>

                    <div className="space-y-4">
                        {filteredPosts.length === 0 ? (
                            <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl text-gray-500">
                                {t.community.noPosts}
                            </div>
                        ) : (
                            filteredPosts.map(post => (
                                <NeonCard key={post.id} color="pink" className="flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold text-lg">
                                                {post.userName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{post.userName}</div>
                                                <div className="text-xs text-gray-500 font-mono">{getTimeAgo(post.timestamp)}</div>
                                            </div>
                                        </div>
                                        <div className="text-[10px] uppercase font-bold px-2 py-1 rounded border border-gray-700 text-gray-400">
                                            {post.industryId === 'general' ? 'General' : (t.industries[post.industryId] || post.industryId)}
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-200 leading-relaxed text-sm md:text-base">
                                        {post.content}
                                    </p>

                                    <div className="flex items-center gap-4 mt-2 pt-3 border-t border-gray-800">
                                        <button 
                                            onClick={() => onLikePost(post.id)}
                                            className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wide transition-colors ${post.isLiked ? 'text-neon-pink' : 'text-gray-500 hover:text-white'}`}
                                        >
                                            <svg className="w-4 h-4" fill={post.isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                            {post.likes}
                                        </button>
                                        <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-gray-500 hover:text-white transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                            Reply
                                        </button>
                                        <div className="flex-grow"></div>
                                        <button className="text-xs text-neon-blue border border-neon-blue px-2 py-1 rounded hover:bg-neon-blue hover:text-black transition-colors uppercase font-bold">
                                            {t.community.connectBtn}
                                        </button>
                                    </div>
                                </NeonCard>
                            ))
                        )}
                    </div>
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-[fadeIn_0.5s_ease-out]">
                {/* Network Map Area */}
                <div className="lg:col-span-8 bg-black/40 border border-gray-800 rounded-2xl relative overflow-hidden h-[600px] shadow-inner group">
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00d4ff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                    
                    <div className="absolute top-6 left-6 z-10">
                        <h3 className="text-neon-blue font-bold uppercase tracking-[0.2em] text-lg mb-1">{t.community.network.title}</h3>
                        <p className="text-gray-500 text-xs font-mono">{t.community.network.desc}</p>
                    </div>

                    <svg width="100%" height="100%" className="relative z-0">
                        <defs>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                            <marker id="arrow" viewBox="0 0 10 10" refX="25" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#00d4ff" opacity="0.5" />
                            </marker>
                        </defs>

                        {/* Network Links */}
                        {networkData.links.map((link, idx) => {
                            const source = networkData.nodes.find(n => n.id === link.source);
                            const target = networkData.nodes.find(n => n.id === link.target);
                            if (!source || !target) return null;
                            
                            const isActive = selectedNode && (selectedNode.id === source.id || selectedNode.id === target.id);

                            return (
                                <line 
                                    key={idx}
                                    x1={source.x} y1={source.y} 
                                    x2={target.x} y2={target.y}
                                    stroke={isActive ? '#00d4ff' : '#222'}
                                    strokeWidth={isActive ? 3 : 1}
                                    strokeDasharray={link.synergyType === 'SYNERGY_POTENTIAL' ? "5,5" : "0"}
                                    markerEnd="url(#arrow)"
                                    className="transition-all duration-500"
                                    filter={isActive ? "url(#glow)" : ""}
                                />
                            );
                        })}

                        {/* Network Nodes */}
                        {networkData.nodes.map((node) => {
                            const isSelected = selectedNode?.id === node.id;
                            const nodeColor = getPartnerColor(node.industryId);

                            return (
                                <g 
                                    key={node.id} 
                                    onClick={() => setSelectedNode(node)}
                                    className="cursor-pointer group"
                                >
                                    {/* Connection Pulse for User */}
                                    {node.isUser && (
                                        <circle 
                                            cx={node.x} cy={node.y} r="25" 
                                            className="fill-neon-blue/20 animate-ping"
                                        />
                                    )}
                                    
                                    <circle 
                                        cx={node.x} cy={node.y} r={isSelected ? "15" : "10"} 
                                        fill={node.isUser ? '#00d4ff' : '#111'}
                                        stroke={isSelected ? '#fff' : nodeColor}
                                        strokeWidth="2"
                                        className="transition-all duration-300 hover:r-15"
                                        filter={isSelected ? "url(#glow)" : ""}
                                    />
                                    
                                    <text 
                                        x={node.x} y={node.y + 30} 
                                        textAnchor="middle" 
                                        className={`text-[10px] uppercase font-bold tracking-widest pointer-events-none transition-all duration-300 ${isSelected ? 'fill-white scale-110' : 'fill-gray-600'}`}
                                    >
                                        {node.userName}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>

                    {/* Interactive Legend */}
                    <div className="absolute bottom-6 left-6 flex flex-col gap-2 bg-black/60 p-3 rounded border border-gray-800 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-neon-blue shadow-neon-blue"></div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">My Venture</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-neon-green shadow-neon-green"></div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Waste Provider</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-neon-pink shadow-neon-pink"></div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mfg consumer</span>
                        </div>
                    </div>
                </div>

                {/* Info / Partner Details Pane */}
                <div className="lg:col-span-4 flex flex-col h-full gap-6">
                    <NeonCard color="blue" hoverEffect={false} className="flex-grow flex flex-col h-full">
                        {selectedNode ? (
                            <div className="animate-[fadeIn_0.3s_ease-out] flex flex-col h-full">
                                <div className="mb-6">
                                    <div className="text-[10px] text-neon-blue font-bold uppercase tracking-[0.2em] mb-1">{t.community.network.partnerType}</div>
                                    <h4 className="text-2xl font-bold text-white uppercase font-orbitron">{selectedNode.userName}</h4>
                                </div>

                                <div className="space-y-6 flex-grow">
                                    <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
                                        <div className="text-[10px] text-gray-500 uppercase font-bold mb-2">Primary Asset</div>
                                        <div className="text-white font-bold mb-1">{selectedNode.machineName}</div>
                                        <div className="text-neon-blue text-xs uppercase font-mono">{selectedNode.businessTitle}</div>
                                    </div>

                                    <div>
                                        <div className="text-[10px] text-neon-green font-bold uppercase tracking-widest mb-3">{t.community.network.synergyMatch}</div>
                                        {/* Dynamic synergy logic based on industry pairs */}
                                        <div className="bg-neon-green/10 border border-neon-green/30 p-4 rounded-lg italic text-sm text-gray-300 leading-relaxed">
                                            {selectedNode.industryId === 'waste' && "Provides processed raw material (pellets/flakes) for your production line."}
                                            {selectedNode.industryId === 'light_mfg' && "Consumes your output as feedstock for final assembly."}
                                            {selectedNode.industryId === 'agri' && "Provides fresh biological inputs for juice/food processing."}
                                            {selectedNode.id === 'user' && "This is your center node. Click others to explore potential alliances."}
                                            {selectedNode.industryId === 'custom' && selectedNode.id !== 'user' && "Potential trade partner found. Match algorithm: 84%"}
                                        </div>
                                    </div>
                                </div>

                                {selectedNode.id !== 'user' && (
                                    <div className="mt-8 space-y-3">
                                        <NeonButton fullWidth color="blue" className="py-2 text-xs">
                                            {t.community.connectBtn}
                                        </NeonButton>
                                        <button className="w-full py-2 text-[10px] text-gray-500 hover:text-white uppercase font-bold tracking-widest border border-transparent hover:border-gray-800 rounded transition-all">
                                            {t.community.network.viewDetails}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
                                <div className="w-16 h-16 rounded-full border-2 border-gray-800 flex items-center justify-center text-gray-700 text-3xl animate-pulse">
                                    📡
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm italic">Scanning Lab Frequencies...</p>
                                    <p className="text-xs text-gray-600 mt-2 uppercase tracking-widest">Select a network node to analyze B2B synergies</p>
                                </div>
                            </div>
                        )}
                    </NeonCard>
                </div>
            </div>
        )}
    </div>
  );
};