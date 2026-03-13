// ─── Auth ───────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'lecturer' | 'student' | 'admin';
  title?: string;
  avatar?: string;
  faculty?: string;
  programme?: string;
  mobile?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// ─── Lecturer ───────────────────────────────────────────
export interface Course {
  courseCode: string;
  courseTitle: string;
  unit: number;
  session: string;
  level: string;
  semester: 'First' | 'Second';
}

export interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}
