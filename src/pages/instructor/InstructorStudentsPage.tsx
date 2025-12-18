import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Mail,
  Eye,
  Download,
  MoreVertical,
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle,
  MessageSquare,
  FileText,
  BarChart3,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layouts';
import { Card, Button, Badge, Input, Avatar, Dropdown, Modal, Progress } from '@/components/ui';
import { useLanguage } from '@/context/LanguageContext';
import { formatNumber, getTimeAgo } from '@/lib/utils';

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrolledCourses: {
    courseId: string;
    courseTitle: string;
    progress: number;
    enrolledAt: string;
    lastAccessedAt: string;
    completedLessons: number;
    totalLessons: number;
    assignmentsCompleted: number;
    totalAssignments: number;
    quizzesPassed: number;
    totalQuizzes: number;
    status: 'active' | 'completed' | 'inactive';
  }[];
  totalProgress: number;
  totalCoursesEnrolled: number;
  totalCoursesCompleted: number;
  lastActiveAt: string;
  joinedAt: string;
}

interface CourseOption {
  id: string;
  title: string;
  studentCount: number;
}

// Mock courses for filter
const mockCourses: CourseOption[] = [
  { id: 'course-1', title: 'React Masterclass: From Zero to Hero', studentCount: 1250 },
  { id: 'course-2', title: 'Full Stack Development with Node.js', studentCount: 856 },
  { id: 'course-3', title: 'UI/UX Design Fundamentals', studentCount: 420 },
];

// Mock students data
const mockStudents: Student[] = [
  {
    id: 'student-1',
    name: 'Ahmad Rizki',
    email: 'ahmad.rizki@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad',
    enrolledCourses: [
      {
        courseId: 'course-1',
        courseTitle: 'React Masterclass: From Zero to Hero',
        progress: 95,
        enrolledAt: '2024-10-15T10:00:00Z',
        lastAccessedAt: '2024-12-16T14:30:00Z',
        completedLessons: 81,
        totalLessons: 85,
        assignmentsCompleted: 8,
        totalAssignments: 8,
        quizzesPassed: 12,
        totalQuizzes: 12,
        status: 'active',
      },
    ],
    totalProgress: 95,
    totalCoursesEnrolled: 2,
    totalCoursesCompleted: 1,
    lastActiveAt: '2024-12-16T14:30:00Z',
    joinedAt: '2024-08-01T10:00:00Z',
  },
  {
    id: 'student-2',
    name: 'Siti Nurhaliza',
    email: 'siti.nur@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti',
    enrolledCourses: [
      {
        courseId: 'course-1',
        courseTitle: 'React Masterclass: From Zero to Hero',
        progress: 88,
        enrolledAt: '2024-09-20T10:00:00Z',
        lastAccessedAt: '2024-12-15T09:00:00Z',
        completedLessons: 75,
        totalLessons: 85,
        assignmentsCompleted: 7,
        totalAssignments: 8,
        quizzesPassed: 11,
        totalQuizzes: 12,
        status: 'active',
      },
      {
        courseId: 'course-2',
        courseTitle: 'Full Stack Development with Node.js',
        progress: 45,
        enrolledAt: '2024-11-01T10:00:00Z',
        lastAccessedAt: '2024-12-14T16:00:00Z',
        completedLessons: 54,
        totalLessons: 120,
        assignmentsCompleted: 3,
        totalAssignments: 10,
        quizzesPassed: 5,
        totalQuizzes: 15,
        status: 'active',
      },
    ],
    totalProgress: 66,
    totalCoursesEnrolled: 2,
    totalCoursesCompleted: 0,
    lastActiveAt: '2024-12-15T09:00:00Z',
    joinedAt: '2024-07-15T10:00:00Z',
  },
  {
    id: 'student-3',
    name: 'Budi Hartono',
    email: 'budi.hartono@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BudiH',
    enrolledCourses: [
      {
        courseId: 'course-1',
        courseTitle: 'React Masterclass: From Zero to Hero',
        progress: 100,
        enrolledAt: '2024-08-10T10:00:00Z',
        lastAccessedAt: '2024-11-30T12:00:00Z',
        completedLessons: 85,
        totalLessons: 85,
        assignmentsCompleted: 8,
        totalAssignments: 8,
        quizzesPassed: 12,
        totalQuizzes: 12,
        status: 'completed',
      },
    ],
    totalProgress: 100,
    totalCoursesEnrolled: 1,
    totalCoursesCompleted: 1,
    lastActiveAt: '2024-11-30T12:00:00Z',
    joinedAt: '2024-06-01T10:00:00Z',
  },
  {
    id: 'student-4',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi',
    enrolledCourses: [
      {
        courseId: 'course-2',
        courseTitle: 'Full Stack Development with Node.js',
        progress: 72,
        enrolledAt: '2024-10-01T10:00:00Z',
        lastAccessedAt: '2024-12-16T11:00:00Z',
        completedLessons: 86,
        totalLessons: 120,
        assignmentsCompleted: 6,
        totalAssignments: 10,
        quizzesPassed: 10,
        totalQuizzes: 15,
        status: 'active',
      },
    ],
    totalProgress: 72,
    totalCoursesEnrolled: 1,
    totalCoursesCompleted: 0,
    lastActiveAt: '2024-12-16T11:00:00Z',
    joinedAt: '2024-09-15T10:00:00Z',
  },
  {
    id: 'student-5',
    name: 'Eko Prasetyo',
    email: 'eko.prasetyo@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eko',
    enrolledCourses: [
      {
        courseId: 'course-1',
        courseTitle: 'React Masterclass: From Zero to Hero',
        progress: 25,
        enrolledAt: '2024-11-20T10:00:00Z',
        lastAccessedAt: '2024-12-01T10:00:00Z',
        completedLessons: 21,
        totalLessons: 85,
        assignmentsCompleted: 1,
        totalAssignments: 8,
        quizzesPassed: 2,
        totalQuizzes: 12,
        status: 'inactive',
      },
    ],
    totalProgress: 25,
    totalCoursesEnrolled: 1,
    totalCoursesCompleted: 0,
    lastActiveAt: '2024-12-01T10:00:00Z',
    joinedAt: '2024-11-15T10:00:00Z',
  },
  {
    id: 'student-6',
    name: 'Fitri Handayani',
    email: 'fitri.handayani@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fitri',
    enrolledCourses: [
      {
        courseId: 'course-1',
        courseTitle: 'React Masterclass: From Zero to Hero',
        progress: 60,
        enrolledAt: '2024-10-25T10:00:00Z',
        lastAccessedAt: '2024-12-16T08:00:00Z',
        completedLessons: 51,
        totalLessons: 85,
        assignmentsCompleted: 4,
        totalAssignments: 8,
        quizzesPassed: 7,
        totalQuizzes: 12,
        status: 'active',
      },
      {
        courseId: 'course-2',
        courseTitle: 'Full Stack Development with Node.js',
        progress: 30,
        enrolledAt: '2024-11-15T10:00:00Z',
        lastAccessedAt: '2024-12-15T14:00:00Z',
        completedLessons: 36,
        totalLessons: 120,
        assignmentsCompleted: 2,
        totalAssignments: 10,
        quizzesPassed: 4,
        totalQuizzes: 15,
        status: 'active',
      },
    ],
    totalProgress: 45,
    totalCoursesEnrolled: 2,
    totalCoursesCompleted: 0,
    lastActiveAt: '2024-12-16T08:00:00Z',
    joinedAt: '2024-10-01T10:00:00Z',
  },
];

export function InstructorStudentsPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'lastActive' | 'enrolled'>('lastActive');
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<string | null>(null);

  // Stats
  const stats = {
    totalStudents: mockStudents.length,
    activeStudents: mockStudents.filter((s) =>
      s.enrolledCourses.some((c) => c.status === 'active')
    ).length,
    completedStudents: mockStudents.filter((s) =>
      s.enrolledCourses.some((c) => c.status === 'completed')
    ).length,
    inactiveStudents: mockStudents.filter((s) =>
      s.enrolledCourses.every((c) => c.status === 'inactive')
    ).length,
    avgProgress: Math.round(
      mockStudents.reduce((sum, s) => sum + s.totalProgress, 0) / mockStudents.length
    ),
  };

  // Filter students
  const filteredStudents = mockStudents
    .filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCourse =
        courseFilter === 'all' ||
        student.enrolledCourses.some((c) => c.courseId === courseFilter);

      const matchesStatus =
        statusFilter === 'all' ||
        student.enrolledCourses.some((c) => c.status === statusFilter);

      return matchesSearch && matchesCourse && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'progress':
          return b.totalProgress - a.totalProgress;
        case 'enrolled':
          return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
        default:
          return new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime();
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: 'active' | 'completed' | 'inactive') => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="success" size="sm">
            <CheckCircle className="w-3 h-3 mr-1" />
            {language === 'id' ? 'Aktif' : 'Active'}
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="primary" size="sm">
            <Award className="w-3 h-3 mr-1" />
            {language === 'id' ? 'Selesai' : 'Completed'}
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="warning" size="sm">
            <Clock className="w-3 h-3 mr-1" />
            {language === 'id' ? 'Tidak Aktif' : 'Inactive'}
          </Badge>
        );
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-blue-600';
    if (progress >= 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setSelectedCourseDetail(student.enrolledCourses[0]?.courseId || null);
    setShowStudentModal(true);
  };

  const getStudentActions = (student: Student) => [
    {
      label: language === 'id' ? 'Lihat Detail' : 'View Details',
      icon: <Eye className="w-4 h-4" />,
      onClick: () => handleViewStudent(student),
    },
    {
      label: language === 'id' ? 'Kirim Pesan' : 'Send Message',
      icon: <MessageSquare className="w-4 h-4" />,
      onClick: () => console.log('Message:', student.id),
    },
    {
      label: language === 'id' ? 'Lihat Progress' : 'View Progress',
      icon: <BarChart3 className="w-4 h-4" />,
      onClick: () => handleViewStudent(student),
    },
    { divider: true, label: '' },
    {
      label: language === 'id' ? 'Kirim Pengingat' : 'Send Reminder',
      icon: <Mail className="w-4 h-4" />,
      onClick: () => console.log('Reminder:', student.id),
    },
  ];

  const currentCourseDetail = selectedStudent?.enrolledCourses.find(
    (c) => c.courseId === selectedCourseDetail
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {language === 'id' ? 'Siswa Saya' : 'My Students'}
            </h1>
            <p className="text-gray-600 mt-1">
              {language === 'id'
                ? 'Kelola dan pantau progress siswa di kursus Anda.'
                : 'Manage and monitor student progress in your courses.'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
              {language === 'id' ? 'Ekspor Data' : 'Export Data'}
            </Button>
            <Button variant="outline" leftIcon={<Mail className="w-4 h-4" />}>
              {language === 'id' ? 'Email Massal' : 'Bulk Email'}
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalStudents)}</p>
                <p className="text-xs text-gray-500">{language === 'id' ? 'Total Siswa' : 'Total Students'}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.activeStudents}</p>
                <p className="text-xs text-gray-500">{language === 'id' ? 'Aktif' : 'Active'}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completedStudents}</p>
                <p className="text-xs text-gray-500">{language === 'id' ? 'Selesai' : 'Completed'}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.inactiveStudents}</p>
                <p className="text-xs text-gray-500">{language === 'id' ? 'Tidak Aktif' : 'Inactive'}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.avgProgress}%</p>
                <p className="text-xs text-gray-500">{language === 'id' ? 'Rata-rata Progress' : 'Avg Progress'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={language === 'id' ? 'Cari siswa...' : 'Search students...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                aria-label="Filter by course"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{language === 'id' ? 'Semua Kursus' : 'All Courses'}</option>
                {mockCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title} ({course.studentCount})
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                aria-label="Filter by status"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{language === 'id' ? 'Semua Status' : 'All Status'}</option>
                <option value="active">{language === 'id' ? 'Aktif' : 'Active'}</option>
                <option value="completed">{language === 'id' ? 'Selesai' : 'Completed'}</option>
                <option value="inactive">{language === 'id' ? 'Tidak Aktif' : 'Inactive'}</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                aria-label="Sort by"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="lastActive">{language === 'id' ? 'Terakhir Aktif' : 'Last Active'}</option>
                <option value="name">{language === 'id' ? 'Nama' : 'Name'}</option>
                <option value="progress">{language === 'id' ? 'Progress' : 'Progress'}</option>
                <option value="enrolled">{language === 'id' ? 'Tanggal Daftar' : 'Enrollment Date'}</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Students Table */}
        {filteredStudents.length === 0 ? (
          <Card className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {language === 'id' ? 'Tidak Ada Siswa' : 'No Students Found'}
            </h3>
            <p className="text-gray-500">
              {searchQuery || courseFilter !== 'all' || statusFilter !== 'all'
                ? language === 'id'
                  ? 'Tidak ada siswa yang cocok dengan filter Anda.'
                  : 'No students match your filters.'
                : language === 'id'
                  ? 'Belum ada siswa yang mendaftar di kursus Anda.'
                  : 'No students have enrolled in your courses yet.'}
            </p>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-medium text-gray-600">
                      {language === 'id' ? 'Siswa' : 'Student'}
                    </th>
                    <th className="text-left py-4 px-4 font-medium text-gray-600">
                      {language === 'id' ? 'Kursus' : 'Courses'}
                    </th>
                    <th className="text-left py-4 px-4 font-medium text-gray-600">
                      {language === 'id' ? 'Progress' : 'Progress'}
                    </th>
                    <th className="text-left py-4 px-4 font-medium text-gray-600">
                      {language === 'id' ? 'Status' : 'Status'}
                    </th>
                    <th className="text-left py-4 px-4 font-medium text-gray-600">
                      {language === 'id' ? 'Terakhir Aktif' : 'Last Active'}
                    </th>
                    <th className="text-right py-4 px-4 font-medium text-gray-600">
                      {language === 'id' ? 'Aksi' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    const primaryCourse = student.enrolledCourses[0];
                    const overallStatus = student.enrolledCourses.some((c) => c.status === 'active')
                      ? 'active'
                      : student.enrolledCourses.some((c) => c.status === 'completed')
                        ? 'completed'
                        : 'inactive';

                    return (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar src={student.avatar} name={student.name} size="md" />
                            <div>
                              <p className="font-medium text-gray-900">{student.name}</p>
                              <p className="text-sm text-gray-500">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">
                              {student.totalCoursesEnrolled} {language === 'id' ? 'kursus' : 'courses'}
                            </span>
                            {student.totalCoursesCompleted > 0 && (
                              <Badge variant="success" size="sm">
                                {student.totalCoursesCompleted} {language === 'id' ? 'selesai' : 'done'}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24">
                              <Progress value={student.totalProgress} size="sm" />
                            </div>
                            <span className={`font-medium ${getProgressColor(student.totalProgress)}`}>
                              {student.totalProgress}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(overallStatus)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-500">
                            {getTimeAgo(student.lastActiveAt)}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Dropdown
                            trigger={
                              <button
                                className="p-2 hover:bg-gray-100 rounded-lg"
                                aria-label="Student actions"
                              >
                                <MoreVertical className="w-5 h-5 text-gray-500" />
                              </button>
                            }
                            items={getStudentActions(student)}
                            align="right"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Student Detail Modal */}
        <Modal
          isOpen={showStudentModal}
          onClose={() => setShowStudentModal(false)}
          title={language === 'id' ? 'Detail Siswa' : 'Student Details'}
          size="lg"
        >
          {selectedStudent && (
            <div className="space-y-6">
              {/* Student Info */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                <Avatar src={selectedStudent.avatar} name={selectedStudent.name} size="xl" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h3>
                  <p className="text-gray-500">{selectedStudent.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {language === 'id' ? 'Bergabung' : 'Joined'}: {formatDate(selectedStudent.joinedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {language === 'id' ? 'Terakhir aktif' : 'Last active'}: {getTimeAgo(selectedStudent.lastActiveAt)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-bold ${getProgressColor(selectedStudent.totalProgress)}`}>
                    {selectedStudent.totalProgress}%
                  </p>
                  <p className="text-sm text-gray-500">{language === 'id' ? 'Progress Keseluruhan' : 'Overall Progress'}</p>
                </div>
              </div>

              {/* Course Tabs */}
              {selectedStudent.enrolledCourses.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedStudent.enrolledCourses.map((course) => (
                    <button
                      key={course.courseId}
                      onClick={() => setSelectedCourseDetail(course.courseId)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedCourseDetail === course.courseId
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {course.courseTitle.substring(0, 30)}...
                    </button>
                  ))}
                </div>
              )}

              {/* Course Progress Details */}
              {currentCourseDetail && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">{currentCourseDetail.courseTitle}</h4>
                    {getStatusBadge(currentCourseDetail.status)}
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">{language === 'id' ? 'Progress Kursus' : 'Course Progress'}</span>
                      <span className="font-medium">{currentCourseDetail.progress}%</span>
                    </div>
                    <Progress value={currentCourseDetail.progress} size="lg" />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">
                        {currentCourseDetail.completedLessons}/{currentCourseDetail.totalLessons}
                      </p>
                      <p className="text-xs text-gray-500">{language === 'id' ? 'Pelajaran' : 'Lessons'}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">
                        {currentCourseDetail.assignmentsCompleted}/{currentCourseDetail.totalAssignments}
                      </p>
                      <p className="text-xs text-gray-500">{language === 'id' ? 'Tugas' : 'Assignments'}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">
                        {currentCourseDetail.quizzesPassed}/{currentCourseDetail.totalQuizzes}
                      </p>
                      <p className="text-xs text-gray-500">{language === 'id' ? 'Quiz Lulus' : 'Quizzes Passed'}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{formatDate(currentCourseDetail.enrolledAt)}</p>
                      <p className="text-xs text-gray-500">{language === 'id' ? 'Tanggal Daftar' : 'Enrolled'}</p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-3">
                      {language === 'id' ? 'Aktivitas Terakhir' : 'Recent Activity'}
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{language === 'id' ? 'Terakhir mengakses kursus' : 'Last accessed course'}: {getTimeAgo(currentCourseDetail.lastAccessedAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        <span>{currentCourseDetail.completedLessons} {language === 'id' ? 'pelajaran diselesaikan' : 'lessons completed'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FileText className="w-4 h-4 text-orange-500" />
                        <span>{currentCourseDetail.assignmentsCompleted} {language === 'id' ? 'tugas dikumpulkan' : 'assignments submitted'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                <Button variant="outline" leftIcon={<Mail className="w-4 h-4" />}>
                  {language === 'id' ? 'Kirim Pesan' : 'Send Message'}
                </Button>
                <Button leftIcon={<MessageSquare className="w-4 h-4" />}>
                  {language === 'id' ? 'Buka Diskusi' : 'Open Discussion'}
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
