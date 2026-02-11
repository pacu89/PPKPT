
import React, { useState, useRef } from 'react';
import { Faculty, Report, ReportStatus } from '../types';
import { FACULTIES } from '../constants';

interface ReportFormProps {
  onSubmit: (report: Omit<Report, 'id' | 'reportedAt' | 'status'>) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    reporterName: '',
    reporterId: '',
    faculty: FACULTIES[0],
    description: '',
    incidentDate: '',
    isAnonymous: false
  });
  const [evidence, setEvidence] = useState<{ name: string; type: string; data: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidence({
          name: file.name,
          type: file.type,
          data: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      reporterName: formData.isAnonymous ? 'Anonim' : formData.reporterName,
      reporterId: formData.reporterId,
      faculty: formData.faculty,
      description: formData.description,
      incidentDate: formData.incidentDate,
      evidence: evidence || undefined
    });
    
    // Reset form
    setFormData({
      title: '',
      reporterName: '',
      reporterId: '',
      faculty: FACULTIES[0],
      description: '',
      incidentDate: '',
      isAnonymous: false
    });
    setEvidence(null);
    alert('Aduan Anda telah berhasil dikirim. Tim PPKPT akan menindaklanjuti segera.');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <div className="mb-8 text-center md:text-left">
        <h3 className="text-2xl font-bold text-slate-800">Formulir Pengaduan</h3>
        <p className="text-slate-500 text-sm">Sampaikan keluhan Anda secara aman. Kerahasiaan Anda adalah prioritas kami.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nama Pelapor</label>
            <input
              type="text"
              disabled={formData.isAnonymous}
              value={formData.reporterName}
              onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
              className={`w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${formData.isAnonymous ? 'bg-slate-50 opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Nama lengkap Anda"
              required={!formData.isAnonymous}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">NIM / NIP</label>
            <input
              type="text"
              value={formData.reporterId}
              onChange={(e) => setFormData({ ...formData, reporterId: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Nomor Identitas Mahasiswa/Dosen"
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="anonymous"
            checked={formData.isAnonymous}
            onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="anonymous" className="text-sm text-slate-600 cursor-pointer">Laporkan sebagai anonim</label>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Judul Laporan</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="Misal: Pelecehan di Gedung Kuliah"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Fakultas Terkait</label>
            <select
              value={formData.faculty}
              onChange={(e) => setFormData({ ...formData, faculty: e.target.value as Faculty })}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
              required
            >
              {FACULTIES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Tanggal Kejadian</label>
            <input
              type="date"
              value={formData.incidentDate}
              onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Deskripsi Kejadian</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32"
            placeholder="Ceritakan detail kejadian dengan jelas..."
            required
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Unggah Barang Bukti</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            />
            {evidence ? (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 truncate max-w-[200px]">{evidence.name}</p>
                  <p className="text-xs text-slate-400">{(evidence.type || 'Dokumen')}</p>
                </div>
                <button 
                  type="button" 
                  onClick={(e) => { e.stopPropagation(); setEvidence(null); }}
                  className="p-1 hover:text-red-500"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ) : (
              <>
                <svg className="w-10 h-10 text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm font-medium text-slate-600">Klik untuk unggah file</p>
                <p className="text-xs text-slate-400 mt-1">Gambar, Video, Audio, atau PDF (Maks 10MB)</p>
              </>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Kirim Aduan Sekarang
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
