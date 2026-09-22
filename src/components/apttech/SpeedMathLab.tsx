import React, { useState } from 'react';
import {
  Zap,
  Sparkles,
  Calculator,
  Calendar,
  Percent,
  CheckCircle2,
  Copy,
  Check,
  Flame,
  Lightbulb,
} from 'lucide-react';
import { SPEED_MATH_TRICKS } from '../../data/apttechData';

export const SpeedMathLab: React.FC = () => {
  const [selectedTrickId, setSelectedTrickId] = useState<string>('trick-mult-11');

  // Input states
  const [multInput, setMultInput] = useState<number>(74);
  const [squareInput, setSquareInput] = useState<number>(85);
  const [pctInputX, setPctInputX] = useState<number>(46);
  const [pctInputY, setPctInputY] = useState<number>(350);

  // Calendar states
  const [calDay, setCalDay] = useState<number>(15);
  const [calMonth, setCalMonth] = useState<number>(8); // August
  const [calYear, setCalYear] = useState<number>(1947);

  const [copied, setCopied] = useState(false);

  const currentTrick =
    SPEED_MATH_TRICKS.find((t) => t.id === selectedTrickId) || SPEED_MATH_TRICKS[0];

  // Logic 1: Multiply by 11
  const computeMult11 = (num: number) => {
    const original = Math.abs(Math.floor(num));
    const res = original * 11;
    const str = original.toString();
    if (str.length === 2) {
      const d1 = parseInt(str[0], 10);
      const d2 = parseInt(str[1], 10);
      const sum = d1 + d2;
      return {
        result: res,
        explanation:
          sum < 10
            ? `First digit = ${d1}, Middle digit = ${d1} + ${d2} = ${sum}, Last digit = ${d2} ⇒ ${res}`
            : `First digit = ${d1}, Middle digit = ${d1} + ${d2} = ${sum} (Carry 1 to ${d1} ⇒ ${d1 + 1}), Last digit = ${d2} ⇒ ${res}`,
      };
    }
    return {
      result: res,
      explanation: `Add each adjacent pair of digits from right to left with carry: ${original} × 11 = ${res}`,
    };
  };

  // Logic 2: Squares ending in 5
  const computeSquare5 = (num: number) => {
    const n = Math.abs(Math.floor(num));
    const res = n * n;
    const str = n.toString();
    if (str.endsWith('5')) {
      const prefix = str.slice(0, -1);
      const a = parseInt(prefix || '0', 10);
      const aPlus1 = a + 1;
      const product = a * aPlus1;
      return {
        result: res,
        valid: true,
        explanation: `Prefix 'a' = ${a}. Multiply by (a + 1): ${a} × ${aPlus1} = ${product}. Suffix 25 ⇒ ${product}25 = ${res}!`,
      };
    }
    return {
      result: res,
      valid: false,
      explanation: `Note: Number must end in 5 for the Ekadhikena Purvena shortcut. Actual square: ${res}`,
    };
  };

  // Logic 3: Calendar Day
  const computeCalendarDay = (day: number, month: number, year: number) => {
    const monthCodes: Record<number, number> = {
      1: 0,
      2: 3,
      3: 3,
      4: 6,
      5: 1,
      6: 4,
      7: 6,
      8: 2,
      9: 5,
      10: 0,
      11: 3,
      12: 5,
    };
    const daysArr = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const century = Math.floor(year / 100);
    const yr = year % 100;

    let centuryCode = 0;
    if (century % 4 === 0) centuryCode = 6;
    else if (century % 4 === 1) centuryCode = 4;
    else if (century % 4 === 2) centuryCode = 2;
    else centuryCode = 0;

    let mCode = monthCodes[month] || 0;
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    if (isLeap && (month === 1 || month === 2)) {
      mCode = mCode - 1;
    }

    const leapYears = Math.floor(yr / 4);
    const totalSum = day + mCode + centuryCode + yr + leapYears;
    const dayIndex = ((totalSum % 7) + 7) % 7;

    return {
      dayName: daysArr[dayIndex],
      dayIndex,
      breakdown: {
        date: day,
        monthCode: mCode,
        centuryCode,
        yearLastTwo: yr,
        leapCount: leapYears,
        totalSum,
        remainder: dayIndex,
      },
    };
  };

  // Logic 4: Smart Percentages
  const computePercentage = (pct: number, base: number) => {
    const actual = (pct * base) / 100;
    const p50 = base * 0.5;
    const p10 = base * 0.1;
    const p5 = base * 0.05;
    const p1 = base * 0.01;

    return {
      actual: actual.toFixed(2),
      p50: p50.toFixed(2),
      p10: p10.toFixed(2),
      p5: p5.toFixed(2),
      p1: p1.toFixed(2),
    };
  };

  const multResult = computeMult11(multInput);
  const squareResult = computeSquare5(squareInput);
  const calResult = computeCalendarDay(calDay, calMonth, calYear);
  const pctResult = computePercentage(pctInputX, pctInputY);

  const handleCopyFormula = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs mb-2">
              <Zap className="w-3.5 h-3.5 text-amber-200" />
              <span>SANIR KITTUR VEDIC MATH VAULT</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Speed Math & Mental Calculation Lab
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl">
              Solve aptitude questions in 5 seconds without pen and paper. As taught across 34+ engineering colleges by the "APTI King of Maharashtra".
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/20 text-center">
              <p className="text-xl font-black">10x</p>
              <p className="text-[10px] text-amber-100 uppercase font-bold">Calculation Speed</p>
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/20 text-center">
              <p className="text-xl font-black">100%</p>
              <p className="text-[10px] text-amber-100 uppercase font-bold">Exam Tested</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SPEED_MATH_TRICKS.map((trick) => {
          const isSelected = selectedTrickId === trick.id;
          return (
            <button
              key={trick.id}
              onClick={() => setSelectedTrickId(trick.id)}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400/40'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {trick.tag}
                </span>
                <h4 className="text-xs font-bold mt-1.5 line-clamp-1">{trick.title}</h4>
              </div>
              <p className={`text-[10px] mt-2 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                {trick.category}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Calculator (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">{currentTrick.title}</h3>
                  <p className="text-xs text-slate-500">{currentTrick.concept}</p>
                </div>
              </div>

              <button
                onClick={() => handleCopyFormula(currentTrick.rule)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer flex items-center gap-1 text-xs"
                title="Copy Rule"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span className="text-[11px] font-semibold">{copied ? 'Copied' : 'Rule'}</span>
              </button>
            </div>

            {/* TRICK 1: 11 MULTIPLICATION INTERACTIVE */}
            {selectedTrickId === 'trick-mult-11' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enter any 2 or 3 digit number:
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={multInput}
                      onChange={(e) => setMultInput(Number(e.target.value))}
                      className="w-36 text-lg font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                    <span className="text-sm font-extrabold text-slate-400">× 11 =</span>
                    <span className="text-2xl font-mono font-black text-amber-600">
                      {multResult.result}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 mb-1">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>Live Vedic Mental Steps:</span>
                  </div>
                  <p className="text-xs font-mono text-amber-900 leading-relaxed">
                    {multResult.explanation}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500">
                  <span className="font-bold">Try quick presets:</span>
                  {[23, 45, 68, 79, 93, 125].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setMultInput(preset)}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-mono text-slate-700 cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TRICK 2: SQUARES ENDING IN 5 */}
            {selectedTrickId === 'trick-square-5' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enter any number ending in 5:
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={squareInput}
                      onChange={(e) => setSquareInput(Number(e.target.value))}
                      className="w-36 text-lg font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                    <span className="text-sm font-extrabold text-slate-400">² =</span>
                    <span className="text-2xl font-mono font-black text-amber-600">
                      {squareResult.result.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 mb-1">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>Ekadhikena Purvena Shortcut:</span>
                  </div>
                  <p className="text-xs font-mono text-amber-900 leading-relaxed">
                    {squareResult.explanation}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500">
                  <span className="font-bold">Try quick presets:</span>
                  {[25, 35, 65, 85, 95, 115].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setSquareInput(preset)}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-mono text-slate-700 cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TRICK 3: CALENDAR DAY FINDER */}
            {selectedTrickId === 'trick-calendar-magic' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      value={calDay}
                      onChange={(e) => setCalDay(Number(e.target.value))}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl p-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Month</label>
                    <select
                      value={calMonth}
                      onChange={(e) => setCalMonth(Number(e.target.value))}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl p-2 font-mono"
                    >
                      <option value={1}>Jan (0)</option>
                      <option value={2}>Feb (3)</option>
                      <option value={3}>Mar (3)</option>
                      <option value={4}>Apr (6)</option>
                      <option value={5}>May (1)</option>
                      <option value={6}>Jun (4)</option>
                      <option value={7}>Jul (6)</option>
                      <option value={8}>Aug (2)</option>
                      <option value={9}>Sep (5)</option>
                      <option value={10}>Oct (0)</option>
                      <option value={11}>Nov (3)</option>
                      <option value={12}>Dec (5)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Year</label>
                    <input
                      type="number"
                      value={calYear}
                      onChange={(e) => setCalYear(Number(e.target.value))}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl p-2 font-mono"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-900 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-indigo-300">Decoded Day of the Week:</span>
                    <span className="text-xs font-mono text-emerald-400">
                      Sum = {calResult.breakdown.totalSum} (mod 7 = {calResult.breakdown.remainder})
                    </span>
                  </div>
                  <div className="text-2xl font-black text-amber-400">{calResult.dayName}</div>
                  <p className="text-[11px] text-indigo-200 leading-relaxed font-mono">
                    Date({calResult.breakdown.date}) + MonthCode({calResult.breakdown.monthCode}) +
                    CenturyCode({calResult.breakdown.centuryCode}) + YrLast2(
                    {calResult.breakdown.yearLastTwo}) + Leap(
                    {calResult.breakdown.leapCount}) = {calResult.breakdown.totalSum}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                  <span className="font-bold">Historical Presets:</span>
                  {[
                    { label: 'Independence Day', d: 15, m: 8, y: 1947 },
                    { label: 'Republic Day', d: 26, m: 1, y: 1950 },
                    { label: 'Today (2026)', d: 21, m: 9, y: 2026 },
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCalDay(p.d);
                        setCalMonth(p.m);
                        setCalYear(p.y);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TRICK 4: SMART PERCENTAGES */}
            {selectedTrickId === 'trick-fast-percentages' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Percentage (%)
                    </label>
                    <input
                      type="number"
                      value={pctInputX}
                      onChange={(e) => setPctInputX(Number(e.target.value))}
                      className="w-24 text-sm font-bold bg-slate-50 border border-slate-300 rounded-xl p-2 font-mono"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-400 mt-5">of</span>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Base Number
                    </label>
                    <input
                      type="number"
                      value={pctInputY}
                      onChange={(e) => setPctInputY(Number(e.target.value))}
                      className="w-28 text-sm font-bold bg-slate-50 border border-slate-300 rounded-xl p-2 font-mono"
                    />
                  </div>
                  <div className="mt-5">
                    <span className="text-xl font-black text-amber-600 font-mono">
                      = {pctResult.actual}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-100">
                    <p className="text-[10px] text-slate-500 font-bold">50%</p>
                    <p className="text-xs font-mono font-bold text-slate-900">{pctResult.p50}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100">
                    <p className="text-[10px] text-slate-500 font-bold">10%</p>
                    <p className="text-xs font-mono font-bold text-slate-900">{pctResult.p10}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100">
                    <p className="text-[10px] text-slate-500 font-bold">5%</p>
                    <p className="text-xs font-mono font-bold text-slate-900">{pctResult.p5}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100">
                    <p className="text-[10px] text-slate-500 font-bold">1%</p>
                    <p className="text-xs font-mono font-bold text-slate-900">{pctResult.p1}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Rule & Step-by-Step Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white p-5 rounded-3xl space-y-4 shadow-md border border-slate-800">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Formula & Step-by-Step Guide
              </h4>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 font-mono text-xs text-emerald-300">
              {currentTrick.rule}
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-300">Example: {currentTrick.exampleProblem}</h5>
              <div className="space-y-1.5 text-xs text-slate-300">
                {currentTrick.solutionSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
