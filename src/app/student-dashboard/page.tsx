
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyNotes, dummyStudentData, dummyTimetable } from "@/lib/dummy-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function StudentDashboardPage() {
    const student = dummyStudentData["STU12345"];

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
                                        <TableHead>Day</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Teacher</TableHead>
                                        <TableHead>Room</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dummyTimetable.map(slot => (
                                        <TableRow key={`${slot.day}-${slot.time}`}>
                                            <TableCell className="font-medium">{slot.day}</TableCell>
                                            <TableCell>{slot.time}</TableCell>
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
                            {student.attendance.map(att => {
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
                                    {dummyNotes.map(note => (
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
