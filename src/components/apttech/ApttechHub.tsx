import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Trophy,
  Zap,
  Target,
  BookOpen,
  Briefcase,
  Flame,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  GraduationCap,
  Users,
  Building2,
  ChevronRight,
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  PlusCircle,
  Video,
} from 'lucide-react';
import {
  APTTECH_TOPICS,
  MOCK_ASSESSMENTS,
  PLACEMENT_DRIVES,
  LEADERBOARD_DATA,
} from '../../data/apttechData';
import { ApttechNewUserModal } from './ApttechNewUserModal';
import { ApttechTestSimulator } from './ApttechTestSimulator';
import { SpeedMathLab } from './SpeedMathLab';
import { AiTestGeneratorModal } from './AiTestGeneratorModal';
import { LiveProctoringConsole } from './LiveProctoringConsole';
import { ApttechCategory, PlacementDrive, MockAssessment } from '../../types/apttech';

export const ApttechHub: React.FC = () => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'mock-tests'
    | 'live-proctoring'
    | 'ai-generator'
    | 'vedic-math'
    | 'modules'
    | 'drives'
    | 'leaderboard'
  >('overview');

  // Simulation test state
  const [selectedMockId, setSelectedMockId] = useState<string | null>(null);
  const [availableTests, setAvailableTests] = useState<MockAssessment[]>(MOCK_ASSESSMENTS);
  const [newlyGeneratedTest, setNewlyGeneratedTest] = useState<MockAssessment | null>(null);

  // Modals State
  const [showNewUserModal, setShowNewUserModal] = useState<boolean>(false);
  const [showAiGeneratorModal, setShowAiGeneratorModal] = useState<boolean>(false);

  // Drives state (allow local registration toggle)
  const [drives, setDrives] = useState<PlacementDrive[]>(PLACEMENT_DRIVES);
  const [filterCategory, setFilterCategory] = useState<ApttechCategory | 'all'>('all');
  const [appliedDriveNotice, setAppliedDriveNotice] = useState<string | null>(null);

  // Check URL parameter "?is_new_user=true" on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('is_new_user') === 'true') {
      setShowNewUserModal(true);
    }
  }, []);

  const handleRegisterDrive = (driveId: string) => {
    setDrives((prev) =>
      prev.map((d) => {
        if (d.id === driveId) {
          const nextState = !d.isRegistered;
          setAppliedDriveNotice(
            nextState
              ? `Application submitted for ${d.companyName} (${d.role})! Hall ticket generated.`
              : `Registration cancelled for ${d.companyName}.`
          );
          setTimeout(() => setAppliedDriveNotice(null), 4000);
          return {
            ...d,
            isRegistered: nextState,
            registeredCount: nextState ? d.registeredCount + 1 : d.registeredCount - 1,
          };
        }
        return d;
      })
    );
  };

  const filteredTopics =
    filterCategory === 'all'
      ? APTTECH_TOPICS
      : APTTECH_TOPICS.filter((t) => t.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Brand Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Background glow accents */}
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>APT-TECH SOLUTIONS • CAMPUS RECRUITMENT TRAINING</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              AI Placement Prep & Aptitude Mastery
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Founded in 2011 by Mr. Sanir Kittur ("APTI King of Maharashtra"). Bridging academic
              engineering with premier IT & core recruiters through speed math, Vedic shortcuts,
              logical deduction, and proctored mock drives.
            </p>

            {/* Quick stats pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300 font-semibold">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>200,000+ Students Trained</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-sky-400" />
                <span>34+ Partner Colleges</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>88% Selection Rate</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              id="btn-apttech-ai-test-gen"
              onClick={() => setShowAiGeneratorModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Faculty AI Test Generator</span>
            </button>

            <button
              id="btn-apttech-live-proctoring"
              onClick={() => setActiveTab('live-proctoring')}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Live Proctoring Room</span>
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            </button>

            <button
              id="btn-apttech-new-user-diagnostic"
              onClick={() => setShowNewUserModal(true)}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs transition border border-white/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Diagnostic Benchmark (?is_new_user)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        {[
          { id: 'overview', label: 'AI Prep Dashboard', icon: BrainCircuit },
          { id: 'mock-tests', label: `Proctored Mock Drives (${availableTests.length})`, icon: Award },
          { id: 'live-proctoring', label: 'Live Proctoring Room', icon: ShieldAlert, badge: 'Live' },
          { id: 'ai-generator', label: 'AI Test Studio', icon: Sparkles },
          { id: 'vedic-math', label: 'Sanir Kittur Speed Math', icon: Zap },
          { id: 'modules', label: 'CRT Learning Modules', icon: BookOpen },
          { id: 'drives', label: 'Campus Placement Drives', icon: Briefcase },
          { id: 'leaderboard', label: 'All-Maharashtra Rank', icon: Trophy },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id !== 'mock-tests') {
                  setSelectedMockId(null);
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {(tab as any).badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-rose-500 text-white font-extrabold animate-pulse">
                  {(tab as any).badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notice Alert when registering */}
      {appliedDriveNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-900 flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{appliedDriveNotice}</span>
        </div>
      )}

      {/* TAB 1: OVERVIEW / DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* PRI Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Placement Readiness
                </span>
                <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <Zap className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 font-mono">78%</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +6% this week
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-indigo-600 h-full rounded-full w-[78%]" />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Tier 1 Prime Cadre (Eligible for ₹7.5+ LPA drives)
              </p>
            </div>

            {/* Daily Aptitude Streak */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Practice Streak
                </span>
                <span className="p-1.5 rounded-xl bg-amber-50 text-amber-600">
                  <Flame className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 font-mono">14 Days</span>
                <span className="text-xs font-bold text-amber-600">On Fire!</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <span
                    key={d}
                    className="flex-1 h-2 rounded-full bg-amber-500"
                    title={`Day ${d}`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                12 questions completed today in Quantitative & Logic
              </p>
            </div>

            {/* Mock Tests Completed */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Mock Tests Solved
                </span>
                <span className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600">
                  <Award className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 font-mono">9 Tests</span>
                <span className="text-xs font-semibold text-slate-500">Avg 74.2%</span>
              </div>
              <p className="text-xs font-bold text-indigo-600">Top 94.2th Percentile</p>
              <p className="text-[11px] text-slate-500 font-medium">
                Last test: TCS NQT Full Simulation (68.2%)
              </p>
            </div>

            {/* Active Drives */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Upcoming Drives
                </span>
                <span className="p-1.5 rounded-xl bg-purple-50 text-purple-600">
                  <Briefcase className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 font-mono">5 Drives</span>
                <span className="text-xs font-bold text-purple-600">₹6.5 - ₹9.5 LPA</span>
              </div>
              <p className="text-xs font-bold text-emerald-600">1 Drive Registered (TCS)</p>
              <p className="text-[11px] text-slate-500 font-medium">
                Next deadline: TCS Digital on Oct 02
              </p>
            </div>
          </div>

          {/* Sanir Kittur Vedic Tip of the Day */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 p-5 rounded-3xl border border-amber-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                APTI
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                    SANIR KITTUR SHORTCUT OF THE DAY
                  </span>
                  <span className="text-xs text-amber-800 font-medium">
                    Fast Squares for numbers ending in 5
                  </span>
                </div>
                <p className="text-xs text-amber-950 font-mono">
                  (N5)² = [N × (N + 1)] suffix 25. For example: 85² ⇒ 8 × 9 = 72 suffix 25 ⇒ 7,225!
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('vedic-math')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition shrink-0 cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Open Speed Math Lab</span>
            </button>
          </div>

          {/* Company Mock Test Series Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Featured Company Mock Assessments
                </h3>
                <p className="text-xs text-slate-500">
                  Exact patterns with section timers and live percentile rankings
                </p>
              </div>
              <button
                onClick={() => setActiveTab('mock-tests')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1 cursor-pointer"
              >
                <span>View All Tests</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {availableTests.map((test) => (
                <div
                  key={test.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                        {test.companyName}
                      </span>
                      {test.isAiGenerated && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-400 text-slate-950 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          AI Proctored
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-slate-500">
                        {test.durationMinutes} mins
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2">
                      {test.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{test.subtitle}</p>

                    <div className="flex items-center gap-1.5 pt-1">
                      {test.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded text-[9px] font-medium bg-slate-100 text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {test.attemptsCount.toLocaleString()} Attempts
                    </span>
                    <button
                      onClick={() => {
                        setSelectedMockId(test.id);
                        setActiveTab('mock-tests');
                      }}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <span>Start Test</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CRT Curriculum Topics Snapshot */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Campus Recruitment Training (CRT) Modules
                </h3>
                <p className="text-xs text-slate-500">
                  Theory notes, shortcuts, and curated problem sets
                </p>
              </div>
              <button
                onClick={() => setActiveTab('modules')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1 cursor-pointer"
              >
                <span>Full Question Bank</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {APTTECH_TOPICS.slice(0, 4).map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                      {topic.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600">
                      {topic.masteryPct}% Mastery
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900">{topic.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{topic.description}</p>

                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${topic.masteryPct}%` }}
                    />
                  </div>

                  <p className="text-[10px] text-slate-400 font-mono">
                    {topic.questionCount} Questions Available
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROCTORED MOCK TESTS SIMULATOR */}
      {activeTab === 'mock-tests' && (
        <ApttechTestSimulator
          initialTestId={selectedMockId || availableTests[0]?.id || 'mock-tcs-nqt'}
          customTest={newlyGeneratedTest || undefined}
          allAvailableTests={availableTests}
          onExit={() => {
            setSelectedMockId(null);
            setActiveTab('overview');
          }}
        />
      )}

      {/* TAB: LIVE PROCTORING ROOM */}
      {activeTab === 'live-proctoring' && <LiveProctoringConsole />}

      {/* TAB: AI TEST GENERATOR STUDIO */}
      {activeTab === 'ai-generator' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-slate-950" />
                Gemini 3.8 Flash Powered
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Faculty AI Test Synthesis &amp; Proctoring Studio
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Teachers can upload subject topics, syllabus documents, or custom questions. Gemini AI will synthesize complete placement-ready mock tests with Vedic shortcuts and configure live proctoring rules.
              </p>
            </div>

            <button
              onClick={() => setShowAiGeneratorModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Launch AI Test Creator</span>
            </button>
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-slate-900 mb-3">
              Published AI &amp; Proctored Assessments ({availableTests.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableTests.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {t.companyName}
                      </span>
                      {t.isAiGenerated && (
                        <span className="text-[9px] font-bold text-amber-900 bg-amber-200 px-1.5 py-0.2 rounded">
                          AI Created
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{t.title}</h4>
                    <p className="text-[10px] text-slate-500">{t.subtitle}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {t.totalQuestions} Qs • {t.durationMinutes}m
                    </span>
                    <button
                      onClick={() => {
                        setSelectedMockId(t.id);
                        setActiveTab('mock-tests');
                      }}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      Test Drive
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SPEED MATH LAB */}
      {activeTab === 'vedic-math' && <SpeedMathLab />}

      {/* TAB 4: CRT LEARNING MODULES & QUESTION BANK */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All CRT Categories' },
              { id: 'quantitative', label: 'Quantitative Aptitude' },
              { id: 'logical', label: 'Logical Reasoning' },
              { id: 'verbal', label: 'Verbal Communication' },
              { id: 'technical', label: 'Pseudo-Code & Technical' },
              { id: 'cognitive', label: 'Cognitive & Game Rounds' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                      {topic.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{topic.title}</h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600">
                    {topic.masteryPct}% Mastery
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{topic.description}</p>

                {/* Key Formulas & Shortcuts */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                    Core Formulae & Identities:
                  </p>
                  <ul className="space-y-1 text-slate-700 font-mono text-[11px]">
                    {topic.formulas.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sanir Kittur Tip */}
                <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-950 text-xs flex items-start gap-2">
                  <Flame className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Sanir Kittur Exam Tip: </span>
                    <span>{topic.shortcutTip}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1 flex-wrap">
                    {topic.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[9px] font-semibold bg-slate-100 text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedMockId('mock-sanir-diagnostic');
                      setActiveTab('mock-tests');
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-xl transition cursor-pointer"
                  >
                    Solve Practice Set →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CAMPUS PLACEMENT DRIVES */}
      {activeTab === 'drives' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Active & Upcoming Campus Recruitment Drives (2026 Batch)
              </h3>
              <p className="text-xs text-slate-500">
                Direct eligibility integration with student academic CGPA and backlog ledger
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
              5 Active Drives
            </span>
          </div>

          <div className="space-y-3">
            {drives.map((drive) => (
              <div
                key={drive.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white">
                      {drive.companyName}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 font-mono">
                      {drive.ctc}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-semibold text-slate-500">
                      Drive Date: {drive.driveDate}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-black text-slate-900">{drive.role}</h4>
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">Eligibility:</span> Min{' '}
                    {drive.eligibility.minCgpa} CGPA • Max {drive.eligibility.maxBacklogs} Backlog •{' '}
                    {drive.eligibility.branches.join(', ')}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Rounds:</span>
                    {drive.rounds.map((round, rIdx) => (
                      <span
                        key={rIdx}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-medium"
                      >
                        {round}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-end gap-2 shrink-0">
                  <div className="text-right">
                    <span className="text-[11px] font-mono text-slate-500">
                      Deadline: {drive.deadline}
                    </span>
                    <p className="text-[10px] text-slate-400">
                      {drive.registeredCount} Students Applied
                    </p>
                  </div>

                  <button
                    onClick={() => handleRegisterDrive(drive.id)}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                      drive.isRegistered
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {drive.isRegistered ? 'Registered (View Hall Ticket)' : 'Apply for Drive'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ALL-MAHARASHTRA LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 p-5 rounded-3xl shadow-md flex items-center justify-between">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-950 text-amber-300">
                STATE-WIDE APTITUDE BENCHMARKS
              </span>
              <h3 className="text-base sm:text-lg font-black">
                All-Maharashtra Engineering CRT Leaderboard
              </h3>
              <p className="text-xs text-slate-900 font-medium">
                Rankings compiled from proctored TCS, Infosys, and Capgemini mock drives across 34+
                partner institutions.
              </p>
            </div>
            <Trophy className="w-12 h-12 text-slate-950/20 shrink-0" />
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Student & College</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Percentile</th>
                    <th className="py-3 px-4">Target Recruiter</th>
                    <th className="py-3 px-4">Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {LEADERBOARD_DATA.map((entry) => (
                    <tr key={entry.rank} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 font-mono font-bold">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            entry.rank === 1
                              ? 'bg-amber-400 text-slate-950 font-black'
                              : entry.rank === 2
                              ? 'bg-slate-200 text-slate-800'
                              : entry.rank === 3
                              ? 'bg-amber-700/20 text-amber-900'
                              : 'text-slate-500'
                          }`}
                        >
                          {entry.rank}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{entry.name}</p>
                        <p className="text-[11px] text-slate-500">{entry.college}</p>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {entry.score}%
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-600">
                        {entry.percentile}th
                      </td>
                      <td className="py-3 px-4 text-slate-600">{entry.targetCompany}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                          {entry.badge}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* New User Diagnostic Modal */}
      <ApttechNewUserModal
        isOpen={showNewUserModal}
        onClose={() => setShowNewUserModal(false)}
        onStartTraining={(targetTab) => {
          if (targetTab === 'vedic-math') {
            setActiveTab('vedic-math');
          } else if (targetTab === 'mock-tests') {
            setActiveTab('mock-tests');
          } else if (targetTab === 'modules') {
            setActiveTab('modules');
          } else {
            setActiveTab('overview');
          }
        }}
      />

      {/* Faculty AI Test Synthesis Modal */}
      <AiTestGeneratorModal
        isOpen={showAiGeneratorModal}
        onClose={() => setShowAiGeneratorModal(false)}
        onTestPublished={(newTest) => {
          setAvailableTests((prev) => [newTest, ...prev]);
          setNewlyGeneratedTest(newTest);
          setSelectedMockId(newTest.id);
          setActiveTab('mock-tests');
          setAppliedDriveNotice(
            `Assessment "${newTest.title}" synthesized via Gemini AI and published with live proctoring telemetry!`
          );
          setTimeout(() => setAppliedDriveNotice(null), 6000);
        }}
      />
    </div>
  );
};
