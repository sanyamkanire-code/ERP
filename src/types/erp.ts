export type UserRole = 'admin' | 'faculty' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  departmentCode: 'CSE' | 'ECE' | 'MECH' | 'AIDS' | 'CIVIL';
  // Role specific fields
  studentId?: string; // e.g. "2023CS0142"
  semester?: number;
  batch?: string;
  facultyId?: string; // e.g. "FAC-CSE-108"
  designation?: string;
  specialization?: string;
  phone?: string;
  advisorName?: string;
}

export interface Department {
  id: string;
  code: 'CSE' | 'ECE' | 'MECH' | 'AIDS' | 'CIVIL';
  name: string;
  headOfDepartment: string;
  totalStudents: number;
  totalFaculty: number;
  averageAttendance: number;
  passPercentage: number;
}

export interface SubjectCourse {
  id: string;
  code: string; // e.g. "CS301"
  name: string; // "Advanced Data Structures & Algorithms"
  credits: number;
  semester: number;
  departmentCode: string;
  facultyId: string;
  facultyName: string;
  room: string;
  scheduleDays: string[]; // ["Mon", "Wed", "Fri"]
  timeSlot: string; // "09:00 AM - 10:00 AM"
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'od'; // od = On Duty (sports/symposium)

export interface AttendanceRecord {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  date: string; // YYYY-MM-DD
  period: number;
  facultyId: string;
  studentAttendance: Record<string, AttendanceStatus>; // studentId -> status
  topicCovered?: string;
  timestamp: string;
}

export interface StudentAttendanceSummary {
  studentId: string;
  studentName: string;
  courseCode: string;
  courseName: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  status: 'safe' | 'warning' | 'critical'; // critical is < 75%
}

export interface AcademicGradeRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  courseName: string;
  semester: number;
  internal1: number; // Max 25
  internal2: number; // Max 25
  assignmentScore: number; // Max 10
  labScore?: number; // Max 40
  finalExamScore?: number; // Max 100
  totalPercentage: number;
  gradeLetter: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'RA' | 'Pending';
  credits: number;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  category: 'Symposium' | 'Hackathon' | 'Workshop' | 'Placement' | 'Sports' | 'Cultural';
  date: string; // e.g. "2026-10-15"
  time: string;
  venue: string;
  organizer: string;
  department: string;
  isRegistered?: boolean;
  registeredCount: number;
  capacity: number;
  bannerImage: string;
  tags: string[];
}

export interface CourseMaterial {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  description: string;
  fileType: 'pdf' | 'pptx' | 'code' | 'doc' | 'archive';
  fileSize: string;
  downloadUrl: string;
  uploadedBy: string;
  uploadDate: string;
  unit: string;
  isCachedOffline: boolean;
  contentPreview?: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  content: string;
  timestamp: string;
  attachment?: {
    name: string;
    type: string;
    size: string;
    url: string;
  };
  reactions?: Record<string, number>; // emoji -> count
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'class' | 'department' | 'general' | 'direct';
  description: string;
  courseCode?: string;
  departmentCode?: string;
  membersCount: number;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'attendance' | 'academic' | 'event' | 'message' | 'security' | 'finance' | 'fee';
  read: boolean;
  linkTab?: string;
  priority?: 'urgent' | 'high' | 'normal' | 'low';
  actionLabel?: string;
  actionTab?: string;
  details?: string;
}

export interface GeofenceZone {
  id: string;
  name: string;
  room: string;
  courseCode: string;
  courseName: string;
  facultyName: string;
  latitude: number;
  longitude: number;
  radiusMeters: number; // 5 meters strict boundary
  beaconId: string;
  isActive: boolean;
  timeSlot: string;
  day: string;
}

export interface GeofencedAttendanceVerification {
  id: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  courseName: string;
  zoneName: string;
  room: string;
  timestamp: string;
  userLatitude: number;
  userLongitude: number;
  targetLatitude: number;
  targetLongitude: number;
  distanceMeters: number;
  accuracyMeters: number;
  verifiedWithin5m: boolean;
  deviceFingerprint: string;
  status: 'marked_present' | 'rejected_out_of_bounds';
}

export interface FeeBreakdownItem {
  id: string;
  name: string;
  category: 'tuition' | 'lab' | 'exam' | 'library' | 'amenities' | 'transport' | 'hostel' | 'other';
  amount: number;
  isOptional?: boolean;
  selected?: boolean;
  description?: string;
}

export interface StudentFeeRecord {
  id: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  department: string;
  departmentCode: string;
  semester: number;
  academicYear: string;
  items: FeeBreakdownItem[];
  subtotal: number;
  scholarshipDeduction: number;
  lateFee: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paymentDate?: string;
  transactionId?: string;
  paymentMethod?: 'UPI' | 'Net Banking' | 'Debit Card' | 'Credit Card' | 'NEFT/RTGS';
  reconciledByFinance: boolean;
  receiptVerified: boolean;
  notes?: string;
}

export interface MonthlyAnalyticsSummary {
  month: string;
  overallAttendanceRate: number;
  passPercentage: number;
  totalClassesConducted: number;
  atRiskStudentsCount: number;
  departmentRankings: {
    dept: string;
    attendance: number;
    passRate: number;
  }[];
  attendanceDistribution: {
    range: string;
    count: number;
    color: string;
  }[];
  subjectPassRates: {
    subject: string;
    code: string;
    passRate: number;
    averageScore: number;
  }[];
}
