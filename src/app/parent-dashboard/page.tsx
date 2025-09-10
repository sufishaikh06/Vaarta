
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyStudentData } from "@/lib/dummy-data";
import { Progress } from "@/components/ui/progress";
import { Circle } from "lucide-react";

export default function ParentDashboardPage() {
    const student = dummyStudentData["STU12345"];

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

                <Card>
                    <CardHeader>
                        <CardTitle>Marks Report</CardTitle>
                        <CardDescription>Performance in recent examinations.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {student.marks.map(mark => (
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
