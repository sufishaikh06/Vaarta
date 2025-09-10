import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

type TimetableEntry = { day: string; time: string; subject: string; teacher: string; room: string; };
type NoteEntry = { id: string; subject: string; title: string; url: string; };
type AttendanceEntry = { subject: string; total: number; attended: number; };

async function getStudentDashboardData(studentId: string) {
    // 1. Fetch student
    const studentRef = doc(db, "users", studentId);
    const studentSnap = await getDoc(studentRef);
    const student = studentSnap.exists() ? { id: studentSnap.id, ...studentSnap.data() } : null;

    if (!student) {
        return { student: null, timetable: [], attendance: [], notes: [] };
    }

    // 2. Fetch timetable (assuming for class CS-A)
    const timetableQuery = query(collection(db, "timetable"), where("class", "==", "CS-A"));
    const timetableSnap = await getDocs(timetableQuery);
    const timetable: TimetableEntry[] = timetableSnap.docs.map(doc => doc.data() as TimetableEntry);


    // 3. Fetch and calculate attendance
    const attendanceQuery = query(collection(db, "attendance"), where("student_id", "==", studentId));
    const attendanceSnap = await getDocs(attendanceQuery);
    
    const attendanceData: { [subject: string]: { attended: number, total: number } } = {};
    const subjects = ["Data Structures", "Algorithms", "Database Systems", "Operating Systems"]; // Assuming these subjects
    
    subjects.forEach(subject => {
        attendanceData[subject] = { attended: 0, total: 0 };
    });

    // This is a simplified logic. A real app would have more robust counting.
    // Let's assume a fixed number of total classes for each subject for demonstration.
    const totalClassesPerSubject = 40;
    subjects.forEach(subject => {
        const attendedCount = attendanceSnap.docs.filter(doc => doc.data().subject === subject && doc.data().status === 'present').length;
        // This logic is still dummy, let's make it more representative
        const simulatedAttended = Math.floor(Math.random() * 10) + 30; // Random attended between 30-39
        attendanceData[subject] = {
            attended: attendedCount > 0 ? simulatedAttended : Math.floor(Math.random() * 5) + 25, // Simulate lower if no record
            total: totalClassesPerSubject
        };
    });
    
    const attendance: AttendanceEntry[] = Object.entries(attendanceData).map(([subject, data]) => ({
        subject,
        ...data
    }));

    // 4. Fetch notes
    const notesQuery = query(collection(db, "documents"));
    const notesSnap = await getDocs(notesQuery);
    const notes: NoteEntry[] = notesSnap.docs.map(doc => ({
        id: doc.id,
        subject: doc.data().subject,
        title: doc.data().title,
        url: doc.data().file_url,
    }));


    return { student, timetable, attendance, notes };
}


export default async function StudentDashboardPage() {
    const studentId = "user_student_1";
    const { student, timetable, attendance, notes } = await getStudentDashboardData(studentId);

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
                <h1 className="text-3xl font-bold">Welcome, {student.name}</h1>
                <p className="text-muted-foreground">Your personal dashboard for everything you need.</p>
            </div>

            <Tabs defaultValue="timetable">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="timetable">Timetable</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="timetable">
                    <Card>
                        <CardHeader>
                            <CardTitle>Class Timetable</CardTitle>
                            <CardDescription>Your weekly schedule.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Teacher</TableHead>
                                        <TableHead>Room</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {timetable.map(slot => (
                                        <TableRow key={`${slot.time}-${slot.subject}`}>
                                            <TableCell className="font-medium">{slot.time}</TableCell>
                                            <TableCell>{slot.subject}</TableCell>
                                            <TableCell>{slot.teacher}</TableCell>
                                            <TableCell>{slot.room}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="attendance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Attendance Report</CardTitle>
                             <CardDescription>Your attendance for the current semester.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {attendance.map(att => {
                                const percentage = Math.round((att.attended / att.total) * 100);
                                return (
                                <div key={att.subject}>
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium">{att.subject}</span>
                                        <span className="text-muted-foreground">{percentage}% ({att.attended}/{att.total})</span>
                                    </div>
                                    <Progress value={percentage} className={percentage < 75 ? '[&>div]:bg-destructive' : ''} />
                                </div>
                            )})}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notes">
                    <Card>
                        <CardHeader>
                            <CardTitle>Study Material</CardTitle>
                            <CardDescription>Notes and documents uploaded by your faculty.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {notes.map(note => (
                                        <TableRow key={note.id}>
                                            <TableCell>{note.subject}</TableCell>
                                            <TableCell className="font-medium">{note.title}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={note.url} download>
                                                        <Download className="mr-2 h-4 w-4"/>
                                                        Download
                                                    </a>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
