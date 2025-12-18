import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  MessageSquare,
  FileText,
  Star,
  ArrowUpRight,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layouts';
import { Card, CardHeader, CardTitle, Badge, Button, Avatar } from '@/components/ui';
import { mockCourses } from '@/data/mockData';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export function InstructorDashboard() {
  const { user } = useAuth();

  // Mock stats
  const stats = {
    totalCourses: 5,
    totalStudents: 15420,
    totalEarnings: 45000000,
    monthlyEarnings: 8500000,
    pendingPayouts: 3200000,
    avgRating: 4.8,
    pendingQuestions: 12,
    pendingSubmissions: 5,
  };

  // Mock courses with analytics
  const courses = mockCourses.slice(0, 4).map((course, index) => ({
    ...course,
    enrollmentsThisMonth: [120, 85, 45, 23][index],
    revenueThisMonth: [3600000, 2550000, 1350000, 690000][index],
    avgProgress: [68, 45, 72, 35][index],
  }));

  // Mock recent activities
  const recentActivities = [
    { id: '1', type: 'enrollment', message: '3 siswa baru mendaftar di React Masterclass', time: '2 jam lalu' },
    { id: '2', type: 'question', message: 'Pertanyaan baru di forum Full Stack Development', time: '3 jam lalu' },
    { id: '3', type: 'submission', message: 'Ahmad mengirimkan tugas Final Project', time: '5 jam lalu' },
    { id: '4', type: 'review', message: 'Ulasan baru 5 bintang di React Masterclass', time: '1 hari lalu' },
  ];

  // Mock top students
  const topStudents = [
    { id: '1', name: 'Ahmad Rizki', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad', course: 'React Masterclass', progress: 95 },
    { id: '2', name: 'Siti Nurhaliza', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti', course: 'Full Stack Development', progress: 88 },
    { id: '3', name: 'Budi Hartono', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BudiH', course: 'React Masterclass', progress: 82 },
  ];

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Selamat datang, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600">
          Berikut ringkasan performa kursus Anda bulan ini.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
            <p className="text-sm text-gray-500">Total Kursus</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalStudents)}</p>
            <p className="text-sm text-gray-500">Total Siswa</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyEarnings)}</p>
            <p className="text-sm text-gray-500">Pendapatan Bulan Ini</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Star className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
            <p className="text-sm text-gray-500">Rating Rata-rata</p>
          </div>
        </Card>
      </div>

      {/* Alert Cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {stats.pendingQuestions > 0 && (
          <Link to="/instructor/qa">
            <Card className="flex items-center justify-between bg-orange-50 border-orange-200 hover:bg-orange-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-orange-900">{stats.pendingQuestions} pertanyaan menunggu jawaban</p>
                  <p className="text-sm text-orange-700">Klik untuk melihat</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-orange-600" />
            </Card>
          </Link>
        )}
        {stats.pendingSubmissions > 0 && (
          <Link to="/instructor/grading">
            <Card className="flex items-center justify-between bg-blue-50 border-blue-200 hover:bg-blue-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-blue-900">{stats.pendingSubmissions} tugas perlu dinilai</p>
                  <p className="text-sm text-blue-700">Klik untuk menilai</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-blue-600" />
            </Card>
          </Link>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Performance */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Performa Kursus</CardTitle>
              <Link to="/instructor/courses" className="text-sm text-blue-600 hover:text-blue-700">
                Lihat Semua
              </Link>
            </CardHeader>

            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex gap-4 p-3 -mx-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{course.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        +{course.enrollmentsThisMonth} bulan ini
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {formatCurrency(course.revenueThisMonth)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">+12%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">vs bulan lalu</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Revenue Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Pendapatan 6 Bulan Terakhir</CardTitle>
            </CardHeader>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Grafik pendapatan akan ditampilkan di sini</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Earnings Summary */}
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <h3 className="font-semibold mb-4">Ringkasan Pendapatan</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-green-100">Total Pendapatan</span>
                <span className="font-bold">{formatCurrency(stats.totalEarnings)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-100">Bulan Ini</span>
                <span className="font-bold">{formatCurrency(stats.monthlyEarnings)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-100">Tersedia untuk Ditarik</span>
                <span className="font-bold">{formatCurrency(stats.pendingPayouts)}</span>
              </div>
            </div>
            <Link to="/instructor/payouts" className="block mt-4">
              <Button size="sm" className="w-full bg-white text-green-600 hover:bg-gray-100">
                Tarik Dana
              </Button>
            </Link>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'enrollment' ? 'bg-green-500' :
                      activity.type === 'question' ? 'bg-orange-500' :
                        activity.type === 'submission' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`} />
                  <div>
                    <p className="text-sm text-gray-700">{activity.message}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Students */}
          <Card>
            <CardHeader>
              <CardTitle>Siswa Teraktif</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {topStudents.map((student, index) => (
                <div key={student.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                    {index + 1}
                  </span>
                  <Avatar src={student.avatar} name={student.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                    <p className="text-xs text-gray-500 truncate">{student.course}</p>
                  </div>
                  <Badge variant="success" size="sm">{student.progress}%</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
