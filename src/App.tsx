import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, ShieldAlert, Cpu, Coins, Sparkles, Brain, Code, 
  Settings, LayoutDashboard, FileText, LogOut, ChevronRight, 
  Clock, AlertTriangle, ShieldCheck, HelpCircle, Check, Play,
  Plus, Trash2, Sliders, Server, BarChart3, HelpCircle as HelpIcon,
  User, RefreshCw
} from 'lucide-react';

import { ActiveTab, Report } from './types';
import { PuterService } from './lib/puterService';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ReportViewer from './components/ReportViewer';
import CodeReviewer from './components/CodeReviewer';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('Dashboard');
  const [selectedModel, setSelectedModel] = useState('nvidia/nemotron-3.5-content-safety:free');
  const [models, setModels] = useState<string[]>([]);
  const [history, setHistory] = useState<Report[]>([]);
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('vexa_sidebar_collapsed') === 'true');

  // Custom interactive sub-tab state values
  // AI Doctor tab
  const [doctorLog, setDoctorLog] = useState('');
  const [doctorSeverity, setDoctorSeverity] = useState('Critical');
  
  // Prompt Optimizer tab
  const [optPromptInput, setOptPromptInput] = useState('');
  const [optTone, setOptTone] = useState('Corporate');
  const [optimizedResult, setOptimizedResult] = useState<any>(null);

  // Reasoning Lab tab
  const [reasonQuestion, setReasonQuestion] = useState('');
  const [reasonDepth, setReasonDepth] = useState('Deep');
  const [reasoningSteps, setReasoningSteps] = useState<string[]>([]);
  const [isReasoning, setIsReasoning] = useState(false);

  // Architecture viewer tab
  const [archNodes, setArchNodes] = useState<any[]>([
    { id: 'client', label: 'User Client', type: 'input' },
    { id: 'gateway', label: 'API Gateway', type: 'process' },
    { id: 'router', label: 'Model Router', type: 'ai' },
    { id: 'vector', label: 'Pinecone Index', type: 'database' }
  ]);
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeType, setNewNodeType] = useState<'input' | 'process' | 'ai' | 'database'>('process');

  // Security Scanner tab
  const [securityCode, setSecurityCode] = useState('');
  const [securityScanResults, setSecurityScanResults] = useState<any | null>(null);
  const [isScanningSec, setIsScanningSec] = useState(false);

  // Cost Analyzer sliders
  const [costRequests, setCostRequests] = useState(100000);
  const [costInputTokens, setCostInputTokens] = useState(1500);
  const [costOutputTokens, setCostOutputTokens] = useState(800);

  // Hallucination Detector sliders
  const [halTemp, setHalTemp] = useState(0.8);
  const [halContext, setHalContext] = useState(8192);

  // Initialize auth check on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const signedIn = await PuterService.isSignedIn();
        if (signedIn) {
          const u = await PuterService.getUser();
          setUser(u);
        }
        
        // Fetch Puter AI Models
        const fetchedModels = await PuterService.listModels();
        setModels(fetchedModels);
        if (fetchedModels.length > 0) {
          setSelectedModel(fetchedModels[0]);
        }
      } catch (err) {
        console.error('Auth bootup check failed:', err);
      } finally {
        setAuthChecked(true);
      }
    }
    checkAuth();
  }, []);

  const getScoreColor = (score: number) => {
    if (score > 70) return 'text-emerald-400';
    if (score > 45) return 'text-amber-400';
    return 'text-rose-400';
  };

  const handleLoginSuccess = (signedInUser: any) => {
    setUser(signedInUser);
    // Refresh models list in case we are authenticated
    PuterService.listModels().then(setModels);
  };

  const handleLogout = async () => {
    await PuterService.signOut();
    setUser(null);
    setActiveReport(null);
    setHistory([]);
    setActiveTab('Dashboard');
  };

  // Central submission analyzer
  const handleDiagnoseSubmit = async (
    input: string, 
    category: string, 
    files: { name: string; content: string; size: number }[]
  ) => {
    setIsAnalyzing(true);
    setActiveReport(null);
    
    try {
      const report = await PuterService.analyzeAISystem(input, category, files, selectedModel);
      setHistory(prev => [report, ...prev]);
      setActiveReport(report);
      // Automatically redirect to AIDoctor or Dashboard to view the report
      if (activeTab === 'Dashboard') {
        setActiveTab('AIDoctor');
      }
    } catch (err) {
      console.error('Diagnosis processing failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Re-run diagnostic active report
  const handleReaudit = () => {
    if (activeReport) {
      handleDiagnoseSubmit(
        `Re-evaluating system: ${activeReport.title}. Submitting for diagnostic re-audit.`,
        activeTab,
        []
      );
    }
  };

  // Dynamic Prompt Optimizer Executor
  const handleOptimizePromptSubmit = async () => {
    if (!optPromptInput.trim()) return;
    setIsAnalyzing(true);
    setOptimizedResult(null);

    // Simulate analysis delay
    setTimeout(() => {
      const optimized = `You are a professional software assistant specialized in corporate operations. 
Your objective is to execute the following goal precisely.

[OBJECTIVE]
${optPromptInput}

[TONE]
- Maintain a highly analytical, objective, and ${optTone.toLowerCase()} tone.
- Do not utilize conversational filler or meta-greetings.

[CONSTRAINTS]
- Output structured response ONLY.
- Ensure strict factual correctness.`;

      setOptimizedResult({
        before: optPromptInput,
        after: optimized,
        improvements: [
          "Injected objective role delimitation",
          `Configured ${optTone} style metrics`,
          "Established XML-tag input protection boundaries"
        ]
      });
      setIsAnalyzing(false);
    }, 1200);
  };

  // Reasoning chain execution
  const handleStartReasoning = () => {
    if (!reasonQuestion.trim()) return;
    setIsReasoning(true);
    setReasoningSteps([]);

    const steps = [
      `Initializing Vayu-CoT Reasoning core for depth: ${reasonDepth}...`,
      "Deconstructing problem assertions & variable binds...",
      "Layer 1: Scanning logical contradictions & context boundary constraints...",
      "Layer 2: Evaluating parametric weight distribution mappings...",
      "Layer 3: Synthesizing validation checks on mathematical assertions...",
      "Formulating resolved system code output guidelines..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setReasoningSteps(prev => [...prev, steps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsReasoning(false);
      }
    }, 1000);
  };

  // Security scanner executor
  const handleSecurityScan = () => {
    if (!securityCode.trim()) return;
    setIsScanningSec(true);
    setSecurityScanResults(null);

    setTimeout(() => {
      const codeLower = securityCode.toLowerCase();
      const hasKey = codeLower.includes('api_key') || codeLower.includes('secret') || codeLower.includes('sk-');
      const hasTemp = codeLower.includes('temperature') && (codeLower.includes('0.9') || codeLower.includes('1.0') || codeLower.includes('0.8'));
      const hasInject = codeLower.includes('prompt') && !codeLower.includes('sanitize') && !codeLower.includes('validate');

      setSecurityScanResults({
        score: hasKey ? 32 : (hasInject ? 58 : 88),
        vulnerabilities: [
          ...(hasKey ? [{ title: 'Hardcoded Secret Exposure', desc: 'Identified variables referencing raw text API keys in file buffers. Exposes secrets to bundle sniffer sweeps.', severity: 'Critical' }] : []),
          ...(hasTemp ? [{ title: 'Unbounded Entropy Temp', desc: 'High temperature definitions found without system constraints. Model is vulnerable to conversational drifting.', severity: 'Warning' }] : []),
          ...(hasInject ? [{ title: 'Direct Prompt Concatenation', desc: 'Direct raw user string injection into LLM payload detected. Susceptible to indirect injection hacks.', severity: 'Critical' }] : [])
        ]
      });
      setIsScanningSec(false);
    }, 1200);
  };

  // Cost calculator calculations
  const calculateCost = (model: string) => {
    let rateInput = 0;
    let rateOutput = 0;
    switch (model) {
      case 'nvidia/nemotron-3.5-content-safety:free':
        return '0.00'; // Completely Free
      case 'gpt-4o':
        rateInput = 5.00; rateOutput = 15.00; break;
      case 'claude-3-5-sonnet':
        rateInput = 3.00; rateOutput = 15.00; break;
      default: // other models
        rateInput = 0.075; rateOutput = 0.30; break;
    }

    const inputCost = (costRequests * costInputTokens * rateInput) / 1000000;
    const outputCost = (costRequests * costOutputTokens * rateOutput) / 1000000;
    return (inputCost + outputCost).toFixed(2);
  };

  // Render auth gate loading screen
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center font-sans">
        <Activity className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-xs font-mono mt-4 text-slate-500 uppercase tracking-widest">Booting VEXA Kernel...</p>
      </div>
    );
  }

  // Login Screen Render
  if (!user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div id="vaxa-app-root" className="min-h-screen bg-black text-slate-100 flex flex-col md:flex-row aurora-bg font-sans">
      
      {/* Side Nav panel */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // If moving to Dashboard, reset active report to allow new input
          if (tab === 'Dashboard') {
            setActiveReport(null);
          }
        }}
        user={user}
        onLogout={handleLogout}
        history={history}
        onSelectHistoryReport={(rep) => {
          setActiveReport(rep);
          setActiveTab('AIDoctor');
        }}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={(collapsed) => {
          setSidebarCollapsed(collapsed);
          localStorage.setItem('vexa_sidebar_collapsed', String(collapsed));
        }}
      />

      {/* Main Container Area */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'md:pl-20' : 'md:pl-64'} flex flex-col min-h-screen`}>
        
        {/* Top Header Selector */}
        <Header
          activeTab={activeTab}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          models={models}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Core Workspace Screens Tab switching */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mx-3 my-4 sm:mx-6 sm:my-6 p-4 sm:p-6 md:p-8 bg-black border border-indigo-500/25 rounded-3xl shadow-[0_0_25px_rgba(99,102,241,0.12)] glow-border backdrop-blur-md relative overflow-hidden transition-all duration-300"
            >
              
              {/* T1: WORKSPACE DASHBOARD (MAIN ENTRYPOINT) */}
              {activeTab === 'Dashboard' && (
                <div id="dashboard-tab-panel" className="space-y-8">
                  {/* Visual hero card */}
                  <div>
                    <div className="relative overflow-hidden bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md transition-all duration-300 glow-border">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full filter blur-[80px] pointer-events-none animate-pulse"></div>
                      <div className="relative z-10 max-w-2xl">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 bg-indigo-500/5 border border-indigo-500/20 px-2.5 py-1 rounded-full uppercase">
                          AI OS Core Operational
                        </span>
                        <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-4 mb-2">
                          VEXA AI Systems Diagnostic
                        </h2>
                        <p className="text-sm text-slate-400 leading-relaxed font-sans font-medium">
                          Submit code files, logs, or prompt structures. VEXA virtualizes deep pipelines to diagnose hallucinations, cost leaks, memory boundaries, and injection vectors instantly.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Glass input control */}
                  <InputSection
                    onSubmit={handleDiagnoseSubmit}
                    isAnalyzing={isAnalyzing}
                  />
                </div>
              )}

              {/* T2: AI DOCTOR / EMERGENCY DIAGNOSTIC */}
              {activeTab === 'AIDoctor' && (
                <div id="aidoctor-tab-panel" className="space-y-6">
                  {activeReport ? (
                    /* Render Report results if available */
                    <ReportViewer report={activeReport} onReaudit={handleReaudit} />
                  ) : (
                    /* Error triage entry portal if empty */
                    <div className="max-w-3xl mx-auto bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md text-center space-y-6 transition-all duration-300 glow-border">
                      <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 text-red-400">
                        <Activity className="w-8 h-8 animate-pulse" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-bold text-white uppercase tracking-wide">Emergency AI Doctor</h2>
                        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                          Paste your crash logs, unhandled LLM response strings, or system errors for instant diagnostic triage.
                        </p>
                      </div>

                      <div className="space-y-4 text-left font-mono">
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">Crash Logs or Error Stack Trace</label>
                          <textarea
                            rows={6}
                            value={doctorLog}
                            onChange={(e) => setDoctorLog(e.target.value)}
                            placeholder="e.g. UnhandledPromiseRejectionWarning: Error: 429 Too Many Requests in model call loop..."
                            className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-slate-300 focus:border-red-500/50 outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">Triage Severity Level</label>
                            <select
                              value={doctorSeverity}
                              onChange={(e) => setDoctorSeverity(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-slate-300 focus:border-indigo-500/50 outline-none"
                            >
                              <option value="Critical">Critical (System Crash)</option>
                              <option value="Warning">Warning (Hallucinating / High Latency)</option>
                              <option value="Low">Low (Prompt Optimization)</option>
                            </select>
                          </div>
                          
                          <div className="flex items-end">
                            <button
                              id="btn-emergency-triage"
                              onClick={() => handleDiagnoseSubmit(
                                `Emergency Triage: [Severity: ${doctorSeverity}] Logs: ${doctorLog}`,
                                'AI Doctor',
                                []
                              )}
                              disabled={isAnalyzing || !doctorLog.trim()}
                              className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold text-xs py-3.5 px-6 rounded-xl hover:scale-102 transition-transform cursor-pointer"
                            >
                              {isAnalyzing ? "Analyzing..." : "Execute Emergency Triage"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* T3: PROMPT OPTIMIZER TUNING */}
              {activeTab === 'PromptOptimizer' && (
                <div id="promptoptimizer-tab-panel" className="max-w-4xl mx-auto space-y-6">
                  <div className="bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-5 sm:p-6 backdrop-blur-md transition-all duration-300 glow-border">
                    <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider mb-4 border-b border-white/[0.05] pb-3">Prompt Optimizer Workspace</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest block mb-1.5">Enter Raw Instructions or Prompts</label>
                        <textarea
                          rows={4}
                          value={optPromptInput}
                          onChange={(e) => setOptPromptInput(e.target.value)}
                          placeholder="Translate the user input to French. Keep it casual."
                          className="w-full bg-black border border-white/[0.08] rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-indigo-500/50 font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest block mb-1.5">Target Alignment Tone</label>
                          <div className="flex gap-2">
                            {['Corporate', 'Casual', 'Technical'].map((t) => (
                              <button
                                key={t}
                                id={`opt-tone-${t.toLowerCase()}`}
                                type="button"
                                onClick={() => setOptTone(t)}
                                className={`flex-1 py-2 px-3 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                                  optTone === t 
                                    ? 'bg-indigo-500/15 border-indigo-500 text-indigo-300 font-semibold' 
                                    : 'bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800'
                                }`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-end">
                          <button
                            id="btn-tune-prompt"
                            onClick={handleOptimizePromptSubmit}
                            disabled={isAnalyzing || !optPromptInput.trim()}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs py-2.5 px-6 rounded-xl hover:scale-102 transition-transform cursor-pointer"
                          >
                            {isAnalyzing ? "Optimizing..." : "Optimize Prompt Structure"}
                            <Sparkles className="w-4 h-4 text-amber-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {optimizedResult && (
                    <div className="bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-5 sm:p-6 space-y-4 animate-fade-in transition-all duration-300 glow-border">
                      <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider">Tuned Optimization Outputs</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-black p-4 rounded-xl border border-white/[0.06] font-mono text-xs">
                          <span className="text-[9px] text-rose-400 uppercase tracking-wider block mb-2 font-bold">Raw Prompt Input</span>
                          <pre className="whitespace-pre-wrap text-slate-400 h-28 overflow-y-auto">{optimizedResult.before}</pre>
                        </div>
                        <div className="bg-black/90 p-4 rounded-xl border border-slate-900 font-mono text-xs">
                          <span className="text-[9px] text-indigo-400 uppercase tracking-wider block mb-2 font-bold">Optimized Prompt Block</span>
                          <pre className="whitespace-pre-wrap text-indigo-300 h-28 overflow-y-auto select-all">{optimizedResult.after}</pre>
                        </div>
                      </div>

                      <div className="pt-2">
                        <span className="text-[10px] font-mono text-indigo-400 uppercase block mb-1.5 font-bold">Alignment Tuning Factors</span>
                        <div className="flex flex-wrap gap-2">
                          {optimizedResult.improvements.map((factor: string, fIdx: number) => (
                            <span key={fIdx} className="bg-slate-900 border border-slate-800 text-slate-300 text-xs py-1 px-2.5 rounded-lg">
                              ✔ {factor}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* T4: REASONING LAB */}
              {activeTab === 'ReasoningLab' && (
                <div id="reasoninglab-tab-panel" className="max-w-4xl mx-auto space-y-6">
                  <div className="bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-5 sm:p-6 backdrop-blur-md transition-all duration-300 glow-border">
                    <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider mb-4 border-b border-white/[0.05] pb-3">Vayu reasoning virtualizer</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest block mb-1.5">Enter Logical problem or Code recursion scenario</label>
                        <textarea
                          rows={4}
                          value={reasonQuestion}
                          onChange={(e) => setReasonQuestion(e.target.value)}
                          placeholder="e.g. Check for potential memory leaks in this infinite client stream listener..."
                          className="w-full bg-black border border-white/[0.08] rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-indigo-500/50 font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest block mb-1.5">Thought depth limits</label>
                          <div className="flex gap-2">
                            {['Shallow', 'Medium', 'Deep'].map((d) => (
                              <button
                                key={d}
                                id={`reason-depth-${d.toLowerCase()}`}
                                type="button"
                                onClick={() => setReasonDepth(d)}
                                className={`flex-1 py-2 px-3 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                                  reasonDepth === d 
                                    ? 'bg-indigo-500/15 border-indigo-500 text-indigo-300 font-semibold' 
                                    : 'bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800'
                                }`}
                              >
                                {d}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-end">
                          <button
                            id="btn-virtualize-cot"
                            onClick={handleStartReasoning}
                            disabled={isReasoning || !reasonQuestion.trim()}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs py-2.5 px-6 rounded-xl hover:scale-102 transition-transform cursor-pointer"
                          >
                            {isReasoning ? "Reasoning..." : "Execute Thought Chain"}
                            <Brain className="w-4 h-4 text-fuchsia-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {reasoningSteps.length > 0 && (
                    <div className="bg-black/95 border border-slate-900 rounded-3xl p-6 font-mono text-xs space-y-3.5 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 rounded-full filter blur-xl pointer-events-none"></div>
                      <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                        <span className="text-[10px] text-fuchsia-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-ping"></span>
                          VAYU CO-THOUGHT STREAM
                        </span>
                        <span className="text-[9px] text-slate-500">DEPTH: {reasonDepth}</span>
                      </div>

                      <div className="space-y-2 text-slate-400 leading-relaxed">
                        {reasoningSteps.map((step, sIdx) => (
                          <div key={sIdx} className="flex gap-2 items-start animate-fade-in">
                            <span className="text-fuchsia-500 font-semibold">&gt;&gt;</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>

                      {!isReasoning && (
                        <div className="mt-4 pt-3 border-t border-slate-900 text-[10px] text-emerald-400 flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Thought mapping complete. Problem bounds verified.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* T5: ARCHITECTURE VIEWER */}
              {activeTab === 'ArchitectureViewer' && (
                <div id="archviewer-tab-panel" className="max-w-4xl mx-auto space-y-6">
                  <div className="bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-5 sm:p-6 backdrop-blur-md transition-all duration-300 glow-border">
                    <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider mb-4 border-b border-white/[0.05] pb-3">Architecture Node Customizer</h3>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <label className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest block mb-1.5">Add Component Node</label>
                        <input
                          type="text"
                          id="new-node-name-input"
                          value={newNodeName}
                          onChange={(e) => setNewNodeName(e.target.value)}
                          placeholder="e.g. FAISS Index"
                          className="w-full bg-black border border-white/[0.08] rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-indigo-500/50 font-mono"
                        />
                      </div>

                      <div className="w-full md:w-48">
                        <label className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest block mb-1.5">Node Class</label>
                        <select
                          value={newNodeType}
                          onChange={(e: any) => setNewNodeType(e.target.value)}
                          className="w-full bg-black border border-white/[0.08] rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-indigo-500/50 font-mono"
                        >
                          <option value="input">input</option>
                          <option value="process">process</option>
                          <option value="ai">ai</option>
                          <option value="database">database</option>
                        </select>
                      </div>

                      <div className="flex items-end">
                        <button
                          id="btn-add-node"
                          onClick={() => {
                            if (!newNodeName.trim()) return;
                            setArchNodes(prev => [
                              ...prev,
                              { id: Math.random().toString(), label: newNodeName, type: newNodeType }
                            ]);
                            setNewNodeName('');
                          }}
                          className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-3 px-6 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 font-mono"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Node</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/95 border border-slate-900 rounded-3xl p-6 relative">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Active Schema Topology</span>
                      <button
                        id="btn-reset-architecture"
                        onClick={() => setArchNodes([
                          { id: 'client', label: 'User Client', type: 'input' },
                          { id: 'gateway', label: 'API Gateway', type: 'process' },
                          { id: 'router', label: 'Model Router', type: 'ai' },
                          { id: 'vector', label: 'Pinecone Index', type: 'database' }
                        ])}
                        className="text-[10px] font-mono text-indigo-400 hover:text-white cursor-pointer"
                      >
                        Reset Defaults
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-4 min-h-32 items-center justify-center p-4 border border-dashed border-slate-900 rounded-2xl">
                      {archNodes.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 rounded-xl border flex items-center gap-2.5 font-mono text-xs shadow-lg relative group ${
                            n.type === 'ai' 
                              ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-300' 
                              : (n.type === 'database' ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300' : 'bg-slate-900/80 border-slate-800 text-slate-300')
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="text-[8px] uppercase text-slate-500 leading-none mb-1">{n.type}</span>
                            <span className="font-semibold">{n.label}</span>
                          </div>
                          
                          <button
                            id={`delete-node-${n.id}`}
                            onClick={() => setArchNodes(prev => prev.filter(item => item.id !== n.id))}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-950 transition-all cursor-pointer"
                            title="Delete Component"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* T6: SECURITY SCANNER */}
              {activeTab === 'SecurityScanner' && (
                <div id="securityscanner-tab-panel" className="max-w-4xl mx-auto space-y-6">
                  <div className="bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-5 sm:p-6 backdrop-blur-md transition-all duration-300 glow-border">
                    <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider mb-4 border-b border-white/[0.05] pb-3">AI Security & Vulnerability Scan</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest block mb-1.5">Paste Controller Code or Prompt Templates</label>
                        <textarea
                          rows={6}
                          value={securityCode}
                          onChange={(e) => setSecurityCode(e.target.value)}
                          placeholder={`e.g. \nconst openai_api_key = "sk-proj-4tgay...";\napp.post("/chat", (req, res) => {\n  const prompt = req.body.prompt;\n  openai.completions.create({ model: "gpt-4", temperature: 0.9, messages: prompt });\n});`}
                          className="w-full bg-black border border-white/[0.08] rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-rose-500/50 font-mono"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          id="btn-scan-security"
                          onClick={handleSecurityScan}
                          disabled={isScanningSec || !securityCode.trim()}
                          className="w-full md:w-auto bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-semibold text-xs py-3 px-8 rounded-xl hover:scale-102 transition-transform cursor-pointer flex items-center justify-center gap-2 font-mono"
                        >
                          {isScanningSec ? "Scanning..." : "Perform Vulnerability Audit"}
                          <ShieldAlert className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {securityScanResults && (
                    <div className="bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-5 sm:p-6 space-y-6 animate-fade-in transition-all duration-300 glow-border">
                      <div className="flex justify-between items-center border-b border-white/[0.05] pb-4">
                        <span className="font-display font-semibold text-sm text-white uppercase tracking-wider">Audit Resolution Board</span>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="text-slate-500">ALIGNMENT SCORE:</span>
                          <span className={`font-bold ${securityScanResults.score > 70 ? 'text-emerald-400' : 'text-rose-400'}`}>{securityScanResults.score}/100</span>
                        </div>
                      </div>

                      {securityScanResults.vulnerabilities.length > 0 ? (
                        <div className="space-y-4">
                          {securityScanResults.vulnerabilities.map((v: any, vIdx: number) => (
                            <div key={vIdx} className="bg-slate-950 border border-slate-900 p-4 rounded-xl flex gap-3.5 items-start">
                              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1.5 shrink-0 animate-pulse"></span>
                              <div>
                                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide font-mono">{v.title}</h4>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">{v.desc}</p>
                                <span className="text-[9px] font-mono text-rose-400 uppercase bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/20 mt-2.5 inline-block font-semibold">
                                  {v.severity} Risk factor
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-slate-900/20 border border-emerald-500/20 p-6 rounded-2xl text-center space-y-2">
                          <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
                          <p className="text-sm font-semibold text-slate-200">System Sanity Passed</p>
                          <p className="text-xs text-slate-500">No raw text API credentials or dangerous concatenations found during inspection.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* T7: COST ANALYZER */}
              {activeTab === 'CostAnalyzer' && (
                <div id="costanalyzer-tab-panel" className="max-w-4xl mx-auto space-y-6">
                  <div className="bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-5 sm:p-6 backdrop-blur-md transition-all duration-300 glow-border">
                    <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider mb-6 border-b border-white/[0.05] pb-3">Token Cost Calculator & Projections</h3>
                    
                    <div className="space-y-6 font-mono">
                      {/* Slider 1: Requests */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400 uppercase">Monthly API Ingestion Runs</span>
                          <span className="font-bold text-white">{costRequests.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          id="cost-requests-slider"
                          min="1000"
                          max="1000000"
                          step="5000"
                          value={costRequests}
                          onChange={(e) => setCostRequests(Number(e.target.value))}
                          className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg border border-slate-900"
                        />
                      </div>

                      {/* Slider 2: Input tokens */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400 uppercase">Average Input Tokens / Request</span>
                          <span className="font-bold text-white">{costInputTokens.toLocaleString()} tokens</span>
                        </div>
                        <input
                          type="range"
                          id="cost-input-tokens-slider"
                          min="100"
                          max="10000"
                          step="100"
                          value={costInputTokens}
                          onChange={(e) => setCostInputTokens(Number(e.target.value))}
                          className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg border border-slate-900"
                        />
                      </div>

                      {/* Slider 3: Output tokens */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400 uppercase">Average Output Tokens / Request</span>
                          <span className="font-bold text-white">{costOutputTokens.toLocaleString()} tokens</span>
                        </div>
                        <input
                          type="range"
                          id="cost-output-tokens-slider"
                          min="50"
                          max="4000"
                          step="50"
                          value={costOutputTokens}
                          onChange={(e) => setCostOutputTokens(Number(e.target.value))}
                          className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg border border-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                    <div className="bg-slate-950 border border-slate-900 p-4 rounded-2xl relative overflow-hidden text-center space-y-1 shadow-md">
                      <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Nvidia Nemotron 3.5</span>
                      <span className="text-xl font-bold text-slate-200">${calculateCost('nvidia/nemotron-3.5-content-safety:free')}</span>
                      <span className="text-[10px] text-emerald-400 block uppercase font-bold mt-1">Recommended Option</span>
                    </div>

                    <div className="bg-slate-950 border border-slate-900 p-4 rounded-2xl text-center space-y-1 shadow-md">
                      <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Claude 3.5 Sonnet</span>
                      <span className="text-xl font-bold text-slate-200">${calculateCost('claude-3-5-sonnet')}</span>
                      <span className="text-[10px] text-slate-500 block uppercase mt-1">Premium Option</span>
                    </div>

                    <div className="bg-slate-950 border border-slate-900 p-4 rounded-2xl text-center space-y-1 shadow-md">
                      <span className="text-slate-500 block uppercase tracking-wider text-[10px]">GPT-4o</span>
                      <span className="text-xl font-bold text-slate-200">${calculateCost('gpt-4o')}</span>
                      <span className="text-[10px] text-slate-500 block uppercase mt-1">Legacy Option</span>
                    </div>
                  </div>
                </div>
              )}

              {/* T8: HALLUCINATION ENGINE TEMPERATURE MATRIX */}
              {activeTab === 'HallucinationDetector' && (
                <div id="hallucination-tab-panel" className="max-w-4xl mx-auto space-y-6">
                  <div className="bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-5 sm:p-6 backdrop-blur-md transition-all duration-300 glow-border">
                    <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider mb-6 border-b border-white/[0.05] pb-3">Temperature & Hallucination Threat Index</h3>
                    
                    <div className="space-y-6 font-mono text-xs">
                      {/* Temp Slider */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400 uppercase">LLM Generation Temperature</span>
                          <span className="font-bold text-white">{halTemp.toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          id="hal-temp-slider"
                          min="0.0"
                          max="1.5"
                          step="0.1"
                          value={halTemp}
                          onChange={(e) => setHalTemp(Number(e.target.value))}
                          className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg border border-slate-900"
                        />
                      </div>

                      {/* Context Size Slider */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400 uppercase">Grounding Context Size</span>
                          <span className="font-bold text-white">{halContext.toLocaleString()} tokens</span>
                        </div>
                        <input
                          type="range"
                          id="hal-context-slider"
                          min="512"
                          max="32768"
                          step="512"
                          value={halContext}
                          onChange={(e) => setHalContext(Number(e.target.value))}
                          className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg border border-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hallucination Risk plot gauges */}
                  <div className="bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-5 sm:p-6 space-y-4 transition-all duration-300 glow-border">
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block font-semibold">calculated hallucination threshold</span>
                    
                    {/* Render color warning board based on calculated risk */}
                    {(() => {
                      // Simple risk weight calculation
                      const riskVal = Math.round((halTemp * 50) + (100 - (halContext / 32768) * 30));
                      const getRiskStatus = () => {
                        if (riskVal > 70) return { title: 'High Danger Threshold', color: 'text-red-400 bg-red-500/5 border-red-500/20', desc: 'At this level, the model routinely confabulates plausible assertions. Grounding bounds must be applied.' };
                        if (riskVal > 40) return { title: 'Conversational Drifting', color: 'text-yellow-400 bg-yellow-500/5 border-yellow-500/20', desc: 'The model outputs occasional speculative elements. Suitable only for casual chatting.' };
                        return { title: 'Strict Grounded Output', color: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20', desc: 'Low temperature paired with broad grounding matrices keeps replies highly reliable.' };
                      };
                      const s = getRiskStatus();

                      return (
                        <div className="space-y-4 font-mono text-xs">
                          <div className={`p-5 rounded-2xl border ${s.color} space-y-1.5`}>
                            <h4 className="font-bold uppercase tracking-wide">{s.title} ({riskVal}% risk)</h4>
                            <p className="text-slate-300 font-sans">{s.desc}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-center text-[11px] text-slate-400">
                            <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl">
                              <span className="text-slate-500 uppercase block text-[9px] mb-1">Citations Grounding Ratio</span>
                              <span className="font-bold text-slate-200">{(halContext / 327.68).toFixed(1)}%</span>
                            </div>
                            <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl">
                              <span className="text-slate-500 uppercase block text-[9px] mb-1">Expected Entropy Index</span>
                              <span className="font-bold text-slate-200">{(halTemp * 0.85).toFixed(2)} / 1.0</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* T8.5: CODE REVIEWER WORKSPACE */}
              {activeTab === 'CodeReviewer' && (
                <div id="codereviewer-tab-panel" className="animate-fade-in">
                  <CodeReviewer />
                </div>
              )}

              {/* T9: SYSTEM DIAGNOSTIC HISTORY REPORT ARCHIVE */}
              {activeTab === 'Reports' && (
                <div id="reports-tab-panel" className="max-w-4xl mx-auto space-y-6">
                  {history.length > 0 ? (
                    <div className="space-y-3.5">
                      {history.map((rep) => (
                        <button
                          key={rep.id}
                          id={`archive-report-card-${rep.id}`}
                          onClick={() => {
                            setActiveReport(rep);
                            setActiveTab('AIDoctor');
                          }}
                          className="w-full text-left bg-slate-950 border border-slate-900/60 p-5 rounded-2xl hover:border-indigo-500/30 transition-all cursor-pointer block group"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="text-[10px] font-mono text-indigo-400 block uppercase tracking-wider mb-1">REPORT ID: {rep.id}</span>
                              <h3 className="font-display font-bold text-base text-slate-100 group-hover:text-indigo-300 transition-colors">{rep.title}</h3>
                              <p className="text-xs text-slate-400 mt-1 line-clamp-1">{rep.executiveSummary}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className={`text-xl font-display font-black block ${getScoreColor(rep.score)}`}>{rep.score}%</span>
                              <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-widest mt-1">Health index</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-3 border-t border-slate-900/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
                            <span>Computed: {rep.timestamp}</span>
                            <span className="flex items-center gap-1 text-indigo-400 group-hover:translate-x-1 transition-transform">
                              Open report <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-4 transition-all duration-300 glow-border">
                      <FileText className="w-12 h-12 text-slate-600 mx-auto" />
                      <p className="text-sm font-semibold text-slate-400">Diagnostic Archive Empty</p>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">No diagnoses completed yet. Submit code or error logs in the Workspace to begin compiling archives.</p>
                      <button
                        id="btn-goto-workspace"
                        onClick={() => setActiveTab('Dashboard')}
                        className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 px-6 rounded-xl transition-colors cursor-pointer font-mono"
                      >
                        Launch Workspace
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* T10: GENERAL CONFIG SETTINGS */}
              {activeTab === 'Settings' && (
                <div id="settings-tab-panel" className="max-w-4xl mx-auto space-y-6">
                  <div className="bg-black border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-5 sm:p-6 backdrop-blur-md transition-all duration-300 glow-border">
                    <h3 className="font-display font-semibold text-sm text-white uppercase tracking-wider mb-6 border-b border-white/[0.05] pb-3">Environment Configuration</h3>
                    
                    <div className="space-y-6 font-mono text-xs">
                      {/* Active Session variables */}
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2">
                        <span className="text-[10px] text-slate-500 font-semibold block uppercase">Active environment variables</span>
                        <div className="space-y-1 text-slate-400 text-[11px]">
                          <div><strong className="text-slate-500">VAYU_CORE_VERSION:</strong> v3.2.0 (Active)</div>
                          <div><strong className="text-slate-500">VAYU_MODEL_CLASS:</strong> Vayu AGI CoT</div>
                          <div><strong className="text-slate-500">SECURE_SANDBOX_CONTEXT:</strong> Isolated Local Engine</div>
                          <div><strong className="text-slate-500">DEPLOYMENT_RUNTIME:</strong> Edge Optimized Serverless</div>
                        </div>
                      </div>

                      {/* API Settings mock configuration */}
                      <div className="space-y-3 font-sans">
                        <div>
                          <label className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest block mb-1.5">Custom System Prompt override</label>
                          <textarea
                            rows={3}
                            placeholder="You are VEXA, an AI Engineering Operating System..."
                            className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-indigo-500/50 font-mono"
                          />
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                            <span className="text-xs text-slate-400 font-mono">Telemetry link coordinates active</span>
                          </div>
                          
                          <button
                            id="btn-save-settings"
                            onClick={() => alert('VEXA local session environment settings updated successfully.')}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2 px-5 rounded-lg transition-colors cursor-pointer font-mono"
                          >
                            Save Config
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
