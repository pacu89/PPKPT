
import React from 'react';
import { Faculty, ReportStatus, Report } from './types';

export const FACULTIES = Object.values(Faculty);

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'REP-001',
    reporterName: 'Mahasiswa A',
    reporterId: '09021182025001',
    faculty: Faculty.FASILKOM,
    title: 'Pelecehan Verbal di Area Kantin',
    description: 'Terjadi tindakan pelecehan verbal secara berulang oleh oknum tertentu saat sedang makan siang.',
    incidentDate: '2024-03-10',
    reportedAt: '2024-03-11',
    status: ReportStatus.UNRESOLVED
  },
  {
    id: 'REP-002',
    reporterName: 'Mahasiswa B',
    reporterId: '04011182126002',
    faculty: Faculty.KEDOKTERAN,
    title: 'Diskriminasi Gender dalam Kelompok Studi',
    description: 'Dikeluarkan dari kelompok praktikum tanpa alasan yang jelas dan mendapat perlakuan diskriminatif.',
    incidentDate: '2024-02-15',
    reportedAt: '2024-02-16',
    status: ReportStatus.IN_PROGRESS
  },
  {
    id: 'REP-003',
    reporterName: 'Mahasiswa C',
    reporterId: '03031281924003',
    faculty: Faculty.TEKNIK,
    title: 'Bullying di Organisasi Kemahasiswaan',
    description: 'Mendapat tekanan psikis berlebihan saat kegiatan pengaderan organisasi.',
    incidentDate: '2024-01-20',
    reportedAt: '2024-01-21',
    status: ReportStatus.RESOLVED
  },
  {
    id: 'REP-004',
    reporterName: 'Mahasiswa D',
    reporterId: '01011182025044',
    faculty: Faculty.EKONOMI,
    title: 'Kekerasan Fisik Ringan',
    description: 'Terjadi gesekan fisik saat antrian administrasi yang berujung pada intimidasi.',
    incidentDate: '2024-03-12',
    reportedAt: '2024-03-13',
    status: ReportStatus.UNRESOLVED
  }
];
