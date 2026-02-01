
import React from 'react';
import { PulseTask } from '../types';

interface Props {
  tasks: PulseTask[];
}

const PulseTerminal: React.FC<Props> = ({ tasks }) => {
  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-6">
        <div>
          <h3 className="text-emerald-400 mono text-lg font-bold tracking-[0.3em] uppercase mb-1">Maintenance_Pulse</h3>
          <p className="text-[10px] text-slate-600 mono tracking-widest uppercase">Temporal Sync // Biological Rhythm</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-emerald-500/70 mono font-bold uppercase">Next Pulse: 04:00:00</p>
          <p className="text-[9px] text-slate-500 mono">Sync Source: Lunar/Weather Matrix</p>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 && (
          <div className="h-32 flex items-center justify-center border border-dashed border-white/10 rounded-2xl text-slate-700 mono text-[10px] uppercase tracking-widest">
            Awaiting Schedule Injection
          </div>
        )}
        {tasks.map((task) => (
          <div key={task.id} className="glass p-5 rounded-2xl border border-white/5 flex items-center gap-6 group hover:border-emerald-500/30 transition-all">
            <div className="w-16 h-16 rounded-xl bg-white/5 flex flex-col items-center justify-center border border-white/10 group-hover:bg-emerald-500/10 transition-colors">
              <span className="text-xs text-emerald-500 font-bold mono">{task.time}</span>
              <span className="text-[8px] text-slate-500 mono uppercase">EST</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[10px] mono text-slate-500 uppercase font-bold tracking-tighter">{task.sector}</span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full border ${
                  task.intensity === 'High' ? 'border-red-500/30 text-red-400 bg-red-400/5' : 
                  task.intensity === 'Medium' ? 'border-amber-500/30 text-amber-400 bg-amber-400/5' : 
                  'border-emerald-500/30 text-emerald-400 bg-emerald-400/5'
                } mono uppercase font-bold`}>{task.intensity}_PULSE</span>
              </div>
              <p className="text-sm text-slate-200 font-bold">{task.action}</p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-[10px] text-emerald-400 mono uppercase font-bold border border-emerald-400/20 px-3 py-1 rounded-lg hover:bg-emerald-400 hover:text-white transition-all">ACKNOWLEDGE</button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
        <h4 className="text-[10px] text-emerald-400 mono font-bold uppercase tracking-widest mb-3">Sync Strategy: Lunar Transition</h4>
        <p className="text-xs text-slate-400 leading-relaxed italic">
          "The current moon phase facilitates root sap-flow. Pruning Elderberry at this moment triggers a biological signal for rapid vegetative expansion and soil-mycelium symbiosis."
        </p>
      </div>
    </div>
  );
};

export default PulseTerminal;
