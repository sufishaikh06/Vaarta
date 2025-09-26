
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


export async function getAcademicCalendarEvents(eventType?: string): Promise<string> {
    let eventsQuery = query(collection(db, 'academic_calendar'), orderBy('start_date', 'asc'));

    if (eventType) {
        eventsQuery = query(collection(db, 'academic_calendar'), where('type', '==', eventType), orderBy('start_date', 'asc'));
    }

    const eventsSnap = await getDocs(eventsQuery);

    if (eventsSnap.empty) {
        return `I could not find any ${eventType ? eventType + ' ' : ''}events in the academic calendar.`;
    }

    const events = eventsSnap.docs.map(doc => doc.data());
    
    const summary = events.map(event => {
        const startDate = new Date(event.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        const endDate = new Date(event.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        let dateInfo = `on **${startDate}**`;
        if (startDate !== endDate) {
            dateInfo = `from **${startDate}** to **${endDate}**`;
        }
        return `- **${event.event_name}**: Takes place ${dateInfo}. *(${event.details})*`;
    }).join('\n');
    
    const eventTypeName = eventType ? `upcoming ${eventType} ` : '';

    return `Here are the ${eventTypeName}events from the academic calendar:\n${summary}`;
}
