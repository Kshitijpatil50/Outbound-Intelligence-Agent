import React, { useState, useMemo } from 'react';
import { Account } from '../types';
import { Building2, MapPin, Pickaxe, ChevronDown, ChevronUp, ArrowUpDown, SlidersHorizontal, Sparkles } from 'lucide-react';
import { ConfidenceBadge, ShowSearchProcessPanel, SourceCitationsList } from './TrustVerificationBadge';
import { motion, AnimatePresence } from 'motion/react';

interface Stage1AccountsCardProps {
  accounts: Account[];
  isRunning: boolean;
  referenceAccount?: string;
}

type SortOption = 'score-desc' | 'score-asc' | 'name-asc' | 'country-asc';

// Circular Progress Ring Component for ICP Fit Score
const CircularProgressRing: React.FC<{ score: number; referenceAccount: string }> = ({ score, referenceAccount }) => {
  const size = 48;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let ringColorClass = 'stroke-emerald-400 text-emerald-400';
  let badgeBgClass = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
  let glowClass = 'drop-shadow-[0_0_6px_rgba(52,211,153,0.35)]';
  let tierText = 'Tier 1 Prime Fit';

  if (normalizedScore < 80) {
    ringColorClass = 'stroke-amber-400 text-amber-400';
    badgeBgClass = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    glowClass = 'drop-shadow-[0_0_6px_rgba(251,191,36,0.35)]';
    tierText = 'Tier 3 Moderate';
  } else if (normalizedScore < 90) {
    ringColorClass = 'stroke-indigo-400 text-indigo-400';
    badgeBgClass = 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
    glowClass = 'drop-shadow-[0_0_6px_rgba(129,140,248,0.35)]';
    tierText = 'Tier 2 High Fit';
  }

  return (
    <div className="flex items-center space-x-2.5 bg-slate-950/80 px-3 py-2 rounded-xl border border-white/10 shadow-inner shrink-0">
      <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
        <svg className={`transform -rotate-90 ${glowClass}`} width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800/80"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className={`${ringColorClass} transition-all duration-700 ease-out`}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-mono font-black text-xs leading-none ${ringColorClass}`}>
            {normalizedScore}
          </span>
          <span className="text-[7px] text-slate-400 font-bold tracking-tighter mt-0.5">FIT</span>
        </div>
      </div>

      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold whitespace-nowrap">ICP Fit Score</span>
        </div>
        <div className="flex items-center space-x-1.5 mt-0.5">
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${badgeBgClass}`}>
            {tierText}
          </span>
        </div>
        <span className="text-[9px] text-slate-400 mt-0.5 whitespace-nowrap truncate">
          Ref: <strong className="text-slate-300">{referenceAccount}</strong>
        </span>
      </div>
    </div>
  );
};

export const Stage1AccountsCard: React.FC<Stage1AccountsCardProps> = ({ 
  accounts, 
  isRunning, 
  referenceAccount = 'SQM (Sociedad Química y Minera de Chile)' 
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('score-desc');

  // Sorted accounts list based on active sorting selection
  const sortedAccounts = useMemo(() => {
    const list = [...accounts];
    return list.sort((a, b) => {
      const scoreA = typeof a.icpScore === 'number' ? a.icpScore : 90;
      const scoreB = typeof b.icpScore === 'number' ? b.icpScore : 90;

      if (sortBy === 'score-desc') return scoreB - scoreA;
      if (sortBy === 'score-asc') return scoreA - scoreB;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'country-asc') return a.hqCountry.localeCompare(b.hqCountry);
      return 0;
    });
  }, [accounts, sortBy]);

  return (
    <section id="stage-1-section" className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden mb-6 shadow-xl">
      
      {/* Stage Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-slate-900/60 backdrop-blur-md border-b border-white/10 flex items-center justify-between cursor-pointer hover:bg-slate-900/80 transition"
      >
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-lg shadow-indigo-500/30">
            1
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white">Stage 1 — Account Identification (Grounded ICP Research)</h3>
              <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full text-[10px] font-semibold backdrop-blur-md">
                {accounts.length} Accounts Identified
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Target account candidates ranked by ICP fit score with verified grounded search backing
            </p>
          </div>
        </div>

        <button className="text-slate-400 hover:text-white">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Stage Content with Motion Animation */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="p-4 bg-slate-950/20 overflow-hidden"
          >
            {accounts.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs italic">
                {isRunning ? 'Grounded search is actively scanning company databases and public records...' : 'No target accounts identified yet. Click "Run Campaign" to trigger Stage 1.'}
              </div>
            ) : (
              <div>
                {/* Account List Sorting Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-slate-900/70 border border-white/10 rounded-xl">
                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-semibold text-slate-200">Account ICP Matrix:</span>
                    <span className="text-slate-400 text-[11px]">
                      Benchmarked against <strong className="text-indigo-300">{referenceAccount.split(' ')[0]}</strong> profile
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <label htmlFor="icp-sort-select" className="text-[11px] font-medium text-slate-400 flex items-center space-x-1">
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      <span>Sort Accounts:</span>
                    </label>
                    <select
                      id="icp-sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="bg-slate-950/90 border border-white/15 focus:border-indigo-400 rounded-lg px-2.5 py-1 text-xs text-slate-100 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-400 transition cursor-pointer"
                    >
                      <option value="score-desc">ICP Score: High to Low</option>
                      <option value="score-asc">ICP Score: Low to High</option>
                      <option value="name-asc">Company Name: A to Z</option>
                      <option value="country-asc">HQ Country: A to Z</option>
                    </select>
                  </div>
                </div>

                {/* Accounts Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedAccounts.map((acc, index) => {
                    const score = typeof acc.icpScore === 'number' ? acc.icpScore : 90;
                    return (
                      <motion.div 
                        key={acc.id}
                        layout
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.35, delay: index * 0.08, ease: 'easeOut' }}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between hover:border-white/20 transition shadow-lg backdrop-blur-sm"
                      >
                        <div>
                          {/* Company Name & Confidence Badge Header Bar */}
                          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5 mb-3">
                            <div className="flex items-center space-x-2 min-w-0">
                              <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-lg shrink-0">
                                <Building2 className="w-4 h-4 text-indigo-400" />
                              </div>
                              <h4 className="text-sm font-bold text-white tracking-tight truncate">{acc.name}</h4>
                            </div>
                            <div className="shrink-0">
                              <ConfidenceBadge confidence={acc.confidence} defaultCount={acc.sources.length} />
                            </div>
                          </div>

                          {/* ICP Fit Score Ring & Why This Account Box */}
                          <div className="flex flex-col sm:flex-row items-stretch gap-2.5 mb-3">
                            <CircularProgressRing score={score} referenceAccount={referenceAccount.split(' ')[0]} />

                            <div className="flex-1 bg-slate-950/60 p-2.5 rounded-xl border border-white/10 flex flex-col justify-center min-w-0">
                              <div className="flex items-center space-x-1.5 mb-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Why Selected</span>
                              </div>
                              <p className="text-[11px] text-slate-300 italic leading-snug">
                                {acc.reasoningTrace || `Chosen: ${acc.hqCountry} operation matching reference scale and hazard profile.`}
                              </p>
                            </div>
                          </div>

                          {/* Location & Commodities */}
                          <div className="flex flex-wrap items-center gap-2 mb-2.5">
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-white/5 border border-white/10 rounded-lg text-[11px] text-slate-300 font-medium">
                              <MapPin className="w-3 h-3 text-red-400" />
                              <span>{acc.hqCountry}</span>
                            </span>

                            <div className="flex items-center gap-1.5">
                              <Pickaxe className="w-3.5 h-3.5 text-amber-400" />
                              {acc.commodities.map((comm) => (
                                <span key={comm} className="px-2 py-0.5 bg-amber-950/40 border border-amber-500/30 text-amber-300 rounded text-[10px] font-semibold">
                                  {comm}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Scale Notes */}
                          <div className="text-xs text-slate-300 mb-2.5 bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                            <span className="font-semibold text-slate-400">Scale & Footprint: </span>
                            {acc.scaleNotes}
                          </div>

                          {/* ICP Fit Reasoning */}
                          <div className="text-xs text-slate-300 leading-relaxed mb-3">
                            <span className="font-semibold text-indigo-400 block mb-1">ICP Fit Breakdown:</span>
                            <p className="bg-slate-950/60 p-2.5 rounded-lg border border-white/5 text-slate-300">
                              {acc.icpReasoning}
                            </p>
                          </div>
                        </div>

                        {/* Show search process toggle panel */}
                        <ShowSearchProcessPanel logs={acc.searchProcess} itemTitle={acc.name} />

                        {/* Grounded Source Citations */}
                        <SourceCitationsList sources={acc.sources} />

                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

