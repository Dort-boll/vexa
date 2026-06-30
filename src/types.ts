export interface SecurityIssue {
  title: string;
  desc: string;
  severity: 'Critical' | 'Warning' | 'Low';
}

export interface ModelRecommendation {
  modelName: string;
  suitability: string;
  pricing: string;
  latency: string;
}

export interface FixStep {
  step: string;
  completed: boolean;
}

export interface Report {
  id: string;
  title: string;
  timestamp: string;
  score: number;
  executiveSummary: string;
  problemSeverity: {
    technical: number;
    security: number;
    cost: number;
    hallucination: number;
    architecture: number;
  };
  rootCause: string;
  reasoningBreakdown: string[];
  securityReport: {
    status: 'Critical' | 'Warning' | 'Passed';
    issues: SecurityIssue[];
  };
  privacyRisk: string;
  costOptimization: {
    currentCostEstimate: string;
    potentialSavings: string;
    recommendations: string[];
  };
  performanceAnalysis: {
    latencyMs: number;
    tokenEfficiency: string;
    bottlenecks: string[];
  };
  hallucinationScore: number;
  architectureNodes: Array<{ id: string; label: string; type: 'input' | 'process' | 'database' | 'ai' | 'output'; x: number; y: number }>;
  architectureEdges: Array<{ from: string; to: string; label?: string }>;
  workflowSteps: Array<{ name: string; duration: string; status: 'completed' | 'critical' | 'warning' }>;
  promptImprovements: {
    before: string;
    after: string;
    improvements: string[];
  };
  codeFixes: {
    description: string;
    beforeCode: string;
    afterCode: string;
  };
  modelRecommendations: ModelRecommendation[];
  stepByStepPlan: FixStep[];
}

export type ActiveTab = 
  | 'Dashboard' 
  | 'AIDoctor' 
  | 'PromptOptimizer' 
  | 'ReasoningLab' 
  | 'ArchitectureViewer' 
  | 'SecurityScanner' 
  | 'CostAnalyzer' 
  | 'HallucinationDetector' 
  | 'CodeReviewer' 
  | 'MemoryEngine' 
  | 'Reports' 
  | 'Settings';
