import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  BarChart3,
  FileText,
  MessageSquare,
  Award,
  DollarSign,
  FolderOpen,
  UserCheck,
  ShieldCheck,
  Layers,
  CreditCard,
  ClipboardList,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { Avatar, Badge, Dropdown } from '@/components/ui';
import type { DropdownItem } from '@/components/ui';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavGroup {
  title?: string;
  items: NavItem[];
}

const studentNavGroups: NavGroup[] = [
  {
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
      { label: 'Kursus Saya', href: '/my-courses', icon: <BookOpen className="w-5 h-5" /> },
    ],
  },
  {
    title: 'Pembelajaran',
    items: [
      { label: 'Tugas', href: '/assignments', icon: <ClipboardList className="w-5 h-5" />, badge: 3 },
      { label: 'Forum Diskusi', href: '/discussions', icon: <MessageSquare className="w-5 h-5" /> },
      { label: 'Sertifikat', href: '/certificates', icon: <Award className="w-5 h-5" /> },
    ],
  },
  {
    title: 'Gamifikasi',
    items: [
      { label: 'Leaderboard', href: '/leaderboard', icon: <BarChart3 className="w-5 h-5" /> },
      { label: 'Lencana Saya', href: '/badges', icon: <Award className="w-5 h-5" /> },
    ],
  },
];

const instructorNavGroups: NavGroup[] = [
  {
    items: [
      { label: 'Dashboard', href: '/instructor', icon: <LayoutDashboard className="w-5 h-5" /> },
      { label: 'Kursus Saya', href: '/instructor/courses', icon: <BookOpen className="w-5 h-5" /> },
    ],
  },
  {
    title: 'Manajemen',
    items: [
      { label: 'Siswa', href: '/instructor/students', icon: <Users className="w-5 h-5" /> },
      { label: 'Penilaian', href: '/instructor/grading', icon: <FileText className="w-5 h-5" />, badge: 5 },
      { label: 'Tanya Jawab', href: '/instructor/qa', icon: <MessageSquare className="w-5 h-5" />, badge: 12 },
    ],
  },
  {
    title: 'Keuangan',
    items: [
      { label: 'Pendapatan', href: '/instructor/earnings', icon: <DollarSign className="w-5 h-5" /> },
      { label: 'Penarikan', href: '/instructor/payouts', icon: <CreditCard className="w-5 h-5" /> },
    ],
  },
];

const adminNavGroups: NavGroup[] = [
  {
    items: [
      { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    ],
  },
  {
    title: 'Manajemen',
    items: [
      { label: 'Pengguna', href: '/admin/users', icon: <Users className="w-5 h-5" /> },
      { label: 'Verifikasi Instruktur', href: '/admin/verify-instructors', icon: <UserCheck className="w-5 h-5" />, badge: 8 },
      { label: 'Kursus', href: '/admin/courses', icon: <BookOpen className="w-5 h-5" /> },
      { label: 'Kategori', href: '/admin/categories', icon: <FolderOpen className="w-5 h-5" /> },
    ],
  },
  {
    title: 'Keuangan',
    items: [
      { label: 'Transaksi', href: '/admin/transactions', icon: <CreditCard className="w-5 h-5" /> },
      { label: 'Pembayaran Instruktur', href: '/admin/payouts', icon: <DollarSign className="w-5 h-5" /> },
      { label: 'Pengaturan Komisi', href: '/admin/commission', icon: <Layers className="w-5 h-5" /> },
    ],
  },
  {
    title: 'Platform',
    items: [
      { label: 'Pengaturan', href: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
      { label: 'Moderasi', href: '/admin/moderation', icon: <ShieldCheck className="w-5 h-5" /> },
    ],
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const getNavGroups = (): NavGroup[] => {
    switch (user?.role) {
      case 'admin':
        return adminNavGroups;
      case 'instructor':
        return instructorNavGroups;
      default:
        return studentNavGroups;
    }
  };

  const navGroups = getNavGroups();

  const userMenuItems: DropdownItem[] = [
    {
      label: 'Kembali ke Beranda',
      icon: <BookOpen className="w-4 h-4" />,
      onClick: () => navigate('/'),
    },
    {
      label: 'Profil Saya',
      icon: <Users className="w-4 h-4" />,
      onClick: () => navigate('/profile'),
    },
    {
      label: 'Pengaturan',
      icon: <Settings className="w-4 h-4" />,
      onClick: () => navigate('/settings'),
    },
    { divider: true, label: '' },
    {
      label: 'Keluar',
      icon: <LogOut className="w-4 h-4" />,
      onClick: () => {
        logout();
        navigate('/');
      },
      danger: true,
    },
  ];

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'admin':
        return 'Administrator';
      case 'instructor':
        return 'Instruktur';
      default:
        return 'Siswa';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">HLMS</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-4rem)]">
          {navGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {group.title && (
                <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {group.title}
                </h3>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        )}
                      >
                        <span className={cn(isActive ? 'text-blue-600' : 'text-gray-400')}>
                          {item.icon}
                        </span>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && item.badge > 0 && (
                          <Badge variant="danger" size="sm">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            <div className="flex-1 lg:hidden" />

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <Dropdown
                trigger={
                  <button className="flex items-center gap-3 p-1.5 hover:bg-gray-100 rounded-lg">
                    <Avatar src={user?.avatar} name={user?.name || 'User'} size="sm" />
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{getRoleLabel()}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
                  </button>
                }
                items={userMenuItems}
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
