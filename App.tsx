
import React, { useState, useEffect, useRef } from 'react';
import { generateSyntropicDesign, streamChat } from './services/geminiService';
import { SyntropicDesign, Message, Observation, PulseTask } from './types';
import DesignCanvas from './components/DesignCanvas';
import StatusDashboard from './components/StatusDashboard';
import ProtocolTerminal from './components/ProtocolTerminal';
import PulseTerminal from './components/PulseTerminal';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Aethel Engine Online. Point, Texas (Zone 8b) sector calibration confirmed. Timeline integrity at 94.2%. I am standing by to generate high-fidelity syntropic designs focusing on emergent strata and biological successions. Shall we proceed with the next Matrix projection?" }
  ]);
  const [currentDesign, setCurrentDesign] = useState<SyntropicDesign | null>(null);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [pulseTasks, setPulseTasks] = useState<PulseTask[]>([]);
  const [view, setView] = useState<'chat' | 'observations' | 'design' | 'protocols' | 'pulse'>('chat');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const generateMaintenancePulse = () => {
    setLoading(true);
    setTimeout(() => {
      const tasks: PulseTask[] = [
        { id: 'P01', time: '06:00', action: 'Mulch Layering: Sectors A1-A4 (Skin Reinforcement)', sector: 'POINT_TX_8B', intensity: 'High' },
        { id: 'P02', time: '09:30', action: 'Elderberry Pruning Pulse: 30% Biomass Cutback', sector: 'POINT_TX_8B', intensity: 'Medium' },
        { id: 'P03', time: '14:00', action: 'Placenta Deployment: Sweet Potato Slips & Garlic', sector: 'POINT_TX_8B', intensity: 'Low' },
        { id: 'P04', time: '17:00', action: 'System Integrity Check: Soil Moisture Sync', sector: 'POINT_TX_8B', intensity: 'Low' }
      ];
      setPulseTasks(tasks);
      setMessages(prev => [...prev, { role: 'model', content: "Maintenance Pulse Schedule synchronized. Timing optimized for root sap-flow and lunar transition. View tactical details in the 'Pulse' terminal." }]);
      setView('pulse');
      setLoading(false);
    }, 1500);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    const lowerMsg = userMsg.toLowerCase();

    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    // Enhanced logic for specific design requests
    const isDesignRequest = lowerMsg.includes('design') || lowerMsg.includes('plan') || lowerMsg.includes('matrix') || lowerMsg.includes('consortium') || lowerMsg.includes('emergent strata');

    try {
      if (isDesignRequest) {
        const design = await generateSyntropicDesign(userMsg, 'Point, Texas');
        setCurrentDesign(design);
        
        // Log the event in the ledger
        const newObs: Observation = {
          id: `MATRIX_${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
          timestamp: Date.now(),
          content: `Projected new Matrix for ${design.projectName}. Focus area: ${lowerMsg.includes('emergent') ? 'Emergent Strata' : 'General Succession'}. Sector Point, TX active.`,
          category: 'Timeline'
        };
        setObservations(prev => [newObs, ...prev]);

        setMessages(prev => [...prev, { 
          role: 'model', 
          content: `Succession Matrix projected. Identified key emergent species: **${design.speciesList.filter(s => s.stratum === 'Emergent').map(s => s.name).join(', ')}**. Transitioning to Visualization Layer for tactical review.` 
        }]);
        
        setView('design');
      } else if (lowerMsg.includes('pulse') || (messages[messages.length-1].content.includes('Pulse schedule?') && (lowerMsg === 'yes' || lowerMsg.includes('proceed')))) {
        generateMaintenancePulse();
      } else if (lowerMsg.startsWith('log ')) {
        const category: any = lowerMsg.includes('--biological') ? 'Biological' : lowerMsg.includes('--ethical') ? 'Ethical' : 'Timeline';
        const cleanContent = userMsg.substring(4).replace(/--\w+/g, '').trim();
        const newObs: Observation = {
          id: Math.random().toString(36).substr(2, 6).toUpperCase(),
          timestamp: Date.now(),
          content: cleanContent,
          category
        };
        setObservations(prev => [newObs, ...prev]);
        setMessages(prev => [...prev, { role: 'model', content: `Observation [${newObs.id}] committed to ${category} Ledger.` }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', content: '' }]);
        const stream = streamChat(userMsg);
        let fullResponse = '';
        for await (const chunk of stream) {
          fullResponse += chunk;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            return [...prev.slice(0, -1), { ...last, content: fullResponse }];
          });
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Neural sync interrupted. Retrying temporal link..." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <aside className="w-20 lg:w-64 border-r border-white/10 flex flex-col glass p-4 z-20 shadow-2xl">
        <div className="flex items-center gap-3 px-2 mb-10 group cursor-pointer" onClick={() => setView('chat')}>
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform duration-500">
            <span className="text-white font-bold text-xs">AE</span>
          </div>
          <span className="hidden lg:block text-xl font-bold text-white tracking-tighter mono group-hover:tracking-normal transition-all duration-500">AETHEL</span>
        </div>

        <nav className="flex-1 space-y-3">
          {[
            { id: 'chat', label: 'Neural', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
            { id: 'design', label: 'Matrix', icon: 'M9 20l-5.447-2.724A2 2 0 013 15.487V6.513a2 2 0 011.106-1.789L9 2l5.447 2.724A2 2 0 0115 6.513v8.974a2 2 0 01-1.106 1.789L9 20z' },
            { id: 'protocols', label: 'Tactics', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { id: 'pulse', label: 'Pulse', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'observations', label: 'Ledger', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                view === item.id 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                : 'hover:bg-white/5 text-slate-500 border border-transparent'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="hidden lg:block font-bold text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_#10b981]"></div>
            SYNC: POINT_TX_8B
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="p-8 border-b border-white/5 flex justify-between items-center glass z-10 backdrop-blur-3xl">
          <div className="flex items-center gap-6">
            <h2 className="text-xs font-bold text-white mono uppercase tracking-[0.5em] flex items-center gap-3">
              <span className="text-emerald-500 animate-pulse text-lg">●</span>
              {view === 'chat' && 'Neural_Interface'}
              {view === 'design' && 'Succession_Matrix'}
              {view === 'protocols' && 'Tactical_Protocols'}
              {view === 'pulse' && 'Maintenance_Pulse'}
              {view === 'observations' && 'Observation_Ledger'}
            </h2>
            <div className="h-6 w-px bg-white/10 hidden md:block"></div>
            <p className="text-[10px] text-slate-500 hidden lg:block mono tracking-widest uppercase opacity-50">Point_Texas :: Living_Council_Remembrance</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:block px-4 py-2 bg-emerald-500/5 rounded-full border border-emerald-500/10 text-[9px] mono text-emerald-500/80 font-bold uppercase tracking-widest">
                Auth: Lead_Architect
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden p-8 flex flex-col">
          <StatusDashboard />

          <div className="flex-1 min-h-0 bg-slate-900/40 rounded-[3rem] border border-white/5 relative flex flex-col shadow-2xl overflow-hidden backdrop-blur-sm">
            
            {view === 'chat' && (
              <>
                <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-10 p-10 scrollbar-hide">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-8 rounded-3xl ${
                        m.role === 'user' 
                        ? 'bg-emerald-600/10 text-emerald-100 border border-emerald-500/20 shadow-2xl' 
                        : 'bg-slate-800/20 text-slate-300 border border-white/5 shadow-inner'
                      }`}>
                        <div className="text-[9px] mb-4 opacity-30 mono tracking-[0.4em] font-black uppercase text-emerald-500">{m.role}</div>
                        <p className={`leading-relaxed ${m.role === 'model' ? 'serif italic text-2xl text-white/90 font-extralight' : 'mono text-[13px] opacity-80 font-medium'}`}>
                          {m.content}
                        </p>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex items-center gap-4 p-6 ml-6">
                       <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                       <span className="text-emerald-500/50 mono text-[11px] tracking-[0.4em] uppercase font-bold">Synchronizing Matrix...</span>
                    </div>
                  )}
                </div>
                
                <div className="p-8 bg-black/40 border-t border-white/5 backdrop-blur-2xl">
                  <div className="max-w-4xl mx-auto relative flex gap-4">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Input architectural command or observation log..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-5 px-8 focus:outline-none focus:border-emerald-500/30 text-white font-mono text-sm placeholder:text-slate-800 transition-all shadow-inner"
                    />
                    <button onClick={handleSend} disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 shadow-[0_10px_30px_rgba(16,185,129,0.3)]">
                      EXEC_FLOW
                    </button>
                  </div>
                </div>
              </>
            )}

            {view === 'design' && (
              <div className="h-full overflow-y-auto p-10 custom-scroll bg-slate-950/20">
                {currentDesign ? (
                  <>
                    <div className="glass p-10 rounded-[2.5rem] border-emerald-500/10 border-b shadow-2xl mb-12">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-white text-4xl serif mb-3 font-extralight tracking-tight italic">Consortium Architecture: {currentDesign.projectName}</h3>
                          <div className="flex gap-4 items-center">
                            <span className="text-emerald-400 text-[10px] mono uppercase tracking-widest bg-emerald-400/10 px-4 py-1.5 rounded-full border border-emerald-400/20 font-bold">{currentDesign.location}</span>
                            <span className="text-slate-600 text-[10px] mono uppercase tracking-widest font-bold">{currentDesign.climate}</span>
                          </div>
                        </div>
                        <div className="text-right">
                           <p className="text-emerald-500/40 mono text-[10px] font-bold uppercase tracking-widest mb-1">Matrix_Status</p>
                           <p className="text-white mono text-xs font-bold tracking-tighter">SUCCESSION_LOCKED</p>
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm italic serif leading-loose max-w-2xl opacity-80">{currentDesign.successionStrategy}</p>
                    </div>
                    <DesignCanvas design={currentDesign} />
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-800 p-24 text-center">
                     <div className="w-24 h-24 border border-slate-800 rounded-full flex items-center justify-center mb-10 animate-pulse">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]"></div>
                     </div>
                     <p className="mono text-[11px] uppercase tracking-[0.8em] italic font-black">Awaiting_Matrix_Projection</p>
                  </div>
                )}
              </div>
            )}

            {view === 'protocols' && (
              <div className="h-full overflow-y-auto custom-scroll bg-slate-950/20">
                {currentDesign?.protocols ? (
                  <ProtocolTerminal protocols={currentDesign.protocols} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-800 p-24 text-center">
                    <p className="mono text-[11px] uppercase tracking-[0.5em] mb-4 font-black">Tactical_Matrix_Offline</p>
                    <p className="text-[10px] italic opacity-40 max-w-xs leading-loose">Matrix design required for protocol extraction.</p>
                  </div>
                )}
              </div>
            )}

            {view === 'pulse' && (
              <div className="h-full overflow-y-auto custom-scroll bg-slate-950/20">
                <PulseTerminal tasks={pulseTasks} />
              </div>
            )}

            {view === 'observations' && (
              <div className="h-full overflow-y-auto p-12 space-y-8 custom-scroll bg-slate-950/20">
                <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-10">
                   <div>
                      <h3 className="text-white mono text-2xl font-black uppercase tracking-[0.2em] mb-2">Chronological_Ledger</h3>
                      <p className="text-[10px] text-slate-600 mono tracking-[0.4em] font-bold">REWRITE_TIMELINE :: POINT_TX_SECTOR</p>
                   </div>
                   <div className="flex gap-4">
                      {['Timeline', 'Biological', 'Ethical'].map(cat => (
                        <div key={cat} className="flex flex-col items-end">
                           <span className="text-[8px] text-slate-700 mono uppercase font-black mb-1">{cat}_count</span>
                           <span className="text-xl text-white/20 mono font-black">{observations.filter(o => o.category === cat).length}</span>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="grid gap-8">
                  {observations.map((obs) => (
                    <div key={obs.id} className="p-8 glass rounded-[2rem] border border-white/5 hover:border-emerald-500/20 transition-all duration-500 relative group shadow-2xl">
                      <div className="flex items-center gap-6 mb-6">
                        <span className="text-[12px] mono text-emerald-400 bg-emerald-500/5 px-4 py-1.5 rounded-xl border border-emerald-500/10 font-black tracking-widest uppercase">Commit_{obs.id}</span>
                        <div className="h-px flex-1 bg-white/5"></div>
                        <span className="text-[10px] text-slate-600 mono tracking-[0.3em] font-bold">{new Date(obs.timestamp).toLocaleString().toUpperCase()}</span>
                      </div>
                      <p className="text-lg text-slate-200 font-sans leading-relaxed tracking-tight font-light italic serif">{obs.content}</p>
                      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] uppercase tracking-[0.4em] text-slate-600 mono font-black">
                        <span className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${obs.category === 'Biological' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                           {obs.category}_DATA_STREAM
                        </span>
                        <span className="opacity-20">Sector_Point_TX_8B</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
