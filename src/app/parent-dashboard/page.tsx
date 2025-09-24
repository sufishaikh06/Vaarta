
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

// Function to fetch data from Firestore
async function getParentDashboardData(studentId: string) {
    // 1. Fetch student details
    const studentRef = doc(db, "users", studentId);
    const studentSnap = await getDoc(studentRef);
    const student = studentSnap.exists() ? { id: studentSnap.id, ...studentSnap.data() } : null;

    if (!student) {
        return { student: null, attendance: [], marks: [] };
    }

    // 2. Fetch attendance
    const attendanceQuery = query(collection(db, "attendance"), where("student_id", "==", studentId));
    const attendanceSnap = await getDocs(attendanceQuery);
    
    // Improved attendance calculation logic
    const attendanceBySubject: { [key: string]: { attended: number, total: number } } = {};
    const subjectsInTimetableQuery = query(collection(db, "timetable"));
    const timetableSnap = await getDocs(subjectsInTimetableQuery);
    
    // Let's assume total classes is a static 40 for this prototype
    const totalClasses = 40;
    const subjects = [...new Set(timetableSnap.docs.map(d => d.data().subject))];

    subjects.forEach(subject => {
        const attendedCount = attendanceSnap.docs.filter(d => d.data().subject === subject && d.data().status === 'present').length;
        attendanceBySubject[subject] = {
            attended: attendedCount,
            total: totalClasses
        };
    });

    const calculatedAttendance = Object.entries(attendanceBySubject).map(([subject, data]) => ({
        subject,
        ...data
    }));


    // 3. Fetch marks
    const marksQuery = query(collection(db, "marks"), where("student_id", "==", studentId));
    const marksSnap = await getDocs(marksQuery);
    const marks = marksSnap.docs.map(doc => ({
        exam: doc.data().exam,
        subject: doc.data().subject,
        score: doc.data().marks,
    }));

    return { student, attendance: calculatedAttendance, marks };
}


export default async function ParentDashboardPage() {
    // For this prototype, we'll hardcode the student ID. 
    // In a real app, this would come from the logged-in parent's data.
    const studentId = "user_student_1"; 
    const { student, attendance, marks } = await getParentDashboardData(studentId);

    if (!student) {
        return (
            <div className="container py-12 px-4 md:px-6">
                <h1 className="text-3xl font-bold text-destructive">Error</h1>
                <p className="text-muted-foreground">Could not find data for the specified student.</p>
            </div>
        );
    }


    return (
        <div className="container py-12 px-4 md:px-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Parent Dashboard</h1>
                <p className="text-muted-foreground">Viewing academic progress for <span className="font-semibold text-primary">{student.name}</span>.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Attendance Report</CardTitle>
                        <CardDescription>Subject-wise attendance for the current semester.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {attendance.map(att => {
                            const percentage = att.total > 0 ? Math.round((att.attended / att.total) * 100) : 0;
                            return (
                            <div key={att.subject}>
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium">{att.subject}</span>
                                    <span className="text-muted-foreground">{percentage}% ({att.attended}/{att.total})</span>
                                </div>
                                <Progress value={percentage} className={percentage < 75 ? '[&>div]:bg-destructive' : ''} />
                            </div>
                        )})}
                         {attendance.length === 0 && <p className="text-muted-foreground">No attendance records found.</p>}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Marks Report</CardTitle>
                        <CardDescription>Performance in recent examinations.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {marks.map(mark => (
                            <div key={`${mark.exam}-${mark.subject}`} className="flex items-center justify-between p-3 bg-secondary rounded-md">
                                <div>
                                    <p className="font-semibold">{mark.subject}</p>
                                    <p className="text-sm text-muted-foreground">{mark.exam}</p>
                                </div>
                                <div className={`font-bold text-xl ${mark.score > 75 ? 'text-primary' : 'text-destructive'}`}>
                                    {mark.score}%
                                </div>
                            </div>
                        ))}
                         {marks.length === 0 && <p className="text-muted-foreground">No marks records found.</p>}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
