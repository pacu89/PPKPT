
import React, { useState, useRef } from 'react';
import { Report, ReportStatus } from '../types';
import { analyzeReport } from '../services/geminiService';

interface ReportDetailProps {
  report: Report;
  onUpdateStatus: (id: string, newStatus: ReportStatus, adminData?: Partial<Report>) => void;
  onBack: () => void;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ report, onUpdateStatus, onBack }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const skInputRef = useRef<HTMLInputElement>(null);
  
  // Local state for admin fields
  const [adminData, setAdminData] = useState({
    victimIdentities: report.victimIdentities || '',
    witnessIdentities: report.witnessIdentities || '',
    investigationProcess: report.investigationProcess || '',
    sanctionRecommendation: report.sanctionRecommendation || '',
    sanctionSK: report.sanctionSK || null
  });

  const handleUpdate = () => {
    setIsSaving(true);
    onUpdateStatus(report.id, report.status, adminData);
    setTimeout(() => {
      setIsSaving(false);
      alert('Data investigasi berhasil diperbarui.');
    }, 500);
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    const analysis = await analyzeReport(report.title, report.description);
    if (analysis) {
      alert(`Analisis AI PPKPT:\n\nKategori: ${analysis.category}\nUrgensi: ${analysis.urgency}\n\nRingkasan: ${analysis.summary}`);
    } else {
      alert('Maaf, analisis AI sedang tidak tersedia.');
    }
    setAnalyzing(false);
  };

  const handleSKUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminData({
          ...adminData,
          sanctionSK: {
            name: file.name,
            type: file.type,
            data: reader.result as string
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusColor = (status: ReportStatus) => {
    switch(status) {
      case ReportStatus.UNRESOLVED: return 'bg-red-50 text-red-600 border-red-100';
      case ReportStatus.IN_PROGRESS: return 'bg-amber-50 text-amber-600 border-amber-100';
      case ReportStatus.RESOLVED: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    }
  };

  const renderFilePreview = (file: { name: string, type: string, data: string }) => {
    if (file.type.startsWith('image/')) {
      return <img src={file.data} alt={file.name} className="max-w-full h-auto rounded-xl border border-slate-200 shadow-sm" />;
    } else {
      return (
        <a href={file.data} download={file.name} className="flex items-center gap-2 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors w-max">
          <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div className="text-left">
            <p className="text-sm font-medium text-slate-800">{file.name}</p>
            <p className="text-xs text-slate-400">Klik untuk unduh</p>
          </div>
        </a>
      );
    }
  };

  const renderEvidence = () => {
    if (!report.evidence) return <p className="text-slate-400 text-sm italic">Tidak ada barang bukti terlampir.</p>;

    const { type, data, name } = report.evidence;
    if (type.startsWith('image/')) {
      return <img src={data} alt={name} className="max-w-full h-auto rounded-xl border border-slate-200 shadow-sm" />;
    } else if (type.startsWith('video/')) {
      return <video controls src={data} className="w-full rounded-xl border border-slate-200 shadow-sm" />;
    } else if (type.startsWith('audio/')) {
      return <audio controls src={data} className="w-full mt-2" />;
    } else {
      return (
        <a href={data} download={name} className="flex items-center gap-2 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors w-max">
          <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div className="text-left">
            <p className="text-sm font-medium text-slate-800">{name}</p>
            <p className="text-xs text-slate-400">Klik untuk unduh dokumen</p>
          </div>
        </a>
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-20">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Kembali ke Daftar
        </button>
        <button 
          onClick={handleUpdate}
          disabled={isSaving}
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-100 flex items-center gap-2 hover:bg-emerald-700 transition-all"
        >
          {isSaving ? 'Menyimpan...' : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Simpan Perubahan
            </>
          )}
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header Detail */}
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-bold rounded uppercase">ID: {report.id}</span>
              <span className={`px-4 py-1 text-sm font-bold rounded-full border ${getStatusColor(report.status)}`}>
                {report.status}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{report.title}</h3>
            <p className="text-slate-500 font-medium">{report.faculty}</p>
          </div>
          <div className="flex flex-col gap-3 min-w-[200px]">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ganti Status</label>
             <select 
                value={report.status} 
                onChange={(e) => onUpdateStatus(report.id, e.target.value as ReportStatus, adminData)}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                <option value={ReportStatus.UNRESOLVED}>Belum Teratasi</option>
                <option value={ReportStatus.IN_PROGRESS}>Sedang Ditindaklanjuti</option>
                <option value={ReportStatus.RESOLVED}>Selesai</option>
              </select>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-7 space-y-10">
            {/* User Provided Content */}
            <section className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              <h4 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Informasi Laporan (User)</h4>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Deskripsi</p>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{report.description}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Barang Bukti</p>
                  {renderEvidence()}
                </div>
              </div>
            </section>

            {/* Admin Management Section */}
            <section className="space-y-6">
              <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 00-2 2v12a2 2 0 002-2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                Panel Administrasi Investigasi
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Identitas Korban</label>
                  <textarea
                    value={adminData.victimIdentities}
                    onChange={(e) => setAdminData({...adminData, victimIdentities: e.target.value})}
                    placeholder="Nama, NIM/NIP, Fakultas korban..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none min-h-[100px] text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Identitas Saksi</label>
                  <textarea
                    value={adminData.witnessIdentities}
                    onChange={(e) => setAdminData({...adminData, witnessIdentities: e.target.value})}
                    placeholder="Daftar saksi yang terlibat..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none min-h-[100px] text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Proses Investigasi</label>
                <textarea
                  value={adminData.investigationProcess}
                  onChange={(e) => setAdminData({...adminData, investigationProcess: e.target.value})}
                  placeholder="Catatan kronologis pemeriksaan, wawancara, dan temuan..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none min-h-[150px] text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Rekomendasi Sanksi (Opsional)</label>
                  <textarea
                    value={adminData.sanctionRecommendation}
                    onChange={(e) => setAdminData({...adminData, sanctionRecommendation: e.target.value})}
                    placeholder="Saran tindakan disipliner..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none min-h-[100px] text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">SK Sanksi (Opsional - Gambar/PDF)</label>
                  <div className="space-y-3">
                    <button 
                      type="button"
                      onClick={() => skInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-200 transition-all text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      {adminData.sanctionSK ? 'Ganti File SK' : 'Unggah File SK'}
                    </button>
                    <input 
                      type="file"
                      ref={skInputRef}
                      onChange={handleSKUpload}
                      accept="image/*,application/pdf"
                      className="hidden"
                    />
                    {adminData.sanctionSK && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-slate-500 uppercase">Lampiran SK:</span>
                          <button 
                            type="button"
                            onClick={() => setAdminData({...adminData, sanctionSK: null})}
                            className="text-red-500 text-xs font-bold hover:underline"
                          >
                            Hapus
                          </button>
                        </div>
                        {renderFilePreview(adminData.sanctionSK)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl space-y-4 border border-slate-100">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Informasi Pelapor
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm py-1 border-b border-slate-100">
                  <span className="text-slate-400">Nama:</span>
                  <span className="text-slate-700 font-semibold">{report.reporterName}</span>
                </div>
                <div className="flex justify-between text-sm py-1 border-b border-slate-100">
                  <span className="text-slate-400">NIM/NIP:</span>
                  <span className="text-slate-700 font-mono">{report.reporterId}</span>
                </div>
                <div className="flex justify-between text-sm py-1 border-b border-slate-100">
                  <span className="text-slate-400">Kejadian:</span>
                  <span className="text-slate-700 font-medium">{report.incidentDate}</span>
                </div>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-slate-400">Lapor pada:</span>
                  <span className="text-slate-700 font-medium">{report.reportedAt}</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 space-y-4">
              <h4 className="text-sm font-bold text-indigo-800 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Asisten Analisis AI
              </h4>
              <p className="text-xs text-indigo-600 leading-relaxed">
                Gunakan AI untuk mengkategorikan urgensi dan merangkum poin-poin penting dari narasi korban secara otomatis.
              </p>
              <button 
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 text-sm"
              >
                {analyzing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Memproses...
                  </span>
                ) : 'Dapatkan Analisis AI'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
