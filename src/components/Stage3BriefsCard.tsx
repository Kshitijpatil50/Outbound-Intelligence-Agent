import React, { useState } from 'react';
import { ResearchBrief } from '../types';
import { FileSearch, ExternalLink, Newspaper, ShieldAlert, Cpu, ChevronDown, ChevronUp, Edit2, Save, Check } from 'lucide-react';
import { ConfidenceBadge, ShowSearchProcessPanel, SourceCitationsList } from './TrustVerificationBadge';
import { motion, AnimatePresence } from 'motion/react';

interface Stage3BriefsCardProps {
  briefs: ResearchBrief[];
  isRunning: boolean;
  onUpdateBrief?: (briefId: string, newSummary: string) => void;
}

export const Stage3BriefsCard: React.FC<Stage3BriefsCardProps> = ({ briefs, isRunning, onUpdateBrief }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSummaryText, setEditSummaryText] = useState<string>('');

  const handleStartEdit = (b: ResearchBrief) => {
    setEditingId(b.id);
    setEditSummaryText(b.summary);
  };

  const handleSaveEdit = (bId: string) => {
    if (onUpdateBrief) {
      onUpdateBrief(bId, editSummaryText);
    }
    setEditingId(null);
  };

  return (
    <section id="stage-3-section" className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden mb-6 shadow-xl">
      
      {/* Stage Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-slate-900/60 backdrop-blur-md border-b border-white/10 flex items-center justify-between cursor-pointer hover:bg-slate-900/80 transition"
      >
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-lg shadow-purple-500/30">
            3
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white">Stage 3 — Account Research Briefs (Factual Synthesis)</h3>
              <span className="px-2.5 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full text-[10px] font-semibold backdrop-blur-md">
                {briefs.length} Briefs Synthesized
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Grounded intelligence briefs with confidence badges and inline editing capabilities
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
            {briefs.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs italic">
                {isRunning ? 'Synthesizing research briefs with grounded news and operational signals...' : 'No briefs created yet.'}
              </div>
            ) : (
              <div className="space-y-4">
                {briefs.map((b, index) => (
                  <motion.div 
                    key={b.id}
                    layout
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35, delay: index * 0.08, ease: 'easeOut' }}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition shadow-lg backdrop-blur-sm"
                  >
                  
                  {/* Account Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                    <div className="flex items-center space-x-2">
                      <FileSearch className="w-4 h-4 text-purple-400" />
                      <h4 className="text-sm font-bold text-white">{b.accountName}</h4>
                      {b.isEdited && (
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] font-semibold">
                          Edited by Rep
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Requirement 1: Confidence Badge */}
                      <ConfidenceBadge confidence={b.confidence} defaultCount={b.sources?.length || 2} />

                      <span className="text-[11px] font-semibold text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20 backdrop-blur-md">
                        Grounded Account Brief
                      </span>
                    </div>
                  </div>

                  {/* Summary Block with Inline Edit Option (Requirement 10) */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-purple-300">Brief Executive Summary</span>
                      {editingId === b.id ? (
                        <button
                          onClick={() => handleSaveEdit(b.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition shadow"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Brief</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(b)}
                          className="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded border border-white/10 text-[11px] font-medium flex items-center gap-1 cursor-pointer transition"
                        >
                          <Edit2 className="w-3 h-3 text-purple-400" />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>

                    {editingId === b.id ? (
                      <textarea
                        value={editSummaryText}
                        onChange={(e) => setEditSummaryText(e.target.value)}
                        rows={5}
                        className="w-full bg-slate-900 border border-purple-500/40 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans leading-relaxed"
                      />
                    ) : (
                      <div className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-white/5 whitespace-pre-line">
                        {b.summary}
                      </div>
                    )}
                  </div>

                  {/* 3 Detail Blocks */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 text-xs">
                    
                    {/* Recent News */}
                    <div className="p-2.5 bg-slate-950/60 rounded-lg border border-white/5">
                      <div className="font-semibold text-indigo-400 flex items-center space-x-1 mb-1">
                        <Newspaper className="w-3.5 h-3.5" />
                        <span>Recent News (12-18 Mos)</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{b.recentNews || 'News gathered from grounded sources.'}</p>
                    </div>

                    {/* Operational Footprint */}
                    <div className="p-2.5 bg-slate-950/60 rounded-lg border border-white/5">
                      <div className="font-semibold text-amber-400 flex items-center space-x-1 mb-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Operational Footprint</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{b.operationalFootprint || 'Hazardous 24/7 site operations.'}</p>
                    </div>

                    {/* Vendor Fit Signals */}
                    <div className="p-2.5 bg-slate-950/60 rounded-lg border border-white/5">
                      <div className="font-semibold text-emerald-400 flex items-center space-x-1 mb-1">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>Vendor Fit Signals</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{b.vendorFitSignals || 'Drone automation potential.'}</p>
                    </div>

                  </div>

                  {/* Requirement 2: Show search process toggle panel */}
                  <ShowSearchProcessPanel logs={b.searchProcess} itemTitle={b.accountName} />

                  {/* Citations Footer */}
                  <SourceCitationsList sources={b.sources} />

                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>

    </section>
  );
};
