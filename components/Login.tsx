
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (success: boolean) => void;
  onCancel: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Updated authentication credentials: username: admin, password: 123456
    if (username === 'admin' && password === '123456') {
      onLogin(true);
    } else {
      setError('Username atau password salah.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-100 shadow-xl mt-12">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800">Login Administrator</h3>
        <p className="text-slate-500 text-sm">Masuk untuk mengelola laporan PPKPT</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg font-medium">
            {error}
          </div>
        )}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="admin"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="••••••••"
            required
          />
        </div>
        <div className="pt-2 flex flex-col gap-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
          >
            Masuk ke Panel Admin
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-slate-50 text-slate-500 font-semibold py-3 rounded-xl hover:bg-slate-100 transition-all text-sm"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
