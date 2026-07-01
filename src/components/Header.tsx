import React from 'react';
import { Sparkles, Menu, X, Github } from 'lucide-react';
import { ActiveTab } from '../types';
import ModelSelector from './ModelSelector';

interface HeaderProps {
  activeTab: ActiveTab;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  models: string[];
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export default function Header({
  activeTab,
  selectedModel,
  setSelectedModel,
  models,
  sidebarOpen,
  setSidebarOpen
}: HeaderProps) {
  const getTitle = () => {
    switch (activeTab) {
      case 'Dashboard':
        return 'VEXA workspace';
      case 'AIDoctor':
        return 'AI Doctor Diagnostic Engine';
      case 'PromptOptimizer':
        return 'Prompt Tuning & Alignment';
      case 'ReasoningLab':
        return 'Vayu Reasoning Engine Lab';
      case 'ArchitectureViewer':
        return 'Semantic & Modular Architecture';
      case 'SecurityScanner':
        return 'System Security & Injection Scanner';
      case 'CostAnalyzer':
        return 'Token Cost & Budget Optimizer';
      case 'HallucinationDetector':
        return 'Hallucination & Temperature Scopes';
      case 'CodeReviewer':
        return 'AI Code Audit & Diff Engine';
      case 'Reports':
        return 'System Diagnostic Archives';
      case 'Settings':
        return 'Engine Environment Config';
      default:
        return 'AI Engineering Workspace';
    }
  };

  const getSubtitle = () => {
    switch (activeTab) {
      case 'Dashboard':
        return 'Initialize diagnoses, assess health parameters, and optimize architectures.';
      case 'AIDoctor':
        return 'Triage systemic AI bugs, hallucinations, loop overflows, and pipeline errors.';
      case 'PromptOptimizer':
        return 'Refine instructions, isolate parameters, and align system context bounds.';
      case 'ReasoningLab':
        return 'Benchmark model logic trees, validation barriers, and thought streams.';
      case 'ArchitectureViewer':
        return 'Render retrieval vectors, API orchestration nodes, and workflow pipelines.';
      case 'SecurityScanner':
        return 'Scan vulnerabilities, sanitize prompt injection vectors, and secure tokens.';
      case 'CostAnalyzer':
        return 'Analyze token metrics, model sizes, and orchestrate cost-mitigating caching.';
      case 'HallucinationDetector':
        return 'Assess truthfulness indices, grounding limits, and temperature variations.';
      case 'CodeReviewer':
        return 'Review code structure, catch loop crashes, and inspect code diffs.';
      case 'Reports':
        return 'Browse historically saved diagnostics and fix execution reports.';
      case 'Settings':
        return 'Manage SDK models, sandbox integrations, and workspace environments.';
      default:
        return 'Operating System powered by Vayu AGI';
    }
  };

  return (
    <header className="sticky top-0 z-20 flex flex-row items-center justify-between gap-3 py-3 md:py-3 px-4 md:px-6 border-b border-white/[0.05] bg-black/30 backdrop-blur-xl shadow-sm shadow-black/10 select-none">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger - Elegant top position */}
        {setSidebarOpen && (
          <button
            id="btn-header-menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden flex items-center justify-center p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] text-slate-300 hover:text-white active:scale-95 transition-all cursor-pointer"
            aria-label="Toggle Menu"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        )}

        <div>
          <h1 className="font-display text-sm md:text-base font-bold tracking-tight text-white flex items-center gap-2 uppercase">
            {getTitle()}
            {activeTab === 'AIDoctor' && (
              <span className="text-[9px] md:text-[10px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30 font-mono tracking-widest uppercase animate-pulse">ACTIVE</span>
            )}
          </h1>
          <p className="hidden xs:block text-[10px] md:text-xs text-slate-400 mt-0.5 font-medium">{getSubtitle()}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* GitHub Link */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] hover:border-white/[0.1] text-slate-300 hover:text-white transition-all cursor-pointer font-mono text-[10px] md:text-xs shadow-md"
          title="Open Repository in GitHub"
        >
          <Github className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">GitHub</span>
        </a>

        {/* Model Selection Tool dropdown */}
        <ModelSelector
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          models={models}
        />
      </div>
    </header>
  );
}
