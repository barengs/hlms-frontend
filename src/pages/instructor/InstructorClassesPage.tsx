import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Plus,
  MoreVertical,
  BookOpen,
  Archive,
  Clock,
  CheckCircle,
  Settings,
  Trash2,
  Eye,
  Copy,
  Calendar,
  GraduationCap,
  FileText,
  BarChart3,
  FolderOpen,
  ArchiveRestore,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layouts';
import { Card, CardHeader, CardTitle, Button, Badge, Input, Dropdown, Modal, Avatar } from '@/components/ui';
import { useLanguage } from '@/context/LanguageContext';
import { formatNumber, getTimeAgo } from '@/lib/utils';

type ClassStatus = 'active' | 'archived';

interface ClassRoom {
  id: string;
  name: string;
  code: string;
  description: string;
  thumbnail: string;
  course: {
    id: string;
    title: string;
  } | null;
  status: ClassStatus;
  studentsCount: number;
  topicsCount: number;
  materialsCount: number;
  assignmentsCount: number;
  averageGrade: number;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  recentStudents: {
    id: string;
    name: string;
    avatar?: string;
  }[];
}

// Mock data
const mockClasses: ClassRoom[] = [
  {
    id: 'class-1',
    name: 'React Advanced 2024 - Batch A',
    code: 'RA2024A',
    description: 'Kelas intensif React untuk developer yang sudah paham dasar React.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    course: {
      id: 'course-1',
      title: 'React Masterclass: From Zero to Hero',
    },
    status: 'active',
    studentsCount: 32,
    topicsCount: 12,
    materialsCount: 45,
    assignmentsCount: 8,
    averageGrade: 85,
    createdAt: '2024-09-01T10:00:00Z',
    updatedAt: '2024-12-16T14:30:00Z',
    lastActivityAt: '2024-12-16T14:30:00Z',
    recentStudents: [
      { id: 's1', name: 'Ahmad Rizki', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad' },
      { id: 's2', name: 'Siti Nurhaliza', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti' },
      { id: 's3', name: 'Budi Hartono', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BudiH' },
    ],
  },
  {
    id: 'class-2',
    name: 'Full Stack Web Development - Weekend Class',
    code: 'FSWD-WKD',
    description: 'Kelas full stack development untuk pemula di akhir pekan.',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
    course: {
      id: 'course-2',
      title: 'Full Stack Development with Node.js',
    },
    status: 'active',
    studentsCount: 28,
    topicsCount: 15,
    materialsCount: 52,
    assignmentsCount: 10,
    averageGrade: 78,
    createdAt: '2024-10-15T10:00:00Z',
    updatedAt: '2024-12-15T11:00:00Z',
    lastActivityAt: '2024-12-15T16:45:00Z',
    recentStudents: [
      { id: 's4', name: 'Dewi Lestari', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi' },
      { id: 's5', name: 'Eko Prasetyo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eko' },
    ],
  },
  {
    id: 'class-3',
    name: 'UI/UX Design Fundamentals - Batch 1',
    code: 'UIUX-B1',
    description: 'Menguasai dasar-dasar desain UI/UX untuk pemula.',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    course: null,
    status: 'active',
    studentsCount: 20,
    topicsCount: 8,
    materialsCount: 30,
    assignmentsCount: 6,
    averageGrade: 82,
    createdAt: '2024-11-01T10:00:00Z',
    updatedAt: '2024-12-14T09:00:00Z',
    lastActivityAt: '2024-12-14T15:20:00Z',
    recentStudents: [
      { id: 's6', name: 'Fitri Handayani', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fitri' },
    ],
  },
  {
    id: 'class-4',
    name: 'React Fundamentals 2023 - Batch C',
    code: 'RF2023C',
    description: 'Kelas dasar React untuk batch C tahun 2023.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    course: {
      id: 'course-1',
      title: 'React Masterclass: From Zero to Hero',
    },
    status: 'archived',
    studentsCount: 35,
    topicsCount: 10,
    materialsCount: 38,
    assignmentsCount: 8,
    averageGrade: 88,
    createdAt: '2023-06-01T10:00:00Z',
    updatedAt: '2023-12-15T16:00:00Z',
    lastActivityAt: '2023-12-15T16:00:00Z',
    recentStudents: [],
  },
];

export function InstructorClassesPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClassStatus | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassRoom | null>(null);

  // Form state for creating class
  const [newClassName, setNewClassName] = useState('');
  const [newClassCode, setNewClassCode] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');

  // Stats
  const stats = {
    totalClasses: mockClasses.length,
    activeClasses: mockClasses.filter((c) => c.status === 'active').length,
    archivedClasses: mockClasses.filter((c) => c.status === 'archived').length,
    totalStudents: mockClasses.reduce((sum, c) => sum + c.studentsCount, 0),
    avgGrade: Math.round(
      mockClasses.filter((c) => c.status === 'active').reduce((sum, c) => sum + c.averageGrade, 0) /
        mockClasses.filter((c) => c.status === 'active').length
    ),
  };

  // Filter classes
  const filteredClasses = mockClasses
    .filter((cls) => {
      const matchesSearch =
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || cls.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const getClassActions = (cls: ClassRoom) => {
    const actions = [
      {
        label: language === 'id' ? 'Lihat Detail' : 'View Details',
        icon: <Eye className="w-4 h-4" />,
        onClick: () => navigate(`/instructor/classes/${cls.id}`),
      },
      {
        label: language === 'id' ? 'Kelola Kelas' : 'Manage Class',
        icon: <Settings className="w-4 h-4" />,
        onClick: () => navigate(`/instructor/classes/${cls.id}/manage`),
      },
      {
        label: language === 'id' ? 'Salin Kode' : 'Copy Code',
        icon: <Copy className="w-4 h-4" />,
        onClick: () => {
          navigator.clipboard.writeText(cls.code);
        },
      },
      { divider: true, label: '' },
    ];

    if (cls.status === 'active') {
      actions.push({
        label: language === 'id' ? 'Arsipkan' : 'Archive',
        icon: <Archive className="w-4 h-4" />,
        onClick: () => {
          setSelectedClass(cls);
          setShowArchiveModal(true);
        },
      });
    } else {
      actions.push({
        label: language === 'id' ? 'Aktifkan Kembali' : 'Restore',
        icon: <ArchiveRestore className="w-4 h-4" />,
        onClick: () => {
          // Restore class logic
          console.log('Restore:', cls.id);
        },
      });
    }

    actions.push({
      label: language === 'id' ? 'Hapus' : 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => {
        setSelectedClass(cls);
        setShowDeleteModal(true);
      },
      className: 'text-red-600 hover:bg-red-50',
    });

    return actions;
  };

  const handleCreateClass = () => {
    // Create class logic
    console.log('Create class:', { newClassName, newClassCode, newClassDescription, selectedCourseId });
    setShowCreateModal(false);
    setNewClassName('');
    setNewClassCode('');
    setNewClassDescription('');
    setSelectedCourseId('');
  };

  const generateClassCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewClassCode(code);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {language === 'id' ? 'Kelas Saya' : 'My Classes'}
            </h1>
            <p className="text-gray-600 mt-1">
              {language === 'id'
                ? 'Kelola kelas dan atur pembelajaran untuk siswa Anda.'
                : 'Manage classes and organize learning for your students.'}
            </p>
          </div>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>
            {language === 'id' ? 'Buat Kelas Baru' : 'Create New Class'}
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FolderOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalClasses)}</p>
                <p className="text-xs text-gray-500">{language === 'id' ? 'Total Kelas' : 'Total Classes'}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.activeClasses}</p>
                <p className="text-xs text-gray-500">{language === 'id' ? 'Kelas Aktif' : 'Active Classes'}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Archive className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.archivedClasses}</p>
                <p className="text-xs text-gray-500">{language === 'id' ? 'Diarsipkan' : 'Archived'}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
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
                <BarChart3 className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.avgGrade}%</p>
                <p className="text-xs text-gray-500">{language === 'id' ? 'Rata-rata Nilai' : 'Average Grade'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={language === 'id' ? 'Cari kelas atau kode...' : 'Search classes or code...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {language === 'id' ? 'Semua' : 'All'} ({stats.totalClasses})
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'active'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {language === 'id' ? 'Aktif' : 'Active'} ({stats.activeClasses})
              </button>
              <button
                onClick={() => setStatusFilter('archived')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'archived'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {language === 'id' ? 'Arsip' : 'Archived'} ({stats.archivedClasses})
              </button>
            </div>
          </div>
        </Card>

        {/* Classes Grid */}
        {filteredClasses.length === 0 ? (
          <Card className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {language === 'id' ? 'Belum Ada Kelas' : 'No Classes Found'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || statusFilter !== 'all'
                ? language === 'id'
                  ? 'Tidak ada kelas yang cocok dengan filter Anda.'
                  : 'No classes match your filters.'
                : language === 'id'
                ? 'Buat kelas pertama Anda untuk memulai mengajar.'
                : 'Create your first class to start teaching.'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>
                {language === 'id' ? 'Buat Kelas Baru' : 'Create New Class'}
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => (
              <Card key={cls.id} className="hover:shadow-lg transition-shadow">
                {/* Thumbnail */}
                <div className="relative h-40 overflow-hidden rounded-t-xl">
                  <img
                    src={cls.thumbnail}
                    alt={cls.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge variant={cls.status === 'active' ? 'success' : 'secondary'} size="sm">
                      {cls.status === 'active'
                        ? language === 'id'
                          ? 'Aktif'
                          : 'Active'
                        : language === 'id'
                        ? 'Diarsipkan'
                        : 'Archived'}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Dropdown
                      trigger={
                        <button
                          className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30"
                          aria-label="Class actions"
                        >
                          <MoreVertical className="w-4 h-4 text-white" />
                        </button>
                      }
                      items={getClassActions(cls)}
                      align="right"
                    />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-bold text-lg line-clamp-1">{cls.name}</p>
                    <p className="text-white/80 text-sm flex items-center gap-1">
                      <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{cls.code}</span>
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Course Link */}
                  {cls.course ? (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <BookOpen className="w-4 h-4" />
                      <span className="line-clamp-1">{cls.course.title}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                      <BookOpen className="w-4 h-4" />
                      <span>{language === 'id' ? 'Tanpa kursus terkait' : 'No linked course'}</span>
                    </div>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-gray-900">{cls.topicsCount}</p>
                      <p className="text-xs text-gray-500">{language === 'id' ? 'Topik' : 'Topics'}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-gray-900">{cls.materialsCount}</p>
                      <p className="text-xs text-gray-500">{language === 'id' ? 'Materi' : 'Materials'}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-gray-900">{cls.studentsCount}</p>
                      <p className="text-xs text-gray-500">{language === 'id' ? 'Siswa' : 'Students'}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-gray-900">{cls.averageGrade}%</p>
                      <p className="text-xs text-gray-500">{language === 'id' ? 'Nilai' : 'Grade'}</p>
                    </div>
                  </div>

                  {/* Students Avatars */}
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {cls.recentStudents.slice(0, 4).map((student) => (
                        <Avatar
                          key={student.id}
                          src={student.avatar}
                          name={student.name}
                          size="sm"
                          className="ring-2 ring-white"
                        />
                      ))}
                      {cls.studentsCount > 4 && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 ring-2 ring-white">
                          +{cls.studentsCount - 4}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getTimeAgo(cls.lastActivityAt)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-100 p-3 flex gap-2">
                  <Link
                    to={`/instructor/classes/${cls.id}`}
                    className="flex-1 text-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {language === 'id' ? 'Lihat' : 'View'}
                  </Link>
                  <Link
                    to={`/instructor/classes/${cls.id}/manage`}
                    className="flex-1 text-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    {language === 'id' ? 'Kelola' : 'Manage'}
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create Class Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title={language === 'id' ? 'Buat Kelas Baru' : 'Create New Class'}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'id' ? 'Nama Kelas' : 'Class Name'} *
              </label>
              <Input
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder={language === 'id' ? 'Contoh: React Advanced 2024 - Batch A' : 'e.g., React Advanced 2024 - Batch A'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'id' ? 'Kode Kelas' : 'Class Code'} *
              </label>
              <div className="flex gap-2">
                <Input
                  value={newClassCode}
                  onChange={(e) => setNewClassCode(e.target.value.toUpperCase())}
                  placeholder="RA2024A"
                  className="flex-1"
                />
                <Button variant="outline" onClick={generateClassCode}>
                  {language === 'id' ? 'Generate' : 'Generate'}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {language === 'id'
                  ? 'Kode ini digunakan siswa untuk bergabung ke kelas.'
                  : 'Students will use this code to join the class.'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'id' ? 'Deskripsi' : 'Description'}
              </label>
              <textarea
                value={newClassDescription}
                onChange={(e) => setNewClassDescription(e.target.value)}
                placeholder={language === 'id' ? 'Deskripsi singkat tentang kelas...' : 'Brief description about the class...'}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'id' ? 'Tautkan ke Kursus (Opsional)' : 'Link to Course (Optional)'}
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select course"
              >
                <option value="">{language === 'id' ? 'Pilih kursus...' : 'Select a course...'}</option>
                <option value="course-1">React Masterclass: From Zero to Hero</option>
                <option value="course-2">Full Stack Development with Node.js</option>
                <option value="course-3">UI/UX Design Fundamentals</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {language === 'id'
                  ? 'Kursus yang ditautkan akan memberikan akses materi ke siswa di kelas ini.'
                  : 'Linked course materials will be accessible to students in this class.'}
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                {language === 'id' ? 'Batal' : 'Cancel'}
              </Button>
              <Button
                onClick={handleCreateClass}
                disabled={!newClassName.trim() || !newClassCode.trim()}
              >
                {language === 'id' ? 'Buat Kelas' : 'Create Class'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Archive Confirmation Modal */}
        <Modal
          isOpen={showArchiveModal}
          onClose={() => setShowArchiveModal(false)}
          title={language === 'id' ? 'Arsipkan Kelas' : 'Archive Class'}
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              {language === 'id'
                ? `Apakah Anda yakin ingin mengarsipkan kelas "${selectedClass?.name}"? Siswa tidak akan dapat mengakses kelas ini setelah diarsipkan.`
                : `Are you sure you want to archive "${selectedClass?.name}"? Students will not be able to access this class after archiving.`}
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowArchiveModal(false)}>
                {language === 'id' ? 'Batal' : 'Cancel'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  console.log('Archive:', selectedClass?.id);
                  setShowArchiveModal(false);
                }}
              >
                {language === 'id' ? 'Arsipkan' : 'Archive'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title={language === 'id' ? 'Hapus Kelas' : 'Delete Class'}
        >
          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-red-800">
                {language === 'id'
                  ? `Apakah Anda yakin ingin menghapus kelas "${selectedClass?.name}"? Semua data termasuk topik, materi, dan nilai siswa akan dihapus secara permanen.`
                  : `Are you sure you want to delete "${selectedClass?.name}"? All data including topics, materials, and student grades will be permanently deleted.`}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                {language === 'id' ? 'Batal' : 'Cancel'}
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  console.log('Delete:', selectedClass?.id);
                  setShowDeleteModal(false);
                }}
              >
                {language === 'id' ? 'Hapus Permanen' : 'Delete Permanently'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
