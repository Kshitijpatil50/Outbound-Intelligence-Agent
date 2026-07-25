import React from 'react';
import { CampaignState } from '../types';
import { Building2, UserCheck, FileText, MailCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Props {
  state: CampaignState;
}

export const CampaignStatBar: React.FC<Props> = ({ state }) => {
  const { accounts, contacts, briefs, emails } = state;

  const foundContactsCount = contacts.filter((c) => c.status === 'found').length;
  const completedBriefsCount = briefs.filter((b) => b.status === 'success').length;
  const generatedEmailsCount = emails.filter((e) => e.status === 'generated').length;
  const sendReadyEmailsCount = emails.filter(
    (e) => e.status === 'generated' && (e.personalization?.isPersonalized || e.personalization?.score! >= 70)
  ).length;

  if (accounts.length === 0) return null;

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-4 shadow-xl mb-6 backdrop-blur-xl ring-1 ring-indigo-500/10">
      <div className="text-[11px] font-semibold tracking-wider text-indigo-300 uppercase mb-2.5 flex items-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
        <span>Live Campaign Summary Metrics</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Metric 1 */}
        <div className="flex items-center space-x-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-white/10 shadow-sm">
          <Building2 className="w-4 h-4 text-sky-400" />
          <span className="font-bold text-white">{accounts.length}</span>
          <span className="text-slate-400">accounts identified</span>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />

        {/* Metric 2 */}
        <div className="flex items-center space-x-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-white/10 shadow-sm">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-white">{foundContactsCount}</span>
          <span className="text-slate-400">contacts identified</span>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />

        {/* Metric 3 */}
        <div className="flex items-center space-x-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-white/10 shadow-sm">
          <FileText className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-white">{completedBriefsCount}</span>
          <span className="text-slate-400">research briefs</span>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />

        {/* Metric 4 */}
        <div className="flex items-center space-x-2 bg-emerald-950/50 px-3.5 py-2 rounded-xl border border-emerald-500/30 text-emerald-300 shadow-sm">
          <MailCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-white">{sendReadyEmailsCount}</span>
          <span className="text-emerald-300 font-medium">emails send-ready</span>
        </div>
      </div>
    </div>
  );
};
