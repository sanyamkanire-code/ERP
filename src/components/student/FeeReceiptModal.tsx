import React from 'react';
import { StudentFeeRecord } from '../../types/erp';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  GraduationCap,
  Building2,
  QrCode,
  ShieldCheck,
  Calendar,
  CreditCard,
} from 'lucide-react';

interface FeeReceiptModalProps {
  receipt: StudentFeeRecord;
  onClose: () => void;
}

// Convert amount number to English words for official receipts
function numberToWords(num: number): string {
  if (num === 0) return 'Zero Rupees Only';
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000)
      return (
        a[Math.floor(n / 100)] +
        ' Hundred' +
        (n % 100 !== 0 ? ' and ' + inWords(n % 100) : '')
      );
    if (n < 100000)
      return (
        inWords(Math.floor(n / 1000)) +
        ' Thousand' +
        (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '')
      );
    if (n < 10000000)
      return (
        inWords(Math.floor(n / 100000)) +
        ' Lakh' +
        (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '')
      );
    return (
      inWords(Math.floor(n / 10000000)) +
      ' Crore' +
      (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '')
    );
  }

  return inWords(Math.round(num)) + ' Rupees Only';
}

export const FeeReceiptModal: React.FC<FeeReceiptModalProps> = ({ receipt, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="fee-receipt-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Modal Action Header (Excluded in print) */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-xs tracking-wide">
              Official Institutional Fee Receipt
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="print-receipt-btn"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              id="close-receipt-btn"
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 bg-white">
          {/* Institutional Branding Header */}
          <div className="border-b-2 border-slate-900 pb-5 text-center relative">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-900 text-white flex items-center justify-center shadow-md">
                <GraduationCap className="w-6 h-6 text-indigo-200" />
              </div>
              <div className="text-left">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase leading-none">
                  Nexus Institute of Technology
                </h2>
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 mt-0.5">
                  Autonomous Engineering College • Affiliated to State Tech University
                </p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 max-w-lg mx-auto font-mono">
              Campus Road, Knowledge Park II, Tech Zone • Accredited with &apos;A++&apos; Grade • GSTIN: 29AAATN9128K1Z8
            </p>

            <div className="mt-3 inline-block bg-indigo-50 border border-indigo-200 text-indigo-950 px-4 py-1 rounded-full text-xs font-black tracking-wider uppercase">
              Official e-Fee Receipt & Accounts Acknowledgment
            </div>
          </div>

          {/* Receipt Metadata Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Receipt Number
              </span>
              <span className="font-mono font-black text-indigo-900 text-xs">
                {receipt.receiptNumber}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Payment Date
              </span>
              <span className="font-semibold text-slate-800 text-xs">
                {receipt.paymentDate || 'Today'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Academic Session
              </span>
              <span className="font-semibold text-slate-800 text-xs">
                {receipt.academicYear} • Sem {receipt.semester}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Reconciliation Status
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded text-[11px]">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                VERIFIED & PAID
              </span>
            </div>
          </div>

          {/* Student Information Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 text-xs">
            <div className="space-y-1.5">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Student Name:</span>
                <p className="font-extrabold text-slate-900 text-sm">{receipt.studentName}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Enrollment / Roll No:</span>
                <p className="font-mono font-bold text-slate-800">{receipt.rollNo}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Student ID:</span>
                <p className="font-mono text-slate-600">{receipt.studentId}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Branch & Department:</span>
                <p className="font-semibold text-slate-800">{receipt.department}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Degree Program:</span>
                <p className="font-semibold text-slate-800">
                  Bachelor of Technology (B.Tech • 4 Years)
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Transaction ID:</span>
                <p className="font-mono font-semibold text-indigo-700 truncate">
                  {receipt.transactionId || 'TXN-ONLINE-09823190'}
                </p>
              </div>
            </div>
          </div>

          {/* Itemized Fee Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">#</th>
                  <th className="py-2.5 px-3">Fee Particular / Component</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {receipt.items
                  .filter((it) => it.selected !== false)
                  .map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 text-center text-slate-400 font-mono text-[11px]">
                        {index + 1}
                      </td>
                      <td className="py-2 px-3">
                        <span className="font-semibold text-slate-900 block">{item.name}</span>
                        {item.description && (
                          <span className="text-[10px] text-slate-500 block leading-tight">
                            {item.description}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                        ₹{item.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot className="bg-slate-50/80 border-t border-slate-200 text-xs font-semibold divide-y divide-slate-200/60">
                <tr>
                  <td colSpan={3} className="py-2 px-3 text-right text-slate-600">
                    Gross Subtotal:
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">
                    ₹{receipt.subtotal.toLocaleString()}
                  </td>
                </tr>
                {receipt.scholarshipDeduction > 0 && (
                  <tr className="text-emerald-700">
                    <td colSpan={3} className="py-2 px-3 text-right">
                      Dean&apos;s Merit Scholarship Concession (CGPA &gt; 8.5):
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold">
                      - ₹{receipt.scholarshipDeduction.toLocaleString()}
                    </td>
                  </tr>
                )}
                {receipt.lateFee > 0 && (
                  <tr className="text-amber-700">
                    <td colSpan={3} className="py-2 px-3 text-right">
                      Late Surcharge:
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold">
                      + ₹{receipt.lateFee.toLocaleString()}
                    </td>
                  </tr>
                )}
                <tr className="bg-indigo-900 text-white font-extrabold text-sm">
                  <td colSpan={3} className="py-3 px-4 text-right tracking-wide">
                    TOTAL AMOUNT PAID:
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-base tracking-tight text-emerald-300">
                    ₹{receipt.paidAmount.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Amount In Words */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Amount In Words:
              </span>
              <p className="font-bold text-slate-800 italic">
                {numberToWords(receipt.paidAmount)}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Payment Channel:
              </span>
              <span className="font-bold text-indigo-700">
                {receipt.paymentMethod || 'Online Payment Gateway'}
              </span>
            </div>
          </div>

          {/* Verification QR & Authorized Signatures */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
            {/* QR Code Validation */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                <QrCode className="w-12 h-12 text-slate-900" />
              </div>
              <div className="text-[11px]">
                <span className="font-bold text-slate-800 block">Digitally Signed & Certified</span>
                <span className="font-mono text-[10px] text-slate-500 block truncate max-w-[200px]">
                  VERIFIED-HASH#{receipt.receiptNumber}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold block">
                  Reconciled with Finance Dept Ledger
                </span>
              </div>
            </div>

            {/* Official Stamps */}
            <div className="flex items-center gap-6 text-right">
              <div className="text-center">
                <div className="w-24 h-10 border-b border-slate-400 flex items-end justify-center pb-1">
                  <span className="font-mono text-[10px] font-bold text-indigo-900 italic">
                    Dr. P. Swaminathan
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 block mt-1">
                  Finance Officer
                </span>
              </div>

              <div className="text-center">
                <div className="w-24 h-10 border-b border-slate-400 flex items-end justify-center pb-1">
                  <span className="font-mono text-[10px] font-bold text-indigo-900 italic">
                    Dr. A. Subramanian
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 block mt-1">
                  Dean of Academics
                </span>
              </div>
            </div>
          </div>

          {/* Legal / Institutional Disclaimer */}
          <p className="text-[10px] text-slate-400 text-center pt-2 font-mono">
            This is a computer-generated institutional receipt issued by Nexus Institute of Technology ERP System. No physical signature required.
          </p>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between shrink-0 print:hidden">
          <span className="text-xs text-slate-500">
            Keep this receipt for semester examinations and hostel gate pass clearance.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download Receipt
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
