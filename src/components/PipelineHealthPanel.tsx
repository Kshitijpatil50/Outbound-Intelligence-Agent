import React, { useState } from 'react';
import { PipelineHealth, PipelineLog } from '../types';
import { ShieldAlert, CheckCircle2, AlertTriangle, Activity, ChevronDown, ChevronUp, Terminal, RefreshCw } from 'lucide-react';

interface PipelineHealthPanelProps {
  health: PipelineHealth;
  logs: PipelineLog[];
  isRunning: boolean;
  currentStage: number;
  stageProgressText: string;
}

export const PipelineHealthPanel: React.FC<PipelineHealthPanelProps> = ({
  health,
  logs,
  isRunning,
  currentStage,
  stageProgressText,
}) => {
  const [showLogDrawer, setShowLogDrawer] = useState(false);

  const getStageBadge = (stageNum: number, name: string, value: string | number, status: 'complete' | 'active' | 'pending' | 'warning') => {
    return (
      <div className={`p-3 rounded-xl border transition-all backdrop-blur-md ${
        status === 'active'
          ? 'bg-indigo-950/50 border-indigo-500/60 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/40'
          : status === 'complete'
          ? 'bg-white/5 border-white/10'
          : status === 'warning'
          ? 'bg-amber-950/30 border-amber-500/30'
          : 'bg-slate-900/30 border-white/5 opacity-60'
      }`}>
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
          <span>Stage {stageNum}</span>
          {status === 'active' && <RefreshCw className="w-3 h-3 text-indigo-400 animate-spin" />}
          {status === 'complete' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
          {status === 'warning' && <AlertTriangle className="w-3 h-3 text-amber-400" />}
        </div>
        <div className="text-xs font-medium text-slate-300 truncate">{name}</div>
        <div className="text-lg font-bold text-white mt-0.5">{value}</div>
      </div>
    );
  };

  return (
    <div id="pipeline-health-panel" className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl mb-6">
      
      {/* Top Health Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Pipeline Health & Stage Telemetry</h3>
            <p className="text-xs text-slate-400">
              Live account progression, contact verification signals, and stage error tracking
            </p>
          </div>
        </div>

        {/* Live Progress Indicator */}
        {isRunning && (
          <div className="flex items-center space-x-2 bg-indigo-950/80 border border-indigo-500/30 px-3 py-1.5 rounded-xl text-xs text-indigo-200 backdrop-blur-md">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            <span className="font-semibold">{stageProgressText || 'Processing pipeline stages...'}</span>
          </div>
        )}
      </div>

      {/* 4-Stage Progression Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
        {getStageBadge(
          1,
          'Accounts Identified',
          `${health.stage1AccountsIdentified} Accounts`,
          currentStage === 1 ? 'active' : health.stage1AccountsIdentified > 0 ? 'complete' : 'pending'
        )}

        {getStageBadge(
          2,
          'Contacts Found / Missing',
          `${health.stage2ContactsFound} Found (${health.stage2ContactsMissing} Missing)`,
          currentStage === 2 ? 'active' : health.stage2ContactsMissing > 0 ? 'warning' : health.stage2ContactsFound > 0 ? 'complete' : 'pending'
        )}

        {getStageBadge(
          3,
          'Research Briefs',
          `${health.stage3BriefsCompleted} Briefs`,
          currentStage === 3 ? 'active' : health.stage3BriefsCompleted > 0 ? 'complete' : 'pending'
        )}

        {getStageBadge(
          4,
          'Emails Generated / Skipped',
          `${health.stage4EmailsGenerated} Drafted (${health.stage4EmailsSkipped} Skipped)`,
          currentStage === 4 ? 'active' : health.stage4EmailsSkipped > 0 ? 'warning' : health.stage4EmailsGenerated > 0 ? 'complete' : 'pending'
        )}
      </div>

      {/* Stage Errors / Warning Log if any */}
      {health.stageErrors.length > 0 && (
        <div className="mt-3 p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl backdrop-blur-md">
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-300 mb-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Pipeline Grounding Warnings & Dropout Reasons ({health.stageErrors.length})</span>
          </div>
          <div className="space-y-1 text-xs text-slate-300 max-h-32 overflow-y-auto">
            {health.stageErrors.map((err, idx) => (
              <div key={idx} className="flex items-start space-x-2 bg-slate-950/60 p-2 rounded-lg border border-amber-500/20">
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-900/60 text-amber-200 rounded uppercase">
                  Stage {err.stage}
                </span>
                <span className="font-semibold text-white">{err.item}:</span>
                <span className="text-slate-300 flex-1">{err.error}</span>
                <span className="text-[10px] text-slate-500">{err.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collapsible Execution Console Log */}
      <div className="mt-3">
        <button
          onClick={() => setShowLogDrawer(!showLogDrawer)}
          className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 py-1 transition"
        >
          <div className="flex items-center space-x-1.5">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold">Pipeline Execution Telemetry Stream ({logs.length} events)</span>
          </div>
          {showLogDrawer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showLogDrawer && (
          <div className="mt-2 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-xl p-3 font-mono text-[11px] max-h-48 overflow-y-auto space-y-1">
            {logs.length === 0 ? (
              <div className="text-slate-500 italic">No execution logs yet. Click "Run Campaign" to trigger research pipeline.</div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-start space-x-2">
                  <span className="text-slate-600 select-none">{log.timestamp}</span>
                  <span className={`font-semibold uppercase text-[10px] px-1 rounded ${
                    log.type === 'error' ? 'bg-red-950 text-red-400' :
                    log.type === 'warning' ? 'bg-amber-950 text-amber-400' :
                    log.type === 'success' ? 'bg-emerald-950 text-emerald-400' :
                    'bg-slate-800 text-indigo-400'
                  }`}>
                    Stage {log.stage}
                  </span>
                  <span className={
                    log.type === 'error' ? 'text-red-300' :
                    log.type === 'warning' ? 'text-amber-300' :
                    log.type === 'success' ? 'text-emerald-300' :
                    'text-slate-300'
                  }>
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

    </div>
  );
};
