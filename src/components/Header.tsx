import React from 'react';
import { Bot, Search, Play, Download, RefreshCw, FileText, CheckCircle2, AlertCircle, History, FileSpreadsheet, Bell, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  isRunning: boolean;
  hasApiKey: boolean;
  onRunCampaign: () => void;
  onExportMarkdown: () => void;
  onExportJson: () => void;
  onExportCsv: () => void;
  onResetDefaults: () => void;
  onOpenHistory?: () => void;
  historyCount?: number;
  onOpenNotifications?: () => void;
  unreadNotificationCount?: number;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  hasData: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isRunning,
  hasApiKey,
  onRunCampaign,
  onExportMarkdown,
  onExportJson,
  onExportCsv,
  onResetDefaults,
  onOpenHistory,
  historyCount = 0,
  onOpenNotifications,
  unreadNotificationCount = 0,
  theme = 'dark',
  onToggleTheme,
  hasData,
}) => {
  return (
    <header id="app-header" className="bg-slate-900/60 backdrop-blur-2xl border-b border-white/10 text-white sticky top-0 z-30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand & Subtitle */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/25">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white">Outbound Intelligence Agent</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full backdrop-blur-md">
                FlytBase BDR Pipeline
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated ICP research, contact discovery & personalized outreach powered by Gemini & Grounded Google Search
            </p>
          </div>
        </div>

        {/* Action Controls & Indicators */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Grounding Indicator */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/5 border border-white/10 backdrop-blur-md rounded-lg text-xs text-slate-300">
            <Search className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-200">Google Search Grounding:</span>
            <span className="text-emerald-400 font-semibold">Active</span>
          </div>

          {/* Dark / Light Theme Switcher Button */}
          {onToggleTheme && (
            <button
              id="theme-toggle-btn"
              onClick={onToggleTheme}
              className="p-2 bg-slate-900/80 hover:bg-slate-800/90 border border-white/15 text-amber-300 hover:text-amber-200 rounded-lg transition shadow-sm backdrop-blur-md active:scale-95 cursor-pointer flex items-center justify-center group"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>
          )}

          {/* Notifications Button */}
          {onOpenNotifications && (
            <button
              id="notifications-btn"
              onClick={onOpenNotifications}
              className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800/90 border border-indigo-500/30 text-indigo-200 hover:text-white rounded-lg transition text-xs font-medium flex items-center space-x-1.5 shadow-sm backdrop-blur-md active:scale-95 cursor-pointer relative"
              title="View pipeline notifications and alerts"
            >
              <div className="relative">
                <Bell className="w-3.5 h-3.5 text-indigo-400" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                )}
              </div>
              <span className="hidden sm:inline">Notifications</span>
              {unreadNotificationCount > 0 && (
                <span className="px-1.5 py-0.2 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-[10px] font-bold">
                  {unreadNotificationCount}
                </span>
              )}
            </button>
          )}

          {/* Campaign History Button */}
          {onOpenHistory && (
            <button
              id="campaign-history-btn"
              onClick={onOpenHistory}
              className="px-3 py-1.5 bg-indigo-950/50 hover:bg-indigo-900/80 border border-indigo-500/30 text-indigo-200 hover:text-white rounded-lg transition text-xs font-medium flex items-center space-x-1.5 shadow-sm backdrop-blur-md active:scale-95 cursor-pointer"
              title="View past campaign execution history"
            >
              <History className="w-3.5 h-3.5 text-indigo-400" />
              <span>History</span>
              {historyCount > 0 && (
                <span className="px-1.5 py-0.2 bg-indigo-500/30 text-indigo-200 rounded-full text-[10px] font-bold">
                  {historyCount}
                </span>
              )}
            </button>
          )}

          {/* API Key Status */}
          <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs border backdrop-blur-md ${
            hasApiKey 
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' 
              : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
          }`}>
            {hasApiKey ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            <span className="font-medium">{hasApiKey ? 'Gemini API Connected' : 'Checking API Key'}</span>
          </div>

          {/* Reset Defaults */}
          <button
            id="reset-defaults-btn"
            onClick={onResetDefaults}
            disabled={isRunning}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition text-xs flex items-center space-x-1 border border-transparent hover:border-white/10 disabled:opacity-50 cursor-pointer"
            title="Reset brief inputs to FlytBase defaults"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Brief</span>
          </button>

          {/* Export Buttons */}
          {hasData && (
            <>
              <button
                id="export-csv-btn"
                onClick={onExportCsv}
                disabled={isRunning}
                className="px-3 py-2 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 hover:text-white rounded-lg transition text-xs font-semibold flex items-center space-x-1.5 shadow-sm backdrop-blur-md active:scale-95 cursor-pointer disabled:opacity-50"
                title="Export campaign leads and emails as CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>

              <button
                id="export-markdown-btn"
                onClick={onExportMarkdown}
                disabled={isRunning}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white rounded-lg transition text-xs font-medium flex items-center space-x-1.5 shadow-sm backdrop-blur-md disabled:opacity-50 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline">Export Markdown</span>
                <span className="md:hidden">MD</span>
              </button>

              <button
                id="export-json-btn"
                onClick={onExportJson}
                disabled={isRunning}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white rounded-lg transition text-xs font-medium flex items-center space-x-1.5 shadow-sm backdrop-blur-md disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">Export JSON</span>
                <span className="md:hidden">JSON</span>
              </button>
            </>
          )}

          {/* Run Campaign Button */}
          <button
            id="run-campaign-btn"
            onClick={onRunCampaign}
            disabled={isRunning}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg transition-all cursor-pointer ${
              isRunning
                ? 'bg-indigo-800/80 text-indigo-200 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 active:scale-[0.98]'
            }`}
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Pipeline Running...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Campaign</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};

