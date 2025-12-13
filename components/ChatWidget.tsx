import React, { useState, useEffect, useRef } from 'react';
import { NeonCard, NeonButton } from './NeonUI';
import { streamChat } from '../services/geminiService';
import { AppState, BusinessIdea, Industry, Language } from '../types';

interface ChatWidgetProps {
  appState: AppState;
  selectedIndustry: Industry | null;
  selectedIdea: BusinessIdea | null;
  currentUser: any;
  t: any;
  language: Language;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ appState, selectedIndustry, selectedIdea, currentUser, t, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: t.chat.greeting }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset greeting when translation changes (optional, but good for language toggle)
  useEffect(() => {
     setMessages(prev => {
         if (prev.length === 1 && prev[0].role === 'model') {
             return [{ role: 'model', text: t.chat.greeting }];
         }
         return prev;
     });
  }, [t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Context-aware suggestions
  const getSuggestions = () => {
    if (appState === AppState.VIEW_CANVAS && selectedIdea) {
      return [
        t.chat.suggestions.risks(selectedIdea.businessTitle),
        t.chat.suggestions.market(selectedIdea.machineName)
      ];
    }
    if (appState === AppState.SELECT_INDUSTRY) {
      return [
        t.chat.suggestions.startup,
        t.chat.suggestions.profitable
      ];
    }
    return [];
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Build context string
    const context = `
      Current App State: ${AppState[appState]}
      Selected Industry: ${selectedIndustry ? selectedIndustry.name : 'None'}
      Selected Idea: ${selectedIdea ? `${selectedIdea.businessTitle} (${selectedIdea.machineName})` : 'None'}
      User: ${currentUser?.name || 'Guest'}
    `;

    // Convert internal message format to API history format
    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    try {
        let fullResponse = "";
        const stream = streamChat(history, text, context, language);
        
        // Add a placeholder message for the model
        setMessages(prev => [...prev, { role: 'model', text: '' }]);

        for await (const chunk of stream) {
            fullResponse += chunk;
            setMessages(prev => {
                const newArr = [...prev];
                newArr[newArr.length - 1] = { role: 'model', text: fullResponse };
                return newArr;
            });
        }
    } catch (error) {
        console.error("Chat error:", error);
        setMessages(prev => [...prev, { role: 'model', text: t.chat.error }]);
    } finally {
        setIsTyping(false);
    }
  };

  const suggestions = getSuggestions();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 pointer-events-auto animate-[fadeIn_0.2s_ease-out]">
          <NeonCard color="yellow" className="flex flex-col h-96 p-0 overflow-hidden shadow-2xl shadow-neon-yellow/20" hoverEffect={false}>
            {/* Header */}
            <div className="bg-yellow-900/20 border-b border-yellow-900/50 p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
                 <span className="font-bold text-neon-yellow font-orbitron tracking-wider">{t.chat.header}</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-yellow-500 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar bg-black/50">
               {messages.map((msg, idx) => (
                 <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
                        msg.role === 'user' 
                        ? 'bg-neon-blue/20 text-white border border-neon-blue/50 rounded-tr-none' 
                        : 'bg-neon-yellow/10 text-yellow-100 border border-neon-yellow/50 rounded-tl-none font-mono'
                    }`}>
                        {msg.text}
                    </div>
                 </div>
               ))}
               {isTyping && (
                   <div className="flex justify-start">
                       <div className="bg-neon-yellow/10 border border-neon-yellow/50 rounded-lg rounded-tl-none p-3 flex gap-1">
                           <div className="w-1.5 h-1.5 bg-neon-yellow rounded-full animate-bounce"></div>
                           <div className="w-1.5 h-1.5 bg-neon-yellow rounded-full animate-bounce delay-100"></div>
                           <div className="w-1.5 h-1.5 bg-neon-yellow rounded-full animate-bounce delay-200"></div>
                       </div>
                   </div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && messages.length < 5 && (
                <div className="px-4 py-2 flex gap-2 overflow-x-auto">
                    {suggestions.map((s, i) => (
                        <button key={i} onClick={() => handleSend(s)} className="whitespace-nowrap text-[10px] bg-dark-card border border-gray-700 hover:border-neon-yellow text-gray-400 hover:text-white px-2 py-1 rounded transition-colors">
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-gray-800 bg-dark-card">
               <div className="flex gap-2">
                 <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t.chat.placeholder}
                    className="flex-grow bg-black/50 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-yellow"
                 />
                 <button 
                    onClick={() => handleSend()}
                    disabled={isTyping || !input.trim()}
                    className="bg-neon-yellow text-black font-bold p-2 rounded hover:bg-white transition-colors disabled:opacity-50"
                 >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                 </button>
               </div>
            </div>
          </NeonCard>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto bg-neon-yellow hover:bg-white text-black w-14 h-14 rounded-full shadow-[0_0_15px_#f9f871] hover:shadow-[0_0_25px_#f9f871] flex items-center justify-center transition-all duration-300 transform hover:scale-110 z-50 group"
      >
        {isOpen ? (
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        ) : (
             <div className="relative">
                 {/* Robot Icon */}
                 <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13A2.5 2.5 0 0 0 5 15.5A2.5 2.5 0 0 0 7.5 18a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 7.5 13m9 0a2.5 2.5 0 0 0-2.5 2.5a2.5 2.5 0 0 0 2.5 2.5a2.5 2.5 0 0 0 2.5-2.5a2.5 2.5 0 0 0-2.5-2.5" />
                 </svg>
                 <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                 </span>
             </div>
        )}
      </button>
    </div>
  );
};