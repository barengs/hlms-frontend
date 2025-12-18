import { useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import {
  FolderOpen,
  TrendingUp,
  BookOpen,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Tag,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layouts';
import { Card, Button, Badge, Modal, DataTable, Input } from '@/components/ui';
import { useLanguage } from '@/context/LanguageContext';
import { formatNumber } from '@/lib/utils';
import type { DropdownItem } from '@/components/ui';
import { Dropdown } from '@/components/ui';

// Category interface
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parent?: string;
  coursesCount: number;
  isActive: boolean;
  createdAt: string;
}

// Mock categories data
const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Web Development',
    slug: 'web-development',
    description: 'Learn to build modern websites and web applications',
    icon: '💻',
    coursesCount: 24,
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
  },
  {
    id: 'cat-2',
    name: 'Mobile Development',
    slug: 'mobile-development',
    description: 'Create mobile apps for iOS and Android',
    icon: '📱',
    coursesCount: 12,
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 150).toISOString(),
  },
  {
    id: 'cat-3',
    name: 'Data Science',
    slug: 'data-science',
    description: 'Master data analysis, ML, and AI',
    icon: '📊',
    coursesCount: 18,
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 120).toISOString(),
  },
  {
    id: 'cat-4',
    name: 'Design',
    slug: 'design',
    description: 'UI/UX design, graphic design, and more',
    icon: '🎨',
    coursesCount: 15,
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
  },
  {
    id: 'cat-5',
    name: 'Programming',
    slug: 'programming',
    description: 'Learn programming languages and algorithms',
    icon: '⌨️',
    coursesCount: 32,
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 200).toISOString(),
  },
  {
    id: 'cat-6',
    name: 'Business',
    slug: 'business',
    description: 'Business, marketing, and entrepreneurship',
    icon: '💼',
    coursesCount: 8,
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
  {
    id: 'cat-7',
    name: 'Frontend Development',
    slug: 'frontend-development',
    description: 'HTML, CSS, JavaScript, React, and more',
    icon: '🖼️',
    parent: 'cat-1', // Parent: Web Development
    coursesCount: 14,
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 100).toISOString(),
  },
];

export function CategoriesManagementPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    parent: '',
  });

  // Calculate stats
  const stats = useMemo(() => {
    const total = mockCategories.length;
    const active = mockCategories.filter(c => c.isActive).length;
    const totalCourses = mockCategories.reduce((sum, c) => sum + c.coursesCount, 0);
    const avgCoursesPerCategory = totalCourses / total;
    const topCategory = mockCategories.reduce((max, c) =>
      c.coursesCount > max.coursesCount ? c : max
      , mockCategories[0]);

    return { total, active, totalCourses, avgCoursesPerCategory, topCategory };
  }, []);

  // Filter categories
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return mockCategories;

    const query = searchQuery.toLowerCase();
    return mockCategories.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.description?.toLowerCase().includes(query) ||
      c.slug.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleAdd = () => {
    setFormData({ name: '', slug: '', description: '', icon: '', parent: '' });
    setShowAddModal(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || '',
      parent: category.parent || '',
    });
    setShowEditModal(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const confirmAdd = () => {
    console.log('Adding category:', formData);
    setShowAddModal(false);
    setFormData({ name: '', slug: '', description: '', icon: '', parent: '' });
  };

  const confirmEdit = () => {
    console.log('Editing category:', selectedCategory?.id, formData);
    setShowEditModal(false);
    setSelectedCategory(null);
    setFormData({ name: '', slug: '', description: '', icon: '', parent: '' });
  };

  const confirmDelete = () => {
    console.log('Deleting category:', selectedCategory?.id);
    setShowDeleteModal(false);
    setSelectedCategory(null);
  };

  const getParentName = (parentId?: string) => {
    if (!parentId) return '-';
    const parent = mockCategories.find(c => c.id === parentId);
    return parent ? parent.name : '-';
  };

  const getCategoryActions = (category: Category): DropdownItem[] => [
    {
      label: language === 'id' ? 'Edit' : 'Edit',
      icon: <Edit className="w-4 h-4" />,
      onClick: () => handleEdit(category),
    },
    { divider: true, label: '' },
    {
      label: language === 'id' ? 'Hapus' : 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => handleDelete(category),
      danger: true,
    },
  ];

  // Column definitions
  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: 'name',
        header: language === 'id' ? 'Kategori' : 'Category',
        cell: ({ row }) => {
          const category = row.original;
          return (
            <div className="flex items-center gap-3">
              <span className="text-2xl">{category.icon || '📁'}</span>
              <div>
                <p className="font-medium text-gray-900 text-sm">{category.name}</p>
                <p className="text-xs text-gray-500">{category.slug}</p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'description',
        header: language === 'id' ? 'Deskripsi' : 'Description',
        cell: ({ row }) => (
          <p className="text-sm text-gray-700 max-w-md truncate">
            {row.original.description || '-'}
          </p>
        ),
      },
      {
        accessorKey: 'parent',
        header: language === 'id' ? 'Parent' : 'Parent',
        cell: ({ row }) => (
          <span className="text-sm text-gray-700">
            {getParentName(row.original.parent)}
          </span>
        ),
      },
      {
        accessorKey: 'coursesCount',
        header: language === 'id' ? 'Kursus' : 'Courses',
        cell: ({ row }) => (
          <div className="flex items-center gap-1 text-sm">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span className="font-medium">{formatNumber(row.original.coursesCount)}</span>
          </div>
        ),
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={row.original.isActive ? 'success' : 'secondary'} size="sm">
            {row.original.isActive ? (language === 'id' ? 'Aktif' : 'Active') : (language === 'id' ? 'Nonaktif' : 'Inactive')}
          </Badge>
        ),
      },
      {
        id: 'actions',
        header: language === 'id' ? 'Aksi' : 'Actions',
        cell: ({ row }) => (
          <Dropdown
            trigger={
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            }
            items={getCategoryActions(row.original)}
          />
        ),
        enableSorting: false,
      },
    ],
    [language]
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'id' ? 'Manajemen Kategori' : 'Categories Management'}
              </h1>
              <p className="text-gray-600 mt-1">
                {language === 'id'
                  ? 'Kelola kategori kursus platform'
                  : 'Manage platform course categories'}
              </p>
            </div>
            <Button onClick={handleAdd} leftIcon={<Plus className="w-4 h-4" />}>
              {language === 'id' ? 'Tambah Kategori' : 'Add Category'}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.total)}</p>
              <p className="text-xs text-gray-500">{language === 'id' ? 'Total' : 'Total'}</p>
            </div>
          </Card>

          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.active)}</p>
              <p className="text-xs text-gray-500">{language === 'id' ? 'Aktif' : 'Active'}</p>
            </div>
          </Card>

          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalCourses)}</p>
              <p className="text-xs text-gray-500">{language === 'id' ? 'Kursus' : 'Courses'}</p>
            </div>
          </Card>

          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.avgCoursesPerCategory.toFixed(1)}</p>
              <p className="text-xs text-gray-500">{language === 'id' ? 'Rata-rata' : 'Average'}</p>
            </div>
          </Card>

          <Card className="flex items-center gap-3">
            <span className="text-2xl">{stats.topCategory.icon || '🏆'}</span>
            <div>
              <p className="text-sm font-bold text-gray-900 truncate">{stats.topCategory.name}</p>
              <p className="text-xs text-gray-500">{language === 'id' ? 'Terpopuler' : 'Most Popular'}</p>
            </div>
          </Card>
        </div>

        {/* Categories Table */}
        <Card>
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'id' ? 'Cari kategori...' : 'Search categories...'}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Table */}
          <DataTable
            columns={columns}
            data={filteredCategories}
            enableRowSelection={false}
            enablePagination={true}
            pageSize={10}
          />
        </Card>

        {/* Add Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={language === 'id' ? 'Tambah Kategori' : 'Add Category'}
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'id' ? 'Nama Kategori' : 'Category Name'}
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={language === 'id' ? 'Contoh: Web Development' : 'e.g., Web Development'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="web-development"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'id' ? 'Deskripsi' : 'Description'}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={language === 'id' ? 'Deskripsi kategori...' : 'Category description...'}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon (Emoji)
              </label>
              <Input
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="💻"
                maxLength={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'id' ? 'Parent Kategori (Opsional)' : 'Parent Category (Optional)'}
              </label>
              <select
                value={formData.parent}
                onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{language === 'id' ? 'Tidak ada parent' : 'No parent'}</option>
                {mockCategories.filter(c => !c.parent).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button size="sm" variant="outline" onClick={() => setShowAddModal(false)}>
                {language === 'id' ? 'Batal' : 'Cancel'}
              </Button>
              <Button size="sm" onClick={confirmAdd}>
                {language === 'id' ? 'Tambah' : 'Add'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title={language === 'id' ? 'Edit Kategori' : 'Edit Category'}
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'id' ? 'Nama Kategori' : 'Category Name'}
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'id' ? 'Deskripsi' : 'Description'}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon (Emoji)
              </label>
              <Input
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                maxLength={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'id' ? 'Parent Kategori (Opsional)' : 'Parent Category (Optional)'}
              </label>
              <select
                value={formData.parent}
                onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{language === 'id' ? 'Tidak ada parent' : 'No parent'}</option>
                {mockCategories.filter(c => !c.parent && c.id !== selectedCategory?.id).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button size="sm" variant="outline" onClick={() => setShowEditModal(false)}>
                {language === 'id' ? 'Batal' : 'Cancel'}
              </Button>
              <Button size="sm" onClick={confirmEdit}>
                {language === 'id' ? 'Simpan' : 'Save'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title={language === 'id' ? 'Konfirmasi Hapus' : 'Confirm Delete'}
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              {language === 'id'
                ? `Apakah Anda yakin ingin menghapus kategori "${selectedCategory?.name}"? Tindakan ini tidak dapat dibatalkan.`
                : `Are you sure you want to delete "${selectedCategory?.name}" category? This action cannot be undone.`}
            </p>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowDeleteModal(false)}>
                {language === 'id' ? 'Batal' : 'Cancel'}
              </Button>
              <Button size="sm" variant="danger" onClick={confirmDelete}>
                {language === 'id' ? 'Hapus' : 'Delete'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
