import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Department,
  SubjectCourse,
  AcademicGradeRecord,
  CampusEvent,
  CourseMaterial,
  ChatChannel,
  ChatMessage,
  NotificationItem,
  MonthlyAnalyticsSummary,
  AttendanceStatus,
  StudentFeeRecord,
  FeeBreakdownItem,
  GeofenceZone,
  GeofencedAttendanceVerification,
} from '../types/erp';
import {
  DEPARTMENTS_DATA,
  COURSES_DATA,
  INITIAL_GRADES_DATA,
  INITIAL_MATERIALS,
  INITIAL_EVENTS,
  INITIAL_CHANNELS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  MONTHLY_ANALYTICS_DATA,
  CLASS_STUDENTS_ROSTER,
  StudentRosterItem,
  INITIAL_FEE_RECORDS,
  DEFAULT_FEE_STRUCTURE,
  DEFAULT_GEOFENCE_ZONES,
} from '../data/mockData';

interface ERPDataContextType {
  departments: Department[];
  courses: SubjectCourse[];
  grades: AcademicGradeRecord[];
  materials: CourseMaterial[];
  events: CampusEvent[];
  channels: ChatChannel[];
  messages: Record<string, ChatMessage[]>;
  notifications: NotificationItem[];
  analytics: MonthlyAnalyticsSummary;
  studentsRoster: StudentRosterItem[];
  feeRecords: StudentFeeRecord[];
  defaultFeeStructure: FeeBreakdownItem[];
  geofenceZones: GeofenceZone[];
  geofencedLogs: GeofencedAttendanceVerification[];
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
  // Actions
  markAttendance: (
    courseCode: string,
    studentAttendance: Record<string, AttendanceStatus>,
    topic: string
  ) => void;
  updateGrade: (record: AcademicGradeRecord) => void;
  addGradeRecord: (newRecord: Omit<AcademicGradeRecord, 'id'>) => void;
  toggleMaterialOfflineCache: (materialId: string) => void;
  addCourseMaterial: (newMat: Omit<CourseMaterial, 'id' | 'isCachedOffline'>) => void;
  toggleEventRSVP: (eventId: string) => void;
  createEvent: (newEvent: Omit<CampusEvent, 'id' | 'registeredCount' | 'isRegistered'>) => void;
  sendMessage: (
    channelId: string,
    content: string,
    sender: { id: string; name: string; role: any; avatar: string },
    attachment?: { name: string; type: string; size: string; url: string }
  ) => void;
  markNotificationAsRead: (id: string) => void;
  markNotificationAsUnread: (id: string) => void;
  toggleNotificationRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'read' | 'timestamp'>) => void;
  markGeofencedAttendance: (
    verification: Omit<GeofencedAttendanceVerification, 'id' | 'timestamp'>
  ) => { success: boolean; message: string; record?: GeofencedAttendanceVerification };
  payCollegeFee: (
    feeRecordId: string,
    paymentMethod: 'UPI' | 'Net Banking' | 'Debit Card' | 'Credit Card' | 'NEFT/RTGS',
    selectedItems?: FeeBreakdownItem[],
    concessionDiscount?: number
  ) => StudentFeeRecord;
  verifyFeeReceipt: (receiptNumber: string) => boolean;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

const ERPDataContext = createContext<ERPDataContextType | undefined>(undefined);

export const ERPDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [departments] = useState<Department[]>(DEPARTMENTS_DATA);
  const [courses] = useState<SubjectCourse[]>(COURSES_DATA);
  const [grades, setGrades] = useState<AcademicGradeRecord[]>(INITIAL_GRADES_DATA);
  const [materials, setMaterials] = useState<CourseMaterial[]>(() => {
    const saved = localStorage.getItem('nexus_materials');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });
  const [events, setEvents] = useState<CampusEvent[]>(INITIAL_EVENTS);
  const [channels, setChannels] = useState<ChatChannel[]>(INITIAL_CHANNELS);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [analytics, setAnalytics] = useState<MonthlyAnalyticsSummary>(MONTHLY_ANALYTICS_DATA);
  const [studentsRoster, setStudentsRoster] = useState<StudentRosterItem[]>(CLASS_STUDENTS_ROSTER);
  const [feeRecords, setFeeRecords] = useState<StudentFeeRecord[]>(() => {
    const saved = localStorage.getItem('nexus_fee_records');
    return saved ? JSON.parse(saved) : INITIAL_FEE_RECORDS;
  });
  const [defaultFeeStructure] = useState<FeeBreakdownItem[]>(DEFAULT_FEE_STRUCTURE);
  const [geofenceZones] = useState<GeofenceZone[]>(DEFAULT_GEOFENCE_ZONES);
  const [geofencedLogs, setGeofencedLogs] = useState<GeofencedAttendanceVerification[]>(() => {
    const saved = localStorage.getItem('nexus_geofenced_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'geo-log-1',
        studentId: 'usr-stu-1',
        studentName: 'Rahul Sharma',
        courseCode: 'CS301',
        courseName: 'Design & Analysis of Algorithms',
        zoneName: 'Turing Lecture Hall 302',
        room: 'Room 302, Academic Block A',
        timestamp: 'Today, 08:58 AM',
        userLatitude: 12.971599,
        userLongitude: 77.594563,
        targetLatitude: 12.971598,
        targetLongitude: 77.594562,
        distanceMeters: 1.8,
        accuracyMeters: 2.1,
        verifiedWithin5m: true,
        deviceFingerprint: 'SM-G998B • Android 15 (Encrypted Keystore)',
        status: 'marked_present',
      },
      {
        id: 'geo-log-2',
        studentId: 'usr-stu-2',
        studentName: 'Ananya Iyer',
        courseCode: 'CS301',
        courseName: 'Design & Analysis of Algorithms',
        zoneName: 'Turing Lecture Hall 302',
        room: 'Room 302, Academic Block A',
        timestamp: 'Today, 08:59 AM',
        userLatitude: 12.971601,
        userLongitude: 77.594560,
        targetLatitude: 12.971598,
        targetLongitude: 77.594562,
        distanceMeters: 2.4,
        accuracyMeters: 1.9,
        verifiedWithin5m: true,
        deviceFingerprint: 'Pixel 9 Pro • Android 15 (Encrypted Keystore)',
        status: 'marked_present',
      },
    ];
  });
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save geofenced logs
  useEffect(() => {
    localStorage.setItem('nexus_geofenced_logs', JSON.stringify(geofencedLogs));
  }, [geofencedLogs]);

  // Save fee records
  useEffect(() => {
    localStorage.setItem('nexus_fee_records', JSON.stringify(feeRecords));
  }, [feeRecords]);

  // Save materials offline cache state
  useEffect(() => {
    localStorage.setItem('nexus_materials', JSON.stringify(materials));
  }, [materials]);

  const toggleOfflineMode = () => {
    setIsOfflineMode((prev) => {
      const next = !prev;
      setToastMessage(
        next
          ? '📶 Offline Mode Activated: Serving essential materials from local encrypted cache'
          : '🌐 Connected to Campus ERP Server: Real-time synchronization active'
      );
      return next;
    });
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'read' | 'timestamp'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: 'notif-' + Date.now(),
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setToastMessage(`🔔 ${notif.title}: ${notif.message.substring(0, 60)}...`);
  };

  const markAttendance = (
    courseCode: string,
    attendanceMap: Record<string, AttendanceStatus>,
    topic: string
  ) => {
    // Update students roster percentages in real time
    setStudentsRoster((prev) =>
      prev.map((student) => {
        const status = attendanceMap[student.id] || 'present';
        let delta = 0;
        if (status === 'present' || status === 'od') {
          delta = 0.5; // slight boost
        } else if (status === 'absent') {
          delta = -1.2; // slight drop
        }
        const newPercent = Math.min(100, Math.max(40, Number((student.attendancePercent + delta).toFixed(1))));
        return {
          ...student,
          attendancePercent: newPercent,
          status: newPercent >= 75 ? 'safe' : newPercent >= 65 ? 'warning' : 'critical',
        };
      })
    );

    // Notify students
    addNotification({
      title: `Real-time Attendance Logged: ${courseCode}`,
      message: `Topic: "${topic || 'Lecture & Lab Demonstration'}". Attendance records updated immediately across the portal.`,
      type: 'attendance',
      linkTab: 'attendance',
    });

    // Also update monthly analytics slightly
    setAnalytics((prev) => ({
      ...prev,
      totalClassesConducted: prev.totalClassesConducted + 1,
    }));
  };

  const updateGrade = (updated: AcademicGradeRecord) => {
    setGrades((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
    addNotification({
      title: `Grade Updated: ${updated.courseCode}`,
      message: `Score updated: IA1=${updated.internal1}, IA2=${updated.internal2}. New grade: ${updated.gradeLetter}`,
      type: 'academic',
      linkTab: 'grades',
    });
  };

  const addGradeRecord = (newRecord: Omit<AcademicGradeRecord, 'id'>) => {
    const record: AcademicGradeRecord = {
      ...newRecord,
      id: 'grd-' + Date.now(),
    };
    setGrades((prev) => [...prev, record]);
  };

  const toggleMaterialOfflineCache = (materialId: string) => {
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id === materialId) {
          const nextState = !m.isCachedOffline;
          setToastMessage(
            nextState
              ? `💾 Downloaded "${m.title}" for offline campus access!`
              : `🗑️ Removed "${m.title}" from local offline cache`
          );
          return { ...m, isCachedOffline: nextState };
        }
        return m;
      })
    );
  };

  const addCourseMaterial = (newMat: Omit<CourseMaterial, 'id' | 'isCachedOffline'>) => {
    const created: CourseMaterial = {
      ...newMat,
      id: 'mat-' + Date.now(),
      isCachedOffline: true, // auto cached on upload
    };
    setMaterials((prev) => [created, ...prev]);
    addNotification({
      title: `New Material Uploaded: ${newMat.courseCode}`,
      message: `${newMat.title} has been published by faculty and is available for offline download.`,
      type: 'academic',
      linkTab: 'materials',
    });
  };

  const toggleEventRSVP = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const isReg = !ev.isRegistered;
          setToastMessage(
            isReg ? `🎉 Successfully registered for ${ev.title}!` : `Cancelled RSVP for ${ev.title}`
          );
          return {
            ...ev,
            isRegistered: isReg,
            registeredCount: isReg ? ev.registeredCount + 1 : ev.registeredCount - 1,
          };
        }
        return ev;
      })
    );
  };

  const createEvent = (newEvent: Omit<CampusEvent, 'id' | 'registeredCount' | 'isRegistered'>) => {
    const created: CampusEvent = {
      ...newEvent,
      id: 'evt-' + Date.now(),
      registeredCount: 1,
      isRegistered: true,
    };
    setEvents((prev) => [created, ...prev]);
    addNotification({
      title: `New Campus Event: ${created.title}`,
      message: `Date: ${created.date} at ${created.venue}. RSVP open for all engineering students.`,
      type: 'event',
      linkTab: 'events',
    });
  };

  const sendMessage = (
    channelId: string,
    content: string,
    sender: { id: string; name: string; role: any; avatar: string },
    attachment?: { name: string; type: string; size: string; url: string }
  ) => {
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      channelId,
      senderId: sender.id,
      senderName: sender.name,
      senderRole: sender.role,
      senderAvatar: sender.avatar,
      content,
      timestamp: 'Just now',
      attachment,
    };

    setMessages((prev) => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), newMsg],
    }));

    // Update channel snippet
    setChannels((prev) =>
      prev.map((c) =>
        c.id === channelId
          ? {
              ...c,
              lastMessage: `${sender.name}: ${content || (attachment ? attachment.name : 'Shared file')}`,
              lastMessageTime: 'Just now',
            }
          : c
      )
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markNotificationAsUnread = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: false } : n))
    );
  };

  const toggleNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markGeofencedAttendance = (
    verificationData: Omit<GeofencedAttendanceVerification, 'id' | 'timestamp'>
  ): { success: boolean; message: string; record?: GeofencedAttendanceVerification } => {
    const isWithin5m = verificationData.distanceMeters <= 5.0;
    const now = new Date();
    const formattedTimestamp = `${now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    const newRecord: GeofencedAttendanceVerification = {
      ...verificationData,
      id: 'geo-verif-' + Date.now(),
      timestamp: formattedTimestamp,
      verifiedWithin5m: isWithin5m,
      status: isWithin5m ? 'marked_present' : 'rejected_out_of_bounds',
    };

    setGeofencedLogs((prev) => [newRecord, ...prev]);

    if (!isWithin5m) {
      return {
        success: false,
        message: `Geofence Lock Active: You are ${verificationData.distanceMeters.toFixed(1)}m away from ${verificationData.zoneName}. You must be within 5.0 meters to verify attendance.`,
        record: newRecord,
      };
    }

    // If within 5m: Mark student as present in roster and update attendance stats
    setStudentsRoster((prev) =>
      prev.map((stu) => {
        if (stu.id === verificationData.studentId) {
          const updatedPercent = Math.min(100, Number((stu.attendancePercent + 0.4).toFixed(1)));
          return {
            ...stu,
            attendancePercent: updatedPercent,
            status: updatedPercent >= 80 ? 'safe' : stu.status,
          };
        }
        return stu;
      })
    );

    // Also dispatch notification
    addNotification({
      title: `Geofenced Attendance Verified: ${verificationData.courseCode}`,
      message: `Checked in at ${verificationData.zoneName} (${verificationData.room}). Proximity: ${verificationData.distanceMeters.toFixed(1)}m within 5m zone. Status: PRESENT.`,
      type: 'attendance',
      priority: 'high',
      actionLabel: 'View Geofence Log',
      actionTab: 'attendance',
      details: `Cryptographic Token: #${newRecord.id.toUpperCase()} • Device: ${verificationData.deviceFingerprint}`,
    });

    setToastMessage(
      `📍 Geofence Verified! Present marked for ${verificationData.courseCode} (${verificationData.distanceMeters.toFixed(1)}m away).`
    );

    return {
      success: true,
      message: `Verified successfully within ${verificationData.distanceMeters.toFixed(1)}m! You are marked PRESENT for ${verificationData.courseCode}.`,
      record: newRecord,
    };
  };

  const payCollegeFee = (
    feeRecordId: string,
    paymentMethod: 'UPI' | 'Net Banking' | 'Debit Card' | 'Credit Card' | 'NEFT/RTGS',
    selectedItems?: FeeBreakdownItem[],
    concessionDiscount?: number
  ): StudentFeeRecord => {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })} ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    const randomReceiptNum = 'REC-NIT-2026-' + Math.floor(10000 + Math.random() * 90000);
    const methodClean = paymentMethod.replace(/\s+/g, '').replace('/', '');
    const randomTxnId = `TXN-${methodClean}-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    let updatedRecord: StudentFeeRecord | null = null;

    setFeeRecords((prev) => {
      const nextRecords = prev.map((rec) => {
        if (rec.id === feeRecordId) {
          const itemsToUse = selectedItems && selectedItems.length > 0 ? selectedItems : rec.items;
          const subtotal = itemsToUse.reduce(
            (acc, it) => acc + (it.selected !== false ? it.amount : 0),
            0
          );
          const discount =
            concessionDiscount !== undefined ? concessionDiscount : rec.scholarshipDeduction;
          const total = Math.max(0, subtotal - discount + rec.lateFee);

          const updated: StudentFeeRecord = {
            ...rec,
            items: itemsToUse,
            subtotal,
            scholarshipDeduction: discount,
            totalAmount: total,
            paidAmount: total,
            balanceDue: 0,
            status: 'paid',
            paymentDate: formattedDate,
            receiptNumber: rec.receiptNumber || randomReceiptNum,
            transactionId: randomTxnId,
            paymentMethod,
            reconciledByFinance: true,
            receiptVerified: true,
            notes: `Paid online via ${paymentMethod}. Institutional e-receipt verified.`,
          };
          updatedRecord = updated;
          return updated;
        }
        return rec;
      });
      return nextRecords;
    });

    const finalRec: StudentFeeRecord = updatedRecord || {
      id: feeRecordId,
      receiptNumber: randomReceiptNum,
      studentId: 'usr-stu-1',
      studentName: 'Rahul Sharma',
      rollNo: '2023CS0142',
      department: 'Computer Science & Engineering',
      departmentCode: 'CSE',
      semester: 5,
      academicYear: '2026 - 2027',
      items: selectedItems || defaultFeeStructure,
      subtotal: 81500,
      scholarshipDeduction: concessionDiscount || 8000,
      lateFee: 0,
      totalAmount: 73500,
      paidAmount: 73500,
      balanceDue: 0,
      status: 'paid',
      dueDate: '2026-10-31',
      paymentDate: formattedDate,
      transactionId: randomTxnId,
      paymentMethod,
      reconciledByFinance: true,
      receiptVerified: true,
    };

    // Trigger explicit alert for Finance Department & Campus Accounts
    addNotification({
      title: 'Finance Dept: College Fee Payment Received',
      message: `Payment of ₹${finalRec.totalAmount.toLocaleString()} verified from ${finalRec.studentName} (${finalRec.rollNo}) for Sem ${finalRec.semester}. Txn Ref: ${finalRec.transactionId}. Ledger credited & reconciled.`,
      type: 'finance',
      linkTab: 'finance-accounts',
    });

    setToastMessage(
      `💳 Fee Payment of ₹${finalRec.totalAmount.toLocaleString()} Successful! Receipt #${finalRec.receiptNumber} generated.`
    );

    return finalRec;
  };

  const verifyFeeReceipt = (receiptNumber: string): boolean => {
    return feeRecords.some((r) => r.receiptNumber === receiptNumber && r.status === 'paid');
  };

  return (
    <ERPDataContext.Provider
      value={{
        departments,
        courses,
        grades,
        materials,
        events,
        channels,
        messages,
        notifications,
        analytics,
        studentsRoster,
        feeRecords,
        defaultFeeStructure,
        geofenceZones,
        geofencedLogs,
        isOfflineMode,
        toggleOfflineMode,
        markAttendance,
        updateGrade,
        addGradeRecord,
        toggleMaterialOfflineCache,
        addCourseMaterial,
        toggleEventRSVP,
        createEvent,
        sendMessage,
        markNotificationAsRead,
        markNotificationAsUnread,
        toggleNotificationRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        deleteNotification,
        addNotification,
        markGeofencedAttendance,
        payCollegeFee,
        verifyFeeReceipt,
        toastMessage,
        setToastMessage,
      }}
    >
      {children}
    </ERPDataContext.Provider>
  );
};

export const useERPData = () => {
  const context = useContext(ERPDataContext);
  if (!context) {
    throw new Error('useERPData must be used within an ERPDataProvider');
  }
  return context;
};
