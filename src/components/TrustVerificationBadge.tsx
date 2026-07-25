import React, { useState } from 'react';
import { FactConfidence, SearchProcessLog, EmailPersonalizationScore } from '../types';
import { ShieldCheck, AlertCircle, Search, ChevronDown, ChevronUp, CheckCircle2, XCircle, Sparkles, Newspaper, Megaphone, Share2, Globe, ExternalLink, Bookmark, Flame } from 'lucide-react';

// Requirement 1: Confidence / Verification Badge
export const ConfidenceBadge: React.FC<{ confidence?: FactConfidence; defaultCount?: number }> = ({
  confidence,
  defaultCount = 2,
}) => {
  const count = confidence?.sourceCount || defaultCount;
  const isVerified = count >= 2;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
        isVerified
          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
      }`}
      title={isVerified ? `Grounded across ${count} independent sources` : 'Single source backing'}
    >
      {isVerified ? (
        <>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verified · {count} sources</span>
        </>
      ) : (
        <>
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Single source</span>
        </>
      )}
    </span>
  );
};

// Requirement 2: Show Search Process Toggle Panel
export const ShowSearchProcessPanel: React.FC<{ logs?: SearchProcessLog[]; itemTitle?: string }> = ({
  logs,
  itemTitle = 'Item',
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!logs || logs.length === 0) return null;

  return (
    <div className="mt-3 border-t border-white/10 pt-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-xs font-medium text-slate-400 hover:text-sky-300 transition-colors py-1 px-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
      >
        <span className="flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-sky-400" />
          <span>Show search process</span>
        </span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {expanded && (
        <div className="mt-2 p-3 bg-slate-950/80 border border-sky-500/20 rounded-xl space-y-2 text-xs font-mono text-slate-300 animate-fadeIn">
          <div className="text-[10px] text-sky-400 uppercase tracking-wider font-semibold">
            Grounded Search Queries & Raw Process
          </div>
          {logs.map((log, i) => (
            <div key={i} className="bg-slate-900 p-2.5 rounded-lg border border-white/5 space-y-1">
              <div className="text-sky-300 font-semibold flex items-center gap-1.5">
                <span className="text-slate-500">Query:</span> "{log.query}"
              </div>
              {log.snippetSummary && (
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  <span className="text-slate-500 font-semibold">Summary:</span> {log.snippetSummary}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Requirement 5: Send-Ready Checklist Per Contact
export const SendReadyChecklistRow: React.FC<{
  contactFound: boolean;
  researchComplete: boolean;
  emailPersonalized: boolean;
}> = ({ contactFound, researchComplete, emailPersonalized }) => {
  const isSendReady = contactFound && researchComplete && emailPersonalized;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-900/90 border border-white/10 rounded-xl text-xs mb-3">
      <span className="font-semibold text-slate-300 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
        <span>Send-Ready Status:</span>
        <span
          className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
            isSendReady
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
          }`}
        >
          {isSendReady ? '✅ READY FOR OUTREACH' : '⚠️ REVIEW REQUIRED'}
        </span>
      </span>

      <div className="flex items-center space-x-3 text-[11px] font-mono">
        <span className="flex items-center gap-1">
          {contactFound ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
          )}
          <span className={contactFound ? 'text-slate-200' : 'text-slate-500'}>Contact</span>
        </span>

        <span className="text-slate-600">→</span>

        <span className="flex items-center gap-1">
          {researchComplete ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
          )}
          <span className={researchComplete ? 'text-slate-200' : 'text-slate-500'}>Research</span>
        </span>

        <span className="text-slate-600">→</span>

        <span className="flex items-center gap-1">
          {emailPersonalized ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <XCircle className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span className={emailPersonalized ? 'text-slate-200' : 'text-slate-500'}>Personalized</span>
        </span>
      </div>
    </div>
  );
};

// Requirement 4: Email Quality / Personalization Score Badge
export const PersonalizationScoreBadge: React.FC<{ personalization?: EmailPersonalizationScore }> = ({
  personalization,
}) => {
  if (!personalization) return null;

  const { isPersonalized, score, reason } = personalization;

  return (
    <div
      className={`p-2.5 rounded-xl border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
        isPersonalized
          ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
          : 'bg-amber-950/40 border-amber-500/30 text-amber-200'
      }`}
    >
      <div className="flex items-center space-x-2">
        <span
          className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border ${
            isPersonalized
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          }`}
        >
          {isPersonalized ? `✅ Personalized (${score}%)` : `⚠️ Flagged for review (${score}%)`}
        </span>
        <span className="text-[11px] text-slate-300">{reason}</span>
      </div>
    </div>
  );
};

// Component to render multi-source intelligence citations (Magazines, Press, Social Buzz, News)
export const SourceCitationsList: React.FC<{ sources?: Array<{ title: string; url: string; snippet?: string; category?: string }> }> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  const getSourceIconAndBadge = (title: string, category?: string) => {
    const t = `${title} ${category || ''}`.toLowerCase();
    if (t.includes('forbes') || t.includes('magazine') || t.includes('wsj') || t.includes('bloomberg') || t.includes('fortune') || t.includes('hbr')) {
      return {
        label: 'Business Magazine',
        badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
        icon: Newspaper,
      };
    }
    if (t.includes('press') || t.includes('wire') || t.includes('dispatch')) {
      return {
        label: 'Press Wire',
        badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
        icon: Megaphone,
      };
    }
    if (t.includes('social') || t.includes('pulse') || t.includes('viral') || t.includes('linkedin') || t.includes('twitter')) {
      return {
        label: 'Internet & Social Buzz',
        badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        icon: Flame,
      };
    }
    return {
      label: 'Trade News',
      badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      icon: Globe,
    };
  };

  return (
    <div className="mt-2.5 pt-2.5 border-t border-slate-800/80">
      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
        <Bookmark className="w-3 h-3 text-cyan-400" />
        <span>Multi-Channel Sourcing & Web Grounding Citations</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {sources.map((src, idx) => {
          const style = getSourceIconAndBadge(src.title, src.category);
          const IconComp = style.icon;
          return (
            <a
              key={idx}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all hover:scale-[1.02] ${style.badgeBg}`}
              title={src.snippet || src.title}
            >
              <IconComp className="w-3 h-3 opacity-90" />
              <span className="truncate max-w-[200px]">{src.title}</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          );
        })}
      </div>
    </div>
  );
};
