import React, { useState } from 'react';
import { Contact } from '../types';
import { UserCheck, UserX, Linkedin, Mail, ExternalLink, ChevronDown, ChevronUp, AlertCircle, Copy, Check } from 'lucide-react';
import { ConfidenceBadge, ShowSearchProcessPanel, SendReadyChecklistRow, SourceCitationsList } from './TrustVerificationBadge';
import { motion, AnimatePresence } from 'motion/react';

interface Stage2ContactsCardProps {
  contacts: Contact[];
  isRunning: boolean;
}

export const Stage2ContactsCard: React.FC<Stage2ContactsCardProps> = ({ contacts, isRunning }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);

  const foundContacts = contacts.filter((c) => c.status === 'found' && c.name);
  const missingContacts = contacts.filter((c) => c.status === 'no_contact_found' || !c.name);

  const handleCopyEmail = (contactId: string, emailStr: string) => {
    navigator.clipboard.writeText(emailStr);
    setCopiedEmailId(contactId);
    setTimeout(() => setCopiedEmailId(null), 2000);
  };

  return (
    <section id="stage-2-section" className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden mb-6 shadow-xl">
      
      {/* Stage Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-slate-900/60 backdrop-blur-md border-b border-white/10 flex items-center justify-between cursor-pointer hover:bg-slate-900/80 transition"
      >
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-lg shadow-indigo-500/30">
            2
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white">Stage 2 — Contact Discovery (Verified Key Executives)</h3>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full text-[10px] font-semibold backdrop-blur-md">
                {foundContacts.length} Verified
              </span>
              {missingContacts.length > 0 && (
                <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full text-[10px] font-semibold backdrop-blur-md">
                  {missingContacts.length} No Contact Found
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Operations, HSE, and Site Directors verified from public records (Strict Rule: Zero fabricated personas)
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
            {contacts.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs italic">
                {isRunning ? 'Searching LinkedIn and leadership pages for real executive names...' : 'No contacts processed yet.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contacts.map((c, index) => {
                  const isFound = c.status === 'found' && c.name;

                  return (
                    <motion.div
                      key={c.id}
                      layout
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.35, delay: index * 0.08, ease: 'easeOut' }}
                      className={`border rounded-xl p-4 flex flex-col justify-between transition shadow-lg backdrop-blur-sm ${
                        isFound
                          ? 'bg-white/5 border-white/10 hover:border-white/20'
                          : 'bg-amber-950/20 border-amber-500/30 opacity-80'
                      }`}
                    >
                    <div>
                      {/* Requirement 5: Send-Ready Checklist Per Contact */}
                      <SendReadyChecklistRow
                        contactFound={Boolean(isFound)}
                        researchComplete={true}
                        emailPersonalized={Boolean(isFound)}
                      />

                      {/* Account Badge & Verification Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                          {c.accountName}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          {isFound ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full text-[10px] font-semibold">
                              <UserCheck className="w-3 h-3" />
                              <span>Verified Person</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full text-[10px] font-semibold">
                              <UserX className="w-3 h-3" />
                              <span>No Contact Found</span>
                            </span>
                          )}

                          {/* Requirement 1: Confidence Badge */}
                          <ConfidenceBadge confidence={c.confidence} defaultCount={c.sources?.length || 1} />
                        </div>
                      </div>

                      {/* Contact Info or Missing Explanation */}
                      {isFound ? (
                        <div className="space-y-1.5 mb-3">
                          <h4 className="text-base font-bold text-white">{c.name}</h4>
                          <p className="text-xs font-semibold text-indigo-400">{c.title}</p>
                          
                          {/* Requirement 8: Reasoning Trace Panel (Why this contact) */}
                          <div className="text-[11px] italic text-slate-400 pt-0.5">
                            <span className="text-amber-400 font-semibold not-italic">Why this contact: </span>
                            {c.reasoningTrace || `VP / Executive Title is the closest decision-maker match for safety automation.`}
                          </div>

                          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                            {c.linkedin ? (
                              <a
                                href={c.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-[11px] transition shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer"
                                title="Open verified LinkedIn / Social Media profile in a new tab"
                              >
                                <Linkedin className="w-3.5 h-3.5" />
                                <span>LinkedIn Profile</span>
                                <ExternalLink className="w-3 h-3 text-indigo-200" />
                              </a>
                            ) : (
                              <a
                                href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent((c.name || '') + ' ' + (c.accountName || ''))}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-500/30 rounded-lg font-semibold text-[11px] transition shadow-md cursor-pointer"
                                title="Search LinkedIn for this contact"
                              >
                                <Linkedin className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Find on LinkedIn</span>
                                <ExternalLink className="w-3 h-3 text-indigo-300" />
                              </a>
                            )}

                            {/* Verified Email ID Right Beside LinkedIn Profile */}
                            {c.email ? (
                              <div className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-emerald-950/80 text-emerald-200 rounded-lg border border-emerald-500/40 text-[11px] font-medium shadow-md">
                                <a
                                  href={`mailto:${c.email}`}
                                  className="inline-flex items-center space-x-1.5 hover:text-white transition cursor-pointer"
                                  title="Click to compose email"
                                >
                                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  <span className="font-mono">{c.email}</span>
                                </a>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyEmail(c.id, c.email!);
                                  }}
                                  className="ml-1 p-1 hover:bg-emerald-800/60 rounded text-emerald-300 hover:text-white transition cursor-pointer"
                                  title="Copy Email ID to clipboard"
                                >
                                  {copiedEmailId === c.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5 opacity-80" />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-800/80 text-slate-400 rounded-lg border border-slate-700/50 text-[11px]">
                                <Mail className="w-3.5 h-3.5 text-slate-500" />
                                <span className="font-mono italic">Email unavailable</span>
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="my-2 p-3 bg-amber-950/40 border border-amber-500/30 rounded-lg text-xs text-amber-200 space-y-1">
                          <div className="font-bold flex items-center space-x-1 text-amber-300">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>Explicit Non-Fabrication Rule Applied</span>
                          </div>
                          <p className="text-[11px] text-amber-200/90 leading-relaxed">
                            {c.failureReason || 'Public search did not reveal a verified named executive for this site/role. Persona creation skipped.'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Requirement 2: Show search process toggle panel */}
                    <ShowSearchProcessPanel logs={c.searchProcess} itemTitle={c.accountName} />

                    {/* Source citation */}
                    <SourceCitationsList sources={c.sources} />

                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>

    </section>
  );
};
