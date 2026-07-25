import React, { useState } from 'react';
import { Email, ResearchBrief, CampaignInput } from '../types';
import { Mail, Copy, Check, ChevronDown, ChevronUp, UserCheck, ShieldAlert, Tag, AlertTriangle, Edit3, Sparkles, Filter, CheckCircle2, TrendingUp, RefreshCw, Send } from 'lucide-react';
import { PersonalizationScoreBadge, ShowSearchProcessPanel } from './TrustVerificationBadge';
import { motion, AnimatePresence } from 'motion/react';

interface Stage4EmailsCardProps {
  emails: Email[];
  briefs: ResearchBrief[];
  campaignInput: CampaignInput;
  isRunning: boolean;
  onUpdateEmail?: (id: string, updatedFields: Partial<Email>) => void;
  onRegenerateEmail?: (email: Email, toneTweak: string) => Promise<void>;
}

export const Stage4EmailsCard: React.FC<Stage4EmailsCardProps> = ({
  emails,
  briefs,
  campaignInput,
  isRunning,
  onUpdateEmail,
  onRegenerateEmail,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'generated' | 'skipped'>('all');
  const [regenInputs, setRegenInputs] = useState<{ [id: string]: string }>({});
  const [regeneratingIds, setRegeneratingIds] = useState<{ [id: string]: boolean }>({});

  const generatedEmails = emails.filter((e) => e.status === 'generated');
  const skippedEmails = emails.filter((e) => e.status === 'skipped');
  const totalEmails = emails.length;
  const generatedPct = totalEmails > 0 ? Math.round((generatedEmails.length / totalEmails) * 100) : 0;
  const skippedPct = totalEmails > 0 ? 100 - generatedPct : 0;

  const displayedEmails = emails.filter((e) => {
    if (filter === 'generated') return e.status === 'generated';
    if (filter === 'skipped') return e.status === 'skipped';
    return true;
  });

  const handleCopy = (email: Email) => {
    const textToCopy = `Subject: ${email.subject}\n\n${email.body}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(email.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const PRESET_TONES = [
    '⚡ Shorter & direct',
    '🎯 Focus on ROI & metrics',
    '👔 Executive C-suite tone',
    '🔥 Casual & conversational',
    '❓ Add curiosity CTA',
  ];

  const handleRegenerateClick = async (email: Email, customTone?: string) => {
    if (!onRegenerateEmail) return;
    const tone = customTone || regenInputs[email.id] || 'Make it more direct, shorter and casual';
    setRegeneratingIds((prev) => ({ ...prev, [email.id]: true }));
    try {
      await onRegenerateEmail(email, tone);
      if (customTone) {
        setRegenInputs((prev) => ({ ...prev, [email.id]: customTone }));
      }
    } finally {
      setRegeneratingIds((prev) => ({ ...prev, [email.id]: false }));
    }
  };

  return (
    <section id="stage-4-section" className="stage-4-emails-card bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden mb-6 shadow-xl">
      
      {/* Stage Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-slate-900/60 backdrop-blur-md border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:bg-slate-900/80 transition"
      >
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
            4
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-white">Stage 4 — Personalized Outbound Outreach</h3>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full text-[10px] font-semibold backdrop-blur-md">
                {generatedEmails.length} Drafted
              </span>
              {skippedEmails.length > 0 && (
                <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full text-[10px] font-semibold backdrop-blur-md">
                  {skippedEmails.length} Skipped
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Role-tailored emails scored for personalization with 1-click tone regenerate & inline editing
            </p>
          </div>
        </div>

        {/* Header Progress Bar & Controls */}
        <div className="flex items-center space-x-3">
          {totalEmails > 0 && (
            <div className="flex items-center space-x-3 bg-slate-950/80 border border-white/10 px-3 py-1.5 rounded-xl text-xs backdrop-blur-md">
              <div className="w-28 sm:w-36 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-emerald-400">{generatedPct}% Ready</span>
                  {skippedEmails.length > 0 && (
                    <span className="text-amber-400">{skippedPct}% Skipped</span>
                  )}
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden flex border border-white/10 p-0.5">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50" 
                    style={{ width: `${generatedPct}%` }}
                    title={`${generatedEmails.length} Generated (${generatedPct}%)`}
                  />
                  {skippedEmails.length > 0 && (
                    <div 
                      className="bg-amber-500/90 h-full rounded-full transition-all duration-500 ml-0.5" 
                      style={{ width: `${skippedPct}%` }}
                      title={`${skippedEmails.length} Skipped (${skippedPct}%)`}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          <button className="text-slate-400 hover:text-white shrink-0">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
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
            {emails.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs italic">
                {isRunning ? 'Drafting role-targeted personalized emails for verified contacts...' : 'No emails drafted yet.'}
              </div>
            ) : (
              <div className="space-y-4">
              
              {/* Campaign Outreach Effectiveness Progress Bar */}
              {(() => {
                const totalCount = emails.length;
                const generatedCount = generatedEmails.length;
                const skippedCount = skippedEmails.length;
                const generatedPct = totalCount > 0 ? Math.round((generatedCount / totalCount) * 100) : 0;
                const skippedPct = totalCount > 0 ? 100 - generatedPct : 0;

                return (
                  <div className="bg-slate-900/80 border border-white/10 rounded-xl p-3 space-y-2 backdrop-blur-md shadow-lg">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 font-semibold text-slate-200">
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Campaign Outreach Rate:</span>
                        <span className="text-emerald-400 font-bold">{generatedPct}% Ready</span>
                      </div>
                      <div className="flex items-center space-x-3 text-[11px] font-semibold">
                        <span className="inline-flex items-center space-x-1 text-emerald-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>{generatedCount} Generated ({generatedPct}%)</span>
                        </span>
                        {skippedCount > 0 && (
                          <span className="inline-flex items-center space-x-1 text-amber-400">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            <span>{skippedCount} Skipped ({skippedPct}%)</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden flex border border-white/10 p-0.5">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50" 
                        style={{ width: `${generatedPct}%` }}
                        title={`${generatedCount} Generated (${generatedPct}%)`}
                      />
                      {skippedCount > 0 && (
                        <div 
                          className="bg-amber-500/90 h-full rounded-full transition-all duration-500 ml-0.5 shadow-sm shadow-amber-500/50" 
                          style={{ width: `${skippedPct}%` }}
                          title={`${skippedCount} Skipped (${skippedPct}%)`}
                        />
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Segmented Control Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/70 border border-white/10 rounded-xl p-2.5 backdrop-blur-md shadow-lg">
                <div className="flex items-center space-x-2 text-xs text-slate-300 pl-1 font-semibold">
                  <Filter className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Outreach Task View:</span>
                  <span className="text-[11px] font-normal text-slate-400 hidden sm:inline">
                    {filter === 'all' && `Showing all ${emails.length} accounts`}
                    {filter === 'generated' && `Showing ${generatedEmails.length} drafted outreach emails`}
                    {filter === 'skipped' && `Showing ${skippedEmails.length} skipped accounts`}
                  </span>
                </div>

                <div className="inline-flex p-1 bg-slate-950/90 border border-white/10 rounded-xl shadow-inner max-w-full overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setFilter('all')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                      filter === 'all'
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25 border border-indigo-400/30 ring-1 ring-indigo-400/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <Mail className={`w-3.5 h-3.5 ${filter === 'all' ? 'text-indigo-200' : 'text-slate-500'}`} />
                    <span>All Accounts</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      filter === 'all' ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'
                    }`}>
                      {emails.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilter('generated')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                      filter === 'generated'
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-500/25 border border-emerald-400/30 ring-1 ring-emerald-400/20'
                        : 'text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/5'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${filter === 'generated' ? 'text-emerald-200' : 'text-emerald-500/70'}`} />
                    <span>Generated</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      filter === 'generated' ? 'bg-white/20 text-white' : 'bg-emerald-500/15 text-emerald-400'
                    }`}>
                      {generatedEmails.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilter('skipped')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                      filter === 'skipped'
                        ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-md shadow-amber-500/25 border border-amber-400/30 ring-1 ring-amber-400/20'
                        : 'text-slate-400 hover:text-amber-300 hover:bg-amber-500/5'
                    }`}
                  >
                    <AlertTriangle className={`w-3.5 h-3.5 ${filter === 'skipped' ? 'text-amber-200' : 'text-amber-500/70'}`} />
                    <span>Skipped</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      filter === 'skipped' ? 'bg-white/20 text-white' : 'bg-amber-500/15 text-amber-400'
                    }`}>
                      {skippedEmails.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Displayed Emails List */}
              {displayedEmails.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs italic bg-slate-900/30 rounded-xl border border-white/5">
                  No {filter} emails match the selected filter.
                </div>
              ) : (
                displayedEmails.map((email, index) => {
                  const isSkipped = email.status === 'skipped';
                  const wordCount = getWordCount(email.body);
                  const isRegenerating = regeneratingIds[email.id] || false;

                if (isSkipped) {
                  return (
                    <motion.div 
                      key={email.id} 
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.08 }}
                      className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 opacity-80 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          <h4 className="text-xs font-bold text-amber-300">
                            Email Generation Skipped — {email.accountName}
                          </h4>
                        </div>
                        <span className="px-2 py-0.5 bg-amber-900/60 text-amber-200 border border-amber-500/30 rounded text-[10px] font-bold">
                          Stage 2 Guard Active
                        </span>
                      </div>
                      <p className="text-xs text-amber-200/90 leading-relaxed">
                        {email.skipReason || 'Stage 2 marked this company "no contact found". Email generation was safely skipped to prevent fabricated outreach.'}
                      </p>
                    </motion.div>
                  );
                }

                return (
                  <motion.div 
                    key={email.id} 
                    layout
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35, delay: index * 0.08, ease: 'easeOut' }}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition shadow-lg backdrop-blur-sm"
                  >
                    
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10 mb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <UserCheck className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm font-bold text-white">{email.contactName}</span>
                          <span className="text-xs text-slate-400">({email.contactTitle})</span>
                          {email.isEdited && (
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] font-semibold">
                              Edited
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-indigo-400 font-semibold mt-0.5">{email.accountName}</div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          <Edit3 className="w-3 h-3 text-indigo-400" />
                          <span>Editable Draft</span>
                        </span>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${
                          wordCount <= 150 
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                        }`}>
                          {wordCount} Words
                        </span>

                        <button
                          onClick={() => handleCopy(email)}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow-lg shadow-indigo-500/25 active:scale-95 cursor-pointer"
                        >
                          {copiedId === email.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-300" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Email</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Requirement 4: Personalization Score Badge */}
                    <div className="mb-3">
                      <PersonalizationScoreBadge personalization={email.personalization} />
                    </div>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap gap-2 mb-3 text-xs">
                      <div className="flex items-center space-x-1 px-2.5 py-1 bg-slate-950/60 border border-white/5 rounded-lg text-slate-300">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="font-semibold text-slate-400">Pain Point:</span>
                        <span className="text-slate-200">{email.painPointTargeted}</span>
                      </div>

                      <div className="flex items-center space-x-1 px-2.5 py-1 bg-slate-950/60 border border-white/5 rounded-lg text-slate-300">
                        <Tag className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span className="font-semibold text-slate-400">Proof Point:</span>
                        <span className="text-purple-300 font-medium">{email.proofPointUsed}</span>
                      </div>
                    </div>

                    {/* Requirement 6: Iterative Email Regeneration & Tone Tweak Bar */}
                    <div className="bg-slate-950/90 border border-indigo-500/30 rounded-xl p-3.5 mb-3 text-xs space-y-2.5 backdrop-blur-md shadow-inner">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-indigo-300 font-bold">
                          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Iterative Tone & Length Refinement</span>
                        </span>
                        
                        {email.lastToneTweak ? (
                          <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full text-[10px] font-semibold flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-indigo-400" />
                            <span>Last Refinement: "{email.lastToneTweak}"</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">Refine draft iteratively as many times as needed</span>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Make it shorter, focus on ROI, add curiosity hook..."
                          value={regenInputs[email.id] ?? ''}
                          onChange={(e) => setRegenInputs({ ...regenInputs, [email.id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !isRegenerating) {
                              e.preventDefault();
                              handleRegenerateClick(email);
                            }
                          }}
                          className="w-full bg-slate-900/90 border border-white/10 focus:border-indigo-400 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition"
                        />
                        <button
                          type="button"
                          disabled={isRegenerating}
                          onClick={() => handleRegenerateClick(email)}
                          className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition cursor-pointer shadow-md shadow-indigo-500/20 active:scale-95"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                          <span>{isRegenerating ? 'Re-drafting...' : 'Regenerate Email'}</span>
                        </button>
                      </div>

                      {/* Quick Preset Tone Tweak Chips */}
                      <div className="pt-1 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-slate-400 mr-1">Quick Presets:</span>
                        {PRESET_TONES.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            disabled={isRegenerating}
                            onClick={() => {
                              setRegenInputs((prev) => ({ ...prev, [email.id]: preset }));
                              handleRegenerateClick(email, preset);
                            }}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-indigo-950/80 text-slate-300 hover:text-indigo-200 border border-white/10 hover:border-indigo-500/40 rounded-lg text-[10px] font-medium transition cursor-pointer active:scale-95 disabled:opacity-50"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Editable Email Box */}
                    <div className="bg-slate-950/80 border border-white/10 rounded-xl p-3.5 font-sans space-y-3 text-xs text-slate-200 leading-relaxed backdrop-blur-md">
                      
                      {/* Subject Editable Field */}
                      <div className="pb-2 border-b border-white/10 flex items-center space-x-2">
                        <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="text-slate-400 text-xs font-medium shrink-0">Subject:</span>
                        <input
                          type="text"
                          value={email.subject}
                          onChange={(e) => onUpdateEmail?.(email.id, { subject: e.target.value, isEdited: true })}
                          className="w-full bg-slate-900/80 border border-white/10 focus:border-indigo-500 rounded-lg px-2.5 py-1 text-indigo-300 font-bold text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                          placeholder="Email subject line..."
                        />
                      </div>

                      {/* Body Editable Textarea */}
                      <div className="pt-1 flex flex-col space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="flex items-center space-x-1 text-slate-300 font-medium">
                            <Sparkles className="w-3 h-3 text-indigo-400" />
                            <span>Outbound Body Text (Edits sync live to JSON / Markdown exports):</span>
                          </span>
                        </div>
                        <textarea
                          rows={6}
                          value={email.body}
                          onChange={(e) => onUpdateEmail?.(email.id, { body: e.target.value, isEdited: true })}
                          className="w-full bg-slate-900/70 border border-white/10 focus:border-indigo-500/80 rounded-xl p-3 text-xs text-slate-100 leading-relaxed font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-y transition"
                          placeholder="Type or edit email body text..."
                        />
                      </div>

                    </div>

                    {/* Requirement 2: Show search process toggle panel */}
                    <ShowSearchProcessPanel logs={email.searchProcess} itemTitle={email.accountName} />

                  </motion.div>
                );
              }))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>

    </section>
  );
};
