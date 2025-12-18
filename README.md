# HLMS (Hybrid Learning Management System)

HLMS adalah platform Learning Management System (LMS) modern yang dibangun dengan React dan TypeScript. Sistem ini dirancang untuk mendukung pembelajaran online dengan fitur-fitur lengkap untuk siswa, instruktur, dan administrator.

## 📋 Deskripsi

HLMS menyediakan solusi lengkap untuk mengelola pembelajaran online, termasuk manajemen kursus, kelas, tugas, ujian, sistem gamifikasi, dan lebih banyak lagi. Platform ini mendukung tiga role utama:

- **Student (Siswa)**: Mengikuti kursus, mengerjakan tugas, mengikuti ujian, dan mendapatkan sertifikat
- **Instructor (Instruktur)**: Membuat dan mengelola kursus, kelas, materi pembelajaran, dan menilai siswa
- **Admin**: Mengelola pengguna, instruktur, kursus, kategori, dan sistem secara keseluruhan

## ✨ Fitur Utama

### 🎓 Untuk Siswa
- **Dashboard Pembelajaran**
  - Overview kursus yang sedang diikuti
  - Progress tracking
  - Upcoming deadlines
  - Recent achievements

- **Kursus & Pembelajaran**
  - Browse dan enroll kursus
  - Video pembelajaran
  - Materi downloadable
  - Quiz interaktif
  - Assignments submission

- **Ujian & Sertifikat**
  - Ujian online dengan timer
  - Auto-grading untuk multiple choice
  - Sertifikat digital setelah menyelesaikan kursus

- **Gamifikasi**
  - Points & rewards system
  - Badges & achievements
  - Leaderboard
  - Progress milestones

- **Diskusi & Q&A**
  - Forum diskusi per kursus
  - Q&A dengan instruktur
  - Peer discussions

### 👨‍🏫 Untuk Instruktur
- **Manajemen Kursus**
  - Create & edit courses
  - Upload materials (video, PDF, etc)
  - Structured curriculum builder
  - Course preview & publishing

- **Manajemen Kelas**
  - Create virtual classes
  - Schedule management
  - Student enrollment
  - Class discussions

- **Penilaian**
  - Assignment grading
  - Exam grading
  - Feedback system
  - Grade analytics

- **Earnings & Payouts**
  - Revenue tracking
  - Transaction history
  - Payout management
  - Financial analytics

- **Students Management**
  - Student progress tracking
  - Performance analytics
  - Communication tools

### 👤 Untuk Admin
- **User Management**
  - Manage all users (students, instructors, admins)
  - User detail pages
  - Account verification
  - Suspend/activate accounts

- **Instructor Management**
  - Instructor verification & approval
  - Instructor detail with statistics
  - Performance monitoring
  - Course & revenue tracking

- **Course Management**
  - Review & approve courses
  - Quality control workflow
  - Feedback system for curriculum
  - Course analytics

- **Category Management**
  - Create & organize categories
  - Category hierarchy (parent-child)
  - Icon/emoji support
  - Course distribution by category

- **Analytics & Reports**
  - Platform statistics
  - User growth metrics
  - Revenue analytics
  - Course performance

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **TanStack Router** - Routing
- **TanStack Table** - Advanced data tables
- **Tailwind CSS** - Styling
- **Lucide React** - Icon library

### State Management & Data
- **React Context** - Global state
- **React Query (planned)** - Server state management

### UI Components
Custom-built component library including:
- Cards, Buttons, Badges
- Modal, Dropdown
- DataTable with sorting, filtering, pagination
- Form inputs (Input, Select, Textarea)
- Avatar, Progress bars

## 📦 Installation

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** atau **yarn**

### Steps

1. **Clone repository**
   ```bash
   git clone https://github.com/barengs/hlms-frontend.git
   cd hlms-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Setup environment variables**
   
   Buat file `.env` di root directory:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_APP_NAME=HLMS
   ```

4. **Run development server**
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

5. **Open browser**
   
   Aplikasi akan berjalan di `http://localhost:5173`

## 🚀 Build untuk Production

```bash
npm run build
# atau
yarn build
```

Build output akan tersimpan di folder `dist/`

## 📁 Struktur Proyek

```
hlms-front/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── layouts/     # Layout components
│   │   └── ui/          # UI component library
│   ├── context/         # React Context providers
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   │   ├── admin/       # Admin pages
│   │   ├── instructor/  # Instructor pages
│   │   ├── student/     # Student pages
│   │   └── gamification/# Gamification pages
│   ├── router/          # Route configuration
│   ├── types/           # TypeScript types
│   ├── App.tsx          # Root component
│   └── main.tsx         # Entry point
├── .env                 # Environment variables
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite config
└── README.md            # This file
```

## 🎨 Component Library

### DataTable
Advanced table component dengan fitur:
- Sorting (ascending/descending)
- Pagination
- Row selection
- Custom cell rendering
- Responsive design

### Modal
Reusable modal component:
- Multiple sizes (sm, md, lg)
- Close on backdrop click
- Animated transitions

### Form Components
- Input, Select, Textarea
- Validation support
- Error states
- Size variants

## 🌐 Multi-language Support

Aplikasi mendukung dua bahasa:
- 🇮🇩 Bahasa Indonesia
- 🇬🇧 English

Language dapat diubah dari user menu di navbar.

## 🔒 Authentication & Authorization

Sistem menggunakan role-based access control (RBAC):
- **Public routes**: Landing, login, register
- **Student routes**: `/student/*`
- **Instructor routes**: `/instructor/*`
- **Admin routes**: `/admin/*`

Protected routes akan redirect ke login jika user belum authenticated.

## 📊 Dashboard Features

Setiap role memiliki dashboard yang disesuaikan:

### Student Dashboard
- Active courses
- Learning progress
- Upcoming assignments & exams
- Recent achievements
- Quick access to resources

### Instructor Dashboard
- Course statistics
- Student performance
- Revenue overview
- Pending tasks
- Recent activities

### Admin Dashboard
- Platform statistics
- User growth
- Revenue metrics
- Pending approvals
- System health

## 🎯 Fitur Khusus

### TanStack Table Integration
Semua tabel data menggunakan TanStack Table untuk:
- Performa optimal dengan data besar
- Flexible column configuration
- Built-in sorting & filtering
- Reusable table logic

### Course Review Workflow
Tim kurikulum/admin dapat:
1. Review course submissions
2. Provide structured feedback
3. Approve, request changes, atau reject
4. Track review history

### Gamification System
- Point accumulation
- Badge collections
- Achievement unlocks
- Competitive leaderboards

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

Developed by the HLMS Development Team

## 📧 Contact

For questions or support, please contact:
- Email: support@hlms.com
- Website: https://hlms.com

---

**HLMS** - Empowering Education Through Technology 🚀
