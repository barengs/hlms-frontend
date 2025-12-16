import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { AuthLayout } from '@/components/layouts';
import { Button, Input, Select } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    if (!agreed) {
      setError('Anda harus menyetujui syarat dan ketentuan');
      return;
    }

    try {
      await register(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    }
  };

  return (
    <AuthLayout
      title="Buat Akun Baru"
      subtitle="Mulai perjalanan belajar Anda bersama kami"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <Input
          label="Nama Lengkap"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Masukkan nama lengkap"
          leftIcon={<User className="w-5 h-5" />}
          required
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@email.com"
          leftIcon={<Mail className="w-5 h-5" />}
          required
        />

        <Select
          label="Daftar Sebagai"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          options={[
            { value: 'student', label: 'Siswa / Peserta' },
            { value: 'instructor', label: 'Instruktur / Pengajar' },
          ]}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimal 8 karakter"
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

        <Input
          label="Konfirmasi Password"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Ulangi password"
          leftIcon={<Lock className="w-5 h-5" />}
          required
        />

        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">
            Saya menyetujui{' '}
            <Link to="/terms" className="text-blue-600 hover:text-blue-700">
              Syarat & Ketentuan
            </Link>{' '}
            dan{' '}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
              Kebijakan Privasi
            </Link>
          </span>
        </label>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Daftar
        </Button>

        <p className="text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
            Masuk
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
