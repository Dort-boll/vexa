import React, { useState } from 'react';
import { 
  Shield, Coins, Cpu, Clock, Activity, Copy, Check, FileText, 
  Workflow, ArrowRight, CornerDownRight, CheckSquare, Square, Download, RefreshCw 
} from 'lucide-react';
import { Report } from '../types';

interface ReportViewerProps {
  report: Report;
  onReaudit: () => void;
}

export default function ReportViewer({ report, onReaudit }: ReportViewerProps) {
  const [copiedBefore, setCopiedBefore] = useState(false);
  const [copiedAfter, setCopiedAfter] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  // Trigger download of JSON report
  const downloadJSONReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Vayu-Diagnostic-${report.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const copyToClipboard = (text: string, type: 'before' | 'after' | 'code') => {
    navigator.clipboard.writeText(text);
    if (type === 'before') {
      setCopiedBefore(true);
      setTimeout(() => setCopiedBefore(false), 2000);
    } else if (type === 'after') {
      setCopiedAfter(true);
      setTimeout(() => setCopiedAfter(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const toggleStep = (idx: number) => {
    setCheckedSteps(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Severity color maps
  const getSeverityColor = (val: number) => {
    if (val >= 8) return 'bg-rose-500';
    if (val >= 5) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getScoreColor = (score: number) => {
    if (score > 70) return 'text-emerald-400';
    if (score > 45) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div id={`report-viewer-${report.id}`} className="space-y-8 animate-fade-in px-6 pb-24">
      
      {/* Top action row and executive meta */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/30 border border-slate-900 p-4 rounded-2xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-indigo-950 border border-indigo-500/20 text-indigo-300 px-3 py-1 rounded-lg">
            REPORT ID: {report.id}
          </span>
          <span className="text-xs font-mono text-slate-500">
            COMPUTED: {report.timestamp}
          </span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            id="btn-export-report"
            onClick={downloadJSONReport}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-950 border border-slate-900 hover:border-slate-800 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export Report (JSON)</span>
          </button>
          
          <button
            id="btn-re-audit"
            onClick={onReaudit}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 text-indigo-300 hover:text-white hover:border-indigo-500/50 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Re-Test Sandbox</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Layer 1: Core Dashboard Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core AI Health Score */}
        <div className="bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 glow-border">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full filter blur-xl pointer-events-none"></div>
          <div>
            <h3 className="font-mono text-[10px] font-semibold text-slate-500 tracking-widest uppercase mb-1">SYSTEM HEALTH METRIC</h3>
            <p className="font-display font-bold text-lg text-white">AI Health Score</p>
          </div>

          {/* Concentric Circle Progress Indicator */}
          <div className="my-6 flex items-center justify-center relative">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="64"
                className="stroke-slate-900"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r="64"
                className={`transition-all duration-1000 ease-out ${
                  report.score > 70 ? 'stroke-emerald-500' : (report.score > 45 ? 'stroke-amber-500' : 'stroke-rose-500')
                }`}
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 64}
                strokeDashoffset={2 * Math.PI * 64 * (1 - report.score / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-4xl font-display font-extrabold ${getScoreColor(report.score)}`}>
                {report.score}%
              </span>
              <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest mt-1">
                {report.score > 70 ? 'OPTIMIZED' : (report.score > 45 ? 'WARNING' : 'CRITICAL')}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-400 leading-relaxed font-sans border-t border-slate-900/60 pt-4">
            Health index is weighed across performance, cost, alignment metrics, and security vectors.
          </div>
        </div>

        {/* Executive Summary & Root Cause */}
        <div className="lg:col-span-2 bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 glow-border">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full filter blur-xl pointer-events-none"></div>
          <div>
            <h3 className="font-mono text-[10px] font-semibold text-slate-500 tracking-widest uppercase mb-1">AGI ANALYTICS SUMMARY</h3>
            <h2 className="font-display font-bold text-xl text-white mb-4">{report.title}</h2>
            
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1">EXECUTIVE STATEMENT</span>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">{report.executiveSummary}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider block mb-1">ROOT CAUSE DETERMINATION</span>
                <p className="text-sm text-slate-300 leading-relaxed font-sans border-l-2 border-rose-500/50 pl-3">{report.rootCause}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-900/60 pt-4 mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span>Category: Local Sandbox Analysis</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>Model Class: Vayu diagnostic</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Layer 2: Core Matrices & Cost Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Rating Severity Bar graph */}
        <div className="bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-5 sm:p-6 relative transition-all duration-300 glow-border">
          <h3 className="font-mono text-[10px] font-semibold text-slate-500 tracking-widest uppercase mb-1">METRIC AUDIT INDEX</h3>
          <p className="font-display font-bold text-lg text-white mb-6">Severity Matrix</p>
          
          <div className="space-y-4 font-mono">
            {Object.entries(report.problemSeverity).map(([key, val]) => (
              <div key={key} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="capitalize text-slate-400">{key} Risk</span>
                  <span className="font-semibold text-slate-200">{val} / 10</span>
                </div>
                <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-white/[0.05]">
                  <div 
                    className={`h-full rounded-full ${getSeverityColor(val)}`} 
                    style={{ width: `${val * 10}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost & Caching Performance */}
        <div className="bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative transition-all duration-300 glow-border">
          <div>
            <h3 className="font-mono text-[10px] font-semibold text-slate-500 tracking-widest uppercase mb-1">RESOURCE COST MODULE</h3>
            <p className="font-display font-bold text-lg text-white mb-4">Cost Optimization</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4 font-mono">
              <div className="bg-black border border-white/[0.05] p-3 rounded-xl">
                <span className="text-[9px] text-slate-500 block uppercase">ESTIMATED RUNRATE</span>
                <span className="text-sm font-bold text-slate-200">{report.costOptimization.currentCostEstimate}</span>
              </div>
              <div className="bg-black border border-white/[0.05] p-3 rounded-xl">
                <span className="text-[9px] text-emerald-500 block uppercase">POTENTIAL SAVINGS</span>
                <span className="text-sm font-bold text-emerald-400">{report.costOptimization.potentialSavings}</span>
              </div>
            </div>

            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block mb-2 font-semibold">CACHING RECOMMENDATIONS</span>
            <ul className="space-y-2 text-xs text-slate-400">
              {report.costOptimization.recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <CornerDownRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Latency & Processing Benchmarks */}
        <div className="bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative transition-all duration-300 glow-border">
          <div>
            <h3 className="font-mono text-[10px] font-semibold text-slate-500 tracking-widest uppercase mb-1">LATENCY & THROTTLING BENCHMARK</h3>
            <p className="font-display font-bold text-lg text-white mb-4">Processing Latency</p>

            <div className="bg-black border border-white/[0.05] p-4 rounded-xl flex items-center justify-between mb-4">
              <div>
                <span className="font-mono text-[9px] text-slate-500 uppercase block">TTFT LATENCY</span>
                <span className="font-display text-2xl font-black text-white">{report.performanceAnalysis.latencyMs}ms</span>
              </div>
              <Clock className="w-8 h-8 text-indigo-500 opacity-60" />
            </div>

            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block mb-2 font-semibold">IDENTIFIED SYSTEM BOTTLENECKS</span>
            <ul className="space-y-2 text-xs text-slate-400">
              {report.performanceAnalysis.bottlenecks.map((bot, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
                  <span>{bot}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Security Scanning Board & Vulnerabilities */}
      <div className="bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-5 sm:p-6 transition-all duration-300 glow-border">
        <div className="flex items-center justify-between mb-6 border-b border-white/[0.05] pb-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-rose-500" />
            <div>
              <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider">AI Security & Injection Shield</h3>
              <p className="text-xs text-slate-500 mt-0.5">Assessing alignment integrity and secret leaks</p>
            </div>
          </div>
          <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded border uppercase tracking-widest ${
            report.securityReport.status === 'Critical' 
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse' 
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}>
            VULNERABILITY LEVEL: {report.securityReport.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.securityReport.issues.map((issue, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-900/60 p-4 rounded-xl flex gap-3.5 items-start">
              <span className={`w-2 h-2 rounded-full shrink-0 mt-2 ${issue.severity === 'Critical' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`}></span>
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide font-mono">{issue.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">{issue.desc}</p>
                <div className="mt-2.5 flex items-center gap-1">
                  <span className="text-[9px] font-mono text-indigo-400 uppercase">Audit severity:</span>
                  <span className={`text-[9px] font-mono uppercase font-semibold ${issue.severity === 'Critical' ? 'text-red-400' : 'text-yellow-400'}`}>{issue.severity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-900/60 flex items-center gap-2 font-mono text-[10px] text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Privacy Risk Analysis: {report.privacyRisk}</span>
        </div>
      </div>

      {/* Interactive Vector Architecture Diagram */}
      <div className="bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-5 sm:p-6 transition-all duration-300 glow-border">
        <h3 className="font-mono text-[10px] font-semibold text-slate-500 tracking-widest uppercase mb-1">VISUAL SYSTEM DEPLOYMENT LAYOUT</h3>
        <p className="font-display font-bold text-lg text-white mb-6">Interactive Architecture Schema</p>

        <div className="bg-black/95 rounded-2xl border border-slate-900 p-6 flex flex-col items-center justify-center min-h-64 overflow-x-auto relative">
          {/* Connecting glowing vectors background lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            {report.architectureEdges.map((edge, idx) => {
              const fromNode = report.architectureNodes.find(n => n.id === edge.from);
              const toNode = report.architectureNodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;
              
              // Draw custom line paths between coordinate ratios
              const x1 = `${fromNode.x}%`;
              const y1 = `${fromNode.y}px`;
              const x2 = `${toNode.x}%`;
              const y2 = `${toNode.y}px`;

              return (
                <g key={idx}>
                  <line 
                    x1={x1} 
                    y1={y1} 
                    x2={x2} 
                    y2={y2} 
                    stroke="#4f46e5" 
                    strokeWidth="1.5" 
                    strokeDasharray="4 4" 
                    className="animate-pulse"
                  />
                  {/* Moving signal particle */}
                  <circle r="3" fill="#818cf8">
                    <animateMotion 
                      dur="3s" 
                      repeatCount="indefinite" 
                      path={`M 0 0`} // standard linear particle offset placeholder
                    />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* Interactive node elements */}
          <div className="relative w-full flex flex-wrap justify-between items-center gap-y-12 gap-x-6 min-h-48 px-4">
            {report.architectureNodes.map((node) => {
              const isAI = node.type === 'ai';
              const isDB = node.type === 'database';
              
              return (
                <div
                  key={node.id}
                  className={`relative p-3.5 rounded-xl border flex flex-col items-center text-center font-mono text-xs w-40 backdrop-blur shadow-lg transition-transform hover:-translate-y-1 duration-200 z-10 ${
                    isAI 
                      ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-300 ring-2 ring-indigo-500/10' 
                      : (isDB ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300' : 'bg-slate-900/80 border-slate-800 text-slate-300')
                  }`}
                >
                  <span className="text-[9px] uppercase text-slate-500 font-semibold mb-1.5">{node.type} node</span>
                  <span className="font-semibold text-slate-100">{node.label}</span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 flex gap-6 text-[10px] font-mono text-slate-500 flex-wrap justify-center border-t border-slate-900/60 pt-4 w-full">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-slate-800 rounded border border-slate-700"></span>
              <span>Client / Output Gateway</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-indigo-950 rounded border border-indigo-500/50"></span>
              <span>AI Engine Processing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-cyan-950 rounded border border-cyan-500/40"></span>
              <span>Vector Database Grounding</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-side Prompt Tuning Optimizer View */}
      <div className="bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-5 sm:p-6 transition-all duration-300 glow-border">
        <h3 className="font-mono text-[10px] font-semibold text-slate-500 tracking-widest uppercase mb-1">TUNING CONTEXT SHIFT</h3>
        <p className="font-display font-bold text-lg text-white mb-6">Prompt Tuning Optimizer</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Before Prompt */}
          <div className="bg-black border border-white/[0.05] rounded-xl p-4 relative font-mono text-xs">
            <div className="flex justify-between items-center mb-3">
              <span className="text-rose-400 bg-rose-500/5 border border-rose-500/20 px-2 py-0.5 rounded uppercase tracking-wider text-[10px] font-semibold">Before Optimization</span>
              <button 
                onClick={() => copyToClipboard(report.promptImprovements.before, 'before')} 
                className="text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                {copiedBefore ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <pre className="text-slate-400 whitespace-pre-wrap leading-relaxed h-32 overflow-y-auto custom-scrollbar">{report.promptImprovements.before}</pre>
          </div>

          {/* After Prompt */}
          <div className="bg-black/80 border border-slate-900 rounded-xl p-4 relative font-mono text-xs">
            <div className="flex justify-between items-center mb-3">
              <span className="text-indigo-400 bg-indigo-500/5 border border-indigo-500/20 px-2 py-0.5 rounded uppercase tracking-wider text-[10px] font-semibold">Vayu Optimized Template</span>
              <button 
                onClick={() => copyToClipboard(report.promptImprovements.after, 'after')} 
                className="text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                {copiedAfter ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <pre className="text-indigo-300/90 whitespace-pre-wrap leading-relaxed h-32 overflow-y-auto custom-scrollbar">{report.promptImprovements.after}</pre>
          </div>
        </div>

        <div className="mt-5">
          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block mb-2 font-semibold">PROMPT PARSER TUNING DETAILS</span>
          <div className="flex flex-wrap gap-2">
            {report.promptImprovements.improvements.map((imp, idx) => (
              <span key={idx} className="bg-slate-900 border border-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg">
                ✔ {imp}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Code Fix Diff Block */}
      <div className="bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-5 sm:p-6 transition-all duration-300 glow-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-mono text-[10px] font-semibold text-slate-500 tracking-widest uppercase mb-1">CODE OPTIMIZATION STREAM</h3>
            <p className="font-display font-bold text-lg text-white">Generated Production Code</p>
          </div>
          <button
            onClick={() => copyToClipboard(report.codeFixes.afterCode, 'code')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-900 hover:bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Solution</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed font-sans">{report.codeFixes.description}</p>

        <div className="bg-black border border-slate-900 rounded-2xl overflow-hidden font-mono text-xs">
          <div className="bg-neutral-950 border-b border-white/[0.04] px-4 py-2 flex items-center justify-between text-[11px] text-slate-500 select-none">
            <span>production_fix_compiler.ts</span>
            <span className="text-indigo-400">TypeScript / ES2025 compliant</span>
          </div>
          <pre className="p-4 leading-relaxed overflow-x-auto text-slate-300 select-all max-h-96 custom-scrollbar">{report.codeFixes.afterCode}</pre>
        </div>
      </div>

      {/* Model recommendations and alternatives table */}
      <div className="bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-5 sm:p-6 transition-all duration-300 glow-border">
        <h3 className="font-mono text-[10px] font-semibold text-slate-500 tracking-widest uppercase mb-1">ROUTING MATRIX</h3>
        <p className="font-display font-bold text-lg text-white mb-6">Model Suitability Recommendations</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 uppercase tracking-widest text-[10px] font-semibold">
                <th className="pb-3 font-normal">Model Name</th>
                <th className="pb-3 font-normal">Suitability Index</th>
                <th className="pb-3 font-normal">Latency (est)</th>
                <th className="pb-3 font-normal">Token Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/40 text-slate-300">
              {report.modelRecommendations.map((rec, idx) => (
                <tr key={idx} className="hover:bg-slate-900/20">
                  <td className="py-3 font-bold text-slate-100">{rec.modelName}</td>
                  <td className="py-3 text-indigo-400 font-medium">{rec.suitability}</td>
                  <td className="py-3">{rec.latency}</td>
                  <td className="py-3">{rec.pricing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Step-by-Step Action Plan checklist */}
      <div className="bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-5 sm:p-6 transition-all duration-300 glow-border">
        <h3 className="font-mono text-[10px] font-semibold text-slate-500 tracking-widest uppercase mb-1">INTERACTIVE MITIGATION ROADMAP</h3>
        <p className="font-display font-bold text-lg text-white mb-6">Step-by-step Fix Plan</p>

        <div className="space-y-3 font-sans">
          {report.stepByStepPlan.map((item, idx) => {
            const checked = checkedSteps[idx] || false;
            return (
              <button
                key={idx}
                id={`plan-step-${idx}`}
                onClick={() => toggleStep(idx)}
                className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                  checked 
                    ? 'bg-slate-900/30 border-indigo-500/20 text-slate-500' 
                    : 'bg-slate-900/60 border-slate-900 hover:border-slate-800 text-slate-200'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {checked ? (
                    <CheckSquare className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                  )}
                </div>
                <div>
                  <span className={`text-sm font-semibold block ${checked ? 'line-through text-slate-500 font-normal' : ''}`}>
                    Phase {idx + 1}: {item.step}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase mt-0.5 block tracking-widest">
                    {checked ? 'MITIGATION APPLIED' : 'ACTION REQUIRED'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
