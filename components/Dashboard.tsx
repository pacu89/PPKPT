
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Report, ReportStatus, Faculty } from '../types';
import { FACULTIES } from '../constants';

interface DashboardProps {
  reports: Report[];
}

const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

const Dashboard: React.FC<DashboardProps> = ({ reports }) => {
  const stats = useMemo(() => {
    return {
      unresolved: reports.filter(r => r.status === ReportStatus.UNRESOLVED).length,
      inProgress: reports.filter(r => r.status === ReportStatus.IN_PROGRESS).length,
      resolved: reports.filter(r => r.status === ReportStatus.RESOLVED).length,
      total: reports.length
    };
  }, [reports]);

  const facultyData = useMemo(() => {
    return FACULTIES.map(faculty => ({
      name: faculty.replace('Fakultas ', ''),
      fullName: faculty,
      count: reports.filter(r => r.faculty === faculty).length
    })).sort((a, b) => b.count - a.count);
  }, [reports]);

  const statusData = [
    { name: 'Belum Teratasi', value: stats.unresolved, color: '#EF4444' },
    { name: 'Ditindaklanjuti', value: stats.inProgress, color: '#F59E0B' },
    { name: 'Selesai', value: stats.resolved, color: '#10B981' },
  ];

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-slate-500 text-sm font-medium">Total Aduan</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-3xl font-bold text-slate-800">{stats.total}</h3>
            <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-bold">Terdaftar</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-red-500 text-sm font-medium">Belum Teratasi</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-3xl font-bold text-slate-800">{stats.unresolved}</h3>
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-amber-500 text-sm font-medium">Ditindaklanjuti</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-3xl font-bold text-slate-800">{stats.inProgress}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-emerald-500 text-sm font-medium">Selesai</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-3xl font-bold text-slate-800">{stats.resolved}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bar Chart - Faculty Breakdown */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-lg font-bold text-slate-800">Distribusi Kasus per Fakultas</h4>
            <div className="flex items-center gap-2">
               <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
               <span className="text-xs text-slate-500">Jumlah Laporan</span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={facultyData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                  {facultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Status Breakdown */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <h4 className="text-lg font-bold text-slate-800 mb-8">Status Penanganan</h4>
          <div className="flex-1 h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></div>
                  <span className="text-slate-600">{s.name}</span>
                </div>
                <span className="font-bold text-slate-800">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
