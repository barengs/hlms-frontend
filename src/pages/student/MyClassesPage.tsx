import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  Search,
  Plus,
  BookOpen,
  Award,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layouts';
import { Card, Button, Badge, Avatar, Input, Modal, Select } from '@/components/ui';
import { useLanguage } from '@/context/LanguageContext';
import { formatDate, getTimeAgo } from '@/lib/utils';

// Mock data for enrolled classes
const mockEnrolledClasses = [
  {
    id: 'class-1',
    courseId: 'course-1',
    courseName: 'React Masterclass Professional',
    instructor: {
      id: 'inst-1',
      name: 'Budi Pengajar',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    schedule: {
      day: 'Senin & Rabu',
      time: '19:00 - 21:00',
      location: 'Online (Zoom)',
    },
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    progress: 65,
    students: 28,
    maxStudents: 30,
    status: 'ongoing' as const,
    nextSession: '2024-01-24T19:00:00',
  },
  {
    id: 'class-2',
    courseId: 'course-2',
    courseName: 'Full Stack Development Bootcamp',
    instructor: {
      id: 'inst-2',
      name: 'Siti Developer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    schedule: {
      day: 'Selasa & Kamis',
      time: '20:00 - 22:00',
      location: 'Online (Google Meet)',
    },
    startDate: '2024-02-01',
    endDate: '2024-05-01',
    progress: 30,
    students: 25,
    maxStudents: 25,
    status: 'ongoing' as const,
    nextSession: '2024-01-25T20:00:00',
  },
  {
    id: 'class-3',
    courseId: 'course-3',
    courseName: 'UI/UX Design Fundamentals',
    instructor: {
      id: 'inst-3',
      name: 'Ahmad Designer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    schedule: {
      day: 'Sabtu',
      time: '10:00 - 12:00',
      location: 'Hybrid (Lab 301)',
    },
    startDate: '2023-12-01',
    endDate: '2024-01-15',
    progress: 100,
    students: 20,
    maxStudents: 20,
    status: 'completed' as const,
    nextSession: null,
  },
];

export function MyClassesPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ongoing' | 'completed'>('all');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinClass = async () => {
    if (!classCode.trim()) return;

    setIsJoining(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Joining class with code:', classCode);
    alert('Berhasil bergabung ke kelas!');
    setClassCode('');
    setShowJoinModal(false);
    setIsJoining(false);
  };

  // Filter classes
  const filteredClasses = mockEnrolledClasses.filter((cls) => {
    const matchesSearch = cls.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || cls.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockEnrolledClasses.length,
    ongoing: mockEnrolledClasses.filter((c) => c.status === 'ongoing').length,
    completed: mockEnrolledClasses.filter((c) => c.status === 'completed').length,
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {language === 'id' ? 'Kelas Saya' : 'My Classes'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {language === 'id'
                ? 'Kelola dan ikuti kelas yang Anda daftar'
                : 'Manage and attend your enrolled classes'}
            </p>
          </div>
          <Button size="sm" onClick={() => setShowJoinModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
            {language === 'id' ? 'Gabung Kelas' : 'Join Class'}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'id' ? 'Total Kelas' : 'Total Classes'}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.ongoing}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'id' ? 'Sedang Berjalan' : 'Ongoing'}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'id' ? 'Selesai' : 'Completed'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <Input
              inputSize="sm"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'id' ? 'Cari kelas...' : 'Search classes...'}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-56">
            <Select
              selectSize="sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'ongoing' | 'completed')}
              options={[
                { value: 'all', label: language === 'id' ? 'Semua Status' : 'All Status' },
                { value: 'ongoing', label: language === 'id' ? 'Sedang Berjalan' : 'Ongoing' },
                { value: 'completed', label: language === 'id' ? 'Selesai' : 'Completed' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Classes List */}
      <div className="grid gap-4">
        {filteredClasses.length === 0 ? (
          <Card className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {language === 'id' ? 'Tidak ada kelas' : 'No classes found'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {language === 'id'
                ? 'Anda belum terdaftar di kelas manapun'
                : 'You are not enrolled in any classes'}
            </p>
            <Button size="sm" onClick={() => setShowJoinModal(true)}>
              {language === 'id' ? 'Gabung Kelas' : 'Join a Class'}
            </Button>
          </Card>
        ) : (
          filteredClasses.map((cls) => (
            <Card key={cls.id} hover>
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Left: Class Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Link
                          to={`/class/${cls.id}`}
                          className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {cls.courseName}
                        </Link>
                        <Badge variant={cls.status === 'ongoing' ? 'success' : 'secondary'} size="sm">
                          {cls.status === 'ongoing'
                            ? language === 'id' ? 'Aktif' : 'Active'
                            : language === 'id' ? 'Selesai' : 'Completed'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={cls.instructor.avatar}
                          name={cls.instructor.name}
                          size="xs"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {cls.instructor.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{cls.schedule.day}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{cls.schedule.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{cls.schedule.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{cls.students}/{cls.maxStudents} {language === 'id' ? 'siswa' : 'students'}</span>
                    </div>
                  </div>

                  {/* Progress */}
                  {cls.status === 'ongoing' && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          {language === 'id' ? 'Progress' : 'Progress'}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">{cls.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${cls.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex lg:flex-col gap-3 lg:w-48">
                  {cls.nextSession && (
                    <div className="flex-1 lg:flex-none p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        {language === 'id' ? 'Sesi Berikutnya' : 'Next Session'}
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDate(cls.nextSession)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {getTimeAgo(cls.nextSession)}
                      </p>
                    </div>
                  )}
                  <Link to={`/class/${cls.id}`} className="flex-1 lg:flex-none">
                    <Button size="sm" variant="outline" className="w-full">
                      {language === 'id' ? 'Lihat Detail' : 'View Details'}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Join Class Modal */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        title={language === 'id' ? 'Gabung ke Kelas' : 'Join a Class'}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {language === 'id'
              ? 'Masukkan kode kelas yang diberikan oleh instruktur untuk bergabung.'
              : 'Enter the class code provided by your instructor to join.'}
          </p>
          <Input
            inputSize="sm"
            label={language === 'id' ? 'Kode Kelas' : 'Class Code'}
            value={classCode}
            onChange={(e) => setClassCode(e.target.value.toUpperCase())}
            placeholder="ABC123"
            className="uppercase"
          />
          <div className="flex gap-3 pt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowJoinModal(false)}
              className="flex-1"
            >
              {language === 'id' ? 'Batal' : 'Cancel'}
            </Button>
            <Button
              size="sm"
              onClick={handleJoinClass}
              disabled={!classCode.trim() || isJoining}
              isLoading={isJoining}
              className="flex-1"
            >
              {language === 'id' ? 'Gabung' : 'Join'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
