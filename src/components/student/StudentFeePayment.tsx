import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useERPData } from '../../context/ERPDataContext';
import { FeeBreakdownItem, StudentFeeRecord } from '../../types/erp';
import { FeeReceiptModal } from './FeeReceiptModal';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Building2,
  FileText,
  Printer,
  ChevronRight,
  QrCode,
  Smartphone,
  ArrowRight,
  HelpCircle,
  Receipt,
  Percent,
} from 'lucide-react';

export const StudentFeePayment: React.FC = () => {
  const { currentUser } = useAuth();
  const { feeRecords, defaultFeeStructure, payCollegeFee } = useERPData();

  // Find the student's current semester fee record
  const currentSemRecord = feeRecords.find(
    (r) => r.studentId === currentUser.id && r.semester === 5
  ) || feeRecords[0];

  // Fee item selection state
  const [items, setItems] = useState<FeeBreakdownItem[]>(() => {
    if (currentSemRecord && currentSemRecord.items) {
      // Merge with default fee structure if needed
      return defaultFeeStructure.map((d) => {
        const existing = currentSemRecord.items.find((i) => i.id === d.id);
        return existing || d;
      });
    }
    return defaultFeeStructure;
  });

  // Concession / Coupon Code state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCouponDiscount, setAppliedCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  // Merit discount based on student's high CGPA
  const meritDiscount = 8000; // Dean's Merit Scholarship (CGPA 8.85)

  // Payment Method selection
  const [paymentMethod, setPaymentMethod] = useState<
    'UPI' | 'Net Banking' | 'Debit Card' | 'Credit Card' | 'NEFT/RTGS'
  >('UPI');
  const [upiId, setUpiId] = useState('rahul.sharma@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Payment state
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedReceiptForView, setSelectedReceiptForView] = useState<StudentFeeRecord | null>(null);

  // Toggle optional item
  const handleToggleItem = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId && item.isOptional) {
          return { ...item, selected: !item.selected };
        }
        return item;
      })
    );
  };

  // Calculate fees dynamically
  const subtotal = items.reduce(
    (acc, it) => acc + (it.selected !== false ? it.amount : 0),
    0
  );
  const totalDeductions = meritDiscount + appliedCouponDiscount;
  const grandTotal = Math.max(0, subtotal - totalDeductions);

  // Handle promo/concession code
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'TECHFEST' || code === 'NEXUS2026') {
      setAppliedCouponDiscount(2000);
      setCouponMessage('✅ Promo Code Applied: ₹2,000 Institutional Grant Deducted!');
    } else if (code === 'SIBLING10') {
      setAppliedCouponDiscount(3500);
      setCouponMessage('✅ Sibling Enrollment Concession: ₹3,500 Deducted!');
    } else {
      setCouponMessage('❌ Invalid concession code. Use "NEXUS2026" or "SIBLING10".');
    }
  };

  // Execute payment
  const handlePayNow = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Ignored if canvas-confetti fails
      }

      // Execute fee payment via context
      const generatedReceipt = payCollegeFee(
        currentSemRecord ? currentSemRecord.id : 'fee-rec-sem5',
        paymentMethod,
        items,
        totalDeductions
      );

      setIsProcessing(false);
      setSelectedReceiptForView(generatedReceipt);
    }, 1200);
  };

  // Filter student fee records for receipts history
  const studentReceiptHistory = feeRecords.filter(
    (r) => r.studentId === currentUser.id || r.rollNo === currentUser.studentId
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Encrypted Payment Gateway • Finance Office Synced</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            College Fee Payment &amp; Instant e-Receipts
          </h1>
          <p className="text-indigo-200 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Review detailed fee calculations, customize optional hostel/transport services, and make secure college fee payments. Official e-receipts are automatically generated and dispatched to the Finance Department ledger in real time.
          </p>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Grid: Calculator & Payment on Left (2 cols), Receipt Archive & Summary on Right (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Interactive Fee Calculator & Payment Portal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Fee Calculation Section */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  Semester 5 Fee Assessment Breakdown
                </h3>
                <p className="text-xs text-slate-500">
                  Academic Year 2026-2027 • B.Tech Computer Science &amp; Engineering
                </p>
              </div>

              {currentSemRecord && currentSemRecord.status === 'paid' ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Fees Fully Paid
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 self-start sm:self-auto">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Payment Due: Oct 31, 2026
                </span>
              )}
            </div>

            {/* Itemized Checkable List */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Standard &amp; Elective Fee Particulars
              </span>

              <div className="space-y-2.5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => item.isOptional && handleToggleItem(item.id)}
                    className={`p-3.5 rounded-2xl border transition flex items-start justify-between gap-3 ${
                      item.isOptional ? 'cursor-pointer' : ''
                    } ${
                      item.selected !== false
                        ? 'bg-slate-50/80 border-slate-200 hover:border-indigo-300'
                        : 'bg-white border-slate-200/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        <input
                          type="checkbox"
                          checked={item.selected !== false}
                          disabled={!item.isOptional}
                          onChange={() => item.isOptional && handleToggleItem(item.id)}
                          className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500 cursor-pointer disabled:opacity-80"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">
                            {item.name}
                          </span>
                          {item.isOptional ? (
                            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200">
                              Optional Service
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              Mandatory
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="font-mono font-bold text-xs text-slate-900 shrink-0">
                      ₹{item.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Concession / Voucher & Merit Scholarship */}
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-xs text-indigo-950">
                    Dean&apos;s Academic Merit Concession
                  </span>
                </div>
                <span className="font-mono font-extrabold text-xs text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                  - ₹{meritDiscount.toLocaleString()} (Applied)
                </span>
              </div>
              <p className="text-[11px] text-indigo-800">
                Awarded automatically based on your cumulative 8.85 CGPA in Semester 4 examinations.
              </p>

              {/* Promo Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-2 border-t border-indigo-100">
                <input
                  type="text"
                  placeholder="Enter Concession Code (e.g. NEXUS2026)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="px-3 py-1.5 bg-white text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 flex-1 font-mono uppercase"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs shrink-0"
                >
                  Apply
                </button>
              </form>
              {couponMessage && (
                <p className="text-[11px] font-semibold text-indigo-900">{couponMessage}</p>
              )}
            </div>

            {/* Detailed Calculation Summary Table */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Selected Items Subtotal:</span>
                <span className="font-mono font-semibold">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Total Scholarship &amp; Concessions:</span>
                <span className="font-mono font-bold">- ₹{totalDeductions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Late Fee Surcharge:</span>
                <span className="font-mono font-semibold text-emerald-600">₹0 (On-Time)</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-slate-900 font-extrabold text-sm">
                <span>Net Total Payable Amount:</span>
                <span className="font-mono text-lg text-indigo-900 font-black">
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Gateway Selection & Action */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              Select Secure Payment Gateway
            </h3>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'UPI'
                    ? 'bg-indigo-50/80 border-indigo-500 text-indigo-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <QrCode className="w-4 h-4 text-indigo-600" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Net Banking')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'Net Banking'
                    ? 'bg-indigo-50/80 border-indigo-500 text-indigo-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>Net Banking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Debit Card')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'Debit Card'
                    ? 'bg-indigo-50/80 border-indigo-500 text-indigo-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <span>Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NEFT/RTGS')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'NEFT/RTGS'
                    ? 'bg-indigo-50/80 border-indigo-500 text-indigo-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>NEFT / RTGS</span>
              </button>
            </div>

            {/* Payment Method Details Form */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              {paymentMethod === 'UPI' && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs shrink-0 text-center">
                      <QrCode className="w-20 h-20 text-slate-900 mx-auto" />
                      <span className="text-[10px] font-bold text-slate-400 mt-1 block">
                        Scan with GPay / PhonePe
                      </span>
                    </div>
                    <div className="w-full space-y-2">
                      <label className="text-xs font-bold text-slate-700 block">
                        Or enter UPI Virtual Payment Address (VPA)
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@bank"
                        className="w-full px-3 py-2 bg-white text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                      />
                      <p className="text-[11px] text-slate-500">
                        Zero transaction fees on verified UPI payments.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'Net Banking' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    Choose Authorized Banking Partner
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 bg-white text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="HDFC Bank">HDFC Bank (Instant Campus Gateway)</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank Corporate &amp; Retail</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'Debit Card' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-white text-xs rounded-xl border border-slate-200 font-mono"
                  />
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      defaultValue="08/28"
                      className="px-3 py-1.5 bg-white text-xs rounded-xl border border-slate-200 font-mono"
                    />
                    <input
                      type="password"
                      placeholder="CVV (•••)"
                      defaultValue="724"
                      className="px-3 py-1.5 bg-white text-xs rounded-xl border border-slate-200 font-mono"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'NEFT/RTGS' && (
                <div className="space-y-1.5 text-xs text-slate-700">
                  <p className="font-bold text-slate-900">University Virtual Account Details:</p>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] space-y-1">
                    <div>Beneficiary: NEXUS INSTITUTE OF TECHNOLOGY</div>
                    <div>Account No: 9102830029340982</div>
                    <div>IFSC: HDFC0001092 (Knowledge Park Branch)</div>
                  </div>
                </div>
              )}
            </div>

            {/* Pay Button */}
            <button
              id="submit-fee-payment-btn"
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 disabled:opacity-60 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Verification with Finance Dept...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Pay ₹{grandTotal.toLocaleString()} &amp; Generate e-Receipt</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                256-Bit SSL Encrypted
              </span>
              <span>Finance Dept Notification Dispatched Automatically</span>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Receipts Archive & Department Oversight Details */}
        <div className="space-y-6">
          {/* Institutional Receipt Archive Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-indigo-600" />
                Payment Receipts Archive
              </h4>
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                {studentReceiptHistory.length} Receipts
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              Auto-generated digital receipts with official QR codes and Finance Department reconciliation seals.
            </p>

            <div className="space-y-2.5">
              {studentReceiptHistory.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-indigo-300 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">
                        Semester {rec.semester} College Fees
                      </span>
                      <span className="font-mono text-[10px] text-indigo-700 font-semibold block">
                        {rec.receiptNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {rec.paymentDate || rec.academicYear}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-xs text-slate-900 block">
                        ₹{(rec.paidAmount || rec.totalAmount).toLocaleString()}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          rec.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedReceiptForView(rec)}
                    className="w-full mt-2 py-1.5 px-2.5 bg-white hover:bg-indigo-50 text-indigo-700 border border-slate-200 hover:border-indigo-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View / Print Official e-Receipt</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Finance Dept Reassurance & Notice */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-3xl shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <h5 className="font-bold text-xs tracking-wide">
                Campus Accounts &amp; Finance Office Notice
              </h5>
            </div>
            <p className="text-[11px] text-indigo-200 leading-relaxed">
              Upon fee clearance, your examination hall ticket, library borrowing privileges, and contactless campus gate turnstile passes are unlocked instantaneously.
            </p>
            <div className="pt-2 border-t border-indigo-800/80 text-[10px] text-indigo-300 flex items-center justify-between">
              <span>Accounts Helpline: Ext 402</span>
              <span>finance@nexuseng.edu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Fee Receipt Modal */}
      {selectedReceiptForView && (
        <FeeReceiptModal
          receipt={selectedReceiptForView}
          onClose={() => setSelectedReceiptForView(null)}
        />
      )}
    </div>
  );
};
