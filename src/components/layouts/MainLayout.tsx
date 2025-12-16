import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Bell,
  ChevronDown,
  User,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useNotifications } from '@/context/NotificationContext';
import { Avatar, Badge, Button, Dropdown } from '@/components/ui';
import type { DropdownItem } from '@/components/ui';
import { getTimeAgo } from '@/lib/utils';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const userMenuItems: DropdownItem[] = [
    {
      label: 'Profil Saya',
      icon: <User className="w-4 h-4" />,
      onClick: () => navigate('/profile'),
    },
    {
      label: 'Kursus Saya',
      icon: <BookOpen className="w-4 h-4" />,
      onClick: () => navigate('/my-courses'),
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

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'instructor':
        return '/instructor';
      default:
        return '/dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">HLMS</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kursus..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Categories Link - Desktop */}
            <Link
              to="/courses"
              className="hidden lg:block text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Jelajahi Kursus
            </Link>

            {isAuthenticated ? (
              <>
                {/* Dashboard Link */}
                <Link
                  to={getDashboardLink()}
                  className="hidden sm:block text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>

                {/* Cart */}
                <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {/* Notifications */}
                <Dropdown
                  trigger={
                    <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Bell className="w-5 h-5 text-gray-600" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  }
                  items={[]}
                  align="right"
                >
                  <div className="w-80 max-h-96 overflow-y-auto">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">Notifikasi</h3>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500">
                        Tidak ada notifikasi
                      </div>
                    ) : (
                      <div>
                        {notifications.slice(0, 5).map((notification) => (
                          <button
                            key={notification.id}
                            onClick={() => {
                              markAsRead(notification.id);
                              if (notification.link) navigate(notification.link);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-50 last:border-0 ${
                              !notification.isRead ? 'bg-blue-50' : ''
                            }`}
                          >
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-sm text-gray-500 line-clamp-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{getTimeAgo(notification.createdAt)}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </Dropdown>

                {/* User Menu */}
                <Dropdown
                  trigger={
                    <button className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-full transition-colors">
                      <Avatar src={user?.avatar} name={user?.name || 'User'} size="sm" />
                      <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
                    </button>
                  }
                  items={userMenuItems}
                />
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Masuk
                  </Button>
                </Link>
                <Link to="/register" className="hidden sm:block">
                  <Button size="sm">Daftar</Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari kursus..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>
            <nav className="space-y-2">
              <Link
                to="/courses"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Jelajahi Kursus
              </Link>
              {isAuthenticated && (
                <Link
                  to={getDashboardLink()}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">HLMS</span>
            </div>
            <p className="text-sm text-gray-400">
              Platform pembelajaran hybrid yang menggabungkan kursus mandiri dan kelas terstruktur.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Jelajahi</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="hover:text-white transition-colors">Semua Kursus</Link></li>
              <li><Link to="/categories" className="hover:text-white transition-colors">Kategori</Link></li>
              <li><Link to="/instructors" className="hover:text-white transition-colors">Instruktur</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Perusahaan</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">Tentang Kami</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Karir</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Hubungi Kami</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="hover:text-white transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Kebijakan Privasi</Link></li>
              <li><Link to="/refund" className="hover:text-white transition-colors">Kebijakan Refund</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} HLMS. Hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
