
import React, { useState } from 'react';
import { Report, ReportStatus, Faculty } from '../types';
import ReportDetail from './ReportDetail';

interface ReportListProps {
  reports: Report[];
  onUpdateStatus: (id: string, newStatus: ReportStatus, adminData?: Partial<Report>) => void;
}

const ReportList: React.FC<ReportListProps> = ({ reports, onUpdateStatus }) => {
  const [filterFaculty, setFilterFaculty] = useState<string>('All');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const filteredReports = filterFaculty === 'All' 
    ? reports 
    : reports.filter(r => r.faculty === filterFaculty);

  const selectedReport = reports.find(r => r.id === selectedReportId);

  const calculateDaysElapsed = (dateStr: string) => {
    const reportDate = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - reportDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (selectedReport) {
    return (
      <ReportDetail 
        report={selectedReport} 
        onUpdateStatus={onUpdateStatus} 
        onBack={() => setSelectedReportId(null)} 
      />
    );
  }

  const getStatusColor = (status: ReportStatus) => {
    switch(status) {
      case ReportStatus.UNRESOLVED: return 'bg-red-50 text-red-600 border-red-100';
      case ReportStatus.IN_PROGRESS: return 'bg-amber-50 text-amber-600 border-amber-100';
      case ReportStatus.RESOLVED: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Cari ID laporan..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm font-medium text-slate-500 whitespace-nowrap">Filter:</span>
          <select 
            value={filterFaculty} 
            onChange={(e) => setFilterFaculty(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none w-full sm:w-auto"
          >
            <option value="All">Semua Fakultas</option>
            {Object.values(Faculty).map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredReports.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">Tidak ada laporan ditemukan.</p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const daysElapsed = calculateDaysElapsed(report.reportedAt);
            const isWarning = daysElapsed >= 25 && report.status !== ReportStatus.RESOLVED;

            return (
              <div key={report.id} className={`bg-white p-6 rounded-3xl border ${isWarning ? 'border-red-200 bg-red-50/10' : 'border-slate-100'} shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded">ID: {report.id}</span>
                    <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                    <span className={`flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold rounded-full ${isWarning ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                      {isWarning && (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      )}
                      {daysElapsed} hari berlalu
                    </span>
                  </div>
                  <h5 className="text-lg font-bold text-slate-800 leading-tight">{report.title}</h5>
                  <div className="flex flex-wrap items-center gap-x-4 text-xs text-slate-500">
                    <span className="font-semibold text-slate-600">{report.faculty}</span>
                    <span>•</span>
                    <span>Diterima: {report.reportedAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {report.evidence && (
                    <div className="p-2 bg-blue-50 text-blue-500 rounded-lg" title="Ada Lampiran">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                    </div>
                  )}
                  <button 
                    onClick={() => setSelectedReportId(report.id)}
                    className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                  >
                    Kelola Detail
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ReportList;
