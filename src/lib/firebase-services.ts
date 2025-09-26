
import { collection, query, where, getDocs, doc, getDoc, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export interface AttendanceRecord {
  subject: string;
  status: 'present' | 'absent';
  date: string;
}

export async function getAttendanceForStudent(studentId: string): Promise<AttendanceRecord[]> {
  if (!studentId) {
    return [];
  }
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

export async function getFacultyInfoForUser(facultyId: string): Promise<string> {
    if (!facultyId) return "I can't retrieve information without a faculty ID.";
    
    // 1. Get faculty name
    const facultyRef = doc(db, "users", facultyId);
    const facultySnap = await getDoc(facultyRef);
    const facultyName = facultySnap.exists() ? facultySnap.data().name : "this faculty member";

    // 2. Find which subjects they teach from the timetable
    const timetableQuery = query(collection(db, "timetable"), where("teacher", "==", facultyName));
    const timetableSnap = await getDocs(timetableQuery);
    
    if (timetableSnap.empty) {
        return `I couldn't find any subjects assigned to ${facultyName} in the timetable.`;
    }

    const subjects = timetableSnap.docs.map(doc => doc.data().subject);
    // Remove duplicates
    const uniqueSubjects = [...new Set(subjects)];

    return `According to the timetable, ${facultyName} teaches the following subject(s): ${uniqueSubjects.join(', ')}.`;
}


export async function getAcademicCalendarEvents(eventType?: string): Promise<any[]> {
    let eventsQuery;

    if (eventType) {
        // This query requires a composite index on `type` and `start_date`.
        // If filtering by type, we can't reliably order by another field without a composite index.
        // We will remove the orderBy to avoid the error and sort the results in code.
        eventsQuery = query(collection(db, 'academic_calendar'), where('type', '==', eventType));
    } else {
        // This query works with a single-field index on start_date.
        eventsQuery = query(collection(db, 'academic_calendar'), orderBy('start_date', 'asc'));
    }

    const eventsSnap = await getDocs(eventsQuery);

    if (eventsSnap.empty) {
        return [];
    }

    const events = eventsSnap.docs.map(doc => doc.data());
    
    // Sort events in code since we can't rely on Firestore ordering with the filtered query
    events.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

    // Return the raw data. The AI will format it.
    return events;
}
