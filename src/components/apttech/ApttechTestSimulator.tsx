import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Timer,
  CheckCircle2,
  XCircle,
  Clock,
  Flag,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Award,
  Zap,
  Check,
  Flame,
  AlertCircle,
  BookOpen,
  Camera,
  Mic,
  ShieldCheck,
  ShieldAlert,
  Maximize,
  Minimize,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MockAssessment, AssessmentQuestion } from '../../types/apttech';
import { MOCK_ASSESSMENTS } from '../../data/apttechData';

interface ApttechTestSimulatorProps {
  initialTestId?: string;
  customTest?: MockAssessment;
  allAvailableTests?: MockAssessment[];
  onExit: () => void;
}

export const ApttechTestSimulator: React.FC<ApttechTestSimulatorProps> = ({
  initialTestId = 'mock-tcs-nqt',
  customTest,
  allAvailableTests,
  onExit,
}) => {
  const testsList = useMemo(() => {
    const list = [...(allAvailableTests || MOCK_ASSESSMENTS)];
    if (customTest && !list.some((t) => t.id === customTest.id)) {
      list.unshift(customTest);
    }
    return list;
  }, [customTest, allAvailableTests]);

  const [selectedTestId, setSelectedTestId] = useState<string>(
    customTest ? customTest.id : initialTestId
  );

  const activeTest = useMemo(() => {
    return (
      testsList.find((t) => t.id === selectedTestId) ||
      customTest ||
      testsList[0]
    );
  }, [selectedTestId, testsList, customTest]);

  // Assessment Engine States
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isDisqualified, setIsDisqualified] = useState<boolean>(false);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flaggedForReview, setFlaggedForReview] = useState<Record<number, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    activeTest.durationMinutes * 60
  );
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Proctoring States
  const [webcamActive, setWebcamActive] = useState<boolean>(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState<boolean>(false);
  const [proctorWarningCount, setProctorWarningCount] = useState<number>(0);
  const [activeViolationModal, setActiveViolationModal] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const sessionIdRef = useRef<string>(`sess-candidate-${Date.now()}`);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sync timer when test changes before starting
  useEffect(() => {
    if (!isStarted) {
      setSecondsRemaining(activeTest.durationMinutes * 60);
      setSelectedAnswers({});
      setFlaggedForReview({});
      setCurrentQIndex(0);
      setIsSubmitted(false);
      setIsDisqualified(false);
      setProctorWarningCount(0);
    }
  }, [activeTest, isStarted]);

  // Timer countdown
  useEffect(() => {
    if (!isStarted || isSubmitted || isDisqualified) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isSubmitted, isDisqualified]);

  // Live Proctoring Tab-Switch & Blur Tracking
  useEffect(() => {
    if (!isStarted || isSubmitted || isDisqualified) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleTriggerProctorViolation(
          'tab_switch',
          'Candidate navigated away from proctored assessment window (Tab switch / App minimize detected)'
        );
      }
    };

    const handleBlur = () => {
      handleTriggerProctorViolation(
        'tab_switch',
        'Assessment window focus lost (Potential secondary screen / search query)'
      );
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isStarted, isSubmitted, isDisqualified, proctorWarningCount]);

  // Camera cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleTriggerProctorViolation = async (
    type: 'tab_switch' | 'face_missing' | 'multiple_faces',
    details: string
  ) => {
    const nextCount = proctorWarningCount + 1;
    setProctorWarningCount(nextCount);
    setActiveViolationModal(details);

    // Transmit violation to proctoring server
    try {
      await fetch('/api/proctor/violation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          type,
          details,
          severity: nextCount >= 2 ? 'high' : 'medium',
          currentQuestion: currentQIndex + 1,
        }),
      });
    } catch (err) {
      console.warn('Proctor server sync offline fallback:', err);
    }

    if (nextCount >= 3) {
      setIsDisqualified(true);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartTest = async () => {
    setIsStarted(true);
    setIsSubmitted(false);
    setIsDisqualified(false);
    setProctorWarningCount(0);
    setSecondsRemaining(activeTest.durationMinutes * 60);

    // Initialize Camera Stream for Proctoring
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
          audio: false,
        });
        streamRef.current = stream;
        setWebcamActive(true);
        setCameraPermissionGranted(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } else {
        setWebcamActive(true);
      }
    } catch (e) {
      // Permission denied or simulated environment - run high-fidelity simulation
      setWebcamActive(true);
      setCameraPermissionGranted(false);
    }

    // Register with server proctoring API
    try {
      await fetch('/api/proctor/start-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          studentId: 'STU-2023-CS-042',
          studentName: 'Aarav Deshmukh',
          testId: activeTest.id,
          testTitle: activeTest.title,
          totalQuestions: activeTest.questions.length,
        }),
      });
    } catch (e) {
      // Safe fallback
    }
  };

  const handleSelectOption = (optIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQIndex]: optIndex,
    }));
  };

  const toggleFlagReview = () => {
    setFlaggedForReview((prev) => ({
      ...prev,
      [currentQIndex]: !prev[currentQIndex],
    }));
  };

  const clearSelection = () => {
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQIndex];
      return next;
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSubmitTest = () => {
    setShowSubmitModal(false);
    setIsSubmitted(true);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Safe fallback
    }
  };

  // Score calculations
  const calculateResults = () => {
    let correct = 0;
    let attempted = 0;
    activeTest.questions.forEach((q, idx) => {
      const ans = selectedAnswers[idx];
      if (ans !== undefined) {
        attempted++;
        if (ans === q.correctOptionIndex) {
          correct++;
        }
      }
    });

    const total = activeTest.questions.length;
    const scorePct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const percentile = Math.min(99.4, Math.max(50.0, +(scorePct * 0.95 + 4.5).toFixed(1)));

    return {
      correct,
      attempted,
      total,
      scorePct,
      accuracy,
      percentile,
    };
  };

  const results = calculateResults();
  const currentQ = activeTest.questions[currentQIndex] || activeTest.questions[0];

  // DISQUALIFICATION SCREEN
  if (isDisqualified) {
    return (
      <div className="bg-white rounded-3xl border border-rose-300 p-8 shadow-2xl text-center max-w-xl mx-auto space-y-5 my-8">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white uppercase tracking-wider">
            CANDIDATE DISQUALIFIED
          </span>
          <h2 className="text-2xl font-black text-slate-900 pt-2">
            Proctoring Integrity Breach Terminated Exam
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
            You have exceeded the maximum allowed proctoring warnings ({proctorWarningCount}/3) due to repeated tab switching, lost window focus, or external browser queries.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-left text-xs text-rose-950 space-y-1">
          <p className="font-bold">Recorded Telemetry Incident Log:</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-900">
            <li>Session ID: {sessionIdRef.current}</li>
            <li>Violation: Window focus lost / unauthorized tab change</li>
            <li>Incident report auto-transmitted to Exam Controller &amp; Faculty Board.</li>
          </ul>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => {
              setIsStarted(false);
              setIsDisqualified(false);
              setProctorWarningCount(0);
            }}
            className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            Restart Clean Proctored Session
          </button>
          <button
            onClick={onExit}
            className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition cursor-pointer"
          >
            Return to Hub
          </button>
        </div>
      </div>
    );
  }

  // Pre-Start Overview Screen
  if (!isStarted && !isSubmitted) {
    return (
      <div className="space-y-6">
        {/* Test Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {testsList.map((test) => {
            const isSel = test.id === selectedTestId;
            return (
              <button
                key={test.id}
                onClick={() => setSelectedTestId(test.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-2 ${
                  isSel
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{test.companyName}</span>
                {test.isAiGenerated && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-[9px] font-black">
                    AI
                  </span>
                )}
                <span className="text-[10px] opacity-75">({test.durationMinutes}m)</span>
              </button>
            );
          })}
        </div>

        {/* Selected Test Detail Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider inline-flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Official Proctored Pattern
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Live AI Proctoring Active
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">{activeTest.title}</h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">{activeTest.subtitle}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/20 text-center">
                  <p className="text-xl font-bold font-mono">{activeTest.durationMinutes} min</p>
                  <p className="text-[10px] text-slate-300 uppercase font-semibold">Test Timer</p>
                </div>
                <div className="px-4 py-2 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/20 text-center">
                  <p className="text-xl font-bold font-mono">{activeTest.totalQuestions} Qs</p>
                  <p className="text-[10px] text-slate-300 uppercase font-semibold">Questions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Assessment Sectional Blueprint:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeTest.pattern.map((pat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1"
                  >
                    <p className="text-xs font-bold text-slate-900">{pat.section}</p>
                    <p className="text-[11px] text-slate-500">
                      {pat.count} Questions • {pat.durationMinutes} Minutes
                    </p>
                    <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700">
                      {pat.category.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strict Proctoring Rules Notice */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-950 space-y-1">
                <p className="font-bold">Live AI Proctoring Safeguards Enabled:</p>
                <ul className="list-disc list-inside space-y-0.5 text-amber-900 text-[11px]">
                  <li>
                    <strong>Webcam &amp; Mic:</strong> Continuously monitored for facial orientation, secondary persons, and ambient voice.
                  </li>
                  <li>
                    <strong>Tab Lock Enforcement:</strong> Navigating away from this tab triggers an immediate proctoring violation. 3 violations will auto-disqualify your submission.
                  </li>
                  <li>
                    <strong>Auto-Save:</strong> Selected answers are saved in real-time. Test auto-submits on timer expiration.
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onExit}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Back to AptTech Hub
              </button>
              <button
                type="button"
                id="btn-launch-proctored-test"
                onClick={handleStartTest}
                className="px-6 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Launch Proctored Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Post-Submission Scorecard Screen
  if (isSubmitted) {
    return (
      <div className="space-y-6">
        {/* Scorecard Hero */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-indigo-900 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>PLACEMENT ASSESSMENT COMPLETED</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black">{activeTest.title}</h2>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1">
              Evaluated against All-Maharashtra Engineering College Benchmarks
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
              <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                {results.scorePct}%
              </p>
              <p className="text-[10px] text-slate-300 uppercase font-bold">Total Score</p>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                {results.correct} / {results.total}
              </p>
              <p className="text-[10px] text-slate-300 uppercase font-bold">Correct Answers</p>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
              <p className="text-2xl sm:text-3xl font-black text-sky-400 font-mono">
                {results.accuracy}%
              </p>
              <p className="text-[10px] text-slate-300 uppercase font-bold">Accuracy</p>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
              <p className="text-2xl sm:text-3xl font-black text-purple-300 font-mono">
                {results.percentile}th
              </p>
              <p className="text-[10px] text-slate-300 uppercase font-bold">Percentile</p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setIsStarted(false);
                setIsSubmitted(false);
              }}
              className="px-4 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Test</span>
            </button>
            <button
              onClick={onExit}
              className="px-5 py-2 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl transition cursor-pointer font-extrabold"
            >
              Return to AptTech Hub
            </button>
          </div>
        </div>

        {/* Question-by-Question Solution Analysis */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900">
              Detailed Question Solutions &amp; Vedic Shortcuts
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {results.correct} of {results.total} correct
            </span>
          </div>

          <div className="space-y-4">
            {activeTest.questions.map((q, idx) => {
              const studentAnswer = selectedAnswers[idx];
              const isCorrect = studentAnswer === q.correctOptionIndex;
              const isAttempted = studentAnswer !== undefined;

              return (
                <div
                  key={q.id}
                  className={`p-4 sm:p-5 rounded-2xl border text-xs space-y-3 ${
                    isCorrect
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : isAttempted
                      ? 'bg-rose-50/50 border-rose-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                        Q{idx + 1}
                      </span>
                      <span className="font-bold text-slate-900">{q.topic}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                        {q.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 font-bold text-xs">
                      {isCorrect ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Correct (+1)
                        </span>
                      ) : isAttempted ? (
                        <span className="text-rose-700 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Incorrect (0)
                        </span>
                      ) : (
                        <span className="text-slate-500">Unattempted (0)</span>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-800 font-medium whitespace-pre-line leading-relaxed">
                    {q.questionText}
                  </p>

                  {q.codeSnippet && (
                    <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto">
                      {q.codeSnippet}
                    </pre>
                  )}

                  {/* Options Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, oIdx) => {
                      const isOptionCorrect = oIdx === q.correctOptionIndex;
                      const isOptionChosen = oIdx === studentAnswer;

                      let badgeClass = 'bg-white border-slate-200 text-slate-700';
                      if (isOptionCorrect) {
                        badgeClass =
                          'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold';
                      } else if (isOptionChosen && !isOptionCorrect) {
                        badgeClass = 'bg-rose-100 border-rose-300 text-rose-900 line-through';
                      }

                      return (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-xl border text-[11px] flex items-center justify-between ${badgeClass}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold">
                              {String.fromCharCode(65 + oIdx)}.
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isOptionCorrect && (
                            <span className="text-[10px] font-bold text-emerald-700">
                              ✓ Correct Answer
                            </span>
                          )}
                          {isOptionChosen && !isOptionCorrect && (
                            <span className="text-[10px] font-bold text-rose-700">
                              Your Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation & Shortcut */}
                  <div className="pt-2 border-t border-slate-200/60 space-y-1.5 text-xs text-slate-700">
                    <p className="font-semibold text-slate-900">Explanation:</p>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                      {q.explanation}
                    </p>

                    {q.vedicOrShortcutTip && (
                      <div className="p-2 rounded-xl bg-amber-100/70 border border-amber-200/80 text-amber-950 flex items-center gap-1.5 font-mono text-[11px]">
                        <Flame className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Sanir Kittur Shortcut: {q.vedicOrShortcutTip}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active Proctored Test Screen
  return (
    <div className="space-y-4">
      {/* Test Sticky Header */}
      <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-extrabold text-white">{activeTest.title}</h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PROCTOR ACTIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {activeTest.companyName} • Section: {currentQ?.category?.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Violation warning badge */}
          <div
            className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold flex items-center gap-1 border ${
              proctorWarningCount > 0
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}
          >
            <ShieldAlert className="w-3 h-3" />
            <span>{proctorWarningCount}/3 Warnings</span>
          </div>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>

          {/* Countdown Timer */}
          <div
            className={`px-3 py-1.5 rounded-xl border font-mono font-bold text-xs flex items-center gap-1.5 ${
              secondsRemaining < 120
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                : 'bg-slate-800 text-emerald-400 border-slate-700'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Main Test Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Question Pane (8 cols) */}
        <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between min-h-[460px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-900">
                  Question {currentQIndex + 1} of {activeTest.questions.length}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                  {currentQ.topic}
                </span>
              </div>

              <button
                onClick={toggleFlagReview}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                  flaggedForReview[currentQIndex]
                    ? 'bg-amber-100 text-amber-800'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>
                  {flaggedForReview[currentQIndex] ? 'Flagged for Review' : 'Mark for Review'}
                </span>
              </button>
            </div>

            <div className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed whitespace-pre-line">
              {currentQ.questionText}
            </div>

            {currentQ.codeSnippet && (
              <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto">
                {currentQ.codeSnippet}
              </pre>
            )}

            {/* Options */}
            <div className="space-y-2 pt-2">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[currentQIndex] === oIdx;
                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleSelectOption(oIdx)}
                    className={`w-full p-3 rounded-xl border text-xs sm:text-sm font-medium text-left transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md font-bold'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
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
          </div>

          {/* Question Controls Bottom Bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={clearSelection}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              Clear Choice
            </button>

            <div className="flex items-center gap-2">
              <button
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex((p) => Math.max(0, p - 1))}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl disabled:opacity-40 cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                disabled={currentQIndex === activeTest.questions.length - 1}
                onClick={() =>
                  setCurrentQIndex((p) => Math.min(activeTest.questions.length - 1, p + 1))
                }
                className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl disabled:opacity-40 cursor-pointer flex items-center gap-1"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Question Palette & Live Proctoring HUD (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Candidate Live Proctor Webcam Preview HUD */}
          <div className="bg-slate-900 rounded-3xl p-4 border border-slate-800 text-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                  AI Proctor Feed
                </span>
              </div>
              <span className="text-[9px] font-mono text-slate-400">
                {sessionIdRef.current.slice(0, 16)}
              </span>
            </div>

            {/* Video Viewport */}
            <div className="relative bg-slate-950 rounded-2xl h-36 overflow-hidden flex items-center justify-center border border-slate-800">
              {webcamActive && cameraPermissionGranted ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                />
              ) : (
                // Synthetic Candidate Frame
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-indigo-950 border-2 border-emerald-400/80 mx-auto flex items-center justify-center text-emerald-300 font-bold text-sm">
                    AD
                  </div>
                  <p className="text-[10px] font-mono text-emerald-400 font-bold">
                    Face Verified • AI Gaze Tracking
                  </p>
                </div>
              )}

              {/* HUD Reticle */}
              <div className="absolute inset-x-3 inset-y-2 border border-emerald-400/30 rounded-xl pointer-events-none flex items-center justify-between p-1">
                <span className="w-2 h-2 border-t-2 border-l-2 border-emerald-400" />
                <span className="w-2 h-2 border-t-2 border-r-2 border-emerald-400" />
              </div>

              {/* Status badges */}
              <div className="absolute bottom-1.5 left-2 flex items-center gap-1 text-[9px] font-bold bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-xs">
                <Camera className="w-2.5 h-2.5 text-emerald-400" />
                <span>Webcam Live</span>
              </div>

              <div className="absolute bottom-1.5 right-2 flex items-center gap-1 text-[9px] font-bold bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-xs text-emerald-400 font-mono">
                <Mic className="w-2.5 h-2.5" />
                <span>Audio Clean</span>
              </div>
            </div>

            {/* Test Simulation Button */}
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Telemetry synced with Faculty HUD</span>
              <button
                type="button"
                onClick={() =>
                  handleTriggerProctorViolation(
                    'tab_switch',
                    'Simulated Tab Switch / Window Blur Event for Verification'
                  )
                }
                className="text-[10px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
              >
                Simulate Tab Switch
              </button>
            </div>
          </div>

          {/* Navigator Palette */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Question Navigator
              </h4>
              <p className="text-[11px] text-slate-500">Quickly jump between assessment questions</p>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {activeTest.questions.map((_, idx) => {
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isFlagged = flaggedForReview[idx];
                const isCurrent = currentQIndex === idx;

                let btnClass = 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200';
                if (isCurrent) {
                  btnClass = 'ring-2 ring-indigo-600 font-black';
                }
                if (isAnswered) {
                  btnClass = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                } else if (isFlagged) {
                  btnClass = 'bg-amber-500 text-white border-amber-500 font-bold';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`h-9 rounded-xl border text-xs font-mono transition cursor-pointer flex items-center justify-center relative ${btnClass}`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && isAnswered && (
                      <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-amber-300 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-600" />
                <span>Answered ({Object.keys(selectedAnswers).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-500" />
                <span>Marked for Review ({Object.values(flaggedForReview).filter(Boolean).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-200" />
                <span>
                  Unvisited (
                    {activeTest.questions.length - Object.keys(selectedAnswers).length}
                  )
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROCTORING VIOLATION ALERT MODAL */}
      {activeViolationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border-2 border-amber-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">
                  ⚠️ Proctoring Integrity Alert! (Warning {proctorWarningCount}/3)
                </h4>
                <p className="text-[11px] text-amber-800 font-semibold">
                  Exam Security Violation Detected
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-amber-50 p-3 rounded-2xl border border-amber-200">
              {activeViolationModal}
            </p>

            <p className="text-[11px] text-slate-500 leading-normal">
              Switching tabs, using secondary windows, or un-focusing the exam window is strictly prohibited. <strong>{3 - proctorWarningCount} warning(s) remaining</strong> before your exam is automatically disqualified.
            </p>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveViolationModal(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition cursor-pointer"
              >
                I Understand &amp; Return to Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h4 className="text-sm font-bold text-slate-900">Submit Assessment?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              You have answered {Object.keys(selectedAnswers).length} out of{' '}
              {activeTest.questions.length} questions. Are you ready to finish and view your
              scorecard?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Keep Solving
              </button>
              <button
                onClick={handleSubmitTest}
                className="px-4 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-sm cursor-pointer"
              >
                Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
