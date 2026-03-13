export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',

  // Lecturer portal
  LECTURER: {
    DASHBOARD: '/lecturer/dashboard',
    COURSE_ALLOCATION: '/lecturer/course-allocation',
    EXAM_ATTENDANCE: '/lecturer/exam-attendance',
    UPLOAD_RESULT: '/lecturer/upload-result',
    VIEW_RESULTS: '/lecturer/view-results',
    ACADEMIC_CALENDAR: '/lecturer/academic-calendar',
    SETTINGS: '/lecturer/settings',
  },
} as const;
