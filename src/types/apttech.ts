export type ApttechCategory =
  | 'quantitative'
  | 'logical'
  | 'verbal'
  | 'technical'
  | 'cognitive';

export interface ApttechTopic {
  id: string;
  category: ApttechCategory;
  title: string;
  description: string;
  questionCount: number;
  masteryPct: number;
  formulas: string[];
  shortcutTip: string;
  tags: string[];
}

export interface AssessmentQuestion {
  id: string;
  category: ApttechCategory;
  topic: string;
  companyTags: string[];
  questionText: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  vedicOrShortcutTip?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface MockSectionPattern {
  section: string;
  category: ApttechCategory;
  count: number;
  durationMinutes: number;
}

export interface MockAssessment {
  id: string;
  title: string;
  subtitle: string;
  companyName: string;
  companyColor: string;
  durationMinutes: number;
  totalQuestions: number;
  pattern: MockSectionPattern[];
  attemptsCount: number;
  avgScore: number;
  difficulty: 'Moderate' | 'Challenging' | 'Expert';
  tags: string[];
  isAiGenerated?: boolean;
  questions: AssessmentQuestion[];
}

export interface PlacementDrive {
  id: string;
  companyName: string;
  companyColor: string;
  role: string;
  ctc: string;
  eligibility: {
    minCgpa: number;
    branches: string[];
    maxBacklogs: number;
    batchYear: number;
  };
  driveDate: string;
  deadline: string;
  location: string;
  rounds: string[];
  status: 'Open' | 'Shortlisting' | 'Upcoming';
  registeredCount: number;
  isRegistered?: boolean;
}

export interface SpeedMathTrick {
  id: string;
  title: string;
  category: string;
  tag: string;
  concept: string;
  rule: string;
  exampleProblem: string;
  solutionSteps: string[];
  inputType: 'single' | 'two_numbers' | 'date';
  defaultInputs: [number, number?];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  college: string;
  collegeRoll: string;
  score: number;
  percentile: number;
  targetCompany: string;
  priLevel: 'Elite' | 'Advanced' | 'Proficient';
  badge: string;
}

export interface NewUserDiagnosticResult {
  completed: boolean;
  score: number;
  total: number;
  percentage: number;
  priIndex: number;
  targetCompanies: string[];
  dreamCtc: string;
  recommendedRoadmap: string[];
  categoryBreakdown: {
    category: ApttechCategory;
    name: string;
    correct: number;
    total: number;
    pct: number;
  }[];
}
