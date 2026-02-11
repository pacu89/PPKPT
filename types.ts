
export enum ReportStatus {
  UNRESOLVED = 'Belum Teratasi',
  IN_PROGRESS = 'Sedang Ditindaklanjuti',
  RESOLVED = 'Selesai'
}

export enum Faculty {
  EKONOMI = 'Fakultas Ekonomi',
  HUKUM = 'Fakultas Hukum',
  TEKNIK = 'Fakultas Teknik',
  KEDOKTERAN = 'Fakultas Kedokteran',
  PERTANIAN = 'Fakultas Pertanian',
  FKIP = 'Fakultas Keguruan dan Ilmu Pendidikan',
  FISIP = 'Fakultas Ilmu Sosial dan Ilmu Politik',
  MIPA = 'Fakultas MIPA',
  FASILKOM = 'Fakultas Ilmu Komputer',
  FKM = 'Fakultas Kesehatan Masyarakat'
}

export interface Report {
  id: string;
  reporterName?: string;
  reporterId?: string;
  faculty: Faculty;
  title: string;
  description: string;
  incidentDate: string;
  reportedAt: string;
  status: ReportStatus;
  aiAssessment?: string;
  evidence?: {
    name: string;
    type: string;
    data: string; // base64 representation
  };
  // Admin-only investigation fields
  witnessIdentities?: string;
  victimIdentities?: string;
  investigationProcess?: string;
  sanctionRecommendation?: string;
  sanctionSK?: {
    name: string;
    type: string;
    data: string; // base64 representation
  };
}

export interface FacultyStats {
  name: Faculty;
  count: number;
}
