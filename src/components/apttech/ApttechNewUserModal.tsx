import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Target,
  GraduationCap,
  Briefcase,
  Flame,
  Award,
  Zap,
  Check,
  X,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MOCK_ASSESSMENTS } from '../../data/apttechData';
import { AssessmentQuestion, ApttechCategory } from '../../types/apttech';

interface ApttechNewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTraining: (tab?: string) => void;
}

export const ApttechNewUserModal: React.FC<ApttechNewUserModalProps> = ({
  isOpen,
  onClose,
  onStartTraining,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: User Preferences
  const [targetDegree, setTargetDegree] = useState('B.Tech Computer Science');
  const [batchYear, setBatchYear] = useState('2026');
  const [targetCompanies, setTargetCompanies] = useState<string[]>([
    'TCS',
    'Infosys',
    'Capgemini',
  ]);
  const [dreamCtc, setDreamCtc] = useState('₹7.5 - ₹10 LPA');

  // Step 2: Diagnostic Questions
  const diagnosticTest = MOCK_ASSESSMENTS.find(
    (m) => m.id === 'mock-sanir-diagnostic'
  ) || MOCK_ASSESSMENTS[0];
  const questions: AssessmentQuestion[] = diagnosticTest.questions;

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  // Step 3: Diagnostic Results
  const [isCalculated, setIsCalculated] = useState(false);

  useEffect(() => {
    if (step === 3 && !isCalculated) {
      setIsCalculated(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [step, isCalculated]);

  if (!isOpen) return null;

  const toggleCompany = (company: string) => {
    if (targetCompanies.includes(company)) {
      if (targetCompanies.length > 1) {
        setTargetCompanies(targetCompanies.filter((c) => c !== company));
      }
    } else {
      setTargetCompanies([...targetCompanies, company]);
    }
  };

  const handleSelectAnswer = (qIdx: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optionIdx,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        correct++;
      }
    });
    return correct;
  };

  const correctCount = calculateScore();
  const scorePct = Math.round((correctCount / questions.length) * 100);
  const calculatedPri = Math.min(95, Math.max(45, Math.round(50 + scorePct * 0.45)));

  const currentQ = questions[currentQuestionIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white p-4 sm:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              APT-TECH SOLUTIONS • CAMPUS RECRUITMENT TRAINING
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-300 text-xs font-medium">
              Sanir Kittur Platform
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
            {step === 1 && 'Welcome, Future Software Engineer!'}
            {step === 2 && 'Diagnostic Aptitude & Coding Benchmark'}
            {step === 3 && 'Your Placement Readiness Index (PRI)'}
            {step === 4 && 'Your Personalized CRT Action Plan'}
          </h2>

          <p className="text-xs text-slate-300 mt-1">
            {step === 1 &&
              'Set your dream placement goals and configure your company-specific assessment path.'}
            {step === 2 &&
              `Question ${currentQuestionIdx + 1} of ${questions.length}: Real CRT questions from TCS, Infosys & Capgemini.`}
            {step === 3 &&
              'Benchmark evaluation based on 200,000+ engineering students trained across Maharashtra.'}
            {step === 4 &&
              'Curated video masterclasses, speed math shortcuts, and company mock tests.'}
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-8 bg-amber-400'
                    : s < step
                    ? 'w-4 bg-emerald-400'
                    : 'w-4 bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* STEP 1: WELCOME & GOAL SETTING */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center font-bold text-sm shrink-0">
                  APTI
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-950">
                    From Mr. Sanir Kittur ("APTI King of Maharashtra")
                  </h4>
                  <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                    "Welcome to Apt-Tech Solutions! Since 2011, we have helped over 200,000 engineering students secure campus placements in TCS, Infosys, Capgemini, and product companies. Let's benchmark your readiness in 3 minutes."
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Graduation Degree & Branch
                  </label>
                  <select
                    value={targetDegree}
                    onChange={(e) => setTargetDegree(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="B.Tech Computer Science">B.Tech Computer Science & Eng</option>
                    <option value="B.Tech Information Technology">B.Tech Information Technology</option>
                    <option value="B.Tech AI & Data Science">B.Tech Artificial Intelligence & DS</option>
                    <option value="B.Tech Electronics & Telecom">B.Tech Electronics & Telecomm</option>
                    <option value="B.Tech Mechanical / Civil">B.Tech Mechanical / Civil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Graduating Batch
                  </label>
                  <select
                    value={batchYear}
                    onChange={(e) => setBatchYear(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="2026">Batch of 2026 (Final Year)</option>
                    <option value="2027">Batch of 2027 (Pre-Final Year)</option>
                    <option value="2028">Batch of 2028 (Sophomore)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Target Dream Recruiters (Select all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'TCS (Ninja & Digital)',
                    'Infosys (SP & SE)',
                    'Capgemini (Exceller)',
                    'Cognizant (GenC Next)',
                    'Wipro (Elite NTH)',
                    'Atlas Copco R&D',
                  ].map((company) => {
                    const isSelected = targetCompanies.some((c) => company.includes(c));
                    return (
                      <button
                        key={company}
                        type="button"
                        onClick={() => toggleCompany(company.split(' ')[0])}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-1 ring-indigo-500'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>{company}</span>
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Dream CTC Package
                </label>
                <div className="flex gap-2">
                  {['₹4.5 - ₹6.5 LPA', '₹7.5 - ₹10 LPA', '₹12+ LPA (Product)'].map((ctc) => (
                    <button
                      key={ctc}
                      type="button"
                      onClick={() => setDreamCtc(ctc)}
                      className={`flex-1 py-2 px-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                        dreamCtc === ctc
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {ctc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DIAGNOSTIC QUESTIONS */}
          {step === 2 && currentQ && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                  {currentQ.category} • {currentQ.topic}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {currentQuestionIdx + 1} / {questions.length}
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <p className="text-xs sm:text-sm font-semibold text-slate-900 whitespace-pre-line leading-relaxed">
                  {currentQ.questionText}
                </p>

                {currentQ.codeSnippet && (
                  <pre className="mt-3 p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto">
                    {currentQ.codeSnippet}
                  </pre>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIdx] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectAnswer(currentQuestionIdx, oIdx)}
                      className={`w-full p-3 rounded-xl border text-xs sm:text-sm font-medium text-left transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md font-bold'
                          : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </button>
                  );
                })}
              </div>

              {/* Navigation between diagnostic questions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-30 cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {currentQuestionIdx < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                    className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition cursor-pointer flex items-center gap-1"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-4 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <Award className="w-4 h-4" />
                    <span>Generate Benchmark Score</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: BENCHMARK SCORE & PLACEMENT READINESS */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-3xl shadow-lg border border-indigo-800 text-center relative overflow-hidden">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span>PLACEMENT READINESS INDEX (PRI)</span>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                    {calculatedPri}%
                  </span>
                  <div className="text-left">
                    <p className="text-xs font-bold text-amber-400 uppercase">
                      {calculatedPri >= 75 ? 'Tier 1 Prime Cadre' : 'Ready for CRT Speed Boost'}
                    </p>
                    <p className="text-[10px] text-slate-300">
                      Score: {correctCount} / {questions.length} Correct ({scorePct}%)
                    </p>
                  </div>
                </div>

                <p className="text-xs text-indigo-200 mt-2 max-w-md mx-auto">
                  {calculatedPri >= 75
                    ? 'Superb performance! You possess strong foundation speed. You are eligible for TCS Digital & Infosys Specialist Programmer tracks.'
                    : 'Good analytical foundation. With Apt-Tech speed math techniques and pseudo-code tracing, you can easily boost this score above 85%.'}
                </p>
              </div>

              {/* Question Solution Breakdown */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Diagnostic Solutions & Vedic Shortcut Review:
                </h4>
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {questions.map((q, idx) => {
                    const isCorrect = selectedAnswers[idx] === q.correctOptionIndex;
                    return (
                      <div
                        key={q.id}
                        className={`p-3 rounded-2xl border text-xs ${
                          isCorrect
                            ? 'bg-emerald-50/70 border-emerald-200'
                            : 'bg-rose-50/70 border-rose-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            {isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                            <span>
                              Q{idx + 1}: {q.topic}
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-500">
                            {q.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 mt-1 line-clamp-2">
                          {q.questionText}
                        </p>
                        <p className="text-[11px] font-semibold text-slate-900 mt-1">
                          Correct Answer:{' '}
                          <span className="text-emerald-700">
                            {q.options[q.correctOptionIndex]}
                          </span>
                        </p>
                        {q.vedicOrShortcutTip && (
                          <div className="mt-1.5 p-1.5 rounded-lg bg-amber-100/70 text-amber-950 font-mono text-[10px] flex items-center gap-1">
                            <Flame className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>Shortcut: {q.vedicOrShortcutTip}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CUSTOM CRT ROADMAP */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200/80">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-indigo-700" />
                  <h4 className="text-xs font-bold text-indigo-950">
                    Your Personalized 4-Week Campus Recruitment Roadmap
                  </h4>
                </div>
                <p className="text-[11px] text-indigo-800">
                  Curated for {targetDegree} targeting {targetCompanies.join(', ')} ({dreamCtc}).
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    week: 'Week 1',
                    title: 'Speed Math & Vedic Number Systems',
                    desc: 'Master 11s multiplication, squares ending in 5, calendar day finding, and percentage shortcuts.',
                    icon: Zap,
                    action: 'Explore Vedic Math Lab',
                    tab: 'vedic-math',
                  },
                  {
                    week: 'Week 2',
                    title: 'Logical Syllogisms & Seating Arrangements',
                    desc: 'Euler logic diagrams, "Only a few" deductions, and 8-person circular seating patterns.',
                    icon: BookOpen,
                    action: 'Practice Logical Reasoning',
                    tab: 'modules',
                  },
                  {
                    week: 'Week 3',
                    title: 'Pseudo-Code Tracing & Bitwise Logic',
                    desc: 'XOR swapping, bit-shifts, recursion call-stacks for Capgemini & Cognizant.',
                    icon: Briefcase,
                    action: 'Solve Pseudo-Code Sets',
                    tab: 'modules',
                  },
                  {
                    week: 'Week 4',
                    title: 'Full Proctored Company Mock Drives',
                    desc: 'Simulate TCS NQT, Infosys Springboard & Capgemini Excellence with real timers.',
                    icon: Trophy,
                    action: 'Take Full Mock Test',
                    tab: 'mock-tests',
                  },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 transition flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-indigo-600 uppercase">
                              {item.week}
                            </span>
                            <span className="text-slate-300">•</span>
                            <h5 className="text-xs font-bold text-slate-900">{item.title}</h5>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug">{item.desc}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onStartTraining(item.tab);
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shrink-0 cursor-pointer"
                      >
                        Start
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-between gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((p) => Math.max(1, p - 1) as any)}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              Skip for now
            </button>

            {step === 1 && (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-md shadow-indigo-600/20 cursor-pointer flex items-center gap-1.5"
              >
                <span>Take Diagnostic Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition cursor-pointer"
              >
                <span>View Results</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <span>View Custom Study Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 4 && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartTraining('dashboard');
                }}
                className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-1.5"
              >
                <Flame className="w-4 h-4" />
                <span>Launch Apt-Tech Hub</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
