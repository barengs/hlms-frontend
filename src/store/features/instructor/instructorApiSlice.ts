import { apiSlice } from '../../api/apiSlice';

export interface InstructorDashboardData {
  stats: {
    total_courses: number;
    total_students: number;
    monthly_revenue: number;
    total_revenue: number;
    average_rating: number;
  };
  actions: {
    pending_grading: number;
    unanswered_questions: number;
  };
  top_courses: Array<{
    id: number;
    title: string;
    total_students: number;
    revenue: number;
    trend: string;
  }>;
  revenue_summary: {
    total_revenue: number;
    this_month: number;
    available_balance: number;
  };
  activities: Array<{
    type: string;
    message: string;
    created_at: string;
  }>;
  revenue_chart: Array<{
    month: string;
    total: number;
  }>;
  active_students: Array<{
    id: number;
    name: string;
    course: string;
    progress: number;
  }>;
}

export interface InstructorDashboardResponse {
  success: boolean;
  message: string;
  data: InstructorDashboardData;
}

export interface InstructorCourse {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  status: 'draft' | 'pending' | 'published' | 'rejected';
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

export interface InstructorCoursesResponse {
  success: boolean;
  message: string;
  data: InstructorCourse[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface CreateCoursePayload {
  title: string;
  slug: string;
  thumbnail: string;
  subtitle: string;
  description: string;
  category_id: number;
  type: 'self_paced' | 'structured';
  level: 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
  language: string;
  price: number;
  discount_price: number;
  requirements: string[];
  outcomes: string[];
  target_audience: string[];
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export const instructorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInstructorDashboard: builder.query<InstructorDashboardData, void>({
      query: () => '/v1/instructor/dashboard',
      transformResponse: (response: InstructorDashboardResponse) => response.data,
    }),
    getInstructorCourses: builder.query<InstructorCourse[], void>({
      query: () => '/v1/instructor/courses',
      transformResponse: (response: any) => {
        // Handle if response is array or object with data property
        const rawData = Array.isArray(response) ? response : response.data || [];

        return rawData.map((course: any) => ({
          id: course.id,
          title: course.title,
          slug: course.slug,
          thumbnail: course.thumbnail,
          status: course.status, // Ensure backend returns 'draft' | 'pending' | 'published' | 'rejected'
          price: Number(course.price || 0),
          totalStudents: Number(course.students_count || 0),
          totalRevenue: Number(course.revenue || 0),
          rating: Number(course.average_rating || 0),
          totalRatings: Number(course.total_reviews || 0),
          totalLessons: Number(course.lessons_count || 0),
          totalModules: Number(course.sections_count || 0),
          completionRate: 0, // Not available in API derived from screenshot
          createdAt: course.created_at,
          updatedAt: course.updated_at,
          publishedAt: course.published_at,
          enrollmentsThisMonth: 0, // Placeholder
          revenueThisMonth: 0, // Placeholder
        }));
      },
      providesTags: ['InstructorCourses'],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => '/v1/admin/categories',
      transformResponse: (response: CategoriesResponse) => response.data,
    }),
    createCourse: builder.mutation<void, CreateCoursePayload>({
      query: (body) => ({
        url: '/v1/instructor/courses',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['InstructorCourses'],
    }),
    deleteCourse: builder.mutation<void, string>({
      query: (id) => ({
        url: `v1/instructor/courses/${id}`,
        method: 'DELETE',
        headers: {
          // Explicitly set header to ensure it's present for this critical action
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      }),
      invalidatesTags: ['InstructorCourses'],
    }),
  }),
});

export const {
  useGetInstructorDashboardQuery,
  useGetInstructorCoursesQuery,
  useGetCategoriesQuery,
  useCreateCourseMutation,
  useDeleteCourseMutation
} = instructorApiSlice;
