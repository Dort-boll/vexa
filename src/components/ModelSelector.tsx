import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Cpu, Sparkles, Search, Check, Brain, Zap } from 'lucide-react';

export interface ModelDetail {
  id: string;
  name: string;
  provider: 'Google' | 'OpenAI' | 'Anthropic' | 'Meta' | 'DeepSeek' | 'Custom' | 'Nvidia';
  category: 'Reasoning' | 'General' | 'Lightweight';
  contextWindow: string;
  speed: 'Ultra-Fast' | 'Fast' | 'Moderate' | 'Deep-Thinking';
  description: string;
}

export const ALL_MODELS: ModelDetail[] = [
  {
    id: 'nvidia/nemotron-3.5-content-safety:free',
    name: 'Nvidia Nemotron 3.5 Content Safety (Free)',
    provider: 'Nvidia',
    category: 'Reasoning',
    contextWindow: '128K',
    speed: 'Ultra-Fast',
    description: 'High performance open-weights safety-aligned model hosted on Puter cloud sandbox.'
  }
];

interface ModelSelectorProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  models: string[];
}

export default function ModelSelector({
  selectedModel,
  setSelectedModel,
  models
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('All');

  // Map incoming model IDs to ALL_MODELS details, preserving custom models with fallback values
  const mappedModels = useMemo(() => {
    return models.map(id => {
      const match = ALL_MODELS.find(m => m.id.toLowerCase() === id.toLowerCase());
      if (match) return match;
      
      // Dynamic fallback for any system models not explicitly listed
      return {
        id,
        name: id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        provider: 'Custom' as const,
        category: 'General' as const,
        contextWindow: '128K',
        speed: 'Fast' as const,
        description: 'Dynamic sandbox diagnostic engine.'
      };
    });
  }, [models]);

  const providers = useMemo(() => {
    const list = new Set(mappedModels.map(m => m.provider));
    return ['All', ...Array.from(list)];
  }, [mappedModels]);

  const filteredModels = useMemo(() => {
    return mappedModels.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                            m.id.toLowerCase().includes(search.toLowerCase()) ||
                            m.provider.toLowerCase().includes(search.toLowerCase());
      const matchesProvider = selectedProvider === 'All' || m.provider === selectedProvider;
      return matchesSearch && matchesProvider;
    });
  }, [mappedModels, search, selectedProvider]);

  const activeModelDetails = useMemo(() => {
    return ALL_MODELS.find(m => m.id.toLowerCase() === selectedModel.toLowerCase()) || {
      id: selectedModel,
      name: selectedModel.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      provider: 'Custom',
      category: 'General',
      contextWindow: '128K',
      speed: 'Fast',
      description: 'Active diagnostic engine.'
    };
  }, [selectedModel]);

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'Nvidia': return 'text-lime-400 bg-lime-500/10 border-lime-500/20';
      case 'Google': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      case 'OpenAI': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Anthropic': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'DeepSeek': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Meta': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getSpeedIcon = (speed: string) => {
    switch (speed) {
      case 'Ultra-Fast': return <Zap className="w-3 h-3 text-amber-400 animate-pulse" />;
      case 'Fast': return <Zap className="w-3 h-3 text-yellow-500" />;
      case 'Moderate': return <Brain className="w-3 h-3 text-indigo-400" />;
      case 'Deep-Thinking': return <Brain className="w-3 h-3 text-purple-400 animate-pulse" />;
      default: return <Brain className="w-3 h-3 text-slate-400" />;
    }
  };

  return (
    <div className="relative shrink-0">
      {/* Selector Button */}
      <button
        id="btn-model-selector-custom"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-mono bg-black border border-white/[0.08] hover:border-indigo-500/40 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] rounded-xl text-slate-300 transition-all duration-300 cursor-pointer shadow-md group active:scale-98 glow-border"
      >
        <div className="relative">
          <Cpu className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-45 transition-transform duration-500" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        </div>
        <span className="hidden sm:inline">
          Active Engine: <strong className="text-white font-semibold transition-colors group-hover:text-indigo-300">{activeModelDetails.name}</strong>
        </span>
        <span className="inline sm:hidden">
          <strong className="text-white font-semibold transition-colors group-hover:text-indigo-300">{activeModelDetails.name}</strong>
        </span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-400' : 'text-slate-500'}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click backdrop */}
            <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsOpen(false)}></div>

            {/* Dropdown Card */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute right-0 mt-2.5 w-[310px] sm:w-[460px] bg-black border border-white/[0.08] rounded-2xl shadow-2xl p-4 z-50 font-mono flex flex-col gap-3 max-h-[500px] overflow-hidden"
            >
              {/* Header Title */}
              <div className="flex items-center justify-between border-b border-white/[0.05] pb-2.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] text-white font-bold uppercase tracking-widest">
                    VEXA AI Models Registry
                  </span>
                </div>
                <span className="text-[9px] text-slate-500 px-2 py-0.5 bg-white/[0.03] border border-white/[0.05] rounded-full uppercase">
                  {filteredModels.length} of {models.length} Online
                </span>
              </div>

              {/* Active Model Overview Section */}
              <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl flex items-start gap-3 relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full filter blur-xl pointer-events-none"></div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] uppercase tracking-widest text-indigo-400 font-bold">CURRENT SELECTION</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.25 rounded-md border uppercase ${getProviderColor(activeModelDetails.provider)}`}>
                      {activeModelDetails.provider}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white font-sans">{activeModelDetails.name}</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{activeModelDetails.description}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1 text-[9px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Brain className="w-2.5 h-2.5 text-indigo-400" /> Category: <strong className="text-slate-300 font-semibold">{activeModelDetails.category}</strong>
                    </span>
                    <span>•</span>
                    <span>Context Window: <strong className="text-slate-300 font-semibold">{activeModelDetails.contextWindow}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      {getSpeedIcon(activeModelDetails.speed)} Speed: <strong className="text-slate-300 font-semibold">{activeModelDetails.speed}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Search & Provider Filter Controls */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search model registry or vendor..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/[0.08] focus:border-indigo-500/50 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 outline-none transition-all"
                  />
                  {search && (
                    <button 
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-2 text-[10px] text-slate-500 hover:text-white"
                    >
                      CLEAR
                    </button>
                  )}
                </div>

                {/* Horizontal Provider Scroll Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-white/10 no-scrollbar">
                  {providers.map((prov) => (
                    <button
                      key={prov}
                      onClick={() => setSelectedProvider(prov)}
                      className={`px-2.5 py-1 text-[9px] font-bold rounded-lg uppercase tracking-wider transition-all border whitespace-nowrap cursor-pointer ${
                        selectedProvider === prov
                          ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-bold'
                          : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {prov}
                    </button>
                  ))}
                </div>
              </div>

              {/* Models List - Grouped & Filtered */}
              <div className="flex-1 overflow-y-auto max-h-[180px] pr-1 space-y-1.5 scrollbar-thin">
                {filteredModels.length > 0 ? (
                  filteredModels.map((m) => {
                    const isSelected = selectedModel.toLowerCase() === m.id.toLowerCase();
                    return (
                      <button
                        key={m.id}
                        id={`model-select-opt-${m.id}`}
                        onClick={() => {
                          setSelectedModel(m.id);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl border text-[10px] md:text-xs hover:bg-white/[0.03] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-500/5 border-indigo-500/30 text-indigo-400 font-semibold'
                            : 'bg-transparent border-white/[0.04] text-slate-400'
                        }`}
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-sans font-bold text-slate-100">{m.name}</span>
                            <span className={`text-[8px] font-semibold px-1 rounded border tracking-wide uppercase scale-90 ${getProviderColor(m.provider)}`}>
                              {m.provider}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[9px] text-slate-500">
                            <span className="text-slate-400">{m.contextWindow} context</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              {getSpeedIcon(m.speed)} {m.speed}
                            </span>
                            <span>•</span>
                            <span className="text-slate-400 capitalize">{m.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 justify-end shrink-0">
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                              <Check className="w-3 h-3 text-indigo-400" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-slate-500 text-[10px] border border-dashed border-white/[0.05] rounded-xl">
                    No matching AI models found in current provider subset.
                  </div>
                )}
              </div>

              {/* Static Warning and Tip Footer */}
              <div className="border-t border-white/[0.05] pt-2 mt-1 text-[9px] text-slate-500 leading-relaxed flex gap-2 items-start bg-black text-left">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span className="font-sans">
                  VEXA coordinates model metadata vectors dynamically. Selecting specific intelligence profiles influences optimization recommendations.
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
