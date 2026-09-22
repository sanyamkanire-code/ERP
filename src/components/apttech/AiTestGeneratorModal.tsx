import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  BrainCircuit,
  ShieldCheck,
  Camera,
  Layers,
  ChevronRight,
  ArrowRight,
  Eye,
  Sliders,
  Flame,
} from 'lucide-react';
import { MockAssessment, AssessmentQuestion, ApttechCategory } from '../../types/apttech';

interface AiTestGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestPublished: (newTest: MockAssessment) => void;
}

export const AiTestGeneratorModal: React.FC<AiTestGeneratorModalProps> = ({
  isOpen,
  onClose,
  onTestPublished,
}) => {
  // Form State
  const [topic, setTopic] = useState<string>('Time, Speed and Distance (Vedic Shortcuts)');
  const [companyPattern, setCompanyPattern] = useState<string>('TCS NQT');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [category, setCategory] = useState<ApttechCategory>('quantitative');
  const [syllabusNotes, setSyllabusNotes] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Proctoring Rules Configuration
  const [enableWebcamProctor, setEnableWebcamProctor] = useState<boolean>(true);
  const [enableTabLock, setEnableTabLock] = useState<boolean>(true);
  const [enableAudioMonitor, setEnableAudioMonitor] = useState<boolean>(true);

  // Generation & Review State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generatedTest, setGeneratedTest] = useState<MockAssessment | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const popularTopics = [
    'Time, Speed and Distance (Vedic Shortcuts)',
    'Permutations, Combinations & Probability',
    'Data Structures & Binary Search Trees',
    'Number Systems & Fast Unit Digit Calculation',
    'Logical Deduction & Syllogisms',
    'SQL Joins, Group By & Subqueries',
    'Verbal Reasoning & Para Jumbles',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setSyllabusNotes((prev) => `${prev}\n[Reference Upload: ${file.name}]\n${text.slice(0, 500)}...`);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleGenerateWithAI = async () => {
    setIsGenerating(true);
    setErrorNotice(null);
    setGenerationStep('Connecting to Gemini 3.8 Flash model...');

    try {
      setTimeout(() => setGenerationStep('Synthesizing competitive exam questions & options...'), 800);
      setTimeout(() => setGenerationStep('Injecting Sanir Kittur Vedic shortcuts and solutions...'), 1600);

      const response = await fetch('/api/generate-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          companyPattern,
          questionCount,
          difficulty,
          category,
          syllabusNotes,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.test) {
        const testPayload: MockAssessment = {
          ...data.test,
          enableLiveProctoring: enableWebcamProctor,
          enableTabSwitchLock: enableTabLock,
          enableAudioMonitoring: enableAudioMonitor,
          createdByTeacher: 'Prof. Rajesh Kulkarni (CRT Coordinator)',
          attemptsCount: 0,
          tags: [companyPattern, difficulty, category.toUpperCase(), 'AI-PROCTORED'],
        };
        setGeneratedTest(testPayload);
      } else {
        throw new Error('Failed to generate test questions');
      }
    } catch (err: any) {
      console.error('Test generation error:', err);
      setErrorNotice(err?.message || 'Error occurred while communicating with AI service');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishTest = () => {
    if (generatedTest) {
      onTestPublished(generatedTest);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>FACULTY AI TEST GENERATION ENGINE</span>
            </div>
            <h2 className="text-xl font-black text-white">
              Synthesize Proctored Assessments with Gemini AI
            </h2>
            <p className="text-xs text-slate-300">
              Upload topics, syllabi, or past paper notes to auto-generate questions, options, Vedic shortcuts, and configure real-time proctoring.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {errorNotice && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {!generatedTest ? (
            // Configuration & Upload Step
            <div className="space-y-5">
              {/* Topic Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  1. Assessment Topic & Skill Subject:
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Dynamic Programming, Permutations, Syllogisms, Vedic Math..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                />

                {/* Quick Topic Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold self-center mr-1">
                    Suggestions:
                  </span>
                  {popularTopics.map((pt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTopic(pt)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 transition cursor-pointer"
                    >
                      {pt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid: Recruiter Pattern, Question Count, Category, Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Recruiter Pattern:
                  </label>
                  <select
                    value={companyPattern}
                    onChange={(e) => setCompanyPattern(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white"
                  >
                    <option value="TCS NQT">TCS NQT</option>
                    <option value="Infosys Springboard">Infosys Springboard</option>
                    <option value="Capgemini Excellence">Capgemini Excellence</option>
                    <option value="Cognizant GenC">Cognizant GenC</option>
                    <option value="Generic CRT">Generic Maharashtra CRT</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Question Count:
                  </label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white"
                  >
                    <option value={3}>3 Questions (Quick Drill)</option>
                    <option value={5}>5 Questions (Standard)</option>
                    <option value={10}>10 Questions (Full Round)</option>
                    <option value={15}>15 Questions (Grand Mock)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Difficulty Tier:
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white"
                  >
                    <option value="Easy">Easy (Fundamentals)</option>
                    <option value="Medium">Medium (Campus Standard)</option>
                    <option value="Hard">Hard (Prime / Ninja Tier)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 block">Category:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white"
                  >
                    <option value="quantitative">Quantitative Aptitude</option>
                    <option value="logical">Logical Reasoning</option>
                    <option value="verbal">Verbal Ability</option>
                    <option value="technical">Technical / Pseudo-Code</option>
                    <option value="cognitive">Cognitive & Gaming</option>
                  </select>
                </div>
              </div>

              {/* Syllabus / Notes & Document Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    2. Upload Syllabus, Notes or Custom Prompts (Optional):
                  </label>
                  <label className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadedFileName ? 'Replace File' : 'Upload Syllabus (.txt, .md)'}</span>
                    <input
                      type="file"
                      accept=".txt,.md,.json,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <textarea
                  rows={3}
                  value={syllabusNotes}
                  onChange={(e) => setSyllabusNotes(e.target.value)}
                  placeholder="Paste lecture notes, specific problem statements, or formulas you want the AI to base the assessment questions on..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                />
                {uploadedFileName && (
                  <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Uploaded: {uploadedFileName}</span>
                  </p>
                )}
              </div>

              {/* Live Proctoring Rules Configuration */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-700" />
                  <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                    3. Live Proctored Telemetry Security Rules:
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-start gap-2 text-xs text-indigo-950 font-medium cursor-pointer p-2 rounded-xl bg-white/80 border border-indigo-100">
                    <input
                      type="checkbox"
                      checked={enableWebcamProctor}
                      onChange={(e) => setEnableWebcamProctor(e.target.checked)}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="font-bold block">Live Webcam Stream</span>
                      <span className="text-[10px] text-slate-500">
                        Face presence & multi-face detection
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 text-xs text-indigo-950 font-medium cursor-pointer p-2 rounded-xl bg-white/80 border border-indigo-100">
                    <input
                      type="checkbox"
                      checked={enableTabLock}
                      onChange={(e) => setEnableTabLock(e.target.checked)}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="font-bold block">Tab-Switch Enforcement</span>
                      <span className="text-[10px] text-slate-500">
                        Auto-warning on window blur (3 limit)
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 text-xs text-indigo-950 font-medium cursor-pointer p-2 rounded-xl bg-white/80 border border-indigo-100">
                    <input
                      type="checkbox"
                      checked={enableAudioMonitor}
                      onChange={(e) => setEnableAudioMonitor(e.target.checked)}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="font-bold block">Audio Anomaly Check</span>
                      <span className="text-[10px] text-slate-500">
                        Background whispering detection
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isGenerating || !topic.trim()}
                  onClick={handleGenerateWithAI}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <BrainCircuit className="w-4 h-4 animate-spin text-amber-300" />
                      <span>{generationStep || 'Synthesizing Test...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Generate Assessment with Gemini AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            // Review & Publish Screen
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-emerald-950">
                      AI Generated: {generatedTest.title}
                    </h4>
                    <p className="text-[11px] text-emerald-800">
                      {generatedTest.totalQuestions} Questions • {generatedTest.durationMinutes} Minutes • Live Proctoring Active
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setGeneratedTest(null)}
                  className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
                >
                  Regenerate
                </button>
              </div>

              {/* Question Previews */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Generated Questions Preview:
                </h4>

                {generatedTest.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900">
                        Q{idx + 1}. {q.topic}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                        Correct: Option {String.fromCharCode(65 + q.correctOptionIndex)}
                      </span>
                    </div>

                    <p className="text-slate-800 font-medium whitespace-pre-line leading-relaxed">
                      {q.questionText}
                    </p>

                    {q.codeSnippet && (
                      <pre className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto">
                        {q.codeSnippet}
                      </pre>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-lg border text-[11px] font-medium flex items-center gap-2 ${
                            oIdx === q.correctOptionIndex
                              ? 'bg-emerald-100 border-emerald-300 text-emerald-950 font-bold'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="font-mono font-bold">
                            {String.fromCharCode(65 + oIdx)}.
                          </span>
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>

                    {q.vedicOrShortcutTip && (
                      <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center gap-1.5 text-[11px] font-mono">
                        <Flame className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Apt-Tech Shortcut: {q.vedicOrShortcutTip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Publish Controls */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGeneratedTest(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Back to Settings
                </button>

                <button
                  type="button"
                  onClick={handlePublishTest}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Test with Live AI Proctoring</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
