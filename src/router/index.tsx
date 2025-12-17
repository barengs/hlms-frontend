import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { AuthProvider, CartProvider, NotificationProvider, LanguageProvider } from '@/context';
import { ProtectedRoute, PublicOnlyRoute } from '@/components/routes';

// Public Pages
import { HomePage, CourseCatalogPage, CourseDetailPage } from '@/pages/public';

// Auth Pages
import { LoginPage, RegisterPage, ForgotPasswordPage } from '@/pages/auth';

// Student Pages
import { StudentDashboard, MyCoursesPage, DiscussionsPage, DiscussionDetailPage } from '@/pages/student';

// Instructor Pages
import { InstructorDashboard } from '@/pages/instructor';

// Admin Pages
import { AdminDashboard } from '@/pages/admin';

// Gamification Pages
import { LeaderboardPage, BadgesPage } from '@/pages/gamification';

// Cart Pages
import { CartPage } from '@/pages/cart';

// Profile Pages
import { ProfilePage } from '@/pages/profile';

// Certificate Pages
import { CertificatesPage, CertificateDetailPage } from '@/pages/certificates';

// Root layout with providers
function RootLayout() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <Outlet />
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public Routes
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/courses',
        element: <CourseCatalogPage />,
      },
      {
        path: '/course/:slug',
        element: <CourseDetailPage />,
      },
      {
        path: '/cart',
        element: <CartPage />,
      },

      // Auth Routes (Public Only)
      {
        path: '/login',
        element: (
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        ),
      },
      {
        path: '/register',
        element: (
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        ),
      },
      {
        path: '/forgot-password',
        element: (
          <PublicOnlyRoute>
            <ForgotPasswordPage />
          </PublicOnlyRoute>
        ),
      },

      // Student Routes (Protected)
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my-courses',
        element: (
          <ProtectedRoute allowedRoles={['student']}>
            <MyCoursesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/leaderboard',
        element: (
          <ProtectedRoute allowedRoles={['student']}>
            <LeaderboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/badges',
        element: (
          <ProtectedRoute allowedRoles={['student']}>
            <BadgesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/discussions',
        element: (
          <ProtectedRoute allowedRoles={['student', 'instructor']}>
            <DiscussionsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/discussions/:id',
        element: (
          <ProtectedRoute allowedRoles={['student', 'instructor']}>
            <DiscussionDetailPage />
          </ProtectedRoute>
        ),
      },

      // Instructor Routes (Protected)
      {
        path: '/instructor',
        element: (
          <ProtectedRoute allowedRoles={['instructor']}>
            <InstructorDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/instructor/courses',
        element: (
          <ProtectedRoute allowedRoles={['instructor']}>
            <InstructorDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/instructor/students',
        element: (
          <ProtectedRoute allowedRoles={['instructor']}>
            <InstructorDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/instructor/grading',
        element: (
          <ProtectedRoute allowedRoles={['instructor']}>
            <InstructorDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/instructor/qa',
        element: (
          <ProtectedRoute allowedRoles={['instructor']}>
            <InstructorDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/instructor/earnings',
        element: (
          <ProtectedRoute allowedRoles={['instructor']}>
            <InstructorDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/instructor/payouts',
        element: (
          <ProtectedRoute allowedRoles={['instructor']}>
            <InstructorDashboard />
          </ProtectedRoute>
        ),
      },

      // Admin Routes (Protected)
      {
        path: '/admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/users',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/verify-instructors',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/courses',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/categories',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/transactions',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/payouts',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/commission',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/settings',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/moderation',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },

      // Certificate Routes (Protected)
      {
        path: '/certificates',
        element: (
          <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
            <CertificatesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/certificates/:id',
        element: (
          <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
            <CertificateDetailPage />
          </ProtectedRoute>
        ),
      },

      // Profile Route (Protected - All authenticated users)
      {
        path: '/profile',
        element: (
          <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },

      // Catch-all - redirect to home
      {
        path: '*',
        element: <HomePage />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
