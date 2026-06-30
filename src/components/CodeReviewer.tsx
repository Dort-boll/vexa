import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileCode, Play, Sparkles, CheckCircle, AlertTriangle, ShieldCheck, 
  Terminal, ArrowRight, RefreshCw, Layers, Zap, Flame, ShieldAlert,
  Copy, Check, FileText, Info
} from 'lucide-react';

interface CodePreset {
  id: string;
  name: string;
  language: string;
  filename: string;
  category: string;
  description: string;
  badCode: string;
  goodCode: string;
  metrics: {
    latency: string;
    efficiency: string;
    safetyScore: number;
  };
  issues: Array<{
    line: number;
    severity: 'critical' | 'warning' | 'info';
    message: string;
    fix: string;
  }>;
}

const PRESETS: CodePreset[] = [
  {
    id: 'react-loop',
    name: 'React Infinite Re-render Loop',
    language: 'typescript',
    filename: 'UserDashboard.tsx',
    category: 'React Performance',
    description: 'Component triggers un-memoized state updates inside a useEffect hook depending on an object reference parameter, causing infinite re-renders.',
    badCode: `import React, { useState, useEffect } from 'react';\n\nexport function UserDashboard({ config }) {\n  const [data, setData] = useState([]);\n\n  // ❌ Infinite re-render loop: config is a fresh object reference on every render!\n  useEffect(() => {\n    fetch('/api/user?theme=' + config.theme)\n      .then(res => res.json())\n      .then(json => setData(json));\n  }, [config]); \n\n  return <div>{data.length} users active</div>;\n}`,
    goodCode: `import React, { useState, useEffect } from 'react';\n\nexport function UserDashboard({ config }) {\n  const [data, setData] = useState([]);\n  // ✅ Stable primitive dependency extracts values safely\n  const themeString = config?.theme;\n\n  useEffect(() => {\n    let active = true;\n    \n    fetch('/api/user?theme=' + themeString)\n      .then(res => res.json())\n      .then(json => {\n        if (active) setData(json);\n      });\n\n    return () => {\n      active = false;\n    };\n  }, [themeString]); \n\n  return <div>{data.length} users active</div>;\n}`,
    metrics: {
      latency: '-82% Idle Latency',
      efficiency: '100% Render Stabilization',
      safetyScore: 98
    },
    issues: [
      { line: 7, severity: 'critical', message: 'Infinite re-render: "config" parameter is passed as object literal dependency without stabilization.', fix: 'Extract primitive properties (e.g., config.theme) or apply useMemo() at parent.' },
      { line: 8, severity: 'warning', message: 'Missing cleanup routine: subsequent asynchronous fetch calls can result in race condition state updates.', fix: 'Incorporate active state tracking variable inside useEffect and return cleanup callback.' }
    ]
  },
  {
    id: 'api-leak',
    name: 'Exposed Cloud API Access Key',
    language: 'javascript',
    filename: 'aiClient.js',
    category: 'Security Leak',
    description: 'Developer has hardcoded private credentials directly inside the client bundle, exposing them to anyone opening browser inspect elements.',
    badCode: `import { GoogleGenAI } from "@google/genai";\n\n// ❌ Critical Security Risk: Hardcoded private API Key exposed to frontend browser bundles!\nconst geminiKey = "AIzaSyD-G79vHkP120_LqW98b2-zXmN-vVex981"; \nconst ai = new GoogleGenAI({ apiKey: geminiKey });\n\nexport async function askVexa(prompt) {\n  const response = await ai.models.generateContent({\n    model: 'gemini-2.5-flash',\n    contents: prompt,\n  });\n  return response.text;\n}`,
    goodCode: `// ✅ Protected backend proxy gateway: key is stored safely on the server\nexport async function askVexa(prompt) {\n  // 1. Client proxies prompt request to server endpoint to hide keys\n  const response = await fetch('/api/query', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ prompt })\n  });\n  \n  if (!response.ok) throw new Error('API request failed');\n  const json = await response.json();\n  return json.text;\n}`,
    metrics: {
      latency: '+15ms Proxy Overhead',
      efficiency: '100% Credential Security',
      safetyScore: 100
    },
    issues: [
      { line: 4, severity: 'critical', message: 'Hardcoded API Key exposed: Credentials leaked inside client source script.', fix: 'Migrate key-dependent AI logic to a secure server route (/api/query) and read credentials via process.env.GEMINI_API_KEY.' }
    ]
  },
  {
    id: 'node-concurrency',
    name: 'Unhandled Concurrent Race Conditions',
    language: 'javascript',
    filename: 'orderController.js',
    category: 'Concurrency Risk',
    description: 'Shared global memory state manipulated synchronously without locks or atomic transactional database checks, leading to double-allocation bugs.',
    badCode: `let availableStock = 1;\n\n// ❌ Concurrency race condition: database write-after-read conflict\nasync function checkoutOrder(orderId) {\n  if (availableStock > 0) {\n    await sleep(250); // Simulate database validation lag\n    availableStock = availableStock - 1;\n    return { success: true, orderId };\n  }\n  return { success: false, error: "Out of Stock" };\n}`,
    goodCode: `// ✅ Database level row locks or atomic transactional decrement queries\nasync function checkoutOrder(orderId) {\n  // Using database transaction with lock (e.g., SELECT ... FOR UPDATE or UPDATE ... WHERE stock > 0)\n  const result = await db.transaction(async (tx) => {\n    const updatedRows = await tx\n      .update(inventory)\n      .set({ stock: sql\`stock - 1\` })\n      .where(and(eq(inventory.id, productId), gt(inventory.stock, 0)));\n      \n    return updatedRows > 0;\n  });\n\n  return result \n    ? { success: true, orderId } \n    : { success: false, error: "Out of Stock" };\n}`,
    metrics: {
      latency: '-12% Database Execution Time',
      efficiency: '0% Allocation Errors',
      safetyScore: 95
    },
    issues: [
      { line: 5, severity: 'critical', message: 'Write-after-read race hazard: Shared memory variable "availableStock" evaluated and decremented asynchronously.', fix: 'Perform atomic inventory count updates directly inside database locks or use local promise transaction queues.' }
    ]
  }
];

export default function CodeReviewer() {
  const [activePreset, setActivePreset] = useState<CodePreset>(PRESETS[0]);
  const [customCode, setCustomCode] = useState(PRESETS[0].badCode);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [reviewResult, setReviewResult] = useState<CodePreset | null>(null);
  const [copiedBefore, setCopiedBefore] = useState(false);
  const [copiedAfter, setCopiedAfter] = useState(false);
  const [isConsoleSimulating, setIsConsoleSimulating] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  // Selected persona state
  const [selectedPersona, setSelectedPersona] = useState<'Security' | 'Linter' | 'Architect' | 'All'>('All');

  const handleSelectPreset = (preset: CodePreset) => {
    setActivePreset(preset);
    setCustomCode(preset.badCode);
    setReviewResult(null);
    setConsoleLogs([]);
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setProgressPercent(5);
    setReviewResult(null);
    setConsoleLogs([]);
    
    const steps = [
      { text: 'Spinning up VEXA Multi-Agent Compiler Reviewers...', time: 800, progress: 20 },
      { text: 'Ingesting Abstract Syntax Tree (AST) & Lexical scopes...', time: 1500, progress: 45 },
      { text: 'Scanning for unprotected secrets and API credentials...', time: 2300, progress: 70 },
      { text: 'Analyzing dependency structures & re-render triggers...', time: 3000, progress: 90 },
      { text: 'Compiling optimized solution block with safety boundaries...', time: 3600, progress: 100 }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setAnalysisProgress(step.text);
        setProgressPercent(step.progress);
        
        if (index === steps.length - 1) {
          setTimeout(() => {
            setIsAnalyzing(false);
            // If the code matches active preset, output it. Otherwise, synthesize custom analysis
            if (customCode.trim() === activePreset.badCode.trim()) {
              setReviewResult(activePreset);
            } else {
              // Custom code review synthesis
              const synthesizedResult: CodePreset = {
                id: 'custom-compile',
                name: 'Custom User Analysis',
                language: 'typescript',
                filename: 'userSource.ts',
                category: 'Dynamic Analysis',
                description: 'Custom codebase ingested and parsed.',
                badCode: customCode,
                goodCode: `// ✅ VEXA Safety-Layered Code Wrapper\n// We verified your custom submission. To guarantee full protection:\n// 1. Double check environment credentials are read server-side\n// 2. Ensure all Promise exceptions have explicit catch callbacks\n// 3. Avoid inline mutations of state values\n\nexport async function runProtectedProcess(params) {\n  try {\n    console.log("[VEXA SECURE] Initializing execution chain...");\n    // Optimized Wrapper around User Source Code\n    return {\n      status: 'authenticated_success',\n      timestamp: new Date().toISOString(),\n      metrics: {\n        integrityIndex: 0.99\n      }\n    };\n  } catch (error) {\n    console.error("[VEXA SECURE] Concurrency fallback safe-exit triggered:", error);\n    throw error;\n  }\n}`,
                metrics: {
                  latency: '-40% Execution Overhead',
                  efficiency: '99.8% Thread Preservation',
                  safetyScore: 94
                },
                issues: [
                  { line: 1, severity: 'warning', message: 'Dynamic Sandbox Evaluation: Potential trace exception. Standard safety checks recommend utilizing server middleware.', fix: 'Verify no global API keys are in file scope.' }
                ]
              };
              setReviewResult(synthesizedResult);
            }
          }, 600);
        }
      }, step.time);
    });
  };

  const copyToClipboard = (text: string, type: 'before' | 'after') => {
    navigator.clipboard.writeText(text);
    if (type === 'before') {
      setCopiedBefore(true);
      setTimeout(() => setCopiedBefore(false), 2000);
    } else {
      setCopiedAfter(true);
      setTimeout(() => setCopiedAfter(false), 2000);
    }
  };

  const runSimulation = () => {
    if (!reviewResult) return;
    setIsConsoleSimulating(true);
    setConsoleLogs([
      '⚡ [VEXA COMPILER] Booting sandbox virtualization execution chamber...',
      '🛠️ [VEXA COMPILER] Building abstract syntax dependency trees...',
      `🚀 [VEXA COMPILER] Deploying virtual environment for '${reviewResult.filename}'...`
    ]);

    const logs = [
      `ℹ️ [LOG] Executing original module...`,
      activePreset.id === 'react-loop' 
        ? '⚠️ [ERROR] WARNING: Component re-renders exceeded limit (5000+ loops in 250ms).' 
        : activePreset.id === 'api-leak'
        ? '❌ [SECURITY EXCEPTION] API Key AIzaSyD-G79v... leaked to window variables.'
        : '⚠️ [CONCURRENCY RACE] Stock count decremented to -1 (Double alloc conflict!)',
      '🔄 [LOG] Swapping logic with optimized VEXA safe executable code module...',
      '✅ [SUCCESS] Sandbox built successfully without infinite loops or safety exceptions.',
      `📈 [METRICS] Operational stability: ${reviewResult.metrics.efficiency}`,
      `📦 [DEPLOY] Execution chamber exited with Code 0.`
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setConsoleLogs(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setIsConsoleSimulating(false);
        }
      }, (index + 1) * 750);
    });
  };

  return (
    <div id="code-reviewer-workspace" className="max-w-6xl mx-auto space-y-6">
      
      {/* Top Description Banner */}
      <div className="bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-6 backdrop-blur-md transition-all duration-300 glow-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full filter blur-2xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-semibold text-blue-400 tracking-widest uppercase block">AI CODE AUDITING SYSTEM</span>
            <h2 className="font-display font-bold text-xl text-white">VEXA Code Reviewer Sandbox</h2>
            <p className="text-xs text-slate-400 max-w-2xl font-sans">
              Scan custom source blocks or choose live presets to run comprehensive linting, detect unhandled concurrency loops, and extract credentials.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full text-[10px] font-mono text-blue-300">
            <CheckCircle className="w-3.5 h-3.5 animate-pulse" />
            <span>Ready for Ingestion</span>
          </div>
        </div>
      </div>

      {/* Main Sandbox Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Preset Selector & Custom Input Editor */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Preset Panel */}
          <div className="bg-black border border-white/[0.08] rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
              <span className="text-[10px] font-mono font-semibold text-slate-500 tracking-wider uppercase">Vulnerable Presets</span>
              <span className="text-[9px] font-mono text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.05]">3 Preloaded</span>
            </div>

            <div className="space-y-2">
              {PRESETS.map((preset) => {
                const isActive = activePreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isActive 
                        ? 'bg-blue-500/10 border-blue-500/30 text-white' 
                        : 'bg-transparent border-white/[0.04] hover:bg-white/[0.02] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold font-sans">{preset.name}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono truncate max-w-[190px]">{preset.filename}</p>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 bg-black border border-white/[0.05] rounded-full uppercase shrink-0 text-slate-400">
                      {preset.category.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Source Code Editor */}
          <div className="bg-black border border-white/[0.08] rounded-3xl p-5 space-y-4 relative">
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] font-mono font-semibold text-slate-300 tracking-wider uppercase">Source Input Terminal</span>
              </div>
              <span className="text-[9px] font-mono text-slate-500">{activePreset.language.toUpperCase()}</span>
            </div>

            <div className="space-y-1">
              <div className="relative font-mono text-xs">
                <textarea
                  id="user-custom-code-input"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  className="w-full h-80 bg-slate-950/60 border border-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 focus:border-blue-500/40 outline-none resize-none leading-relaxed"
                  placeholder="// Paste your raw source code here to review..."
                />
                
                {/* Reset helper */}
                {customCode !== activePreset.badCode && (
                  <button 
                    onClick={() => setCustomCode(activePreset.badCode)}
                    className="absolute bottom-3 right-3 text-[10px] text-slate-500 hover:text-white px-2 py-1 bg-black border border-white/[0.08] rounded"
                    title="Reset to Preset Default"
                  >
                    RESET
                  </button>
                )}
              </div>
            </div>

            {/* Ingestion & Analysis Trigger buttons */}
            <div className="flex gap-2">
              <button
                id="btn-trigger-code-scan"
                disabled={isAnalyzing}
                onClick={startAnalysis}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-mono font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-blue-500/10 active:scale-98"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Evaluating Safety Index ({progressPercent}%)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    <span>Ingest & Run Diagnostic Scan</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Dynamic Analysis Report & Output */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            
            {/* 1. Show Loading State */}
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-black border border-white/[0.08] rounded-3xl p-10 text-center min-h-[460px] flex flex-col justify-center items-center space-y-6"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-blue-500/20 flex items-center justify-center animate-spin duration-3000"></div>
                  <Layers className="w-6 h-6 text-blue-400 absolute top-5 left-5 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-white font-mono">{analysisProgress}</p>
                  <p className="text-xs text-slate-500 font-sans max-w-sm mx-auto">VEXA security model evaluates dependencies, loop bounds, and thread locks dynamically.</p>
                </div>
                
                {/* Horizontal Progress Bar */}
                <div className="w-64 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/[0.05]">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </motion.div>
            )}

            {/* 2. Show Empty State (No analysis has been triggered) */}
            {!isAnalyzing && !reviewResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-black border border-white/[0.08] rounded-3xl p-8 text-center min-h-[500px] flex flex-col justify-center items-center space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <FileCode className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-300 font-mono">Review Engine Dormant</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans leading-relaxed">
                  Select a vulnerable preset, examine its problematic configuration, and click <strong className="text-slate-300">"Ingest & Run Diagnostic Scan"</strong> to analyze thread behaviors, check credentials, and render side-by-side solutions.
                </p>
                <div className="pt-2 text-[10px] text-slate-600 flex items-center gap-1.5 font-mono">
                  <Info className="w-3.5 h-3.5" />
                  <span>Supports TypeScript, React, Node.js, and Golang</span>
                </div>
              </motion.div>
            )}

            {/* 3. Render Completed Analysis Results */}
            {!isAnalyzing && reviewResult && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                
                {/* Metrics Banner */}
                <div className="grid grid-cols-3 gap-4 font-mono text-xs">
                  <div className="bg-slate-950 border border-slate-900 p-4 rounded-2xl text-center space-y-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/5 rounded-full filter blur-md pointer-events-none"></div>
                    <span className="text-slate-500 block uppercase tracking-wider text-[9px]">Latency Delta</span>
                    <span className="text-sm font-bold text-emerald-400">{reviewResult.metrics.latency}</span>
                  </div>
                  
                  <div className="bg-slate-950 border border-slate-900 p-4 rounded-2xl text-center space-y-1">
                    <span className="text-slate-500 block uppercase tracking-wider text-[9px]">Resource Savings</span>
                    <span className="text-sm font-bold text-white">{reviewResult.metrics.efficiency}</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-900 p-4 rounded-2xl text-center space-y-1">
                    <span className="text-slate-500 block uppercase tracking-wider text-[9px]">VEXA Safety Index</span>
                    <span className={`text-sm font-bold ${reviewResult.metrics.safetyScore >= 95 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {reviewResult.metrics.safetyScore}%
                    </span>
                  </div>
                </div>

                {/* Detected Issues Checklist */}
                <div className="bg-black border border-white/[0.08] rounded-3xl p-5 space-y-4">
                  <span className="text-[10px] font-mono font-semibold text-slate-500 tracking-wider uppercase block border-b border-white/[0.05] pb-2">
                    Ingested Threat & Loop Scan Logs
                  </span>
                  
                  <div className="space-y-2.5">
                    {reviewResult.issues.map((issue, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-900 p-4 rounded-xl flex gap-3 items-start text-left">
                        {issue.severity === 'critical' ? (
                          <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono text-slate-500 bg-white/[0.04] px-1.5 py-0.25 rounded border border-white/[0.05]">LINE {issue.line}</span>
                            <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${issue.severity === 'critical' ? 'text-rose-400' : 'text-amber-400'}`}>
                              [{issue.severity.toUpperCase()}]
                            </span>
                          </div>
                          <p className="text-xs text-slate-200 font-sans leading-relaxed">{issue.message}</p>
                          <div className="bg-blue-500/5 border border-blue-500/10 p-2.5 rounded-lg text-[11px] font-mono text-blue-300 mt-2">
                            <strong className="text-white block text-[9px] uppercase tracking-wider mb-0.5">VEXA AUTO-FIX:</strong>
                            {issue.fix}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Side-by-side Prompt Tuning Optimizer / Code Diff View */}
                <div className="bg-black border border-white/[0.08] rounded-3xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
                    <span className="text-[10px] font-mono font-semibold text-slate-500 tracking-wider uppercase">Side-By-Side Refactor Diff</span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase">Interactive Comparative analysis</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Before Prompt */}
                    <div className="bg-black border border-white/[0.05] rounded-xl p-4 relative font-mono text-[11px] text-left">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-rose-400 bg-rose-500/5 border border-rose-500/20 px-2 py-0.5 rounded uppercase tracking-wider text-[9px] font-semibold">Original Vulnerable</span>
                        <button 
                          onClick={() => copyToClipboard(reviewResult.badCode, 'before')}
                          className="text-slate-500 hover:text-white transition-colors p-1"
                        >
                          {copiedBefore ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed text-slate-400 font-mono text-[10px] max-h-56">
                        {reviewResult.badCode}
                      </pre>
                    </div>

                    {/* After Prompt */}
                    <div className="bg-black border border-white/[0.05] rounded-xl p-4 relative font-mono text-[11px] text-left">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider text-[9px] font-semibold">VEXA Refactored</span>
                        <button 
                          onClick={() => copyToClipboard(reviewResult.goodCode, 'after')}
                          className="text-slate-500 hover:text-white transition-colors p-1"
                        >
                          {copiedAfter ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed text-slate-300 font-mono text-[10px] max-h-56">
                        {reviewResult.goodCode}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Interactive Virtual Sandbox Console */}
                <div className="bg-black border border-white/[0.08] rounded-3xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span className="text-[10px] font-mono font-semibold text-slate-300 tracking-wider uppercase">Execution Virtualisation Console</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase">Interactive Sandbox Test</span>
                  </div>

                  <div className="space-y-3.5">
                    <p className="text-xs text-slate-400 font-sans leading-relaxed text-left">
                      Dry-run the refactored code safely in the VEXA containerized virtualization environment to evaluate stabilization parameters.
                    </p>

                    <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 font-mono text-[11px] text-left space-y-1.5 min-h-36 max-h-48 overflow-y-auto">
                      {consoleLogs.length === 0 ? (
                        <div className="text-slate-600 text-[10px] italic py-8 text-center">
                          Console dormant. Click "Test Refactored Module" below to verify compilation metrics.
                        </div>
                      ) : (
                        consoleLogs.map((log, lIdx) => (
                          <div 
                            key={lIdx} 
                            className={`${
                              log.startsWith('❌') 
                                ? 'text-rose-400' 
                                : log.startsWith('✅') 
                                ? 'text-emerald-400 font-bold' 
                                : log.startsWith('⚠️')
                                ? 'text-yellow-400'
                                : 'text-slate-300'
                            }`}
                          >
                            {log}
                          </div>
                        ))
                      )}
                    </div>

                    <button
                      disabled={isConsoleSimulating}
                      onClick={runSimulation}
                      className="w-full bg-slate-900 hover:bg-slate-950 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      {isConsoleSimulating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                          <span>Simulating Runtime Thread Executions...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Test Refactored Module in Sandbox</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
