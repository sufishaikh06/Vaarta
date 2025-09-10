
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface AttendanceRecord {
  subject: string;
  status: 'present' | 'absent';
  date: string;
}

export async function getAttendanceForStudent(studentId: string): Promise<AttendanceRecord[]> {
  const attendanceQuery = query(
    collection(db, 'attendance'),
    where('student_id', '==', studentId)
  );
  const attendanceSnap = await getDocs(attendanceQuery);
  if (attendanceSnap.empty) {
    return [];
  }
  return attendanceSnap.docs.map(doc => doc.data() as AttendanceRecord);
}
