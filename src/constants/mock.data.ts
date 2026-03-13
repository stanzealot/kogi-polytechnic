import type { Course } from '@/types';

// ─── Allocated Courses (lecturer's current list) ───────────────
export const MOCK_ALLOCATED_COURSES: Course[] = [
  { courseCode: 'ACC111', courseTitle: 'Principles of Accounting 1',    unit: 3, session: '2025/2026', level: 'ND1',  semester: 'First'  },
  { courseCode: 'BAM114', courseTitle: 'Principles of Economics',       unit: 2, session: '2025/2026', level: 'ND1',  semester: 'First'  },
  { courseCode: 'BAM214', courseTitle: 'Business Law',                  unit: 3, session: '2025/2026', level: 'HND1', semester: 'Second' },
  { courseCode: 'EED216', courseTitle: 'Practice of Entrepreneurship',  unit: 3, session: '2025/2026', level: 'ND2',  semester: 'First'  },
  { courseCode: 'EED413', courseTitle: 'Entrepreneurship Development',  unit: 4, session: '2025/2026', level: 'HND2', semester: 'Second' },
  { courseCode: 'GNS201', courseTitle: 'Use of English',                unit: 2, session: '2025/2026', level: 'ND2',  semester: 'Second' },
  { courseCode: 'GNS401', courseTitle: 'Communication in English',      unit: 3, session: '2025/2026', level: 'HND1', semester: 'First'  },
  { courseCode: 'MGT301', courseTitle: 'Management Principles',         unit: 3, session: '2025/2026', level: 'HND1', semester: 'Second' },
  { courseCode: 'ACC211', courseTitle: 'Intermediate Accounting',       unit: 3, session: '2025/2026', level: 'ND2',  semester: 'First'  },
  { courseCode: 'BAM101', courseTitle: 'Business Communication',        unit: 2, session: '2025/2026', level: 'ND1',  semester: 'Second' },
];

// ─── Courses available for allocation (from own school) ────────
export interface AvailableCourse {
  courseCode: string;
  courseTitle: string;
  unit: number;
  level: string;
}

export const MOCK_AVAILABLE_COURSES: AvailableCourse[] = [
  { courseCode: 'ACC111', courseTitle: 'Principles of Accounting 1',   unit: 3, level: 'ND1'  },
  { courseCode: 'BAM114', courseTitle: 'Principles of Economics',      unit: 2, level: 'ND1'  },
  { courseCode: 'BAM214', courseTitle: 'Business Law',                 unit: 3, level: 'HND1' },
  { courseCode: 'EED216', courseTitle: 'Practice of Entrepreneurship', unit: 3, level: 'ND2'  },
  { courseCode: 'EED413', courseTitle: 'Entrepreneurship Development', unit: 4, level: 'HND2' },
  { courseCode: 'GNS201', courseTitle: 'Use of English',               unit: 2, level: 'ND2'  },
  { courseCode: 'GNS401', courseTitle: 'Communication in English',     unit: 3, level: 'HND1' },
  { courseCode: 'MGT301', courseTitle: 'Management Principles',        unit: 3, level: 'HND1' },
  { courseCode: 'ACC211', courseTitle: 'Intermediate Accounting',      unit: 3, level: 'ND2'  },
  { courseCode: 'BAM101', courseTitle: 'Business Communication',       unit: 2, level: 'ND1'  },
];

// ─── Courses from other schools (cross-institution list) ───────
export const MOCK_OTHER_SCHOOL_COURSES: AvailableCourse[] = [
  { courseCode: 'ACC112', courseTitle: 'Advanced Accounting',               unit: 3, level: 'HND1' },
  { courseCode: 'BIO101', courseTitle: 'Introduction to Biology',           unit: 2, level: 'ND1'  },
  { courseCode: 'CSC211', courseTitle: 'Data Structures & Algorithms',      unit: 3, level: 'ND2'  },
  { courseCode: 'EED423', courseTitle: 'Digital Entrepreneurship',          unit: 3, level: 'HND2' },
  { courseCode: 'EED302', courseTitle: 'Small Business Management',         unit: 2, level: 'HND1' },
  { courseCode: 'COM224', courseTitle: 'Computer Networks',                 unit: 3, level: 'ND2'  },
  { courseCode: 'BAF221', courseTitle: 'Banking and Finance Fundamentals',  unit: 2, level: 'ND1'  },
  { courseCode: 'ENG101', courseTitle: 'Technical English',                 unit: 2, level: 'ND1'  },
  { courseCode: 'PHY201', courseTitle: 'Applied Physics',                   unit: 3, level: 'ND2'  },
  { courseCode: 'MTH301', courseTitle: 'Engineering Mathematics',           unit: 4, level: 'HND1' },
];

// ─── Filter options ────────────────────────────────────────────
export const SESSIONS = ['2025/2026', '2024/2025', '2023/2024'];
export const SEMESTERS = ['First', 'Second'];
export const STUDENT_TYPES = ['Full time', 'Part time', 'Sandwich'];
export const DEPARTMENTS = ['Accounting', 'Business Administration', 'Marketing', 'Economics'];

// ─── Pagination ────────────────────────────────────────────────
export const PAGE_SIZE = 7;

// ─── Exam Attendance: courses with student counts ──────────────
export interface AttendanceCourse {
  courseCode: string;
  courseTitle: string;
  unit: number;
  department: string;
  session: string;
  level: string;
  semester: 'First' | 'Second';
  studentCount: number;
}

export const MOCK_ATTENDANCE_COURSES: AttendanceCourse[] = [
  { courseCode: 'ACC111', courseTitle: 'Principles of Accounting 1',   unit: 3, department: 'Accounting',             session: '2025/2026', level: 'ND1',  semester: 'First',  studentCount: 20  },
  { courseCode: 'ACC112', courseTitle: 'Principles of Accounting 2',   unit: 4, department: 'Accounting',             session: '2025/2026', level: 'ND1',  semester: 'Second', studentCount: 202 },
  { courseCode: 'ACC113', courseTitle: 'Financial Management',         unit: 3, department: 'Accounting',             session: '2025/2026', level: 'ND1',  semester: 'Second', studentCount: 203 },
  { courseCode: 'ACC114', courseTitle: 'Marketing Fundamentals',       unit: 2, department: 'Accounting',             session: '2025/2026', level: 'ND1',  semester: 'First',  studentCount: 204 },
  { courseCode: 'ACC115', courseTitle: 'Business Law and Ethics',      unit: 4, department: 'Accounting',             session: '2025/2026', level: 'ND1',  semester: 'Second', studentCount: 205 },
  { courseCode: 'ACC116', courseTitle: 'Organizational Behavior',      unit: 3, department: 'Accounting',             session: '2025/2026', level: 'ND1',  semester: 'First',  studentCount: 206 },
  { courseCode: 'BAM114', courseTitle: 'Principles of Economics',      unit: 2, department: 'Business Administration',session: '2025/2026', level: 'ND1',  semester: 'First',  studentCount: 85  },
  { courseCode: 'BAM214', courseTitle: 'Business Law',                 unit: 3, department: 'Business Administration',session: '2025/2026', level: 'HND1', semester: 'Second', studentCount: 64  },
  { courseCode: 'EED216', courseTitle: 'Practice of Entrepreneurship', unit: 3, department: 'Marketing',             session: '2025/2026', level: 'ND2',  semester: 'First',  studentCount: 112 },
  { courseCode: 'GNS201', courseTitle: 'Use of English',               unit: 2, department: 'Business Administration',session: '2025/2026', level: 'ND2',  semester: 'Second', studentCount: 198 },
];

// ─── Exam Attendance: student records per course ───────────────
export interface AttendanceStudent {
  sn: number;
  matricNumber: string;
  fullName: string;
}

const NAMES = [
  'John Doe','Jane Smith','Michael Johnson','Emily Davis','Chris Brown',
  'Sarah Wilson','David Garcia','Laura Martinez','Daniel Rodriguez','Rebecca Lee',
  'Anthony Hall','Jessica Young','William King','Linda Wright','James Scott',
  'Patricia Green','Charles Adams','Susan Baker','Joseph Nelson','Karen Carter',
];

export function getMockStudents(courseCode: string, count: number): AttendanceStudent[] {
  const prefix = courseCode.replace(/\D/g, '').padStart(2, '0');
  return Array.from({ length: Math.min(count, 20) }, (_, i) => ({
    sn: i + 1,
    matricNumber: `25AC${prefix}${String(i + 1).padStart(3, '0')}`,
    fullName: NAMES[i] ?? `Student ${i + 1}`,
  }));
}

// ─── View Uploaded Results: uploaded result records ────────────
// Reuses AttendanceCourse shape — same columns as exam attendance
// (no separate type needed, AttendanceCourse already has all fields)
export const MOCK_UPLOADED_RESULTS = MOCK_ATTENDANCE_COURSES;
