import React, { useState } from 'react';
import { NeonCard, NeonButton, NeonInput, NeonTextArea, NeonSelect } from './NeonUI';
import { User, CommunityPost } from '../types';
import { INDUSTRIES } from '../constants';

interface CommunityProps {
  user: User;
  posts: CommunityPost[];
  onAddPost: (content: string, industryId: string) => void;
  onLikePost: (postId: string) => void;
  t: any;
}

export const Community: React.FC<CommunityProps> = ({ user, posts, onAddPost, onLikePost, t }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostIndustry, setNewPostIndustry] = useState('general');

  const filteredPosts = activeFilter === 'all' 
    ? posts 
    : posts.filter(p => p.industryId === activeFilter);

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
        <div className="mb-8 flex justify-between items-end">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tighter uppercase">
                    <span className="text-neon-pink">FAD</span> connect
                </h2>
                <p className="text-gray-400 font-mono text-sm">{t.community.subtitle}</p>
            </div>
            <div className="hidden md:block text-right">
                <div className="text-xs text-neon-green font-bold uppercase tracking-widest">{filteredPosts.length} SIGNALS DETECTED</div>
            </div>
        </div>

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
                
                {/* Create Post */}
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

                {/* Feed List */}
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
    </div>
  );
};