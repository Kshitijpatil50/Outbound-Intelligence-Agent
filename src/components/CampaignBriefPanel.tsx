import React, { useState } from 'react';
import { CampaignInput } from '../types';
import { Sliders, Target, Building2, ShieldCheck, Tag, Plus, X, RotateCcw, ChevronLeft, ChevronRight, Pickaxe, Zap, Factory, History } from 'lucide-react';
import { DEFAULT_CAMPAIGN_INPUT } from '../data/defaults';

interface CampaignBriefPanelProps {
  input: CampaignInput;
  onChange: (input: CampaignInput) => void;
  isRunning: boolean;
  onOpenHistory?: () => void;
}

export const CampaignBriefPanel: React.FC<CampaignBriefPanelProps> = ({
  input,
  onChange,
  isRunning,
  onOpenHistory,
}) => {

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [newProofPoint, setNewProofPoint] = useState('');

  const handleChange = (field: keyof CampaignInput, value: any) => {
    onChange({ ...input, [field]: value });
  };

  const handleAddProofPoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProofPoint.trim() && !input.vendorProofPoints.includes(newProofPoint.trim())) {
      onChange({
        ...input,
        vendorProofPoints: [...input.vendorProofPoints, newProofPoint.trim()],
      });
      setNewProofPoint('');
    }
  };

  const handleRemoveProofPoint = (tagToRemove: string) => {
    onChange({
      ...input,
      vendorProofPoints: input.vendorProofPoints.filter((tag) => tag !== tagToRemove),
    });
  };

  const handlePresetSelect = (preset: 'mining' | 'energy' | 'heavy_industry') => {
    if (preset === 'mining') {
      onChange(DEFAULT_CAMPAIGN_INPUT);
    } else if (preset === 'energy') {
      onChange({
        targetVertical: 'Major utility and renewable energy power line & transmission operators in North America',
        referenceAccount: 'Pacific Gas & Electric (PG&E)',
        goal: 'Book discovery calls with Head of Asset Integrity, Grid Reliability Director, or VP Safety',
        vendorName: 'FlytBase',
        vendorAngle: 'Autonomous BVLOS drone inspection for remote power transmission corridors replacing manual helicopter patrols',
        vendorProofPoints: ['Statnett', 'Shell', 'Airbus', 'CSX'],
        accountCount: 6,
      });
    } else if (preset === 'heavy_industry') {
      onChange({
        targetVertical: 'Petrochemical refineries and offshore oil & gas production platforms in Gulf Coast / LatAm',
        referenceAccount: 'Petrobras',
        goal: 'Book discovery calls with Plant Integrity Manager, VP HSE, or Maintenance Operations Director',
        vendorName: 'FlytBase',
        vendorAngle: 'Dock-in-a-box automated drone flare stack and tank farm surveillance in high-hazard refinery environments',
        vendorProofPoints: ['Shell', 'Anglo American', 'Airbus', 'UK Police'],
        accountCount: 6,
      });
    }
  };

  // Helper to check active preset based on current input values
  const getActivePreset = (): 'mining' | 'energy' | 'heavy_industry' | 'custom' => {
    if (input.referenceAccount.includes('SQM') || input.targetVertical.toLowerCase().includes('lithium')) {
      return 'mining';
    }
    if (input.referenceAccount.includes('Pacific Gas') || input.referenceAccount.includes('PG&E') || input.targetVertical.toLowerCase().includes('power line')) {
      return 'energy';
    }
    if (input.referenceAccount.includes('Petrobras') || input.targetVertical.toLowerCase().includes('petrochemical') || input.targetVertical.toLowerCase().includes('refinery')) {
      return 'heavy_industry';
    }
    return 'custom';
  };

  const activePreset = getActivePreset();

  if (isCollapsed) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-2xl border-r border-slate-800/80 p-2 flex flex-col items-center">
        <button
          id="expand-brief-panel-btn"
          onClick={() => setIsCollapsed(false)}
          className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition border border-white/10"
          title="Expand Campaign Brief Panel"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="mt-6 rotate-90 whitespace-nowrap text-xs font-semibold text-slate-400 tracking-wider">
          CAMPAIGN BRIEF
        </div>
      </div>
    );
  }

  return (
    <aside id="campaign-brief-panel" className="w-full lg:w-96 bg-slate-900/60 backdrop-blur-2xl border-r border-slate-800/80 text-slate-200 flex flex-col shrink-0 shadow-2xl">
      
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-white tracking-wide uppercase">Campaign Brief Configurator</h2>
        </div>
        <div className="flex items-center space-x-1">
          {onOpenHistory && (
            <button
              type="button"
              onClick={onOpenHistory}
              className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition border border-transparent hover:border-indigo-500/20 cursor-pointer"
              title="View Campaign Execution History"
            >
              <History className="w-4 h-4" />
            </button>
          )}
          <button
            id="collapse-brief-panel-btn"
            onClick={() => setIsCollapsed(true)}
            className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded transition hidden lg:block cursor-pointer"
            title="Collapse Panel"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>


      <div className="p-4 overflow-y-auto space-y-5 text-xs flex-1">
        
        {/* Preset Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Quick Campaign Presets
            </label>
            {activePreset !== 'custom' && (
              <span className="text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full font-semibold">
                Preset Active
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handlePresetSelect('mining')}
              disabled={isRunning}
              className={`px-2 py-2 rounded-xl text-[11px] font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50 ${
                activePreset === 'mining'
                  ? 'bg-indigo-600 border border-indigo-400 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-indigo-400/30'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Pickaxe className={`w-3.5 h-3.5 shrink-0 ${activePreset === 'mining' ? 'text-amber-300' : 'text-amber-400'}`} />
              <span className="truncate">Mining LatAm</span>
            </button>

            <button
              type="button"
              onClick={() => handlePresetSelect('energy')}
              disabled={isRunning}
              className={`px-2 py-2 rounded-xl text-[11px] font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50 ${
                activePreset === 'energy'
                  ? 'bg-indigo-600 border border-indigo-400 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-indigo-400/30'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 shrink-0 ${activePreset === 'energy' ? 'text-yellow-300' : 'text-yellow-400'}`} />
              <span className="truncate">Energy Grid</span>
            </button>

            <button
              type="button"
              onClick={() => handlePresetSelect('heavy_industry')}
              disabled={isRunning}
              className={`px-2 py-2 rounded-xl text-[11px] font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50 ${
                activePreset === 'heavy_industry'
                  ? 'bg-indigo-600 border border-indigo-400 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-indigo-400/30'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Factory className={`w-3.5 h-3.5 shrink-0 ${activePreset === 'heavy_industry' ? 'text-cyan-300' : 'text-cyan-400'}`} />
              <span className="truncate">Refineries</span>
            </button>
          </div>
        </div>

        {/* Target Vertical */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-between">
            <span>Target Vertical</span>
            <Target className="w-3.5 h-3.5 text-indigo-400" />
          </label>
          <textarea
            id="input-target-vertical"
            rows={2}
            value={input.targetVertical}
            onChange={(e) => handleChange('targetVertical', e.target.value)}
            disabled={isRunning}
            className="w-full bg-slate-800/50 border border-slate-700/80 focus:border-indigo-500 rounded-lg p-2.5 text-slate-100 text-xs focus:ring-1 focus:ring-indigo-500 transition resize-none disabled:opacity-60"
            placeholder="e.g. Lithium, copper, iron ore mining in LatAm"
          />
        </div>

        {/* Reference Account (ICP Anchor) */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-between">
            <span>Reference Account (ICP Anchor)</span>
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
          </label>
          <input
            id="input-reference-account"
            type="text"
            value={input.referenceAccount}
            onChange={(e) => handleChange('referenceAccount', e.target.value)}
            disabled={isRunning}
            className="w-full bg-slate-800/50 border border-slate-700/80 focus:border-indigo-500 rounded-lg p-2 text-slate-100 text-xs focus:ring-1 focus:ring-indigo-500 transition disabled:opacity-60"
            placeholder="e.g. SQM (Sociedad Química y Minera de Chile)"
          />
        </div>

        {/* Campaign Goal */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Campaign Goal
          </label>
          <textarea
            id="input-campaign-goal"
            rows={2}
            value={input.goal}
            onChange={(e) => handleChange('goal', e.target.value)}
            disabled={isRunning}
            className="w-full bg-slate-800/50 border border-slate-700/80 focus:border-indigo-500 rounded-lg p-2.5 text-slate-100 text-xs focus:ring-1 focus:ring-indigo-500 transition resize-none disabled:opacity-60"
            placeholder="e.g. Book discovery calls with Head of Operations or VP HSE"
          />
        </div>

        {/* Vendor Name */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Vendor Name
          </label>
          <input
            id="input-vendor-name"
            type="text"
            value={input.vendorName}
            onChange={(e) => handleChange('vendorName', e.target.value)}
            disabled={isRunning}
            className="w-full bg-slate-800/50 border border-slate-700/80 focus:border-indigo-500 rounded-lg p-2 text-slate-100 text-xs focus:ring-1 focus:ring-indigo-500 transition disabled:opacity-60"
          />
        </div>

        {/* Vendor Angle */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-between">
            <span>Vendor Value Angle</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </label>
          <textarea
            id="input-vendor-angle"
            rows={3}
            value={input.vendorAngle}
            onChange={(e) => handleChange('vendorAngle', e.target.value)}
            disabled={isRunning}
            className="w-full bg-slate-800/50 border border-slate-700/80 focus:border-indigo-500 rounded-lg p-2.5 text-slate-100 text-xs focus:ring-1 focus:ring-indigo-500 transition resize-none disabled:opacity-60"
            placeholder="e.g. Autonomous drone inspection replacing contracted human crews"
          />
        </div>

        {/* Proof Points */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-between">
            <span>Proof Points / Reference Customers</span>
            <Tag className="w-3.5 h-3.5 text-purple-400" />
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2 p-2 bg-slate-800/50 border border-slate-700/80 rounded-lg min-h-[42px]">
            {input.vendorProofPoints.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center space-x-1 px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded text-[11px]"
              >
                <span>{tag}</span>
                {!isRunning && (
                  <button
                    type="button"
                    onClick={() => handleRemoveProofPoint(tag)}
                    className="hover:text-red-400 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
          {!isRunning && (
            <form onSubmit={handleAddProofPoint} className="flex gap-1.5">
              <input
                type="text"
                value={newProofPoint}
                onChange={(e) => setNewProofPoint(e.target.value)}
                placeholder="Add reference customer..."
                className="flex-1 bg-slate-800/50 border border-slate-700/80 rounded p-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded text-xs font-medium border border-white/10"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Target Account Count Slider */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Target Accounts Count
            </label>
            <span className="text-xs font-bold text-indigo-300 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded">
              {input.accountCount} Companies
            </span>
          </div>
          <input
            id="input-account-count"
            type="range"
            min={5}
            max={8}
            step={1}
            value={input.accountCount}
            onChange={(e) => handleChange('accountCount', parseInt(e.target.value))}
            disabled={isRunning}
            className="w-full accent-indigo-500 bg-slate-800/50 cursor-pointer disabled:opacity-50"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
            <span>5 Accounts</span>
            <span>8 Accounts</span>
          </div>
        </div>

        {/* Reset Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onChange(DEFAULT_CAMPAIGN_INPUT)}
            disabled={isRunning}
            className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs font-medium border border-white/10 transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore FlytBase Defaults</span>
          </button>
        </div>

      </div>
    </aside>
  );
};
