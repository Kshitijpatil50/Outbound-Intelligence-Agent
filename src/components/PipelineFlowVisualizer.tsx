import React from 'react';
import { CampaignState } from '../types';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  state: CampaignState;
}

export const PipelineFlowVisualizer: React.FC<Props> = ({ state }) => {
  const { currentStage, isRunning, accounts, contacts, briefs, emails } = state;

  const foundContactsCount = contacts.filter((c) => c.status === 'found').length;
  const completedBriefsCount = briefs.filter((b) => b.status === 'success').length;
  const generatedEmailsCount = emails.filter((e) => e.status === 'generated').length;

  const stages = [
    {
      stageNum: 1,
      title: '1. Account Identification',
      shortTitle: 'Accounts',
      countText: accounts.length > 0 ? `${accounts.length} found` : 'Waiting',
      isDone: currentStage > 1 || (!isRunning && accounts.length > 0),
      isCurrent: isRunning && currentStage === 1,
    },
    {
      stageNum: 2,
      title: '2. Contact Discovery',
      shortTitle: 'Contacts',
      countText: accounts.length > 0 ? `${foundContactsCount}/${accounts.length} found` : 'Waiting',
      isDone: currentStage > 2 || (!isRunning && contacts.length > 0),
      isCurrent: isRunning && currentStage === 2,
    },
    {
      stageNum: 3,
      title: '3. Grounded Research',
      shortTitle: 'Research Briefs',
      countText: accounts.length > 0 ? `${completedBriefsCount}/${accounts.length} briefs` : 'Waiting',
      isDone: currentStage > 3 || (!isRunning && briefs.length > 0),
      isCurrent: isRunning && currentStage === 3,
    },
    {
      stageNum: 4,
      title: '4. Custom Outreach',
      shortTitle: 'Emails',
      countText: contacts.length > 0 ? `${generatedEmailsCount}/${contacts.length} emails` : 'Waiting',
      isDone: currentStage >= 4 && !isRunning && emails.length > 0,
      isCurrent: isRunning && currentStage === 4,
    },
  ];

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-5 shadow-2xl mb-6 ring-1 ring-white/5">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
          <span>Live Outbound Pipeline Architecture</span>
        </h3>
        {isRunning && (
          <motion.span 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs font-mono text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse"
          >
            <Loader2 className="w-3 h-3 animate-spin text-sky-400" />
            <span>{state.stageProgressText || 'Pipeline executing...'}</span>
          </motion.span>
        )}
      </div>

      {/* Grid / Flow diagram with Motion transitions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
        {stages.map((stg, idx) => (
          <motion.div
            key={stg.stageNum}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: stg.isCurrent || stg.isDone ? 1 : 0.65, 
              y: 0,
              scale: stg.isCurrent ? 1.02 : 1 
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`relative p-3.5 rounded-xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
              stg.isCurrent
                ? 'bg-sky-950/70 border-sky-500/60 shadow-lg shadow-sky-500/20 ring-1 ring-sky-400/40'
                : stg.isDone
                ? 'bg-slate-800/60 border-emerald-500/30'
                : 'bg-slate-950/40 border-white/5'
            }`}
          >
            {/* Active Stage Animated Progress Bar Line */}
            {stg.isCurrent && (
              <motion.div
                className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-400"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              />
            )}

            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                {stg.isDone ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  </motion.div>
                ) : stg.isCurrent ? (
                  <Loader2 className="w-4 h-4 text-sky-400 animate-spin flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                )}
                <span className="truncate">{stg.shortTitle}</span>
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-colors duration-300 ${
                  stg.isDone
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : stg.isCurrent
                    ? 'bg-sky-500/20 text-sky-200 border-sky-400/40 animate-pulse'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
              >
                {stg.countText}
              </span>
            </div>

            <div className="text-xs font-semibold text-slate-100 truncate">{stg.title}</div>

            {/* Connecting Arrow indicator for desktop */}
            {idx < 3 && (
              <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                <motion.span
                  animate={{ x: stg.isCurrent ? [0, 2, 0] : 0 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className={stg.isCurrent ? 'text-sky-400 font-bold' : 'text-slate-600'}
                >
                  →
                </motion.span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
