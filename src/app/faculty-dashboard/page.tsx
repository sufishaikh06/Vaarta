
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, Send } from "lucide-react";

const noticeSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  content: z.string().min(20, "Notice content must be at least 20 characters."),
  targetGroup: z.string().min(1, "Please select a target group."),
});

type NoticeFormValues = z.infer<typeof noticeSchema>;

const notesSchema = z.object({
  subject: z.string().min(1, "Please select a subject."),
  title: z.string().min(5, "Title is required."),
  file: z.any().refine(files => files?.length === 1, "File is required."),
});

type NotesFormValues = z.infer<typeof notesSchema>;

export default function FacultyDashboardPage() {
    const { toast } = useToast();
    
    const noticeForm = useForm<NoticeFormValues>({ resolver: zodResolver(noticeSchema) });
    const notesForm = useForm<NotesFormValues>({ resolver: zodResolver(notesSchema) });

    const onNoticeSubmit = (data: NoticeFormValues) => {
        toast({
            title: "Notice Sent!",
            description: `Notice "${data.title}" has been sent to ${data.targetGroup}.`,
        });
        noticeForm.reset({title: '', content: '', targetGroup: ''});
    };

    const onNotesSubmit = (data: NotesFormValues) => {
         toast({
            title: "Notes Uploaded!",
            description: `File for "${data.title}" has been uploaded successfully.`,
        });
        notesForm.reset({subject: '', title: '', file: undefined});
    };

    return (
         <div className="container py-12 px-4 md:px-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Welcome, Faculty Member</h1>
                <p className="text-muted-foreground">Manage your academic tasks efficiently.</p>
            </div>

            <Tabs defaultValue="notices" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="notices">Send Notices</TabsTrigger>
                    <TabsTrigger value="notes">Upload Notes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="notices">
                    <Card>
                        <CardHeader>
                            <CardTitle>Post a New Notice</CardTitle>
                            <CardDescription>Broadcast announcements to students and faculty.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Form {...noticeForm}>
                                <form onSubmit={noticeForm.handleSubmit(onNoticeSubmit)} className="space-y-4">
                                     <FormField control={noticeForm.control} name="title" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Notice Title</FormLabel>
                                            <FormControl><Input placeholder="e.g., Exam Schedule Change" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                     <FormField control={noticeForm.control} name="targetGroup" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Target Group</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select who will see this notice" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="All Students">All Students</SelectItem>
                                                    <SelectItem value="All Faculty">All Faculty</SelectItem>
                                                    <SelectItem value="CS-Year 1">Computer Science - Year 1</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                     )} />
                                     <FormField control={noticeForm.control} name="content" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Notice Content</FormLabel>
                                            <FormControl><Textarea placeholder="Enter the full details of the notice..." {...field} rows={5} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <Button type="submit" className="w-full">
                                        <Send className="mr-2 h-4 w-4"/>
                                        Send Notice
                                    </Button>
                                </form>
                           </Form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notes">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload Study Material</CardTitle>
                            <CardDescription>Share notes, presentations, and documents with your students.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...notesForm}>
                                <form onSubmit={notesForm.handleSubmit(onNotesSubmit)} className="space-y-4">
                                    <FormField control={notesForm.control} name="subject" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subject</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Data Structures">Data Structures</SelectItem>
                                                    <SelectItem value="Algorithms">Algorithms</SelectItem>
                                                    <SelectItem value="Database Systems">Database Systems</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={notesForm.control} name="title" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Document Title</FormLabel>
                                            <FormControl><Input placeholder="e.g., Lecture 1: Introduction" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                     <FormField control={notesForm.control} name="file" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>File</FormLabel>
                                            <FormControl><Input type="file" onChange={(e) => field.onChange(e.target.files)} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <Button type="submit" className="w-full">
                                        <Upload className="mr-2 h-4 w-4"/>
                                        Upload Notes
                                    </Button>
                                </form>
                           </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
         </div>
    );
}
