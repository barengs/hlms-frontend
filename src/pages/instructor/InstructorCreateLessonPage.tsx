import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts';
import { Card, Button, Input, Textarea } from '@/components/ui';
import { useLanguage } from '@/context/LanguageContext';
import {
  useCreateLessonMutation,
  useGetInstructorCourseQuery
} from '@/store/features/instructor/instructorApiSlice';

export function InstructorCreateLessonPage() {
  const { courseId, sectionId } = useParams<{ courseId: string; sectionId: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [createLesson, { isLoading: isSubmitting }] = useCreateLessonMutation();

  const { data: courseData } = useGetInstructorCourseQuery(courseId || '', {
    skip: !courseId,
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video' as 'video' | 'article' | 'quiz' | 'assignment',
    video_url: '',
    video_provider: 'youtube' as 'youtube' | 'vimeo',
    duration: 0,
    content: '',
    is_free: false,
    is_published: true,
  });


  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!courseId || !sectionId) return;

    try {
      await createLesson({
        courseId,
        sectionId,
        data: {
          title: formData.title,
          description: formData.description,
          type: formData.type,
          video_url: formData.video_url,
          video_provider: formData.video_provider,
          duration: formData.duration,
          content: formData.content,
          is_free: formData.is_free,
          is_published: formData.is_published,
        }
      }).unwrap();

      navigate(`/instructor/courses/${courseId}/edit?tab=curriculum`);
    } catch (error) {
      console.error('Failed to create lesson:', error);
      alert(language === 'id' ? 'Gagal membuat pelajaran. Silakan coba lagi.' : 'Failed to create lesson. Please try again.');
    }
  };

  if (!courseData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">
              {language === 'id' ? 'Memuat data kursus...' : 'Loading course data...'}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto pb-10">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/instructor/courses/${courseId}/edit?tab=curriculum`)}
            className="rounded-full aspect-square p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {language === 'id' ? 'Buat Pelajaran Baru' : 'Create New Lesson'}
            </h1>
            <p className="text-gray-600">
              {language === 'id'
                ? `Untuk kursus: ${courseData.title}`
                : `For course: ${courseData.title}`}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
              {language === 'id' ? 'Informasi Dasar' : 'Basic Information'}
            </h2>

            <Input
              label={language === 'id' ? 'Judul Pelajaran' : 'Lesson Title'}
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
            />

            <Textarea
              label={language === 'id' ? 'Deskripsi' : 'Description'}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              disabled={isSubmitting}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'id' ? 'Tipe Konten' : 'Content Type'}
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  <option value="video">Video</option>
                  <option value="article">{language === 'id' ? 'Artikel' : 'Article'}</option>
                  <option value="quiz">Quiz</option>
                  <option value="assignment">{language === 'id' ? 'Tugas' : 'Assignment'}</option>
                </select>
              </div>

              <Input
                label={language === 'id' ? 'Durasi (menit)' : 'Duration (minutes)'}
                type="number"
                name="duration"
                min="0"
                value={formData.duration}
                onChange={handleNumberChange}
                disabled={isSubmitting}
              />
            </div>
          </Card>

          {/* Content */}
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
              {language === 'id' ? 'Konten' : 'Content'}
            </h2>

            {formData.type === 'video' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'id' ? 'Provider Video' : 'Video Provider'}
                  </label>
                  <select
                    name="video_provider"
                    value={formData.video_provider}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    <option value="youtube">YouTube</option>
                    <option value="vimeo">Vimeo</option>
                  </select>
                </div>

                <Input
                  label={language === 'id' ? 'URL Video' : 'Video URL'}
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  disabled={isSubmitting}
                />
              </>
            )}

            {(formData.type === 'article' || formData.type === 'assignment') && (
              <Textarea
                label={language === 'id' ? 'Konten' : 'Content'}
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={10}
                disabled={isSubmitting}
                required
              />
            )}

            {formData.type === 'quiz' && (
              <div className="text-center py-8 text-gray-500">
                <p>{language === 'id'
                  ? 'Quiz akan dikonfigurasi setelah pelajaran dibuat.'
                  : 'Quiz will be configured after the lesson is created.'}</p>
              </div>
            )}
          </Card>

          {/* Settings */}
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
              {language === 'id' ? 'Pengaturan' : 'Settings'}
            </h2>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_free"
                name="is_free"
                checked={formData.is_free}
                onChange={handleCheckboxChange}
                disabled={isSubmitting}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_free" className="text-sm text-gray-700">
                {language === 'id' ? 'Pelajaran gratis (preview)' : 'Free lesson (preview)'}
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                checked={formData.is_published}
                onChange={handleCheckboxChange}
                disabled={isSubmitting}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_published" className="text-sm text-gray-700">
                {language === 'id' ? 'Publikasikan segera' : 'Publish immediately'}
              </label>
            </div>
          </Card>

          {/* Submit Action */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/instructor/courses/${courseId}/edit?tab=curriculum`)}
              disabled={isSubmitting}
            >
              {language === 'id' ? 'Batal' : 'Cancel'}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 min-w-[150px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {language === 'id' ? 'Menyimpan...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {language === 'id' ? 'Simpan Pelajaran' : 'Save Lesson'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}