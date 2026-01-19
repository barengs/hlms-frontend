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

export const instructorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInstructorDashboard: builder.query<InstructorDashboardData, void>({
      query: () => '/v1/instructor/dashboard',
      transformResponse: (response: InstructorDashboardResponse) => response.data,
    }),
  }),
});

export const { useGetInstructorDashboardQuery } = instructorApiSlice;
