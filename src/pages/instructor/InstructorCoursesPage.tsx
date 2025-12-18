import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  DollarSign,
  Star,
  Eye,
  Edit,
  MoreVertical,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Trash2,
  Copy,
  Archive,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layouts';
import { Card, Button, Badge, Input, Dropdown, Modal } from '@/components/ui';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency, formatNumber } from '@/lib/utils';

type CourseStatus = 'draft' | 'pending' | 'published' | 'rejected';

interface InstructorCourse {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  status: CourseStatus;
  price: number;
  totalStudents: number;
  totalRevenue: number;
  rating: number;
  totalRatings: number;
  totalLessons: number;
  totalModules: number;
  completionRate: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  enrollmentsThisMonth: number;
  revenueThisMonth: number;
}

// Mock instructor courses
const mockInstructorCourses: InstructorCourse[] = [
  {
    id: 'course-1',
    title: 'React Masterclass: From Zero to Hero',
    slug: 'react-masterclass',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    status: 'published',
    price: 299000,
    totalStudents: 1250,
    totalRevenue: 374750000,
    rating: 4.9,
    totalRatings: 856,
    totalLessons: 85,
    totalModules: 12,
    completionRate: 68,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-10T15:30:00Z',
    publishedAt: '2024-02-01T10:00:00Z',
    enrollmentsThisMonth: 120,
    revenueThisMonth: 35880000,
  },
  {
    id: 'course-2',
    title: 'Full Stack Development with Node.js',
    slug: 'fullstack-nodejs',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
    status: 'published',
    price: 449000,
    totalStudents: 856,
    totalRevenue: 384344000,
    rating: 4.8,
    totalRatings: 523,
    totalLessons: 120,
    totalModules: 15,
    completionRate: 45,
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-12-08T12:00:00Z',
    publishedAt: '2024-04-01T10:00:00Z',
    enrollmentsThisMonth: 85,
    revenueThisMonth: 38165000,
  },
  {
    id: 'course-3',
    title: 'UI/UX Design Fundamentals',
    slug: 'uiux-fundamentals',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    status: 'pending',
    price: 199000,
    totalStudents: 0,
    totalRevenue: 0,
    rating: 0,
    totalRatings: 0,
    totalLessons: 45,
    totalModules: 8,
    completionRate: 0,
    createdAt: '2024-11-20T10:00:00Z',
    updatedAt: '2024-12-05T10:00:00Z',
    enrollmentsThisMonth: 0,
    revenueThisMonth: 0,
  },
  {
    id: 'course-4',
    title: 'Advanced TypeScript Patterns',
    slug: 'advanced-typescript',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
    status: 'draft',
    price: 349000,
    totalStudents: 0,
    totalRevenue: 0,
    rating: 0,
    totalRatings: 0,
    totalLessons: 28,
    totalModules: 6,
    completionRate: 0,
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-12T14:00:00Z',
    enrollmentsThisMonth: 0,
    revenueThisMonth: 0,
  },
  {
    id: 'course-5',
    title: 'Machine Learning Basics',
    slug: 'ml-basics',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
    status: 'rejected',
    price: 399000,
    totalStudents: 0,
    totalRevenue: 0,
    rating: 0,
    totalRatings: 0,
    totalLessons: 35,
    totalModules: 7,
    completionRate: 0,
    createdAt: '2024-10-15T10:00:00Z',
    updatedAt: '2024-11-01T10:00:00Z',
    enrollmentsThisMonth: 0,
    revenueThisMonth: 0,
  },
];

export function InstructorCoursesPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CourseStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'students' | 'revenue'>('newest');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<InstructorCourse | null>(null);

  // Stats
  const stats = {
    totalCourses: mockInstructorCourses.length,
    published: mockInstructorCourses.filter((c) => c.status === 'published').length,
    pending: mockInstructorCourses.filter((c) => c.status === 'pending').length,
    draft: mockInstructorCourses.filter((c) => c.status === 'draft').length,
    totalStudents: mockInstructorCourses.reduce((sum, c) => sum + c.totalStudents, 0),
    totalRevenue: mockInstructorCourses.reduce((sum, c) => sum + c.totalRevenue, 0),
    monthlyRevenue: mockInstructorCourses.reduce((sum, c) => sum + c.revenueThisMonth, 0),
  };

  // Filter and sort courses
  const filteredCourses = mockInstructorCourses
    .filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'students':
          return b.totalStudents - a.totalStudents;
        case 'revenue':
          return b.totalRevenue - a.totalRevenue;
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

  const getStatusBadge = (status: CourseStatus) => {
    switch (status) {
      case 'published':
        return (
          <Badge variant="success" size="sm">
            <CheckCircle className="w-3 h-3 mr-1" />
            {language === 'id' ? 'Dipublikasi' : 'Published'}
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="warning" size="sm">
            <Clock className="w-3 h-3 mr-1" />
            {language === 'id' ? 'Menunggu Review' : 'Pending Review'}
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="secondary" size="sm">
            <Edit className="w-3 h-3 mr-1" />
            {language === 'id' ? 'Draft' : 'Draft'}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="danger" size="sm">
            <XCircle className="w-3 h-3 mr-1" />
            {language === 'id' ? 'Ditolak' : 'Rejected'}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDeleteCourse = () => {
    if (selectedCourse) {
      console.log('Deleting course:', selectedCourse.id);
      setShowDeleteModal(false);
      setSelectedCourse(null);
    }
  };

  const getCourseActions = (course: InstructorCourse) => [
    {
      label: language === 'id' ? 'Edit Kursus' : 'Edit Course',
      icon: <Edit className="w-4 h-4" />,
      onClick: () => navigate(`/instructor/courses/${course.id}/edit`),
    },
    {
      label: language === 'id' ? 'Lihat Statistik' : 'View Statistics',
      icon: <BarChart3 className="w-4 h-4" />,
      onClick: () => navigate(`/instructor/courses/${course.id}/analytics`),
    },
    {
      label: language === 'id' ? 'Kelola Siswa' : 'Manage Students',
      icon: <Users className="w-4 h-4" />,
      onClick: () => navigate(`/instructor/courses/${course.id}/students`),
    },
    ...(course.status === 'published'
      ? [
        {
          label: language === 'id' ? 'Lihat Kursus' : 'View Course',
          icon: <Eye className="w-4 h-4" />,
          onClick: () => navigate(`/course/${course.slug}`),
        },
      ]
      : []),
    {
      label: language === 'id' ? 'Duplikasi' : 'Duplicate',
      icon: <Copy className="w-4 h-4" />,
      onClick: () => console.log('Duplicate:', course.id),
    },
    { divider: true, label: '' },
    ...(course.status === 'draft'
      ? [
        {
          label: language === 'id' ? 'Hapus Kursus' : 'Delete Course',
          icon: <Trash2 className="w-4 h-4" />,
          onClick: () => {
            setSelectedCourse(course);
            setShowDeleteModal(true);
          },
          danger: true,
        },
      ]
      : [
        {
          label: language === 'id' ? 'Arsipkan' : 'Archive',
          icon: <Archive className="w-4 h-4" />,
          onClick: () => console.log('Archive:', course.id),
          danger: true,
        },
      ]),
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {language === 'id' ? 'Kursus Saya' : 'My Courses'}
            </h1>
            <p className="text-gray-600 mt-1">
              {language === 'id'
                ? 'Kelola semua kursus yang Anda buat.'
                : 'Manage all the courses you have created.'}
            </p>
          </div>
          <Link
            to="/instructor/courses/create"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            {language === 'id' ? 'Buat Kursus Baru' : 'Create New Course'}
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                <p className="text-xs text-gray-500">{language === 'id' ? 'Total Kursus' : 'Total Courses'}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalStudents)}</p>
                <p className="text-xs text-gray-500">{language === 'id' ? 'Total Siswa' : 'Total Students'}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-xs text-gray-500">{language === 'id' ? 'Total Pendapatan' : 'Total Revenue'}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
                <p className="text-xs text-gray-500">{language === 'id' ? 'Bulan Ini' : 'This Month'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {language === 'id' ? 'Semua' : 'All'} ({stats.totalCourses})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === 'published'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {language === 'id' ? 'Dipublikasi' : 'Published'} ({stats.published})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === 'pending'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {language === 'id' ? 'Menunggu Review' : 'Pending'} ({stats.pending})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === 'draft'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            Draft ({stats.draft})
          </button>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={language === 'id' ? 'Cari kursus...' : 'Search courses...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'students' | 'revenue')}
                aria-label="Sort by"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">{language === 'id' ? 'Terbaru' : 'Newest'}</option>
                <option value="students">{language === 'id' ? 'Siswa Terbanyak' : 'Most Students'}</option>
                <option value="revenue">{language === 'id' ? 'Pendapatan Tertinggi' : 'Highest Revenue'}</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Courses List */}
        {filteredCourses.length === 0 ? (
          <Card className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {language === 'id' ? 'Tidak Ada Kursus' : 'No Courses Found'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || statusFilter !== 'all'
                ? language === 'id'
                  ? 'Tidak ada kursus yang cocok dengan filter Anda.'
                  : 'No courses match your filters.'
                : language === 'id'
                  ? 'Mulai buat kursus pertama Anda.'
                  : 'Start creating your first course.'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Link
                to="/instructor/courses/create"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                {language === 'id' ? 'Buat Kursus Baru' : 'Create New Course'}
              </Link>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row">
                  {/* Thumbnail */}
                  <div className="lg:w-64 h-40 lg:h-auto flex-shrink-0 relative overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      {getStatusBadge(course.status)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Title */}
                        <Link
                          to={`/instructor/courses/${course.id}/edit`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors block mb-2"
                        >
                          {course.title}
                        </Link>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            <span>
                              {course.totalModules} {language === 'id' ? 'Modul' : 'Modules'} • {course.totalLessons}{' '}
                              {language === 'id' ? 'Pelajaran' : 'Lessons'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {language === 'id' ? 'Diperbarui' : 'Updated'} {formatDate(course.updatedAt)}
                            </span>
                          </div>
                          {course.status === 'published' && course.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span>
                                {course.rating} ({course.totalRatings})
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Stats Grid */}
                        {course.status === 'published' && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <p className="text-lg font-bold text-gray-900">
                                {formatNumber(course.totalStudents)}
                              </p>
                              <p className="text-xs text-gray-500">{language === 'id' ? 'Siswa' : 'Students'}</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <p className="text-lg font-bold text-gray-900">
                                {formatCurrency(course.totalRevenue)}
                              </p>
                              <p className="text-xs text-gray-500">{language === 'id' ? 'Pendapatan' : 'Revenue'}</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <p className="text-lg font-bold text-green-600">
                                +{course.enrollmentsThisMonth}
                              </p>
                              <p className="text-xs text-gray-500">{language === 'id' ? 'Siswa Baru' : 'New Students'}</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <p className="text-lg font-bold text-gray-900">{course.completionRate}%</p>
                              <p className="text-xs text-gray-500">
                                {language === 'id' ? 'Tingkat Penyelesaian' : 'Completion Rate'}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Pending/Rejected Message */}
                        {course.status === 'pending' && (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                            <AlertCircle className="w-4 h-4 inline mr-2" />
                            {language === 'id'
                              ? 'Kursus Anda sedang dalam proses review oleh admin. Biasanya membutuhkan 1-3 hari kerja.'
                              : 'Your course is under review by admin. This usually takes 1-3 business days.'}
                          </div>
                        )}

                        {course.status === 'rejected' && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                            <XCircle className="w-4 h-4 inline mr-2" />
                            {language === 'id'
                              ? 'Kursus Anda ditolak. Silakan periksa feedback dan perbaiki konten yang diperlukan.'
                              : 'Your course was rejected. Please check the feedback and revise the required content.'}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(course.price)}</p>
                        <Dropdown
                          trigger={
                            <button
                              className="p-2 hover:bg-gray-100 rounded-lg"
                              aria-label="Course actions"
                            >
                              <MoreVertical className="w-5 h-5 text-gray-500" />
                            </button>
                          }
                          items={getCourseActions(course)}
                          align="right"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title={language === 'id' ? 'Hapus Kursus' : 'Delete Course'}
          size="md"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {language === 'id' ? 'Apakah Anda yakin?' : 'Are you sure?'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'id'
                ? `Anda akan menghapus kursus "${selectedCourse?.title}". Tindakan ini tidak dapat dibatalkan.`
                : `You are about to delete "${selectedCourse?.title}". This action cannot be undone.`}
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                {language === 'id' ? 'Batal' : 'Cancel'}
              </Button>
              <Button variant="danger" onClick={handleDeleteCourse}>
                {language === 'id' ? 'Ya, Hapus' : 'Yes, Delete'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
