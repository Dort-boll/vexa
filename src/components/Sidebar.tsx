import React from 'react';
import { 
  Activity, LayoutDashboard, Brain, ShieldAlert, Cpu, 
  Coins, HelpCircle, Code, FileText, Settings, LogOut,
  Sparkles, FileCode, Workflow, ChevronLeft, ChevronRight, Menu, X, CheckCircle
} from 'lucide-react';
import { ActiveTab, Report } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: any;
  onLogout: () => void;
  history: Report[];
  onSelectHistoryReport: (report: Report) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  user,
  onLogout,
  history,
  onSelectHistoryReport,
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed
}: SidebarProps) {

  const menuItems = [
    { id: 'Dashboard', label: 'Workspace', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'AIDoctor', label: 'AI Doctor Diagnostic', icon: <Activity className="w-4 h-4 text-emerald-400" /> },
    { id: 'PromptOptimizer', label: 'Prompt Optimizer', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
    { id: 'ReasoningLab', label: 'Reasoning Lab', icon: <Brain className="w-4 h-4 text-fuchsia-400" /> },
    { id: 'ArchitectureViewer', label: 'Architecture Viewer', icon: <Workflow className="w-4 h-4 text-indigo-400" /> },
    { id: 'SecurityScanner', label: 'Security Scanner', icon: <ShieldAlert className="w-4 h-4 text-rose-400" /> },
    { id: 'CostAnalyzer', label: 'Cost Analyzer', icon: <Coins className="w-4 h-4 text-yellow-400" /> },
    { id: 'HallucinationDetector', label: 'Hallucination Engine', icon: <Cpu className="w-4 h-4 text-cyan-400" /> },
    { id: 'CodeReviewer', label: 'Code Reviewer', icon: <FileCode className="w-4 h-4 text-blue-400" /> },
    { id: 'Reports', label: 'Reports & Logs', icon: <FileText className="w-4 h-4" /> },
    { id: 'Settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <>
      {/* Sidebar Container - Supports smooth toggle from full width to collapsed */}
      <aside
        id="vaxa-sidebar"
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          sidebarCollapsed ? 'md:w-20' : 'md:w-64'
        } w-64 bg-black border-r border-white/[0.06] flex flex-col justify-between backdrop-blur-lg shadow-[4px_0_30px_rgba(0,0,0,0.6)]`}
      >
        <div className="flex-1 flex flex-col min-h-0">
          
          {/* Brand Header */}
          <div className={`p-5 border-b border-white/[0.05] flex items-center justify-between ${sidebarCollapsed ? 'md:justify-center' : ''}`}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(99,102,241,0.3)] shrink-0">
                <Activity className="w-4.5 h-4.5 text-white animate-pulse" />
              </div>
              
              {!sidebarCollapsed && (
                <div className="animate-fade-in">
                  <span className="font-display font-bold text-lg tracking-wider text-white">VEXA</span>
                  <span className="text-[9px] block font-mono text-indigo-400 tracking-widest leading-none uppercase">BY VAYU AGI</span>
                </div>
              )}
            </div>
            
            {/* Mobile close menu button */}
            <button 
              id="btn-sidebar-close-mobile"
              onClick={() => setSidebarOpen(false)} 
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop Collapse / Expand Arrow Button */}
            {!sidebarOpen && (
              <button
                id="btn-sidebar-toggle-desktop"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden md:flex items-center justify-center w-6 h-6 rounded-md bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-slate-400 hover:text-white transition-colors cursor-pointer absolute -right-3 top-6 z-50 shadow-md"
                title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
            {!sidebarCollapsed ? (
              <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase px-3 block mb-2 animate-fade-in">
                ENGINES & TOOLS
              </span>
            ) : (
              <div className="h-4 border-b border-white/[0.03] mb-3"></div>
            )}

            {menuItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id as ActiveTab);
                    setSidebarOpen(false); // Auto-close drawer on mobile
                  }}
                  className={`group relative w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all duration-150 cursor-pointer ${
                    sidebarCollapsed ? 'justify-center' : 'justify-between'
                  } ${
                    active 
                      ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-l-2 border-indigo-500 text-white shadow-sm' 
                      : 'text-slate-400 hover:bg-white/[0.02] hover:text-white'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3">
                    <div className={`${active ? 'scale-110' : 'group-hover:scale-105'} transition-transform shrink-0`}>
                      {item.icon}
                    </div>
                    {!sidebarCollapsed && <span className="animate-fade-in">{item.label}</span>}
                  </div>

                  {/* Active dot indicator on full expanded layout */}
                  {!sidebarCollapsed && active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
                  )}

                  {/* Mini floating hover label when collapsed */}
                  {sidebarCollapsed && (
                    <div className="absolute left-16 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 pointer-events-none transition-all duration-150 bg-black border border-white/[0.08] text-white text-[10px] font-mono px-2.5 py-1.5 rounded-md whitespace-nowrap z-50 shadow-xl">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}

            {/* Quick Diagnostic History List */}
            {history.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/[0.05]">
                {!sidebarCollapsed ? (
                  <>
                    <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase px-3 block mb-3 animate-fade-in">
                      DIAGNOSTIC ARCHIVE
                    </span>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {history.map((rep) => (
                        <button
                          key={rep.id}
                          id={`history-item-${rep.id}`}
                          onClick={() => {
                            onSelectHistoryReport(rep);
                            setSidebarOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/[0.02] transition-colors flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          <span className="truncate max-w-[130px]">{rep.title}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className={`w-1.5 h-1.5 rounded-full ${rep.score > 70 ? 'bg-emerald-500 animate-pulse' : (rep.score > 45 ? 'bg-amber-500' : 'bg-rose-500')}`}></span>
                            <span className="font-mono text-[10px] text-slate-500">{rep.score}%</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex justify-center" title="Audit Logs">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40 animate-ping"></div>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>

        {/* User Info & Sign Out Footer */}
        <div className="p-4 border-t border-white/[0.05] bg-white/[0.01]">
          <div className={`flex items-center justify-between ${sidebarCollapsed ? 'flex-col gap-4' : 'flex-row'}`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <img 
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=40&q=40'} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-white/[0.08]"
              />
              {!sidebarCollapsed && (
                <div className="min-w-0 animate-fade-in">
                  <p className="text-xs font-semibold text-slate-200 truncate leading-none mb-1">{user.username}</p>
                  <div className="flex items-center gap-1">
                    <span className={`w-1 h-1 rounded-full ${user.isSandbox ? 'bg-yellow-400' : 'bg-emerald-400 animate-pulse'}`}></span>
                    <span className="text-[9px] font-mono text-slate-500 truncate">
                      {user.isSandbox ? 'Sandbox' : 'Vayu Sync'}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <button
              id="btn-user-logout"
              onClick={onLogout}
              title="Sign Out"
              className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-white/[0.03] border border-transparent hover:border-white/[0.05] transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar background dim overlay for mobile */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 z-30 bg-black/80 backdrop-blur-md"
        ></div>
      )}
    </>
  );
}
