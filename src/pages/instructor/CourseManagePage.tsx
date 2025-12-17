import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Play,
  FileText,
  HelpCircle,
  Clock,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  Image,
  Video,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layouts';
import { Card, CardHeader, CardTitle, Button, Badge, Input, Modal, Progress } from '@/components/ui';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency } from '@/lib/utils';

type Tab = 'overview' | 'curriculum' | 'pricing' | 'students' | 'analytics' | 'settings';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'article' | 'quiz' | 'assignment';
  duration: number;
  isFree: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseData {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  introVideo?: string;
  category: string;
  level: string;
  price: number;
  discountPrice?: number;
  status: 'draft' | 'pending' | 'published' | 'rejected';
  modules: Module[];
  totalStudents: number;
  rating: number;
  totalRatings: number;
  objectives: string[];
  prerequisites: string[];
}

// Mock course data
const mockCourseData: CourseData = {
  id: 'course-1',
  title: 'React Masterclass: From Zero to Hero',
  slug: 'react-masterclass',
  description: 'Master React.js from the ground up. Learn hooks, state management, and build real-world applications with modern best practices.',
  shortDescription: 'Complete React course for beginners to advanced developers.',
  thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
  introVideo: 'https://www.youtube.com/watch?v=abc123',
  category: 'web-development',
  level: 'intermediate',
  price: 299000,
  discountPrice: 249000,
  status: 'published',
  totalStudents: 1250,
  rating: 4.9,
  totalRatings: 856,
  objectives: [
    'Understand React fundamentals and JSX',
    'Master React Hooks and State Management',
    'Build complete web applications',
    'Deploy React apps to production',
  ],
  prerequisites: [
    'Basic HTML, CSS, and JavaScript knowledge',
    'Understanding of ES6+ syntax',
    'Familiarity with command line',
  ],
  modules: [
    {
      id: 'module-1',
      title: 'Introduction to React',
      lessons: [
        { id: 'lesson-1-1', title: 'What is React?', type: 'video', duration: 15, isFree: true },
        { id: 'lesson-1-2', title: 'Setting Up Development Environment', type: 'video', duration: 20, isFree: true },
        { id: 'lesson-1-3', title: 'Your First React App', type: 'video', duration: 25, isFree: false },
        { id: 'lesson-1-4', title: 'Understanding JSX', type: 'article', duration: 10, isFree: false },
        { id: 'lesson-1-5', title: 'Module 1 Quiz', type: 'quiz', duration: 15, isFree: false },
      ],
    },
    {
      id: 'module-2',
      title: 'Components & Props',
      lessons: [
        { id: 'lesson-2-1', title: 'Functional Components', type: 'video', duration: 20, isFree: false },
        { id: 'lesson-2-2', title: 'Class Components', type: 'video', duration: 18, isFree: false },
        { id: 'lesson-2-3', title: 'Props and PropTypes', type: 'video', duration: 22, isFree: false },
        { id: 'lesson-2-4', title: 'Component Composition', type: 'article', duration: 12, isFree: false },
        { id: 'lesson-2-5', title: 'Build a Component Library', type: 'assignment', duration: 60, isFree: false },
        { id: 'lesson-2-6', title: 'Module 2 Quiz', type: 'quiz', duration: 20, isFree: false },
      ],
    },
    {
      id: 'module-3',
      title: 'State & Lifecycle',
      lessons: [
        { id: 'lesson-3-1', title: 'Understanding State', type: 'video', duration: 25, isFree: false },
        { id: 'lesson-3-2', title: 'useState Hook', type: 'video', duration: 20, isFree: false },
        { id: 'lesson-3-3', title: 'useEffect Hook', type: 'video', duration: 22, isFree: false },
        { id: 'lesson-3-4', title: 'Lifecycle Methods', type: 'article', duration: 15, isFree: false },
        { id: 'lesson-3-5', title: 'Module 3 Quiz', type: 'quiz', duration: 15, isFree: false },
      ],
    },
  ],
};

export function CourseManagePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [expandedModules, setExpandedModules] = useState<string[]>(['module-1', 'module-2', 'module-3']);
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonType, setNewLessonType] = useState<Lesson['type']>('video');
  const [isSaving, setIsSaving] = useState(false);

  // In real app, fetch course by id
  const course = mockCourseData;
  console.log('Course ID:', courseId);

  const [formData, setFormData] = useState({
    title: course.title,
    shortDescription: course.shortDescription,
    description: course.description,
    category: course.category,
    level: course.level,
    price: course.price,
    discountPrice: course.discountPrice,
  });

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: language === 'id' ? 'Ikhtisar' : 'Overview', icon: <Edit className="w-4 h-4" /> },
    { id: 'curriculum', label: language === 'id' ? 'Kurikulum' : 'Curriculum', icon: <FileText className="w-4 h-4" /> },
    { id: 'pricing', label: language === 'id' ? 'Harga' : 'Pricing', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'students', label: language === 'id' ? 'Siswa' : 'Students', icon: <Users className="w-4 h-4" /> },
    { id: 'analytics', label: language === 'id' ? 'Analitik' : 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: language === 'id' ? 'Pengaturan' : 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const getLessonIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'video':
        return <Play className="w-4 h-4 text-blue-500" />;
      case 'article':
        return <FileText className="w-4 h-4 text-purple-500" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4 text-yellow-500" />;
      case 'assignment':
        return <FileText className="w-4 h-4 text-orange-500" />;
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getTotalLessons = () => course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const getTotalDuration = () =>
    course.modules.reduce((sum, m) => sum + m.lessons.reduce((s, l) => s + l.duration, 0), 0);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert(language === 'id' ? 'Perubahan berhasil disimpan!' : 'Changes saved successfully!');
  };

  const handleAddModule = () => {
    if (newModuleTitle.trim()) {
      console.log('Adding module:', newModuleTitle);
      setNewModuleTitle('');
      setShowAddModuleModal(false);
    }
  };

  const handleAddLesson = () => {
    if (newLessonTitle.trim() && selectedModuleId) {
      console.log('Adding lesson:', newLessonTitle, 'to module:', selectedModuleId);
      setNewLessonTitle('');
      setNewLessonType('video');
      setShowAddLessonModal(false);
    }
  };

  const getStatusBadge = () => {
    switch (course.status) {
      case 'published':
        return <Badge variant="success">{language === 'id' ? 'Dipublikasi' : 'Published'}</Badge>;
      case 'pending':
        return <Badge variant="warning">{language === 'id' ? 'Menunggu Review' : 'Pending Review'}</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'rejected':
        return <Badge variant="danger">{language === 'id' ? 'Ditolak' : 'Rejected'}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Link
              to="/instructor/courses"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
                {getStatusBadge()}
              </div>
              <p className="text-sm text-gray-500">
                {course.modules.length} {language === 'id' ? 'Modul' : 'Modules'} • {getTotalLessons()}{' '}
                {language === 'id' ? 'Pelajaran' : 'Lessons'} • {formatDuration(getTotalDuration())}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {course.status === 'published' && (
              <Link
                to={`/course/${course.slug}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
              >
                <Eye className="w-4 h-4" />
                {language === 'id' ? 'Lihat Kursus' : 'View Course'}
              </Link>
            )}
            <Button leftIcon={<Save className="w-4 h-4" />} onClick={handleSave} isLoading={isSaving}>
              {language === 'id' ? 'Simpan' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'id' ? 'Informasi Dasar' : 'Basic Information'}</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <Input
                    label={language === 'id' ? 'Judul Kursus' : 'Course Title'}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  <Input
                    label={language === 'id' ? 'Deskripsi Singkat' : 'Short Description'}
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'id' ? 'Deskripsi Lengkap' : 'Full Description'}
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'id' ? 'Kategori' : 'Category'}
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="web-development">Web Development</option>
                        <option value="mobile-development">Mobile Development</option>
                        <option value="data-science">Data Science</option>
                        <option value="design">Design</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === 'id' ? 'Level' : 'Level'}
                      </label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="beginner">{language === 'id' ? 'Pemula' : 'Beginner'}</option>
                        <option value="intermediate">{language === 'id' ? 'Menengah' : 'Intermediate'}</option>
                        <option value="advanced">{language === 'id' ? 'Lanjutan' : 'Advanced'}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Thumbnail & Video */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'id' ? 'Media' : 'Media'}</CardTitle>
                </CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'id' ? 'Thumbnail Kursus' : 'Course Thumbnail'}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <button className="text-sm text-blue-600 hover:underline flex items-center justify-center gap-1 mx-auto">
                        <Image className="w-4 h-4" />
                        {language === 'id' ? 'Ganti Gambar' : 'Change Image'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'id' ? 'Video Perkenalan' : 'Intro Video'}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center h-full flex flex-col items-center justify-center">
                      <Video className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-2">
                        {course.introVideo || (language === 'id' ? 'Belum ada video' : 'No video yet')}
                      </p>
                      <button className="text-sm text-blue-600 hover:underline">
                        {language === 'id' ? 'Upload Video' : 'Upload Video'}
                      </button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Objectives & Prerequisites */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'id' ? 'Tujuan Pembelajaran' : 'Learning Objectives'}</CardTitle>
                </CardHeader>
                <div className="space-y-2">
                  {course.objectives.map((obj, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <input
                        type="text"
                        value={obj}
                        onChange={() => {}}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="p-1 text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    {language === 'id' ? 'Tambah Tujuan' : 'Add Objective'}
                  </button>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'id' ? 'Statistik' : 'Statistics'}</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{language === 'id' ? 'Total Siswa' : 'Total Students'}</span>
                    <span className="font-bold text-gray-900">{course.totalStudents}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-bold text-gray-900">⭐ {course.rating} ({course.totalRatings})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{language === 'id' ? 'Total Modul' : 'Total Modules'}</span>
                    <span className="font-bold text-gray-900">{course.modules.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{language === 'id' ? 'Total Pelajaran' : 'Total Lessons'}</span>
                    <span className="font-bold text-gray-900">{getTotalLessons()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{language === 'id' ? 'Durasi Total' : 'Total Duration'}</span>
                    <span className="font-bold text-gray-900">{formatDuration(getTotalDuration())}</span>
                  </div>
                </div>
              </Card>

              {/* Publish Status */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'id' ? 'Status Publikasi' : 'Publish Status'}</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                    <span className="text-gray-600">{language === 'id' ? 'Status Saat Ini' : 'Current Status'}</span>
                    {getStatusBadge()}
                  </div>
                  {course.status === 'draft' && (
                    <Button className="w-full">
                      {language === 'id' ? 'Ajukan untuk Review' : 'Submit for Review'}
                    </Button>
                  )}
                  {course.status === 'published' && (
                    <Button variant="outline" className="w-full">
                      {language === 'id' ? 'Buat Draft Baru' : 'Create New Draft'}
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                {language === 'id'
                  ? 'Kelola modul dan pelajaran kursus Anda.'
                  : 'Manage your course modules and lessons.'}
              </p>
              <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModuleModal(true)}>
                {language === 'id' ? 'Tambah Modul' : 'Add Module'}
              </Button>
            </div>

            {course.modules.map((module, moduleIndex) => {
              const isExpanded = expandedModules.includes(module.id);
              const totalDuration = module.lessons.reduce((sum, l) => sum + l.duration, 0);

              return (
                <Card key={module.id} className="overflow-hidden">
                  {/* Module Header */}
                  <div className="flex items-center gap-3 p-4 bg-gray-50 border-b border-gray-200">
                    <button className="cursor-grab text-gray-400 hover:text-gray-600">
                      <GripVertical className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="flex-1 flex items-center gap-2 text-left"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {language === 'id' ? 'Modul' : 'Module'} {moduleIndex + 1}: {module.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {module.lessons.length} {language === 'id' ? 'pelajaran' : 'lessons'} • {formatDuration(totalDuration)}
                        </p>
                      </div>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedModuleId(module.id);
                          setShowAddLessonModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        aria-label="Add lesson"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Lessons */}
                  {isExpanded && (
                    <div>
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className={`flex items-center gap-3 p-4 hover:bg-gray-50 ${
                            lessonIndex < module.lessons.length - 1 ? 'border-b border-gray-100' : ''
                          }`}
                        >
                          <button className="cursor-grab text-gray-400 hover:text-gray-600">
                            <GripVertical className="w-4 h-4" />
                          </button>
                          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                            {getLessonIcon(lesson.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900">{lesson.title}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span className="capitalize">{lesson.type}</span>
                              <span>•</span>
                              <Clock className="w-3 h-3" />
                              <span>{lesson.duration}m</span>
                              {lesson.isFree && (
                                <>
                                  <span>•</span>
                                  <Badge variant="success" size="sm">
                                    {language === 'id' ? 'Gratis' : 'Free'}
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {activeTab === 'pricing' && (
          <Card>
            <CardHeader>
              <CardTitle>{language === 'id' ? 'Pengaturan Harga' : 'Pricing Settings'}</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'id' ? 'Harga Normal' : 'Regular Price'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'id' ? 'Harga Diskon (Opsional)' : 'Discount Price (Optional)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                  <input
                    type="number"
                    value={formData.discountPrice || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, discountPrice: e.target.value ? Number(e.target.value) : undefined })
                    }
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            {formData.discountPrice && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-green-800">
                  {language === 'id' ? 'Diskon:' : 'Discount:'}{' '}
                  <span className="font-bold">
                    {Math.round(((formData.price - formData.discountPrice) / formData.price) * 100)}%
                  </span>{' '}
                  ({formatCurrency(formData.price - formData.discountPrice)}{' '}
                  {language === 'id' ? 'hemat' : 'savings'})
                </p>
              </div>
            )}
          </Card>
        )}

        {activeTab === 'students' && (
          <Card>
            <CardHeader>
              <CardTitle>{language === 'id' ? 'Daftar Siswa' : 'Student List'}</CardTitle>
            </CardHeader>
            <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>{language === 'id' ? 'Fitur ini akan segera hadir.' : 'This feature is coming soon.'}</p>
            </div>
          </Card>
        )}

        {activeTab === 'analytics' && (
          <Card>
            <CardHeader>
              <CardTitle>{language === 'id' ? 'Analitik Kursus' : 'Course Analytics'}</CardTitle>
            </CardHeader>
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>{language === 'id' ? 'Fitur ini akan segera hadir.' : 'This feature is coming soon.'}</p>
            </div>
          </Card>
        )}

        {activeTab === 'settings' && (
          <Card>
            <CardHeader>
              <CardTitle>{language === 'id' ? 'Pengaturan Kursus' : 'Course Settings'}</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <h4 className="font-medium text-red-800 mb-2">
                  {language === 'id' ? 'Zona Berbahaya' : 'Danger Zone'}
                </h4>
                <p className="text-sm text-red-600 mb-4">
                  {language === 'id'
                    ? 'Tindakan ini tidak dapat dibatalkan. Harap berhati-hati.'
                    : 'These actions are irreversible. Please be careful.'}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    {language === 'id' ? 'Arsipkan Kursus' : 'Archive Course'}
                  </Button>
                  {course.status === 'draft' && (
                    <Button variant="danger" size="sm">
                      {language === 'id' ? 'Hapus Kursus' : 'Delete Course'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Add Module Modal */}
        <Modal
          isOpen={showAddModuleModal}
          onClose={() => setShowAddModuleModal(false)}
          title={language === 'id' ? 'Tambah Modul Baru' : 'Add New Module'}
          size="md"
        >
          <div className="space-y-4">
            <Input
              label={language === 'id' ? 'Judul Modul' : 'Module Title'}
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              placeholder={language === 'id' ? 'Contoh: Pengenalan React' : 'e.g., Introduction to React'}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddModuleModal(false)}>
                {language === 'id' ? 'Batal' : 'Cancel'}
              </Button>
              <Button onClick={handleAddModule}>{language === 'id' ? 'Tambah' : 'Add'}</Button>
            </div>
          </div>
        </Modal>

        {/* Add Lesson Modal */}
        <Modal
          isOpen={showAddLessonModal}
          onClose={() => setShowAddLessonModal(false)}
          title={language === 'id' ? 'Tambah Pelajaran Baru' : 'Add New Lesson'}
          size="md"
        >
          <div className="space-y-4">
            <Input
              label={language === 'id' ? 'Judul Pelajaran' : 'Lesson Title'}
              value={newLessonTitle}
              onChange={(e) => setNewLessonTitle(e.target.value)}
              placeholder={language === 'id' ? 'Contoh: Apa itu React?' : 'e.g., What is React?'}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'id' ? 'Tipe Konten' : 'Content Type'}
              </label>
              <select
                value={newLessonType}
                onChange={(e) => setNewLessonType(e.target.value as Lesson['type'])}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="video">Video</option>
                <option value="article">{language === 'id' ? 'Artikel' : 'Article'}</option>
                <option value="quiz">Quiz</option>
                <option value="assignment">{language === 'id' ? 'Tugas' : 'Assignment'}</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddLessonModal(false)}>
                {language === 'id' ? 'Batal' : 'Cancel'}
              </Button>
              <Button onClick={handleAddLesson}>{language === 'id' ? 'Tambah' : 'Add'}</Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
