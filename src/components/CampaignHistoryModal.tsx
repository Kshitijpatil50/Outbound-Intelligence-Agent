import React from 'react';
import { CampaignHistoryRecord } from '../types';
import { History, X, Clock, Target, Building2, Users, FileText, Mail, ArrowUpRight, Trash2, CheckCircle2, RotateCcw } from 'lucide-react';

interface CampaignHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyRecords: CampaignHistoryRecord[];
  onLoadRecord: (record: CampaignHistoryRecord) => void;
  onApplyConfig: (record: CampaignHistoryRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

export const CampaignHistoryModal: React.FC<CampaignHistoryModalProps> = ({
  isOpen,
  onClose,
  historyRecords,
  onLoadRecord,
  onApplyConfig,
  onDeleteRecord,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white">Campaign Execution History</h3>
                <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full">
                  {historyRecords.length} Saved {historyRecords.length === 1 ? 'Run' : 'Runs'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Review past pipeline execution runs, restore generated outputs, or re-use campaign brief configurations.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {historyRecords.length === 0 ? (
            <div className="py-12 text-center space-y-3 bg-slate-950/40 border border-white/5 rounded-2xl p-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400">
                <Clock className="w-6 h-6 text-slate-500" />
              </div>
              <h4 className="text-sm font-semibold text-slate-300">No Campaign History Yet</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Whenever you run the Outbound BDR Pipeline, completed campaign results and brief configs will automatically be saved here for instant re-use and audit tracking.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {historyRecords.map((record) => {
                const accountsCount = record.accounts.length;
                const contactsCount = record.contacts.filter((c) => c.status === 'found').length;
                const emailsCount = record.emails.filter((e) => e.status === 'generated').length;

                return (
                  <div
                    key={record.id}
                    className="bg-slate-950/70 hover:bg-slate-950/90 border border-white/10 hover:border-indigo-500/40 rounded-xl p-4 transition-all space-y-3 group"
                  >
                    {/* Top line: timestamp & target info */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="flex items-center space-x-1 text-slate-400 font-medium">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{record.timestamp}</span>
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-semibold truncate max-w-[200px]">
                          Target: {record.inputs.targetVertical}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            onApplyConfig(record);
                            onClose();
                          }}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-lg text-xs font-semibold transition flex items-center space-x-1 cursor-pointer"
                          title="Apply this brief configuration to current inputs"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                          <span>Use Brief Config</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onLoadRecord(record);
                            onClose();
                          }}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition flex items-center space-x-1 shadow-md shadow-indigo-500/20 cursor-pointer"
                          title="Restore full campaign outputs to workspace"
                        >
                          <span>Load Results</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteRecord(record.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                          title="Delete from history"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Middle line: Ref account & stats badges */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center space-x-1.5 text-slate-300 truncate">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-400">Ref Account:</span>
                        <span className="font-semibold text-white truncate">{record.inputs.referenceAccount}</span>
                      </div>

                      <div className="flex items-center space-x-2 justify-start md:justify-end">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-slate-300">
                          <Building2 className="w-3 h-3 text-indigo-400" />
                          <span>{accountsCount} Accounts</span>
                        </span>
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-slate-300">
                          <Users className="w-3 h-3 text-cyan-400" />
                          <span>{contactsCount} Contacts</span>
                        </span>
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-slate-300">
                          <Mail className="w-3 h-3 text-emerald-400" />
                          <span>{emailsCount} Emails</span>
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/80 flex items-center justify-between">
          {historyRecords.length > 0 ? (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History Log</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
