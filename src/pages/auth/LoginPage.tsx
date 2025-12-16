import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { AuthLayout } from '@/components/layouts';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    }
  };

  // Demo accounts info
  const demoAccounts = [
    { email: 'student@example.com', role: 'Siswa' },
    { email: 'instructor@example.com', role: 'Instruktur' },
    { email: 'admin@example.com', role: 'Admin' },
  ];

  return (
    <AuthLayout
      title="Selamat Datang Kembali"
      subtitle="Masuk ke akun Anda untuk melanjutkan belajar"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@email.com"
          leftIcon={<Mail className="w-5 h-5" />}
          required
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Masukkan password"
          leftIcon={<Lock className="w-5 h-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Ingat saya</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Lupa password?
          </Link>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Masuk
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Atau</span>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600">
          Belum punya akun?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700">
            Daftar sekarang
          </Link>
        </p>

        {/* Demo accounts */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center mb-3">Akun demo (password: apapun)</p>
          <div className="grid grid-cols-3 gap-2">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => {
                  setEmail(account.email);
                  setPassword('demo');
                }}
                className="px-2 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
              >
                {account.role}
              </button>
            ))}
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
