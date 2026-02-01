
import React from 'react';
import { ManagementTask } from '../types';

interface Props {
  protocols: ManagementTask[];
}

const ProtocolTerminal: React.FC<Props> = ({ protocols }) => {
  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-6">
        <div>
          <h3 className="text-emerald-400 mono text-lg font-bold tracking-[0.3em] uppercase mb-1">Tactical_Protocols</h3>
          <p className="text-[10px] text-slate-600 mono tracking-widest uppercase">Biological succession management // Zone 8b</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-emerald-500/50 mono animate-pulse font-bold tracking-widest">STREAM_SYNC: 94.2%</span>
          <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
             <div className="w-[94%] h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
          </div>
        </div>
      </div>
      
      <div className="grid gap-6">
        {protocols.map((task, i) => (
          <div key={i} className="glass p-6 rounded-2xl border-l-4 border-emerald-500/30 hover:border-emerald-500 transition-all group relative overflow-hidden bg-white/5 shadow-xl">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-8xl mono font-black select-none">
              0{i + 1}
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold mono border border-emerald-500/20 tracking-widest">PHASE::{task.phase.toUpperCase()}</span>
                <div className="h-1 w-8 bg-white/10 rounded-full"></div>
                <span className="text-[10px] text-slate-500 mono font-bold tracking-widest">{task.timing}</span>
              </div>
            </div>

            <h4 className="text-xl text-white font-bold mb-3 group-hover:text-emerald-400 transition-colors tracking-tight italic serif">
              {task.action}
            </h4>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {task.targetSpecies.map((s, si) => (
                <span key={si} className="text-[10px] text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-lg mono tracking-tighter">
                  {s}
                </span>
              ))}
            </div>

            <div className="p-4 bg-black/40 rounded-xl border border-white/5">
              <div className="text-[9px] text-emerald-500/70 font-bold mono uppercase tracking-widest mb-2 flex items-center gap-2">
                 <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                 Expected_Outcome_Vector
              </div>
              <p className="text-sm text-slate-300 italic leading-relaxed opacity-80">
                {task.benefit}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 glass rounded-2xl border border-dashed border-white/10 text-center">
         <p className="text-[10px] text-slate-600 mono uppercase tracking-[0.5em]">Sector_Protocols_Terminal_EOF</p>
      </div>
    </div>
  );
};

export default ProtocolTerminal;
