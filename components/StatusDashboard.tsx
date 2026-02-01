
import React from 'react';

const StatusDashboard: React.FC = () => {
  const stats = [
    { label: 'Timeline Health', value: '94.2%', color: 'text-emerald-400' },
    { label: 'Biological Sync', value: 'Active', color: 'text-blue-400' },
    { label: 'Ethical Guardrails', value: 'Locked', color: 'text-amber-400' },
    { label: 'Council Connection', value: 'Secure', color: 'text-purple-400' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => (
        <div key={i} className="glass p-3 rounded-xl border border-white/5">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">{stat.label}</p>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full bg-current animate-pulse ${stat.color}`}></div>
            <p className={`text-sm font-mono font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusDashboard;
