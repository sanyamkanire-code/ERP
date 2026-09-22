import React, { useState } from 'react';
import { useERPData } from '../../context/ERPDataContext';
import { StudentFeeRecord } from '../../types/erp';
import { FeeReceiptModal } from '../student/FeeReceiptModal';
import {
  Building2,
  DollarSign,
  Receipt,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  Bell,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  FileSpreadsheet,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

export const FinanceDepartmentPortal: React.FC = () => {
  const { feeRecords, notifications, setToastMessage } = useERPData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<StudentFeeRecord | null>(null);

  // Financial calculations
  const totalCollections = feeRecords
    .filter((r) => r.status === 'paid')
    .reduce((acc, r) => acc + (r.paidAmount || r.totalAmount), 0);

  const totalDuesPending = feeRecords
    .filter((r) => r.status === 'pending')
    .reduce((acc, r) => acc + (r.balanceDue || r.totalAmount), 0);

  const paidCount = feeRecords.filter((r) => r.status === 'paid').length;
  const collectionRate = ((paidCount / feeRecords.length) * 100).toFixed(1);

  // Filtered fee records
  const filteredRecords = feeRecords.filter((rec) => {
    const matchesSearch =
      rec.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.transactionId && rec.transactionId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = filterDept === 'all' || rec.departmentCode === filterDept;
    const matchesStatus = filterStatus === 'all' || rec.status === filterStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Finance-specific notifications
  const financeNotifications = notifications.filter(
    (n) => n.type === 'finance' || n.title.toLowerCase().includes('fee') || n.title.toLowerCase().includes('finance')
  );

  const handleExportCSV = () => {
    const headers = 'ReceiptNumber,RollNo,StudentName,Department,Semester,AmountPaid,PaymentDate,PaymentMethod,TransactionId,Status\n';
    const rows = filteredRecords
      .map(
        (r) =>
          `"${r.receiptNumber}","${r.rollNo}","${r.studentName}","${r.departmentCode}","Sem ${r.semester}","${r.paidAmount || r.totalAmount}","${r.paymentDate || 'N/A'}","${r.paymentMethod || 'Online'}","${r.transactionId || 'N/A'}","${r.status}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NexusEng_Finance_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setToastMessage('📊 Finance Ledger exported to CSV successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-400/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>Office of the Comptroller &amp; Finance Accounts Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Finance Department Ledger &amp; Fee Reconciliation
          </h1>
          <p className="text-indigo-200 text-xs sm:text-sm mt-1 max-w-2xl">
            Real-time tracking of institutional fee collections, automatic receipt verifications, and instant bank reconciliation audit logs.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md shrink-0 self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Realized Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              ₹{totalCollections.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Directly credited to University Account</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Pending Term Dues</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              ₹{totalDuesPending.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              Due Oct 31
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Pending Semester 5 tuition &amp; lab fee</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Fee Compliance Rate</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{collectionRate}%</span>
            <span className="text-xs font-semibold text-emerald-600">High Recovery</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${collectionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Verified e-Receipts</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{paidCount}</span>
            <span className="text-xs font-semibold text-blue-600">Auto-Reconciled</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Tamper-proof digital QR signature</p>
        </div>
      </div>

      {/* Finance Department Real-Time Notifications Feed */}
      {financeNotifications.length > 0 && (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-900">
            <Bell className="w-4 h-4 text-emerald-600" />
            <span>Real-Time Finance Department Inbound Alerts</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {financeNotifications.slice(0, 4).map((notif) => (
              <div
                key={notif.id}
                className="bg-white p-3 rounded-xl border border-emerald-200/80 text-xs shadow-2xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{notif.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{notif.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">{notif.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-indigo-600" />
              Student Fee Transactions &amp; Audit Trail
            </h3>
            <p className="text-xs text-slate-500">
              Live records of fee payments, payment gateways, and institutional receipt numbers
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search student, roll no, receipt #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-64"
              />
            </div>

            {/* Department Filter */}
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="AIDS">AIDS</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid &amp; Verified</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-bold bg-slate-50/60">
                <th className="py-3 px-3">Receipt / Txn ID</th>
                <th className="py-3 px-3">Student Particulars</th>
                <th className="py-3 px-3">Branch &amp; Term</th>
                <th className="py-3 px-3">Payment Channel</th>
                <th className="py-3 px-3 text-right">Amount (₹)</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-indigo-900 block">
                      {rec.receiptNumber}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 block truncate max-w-[150px]">
                      {rec.transactionId || 'Awaiting Payment'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block">{rec.studentName}</span>
                    <span className="font-mono text-[10px] text-slate-500 block">
                      {rec.rollNo}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800 block">
                      {rec.departmentCode}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Sem {rec.semester}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-700 block">
                      {rec.paymentMethod || 'Pending Gateway'}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {rec.paymentDate || 'Not paid yet'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    ₹{(rec.paidAmount || rec.totalAmount).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {rec.status === 'paid' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Reconciled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedReceipt(rec)}
                      className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-indigo-700 border border-slate-200 hover:border-indigo-200 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 shadow-2xs"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <FeeReceiptModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
};
