
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
import { Upload, Send, Loader2, Wand2, ThumbsDown, ThumbsUp } from "lucide-react";
import { validateNotice } from "@/ai/flows/notice-validator";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


const noticeSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  content: z.string().min(20, "Notice content must be at least 20 characters."),
  targetGroup: z.string().min(1, "Please select a target group."),
});

type NoticeFormValues = z.infer<typeof noticeSchema>;

const notesSchema = z.object({
  subject: z.string().min(1, "Please select a subject."),
  title: z.string().min(5, "Title is required."),
  file: z.instanceof(FileList).refine(files => files?.length === 1, "File is required."),
});

type NotesFormValues = z.infer<typeof notesSchema>;

type ValidationState = {
    status: 'idle' | 'loading' | 'valid' | 'invalid';
    reason?: string;
    suggestion?: string;
}

export default function FacultyDashboardPage() {
    const { toast } = useToast();
    const [isSubmittingNotice, setIsSubmittingNotice] = useState(false);
    const [isSubmittingNotes, setIsSubmittingNotes] = useState(false);
    const [validation, setValidation] = useState<ValidationState>({ status: 'idle' });
    
    const noticeForm = useForm<NoticeFormValues>({ resolver: zodResolver(noticeSchema), mode: "onChange" });
    const notesForm = useForm<NotesFormValues>({ resolver: zodResolver(notesSchema) });

    const handleValidate = async () => {
        const noticeText = `Title: ${noticeForm.getValues("title")}\nContent: ${noticeForm.getValues("content")}`;
        setValidation({ status: 'loading' });
        try {
            const result = await validateNotice({ noticeText });
            if (result.isValid) {
                setValidation({ status: 'valid', suggestion: result.suggestedRevision });
                if(result.suggestedRevision) {
                    const suggestedContent = result.suggestedRevision.substring(result.suggestedRevision.indexOf("Content: ") + 9);
                    noticeForm.setValue('content', suggestedContent);
                }
            } else {
                setValidation({ status: 'invalid', reason: result.reason });
            }
        } catch (error) {
            console.error("Validation failed:", error);
            setValidation({ status: 'invalid', reason: 'AI validation failed. Please try again.' });
        }
    };


    const onNoticeSubmit = async (data: NoticeFormValues) => {
        setIsSubmittingNotice(true);
        try {
            await addDoc(collection(db, "notices"), {
                title: data.title,
                message: data.content,
                target_group: data.targetGroup,
                type: "announcement",
                created_by: "user_faculty_1", // Hardcoded for prototype
                createdAt: serverTimestamp(),
            });
            toast({
                title: "Notice Posted!",
                description: `Notice "${data.title}" has been successfully posted.`,
            });
            noticeForm.reset({title: '', content: '', targetGroup: ''});
            setValidation({ status: 'idle' });
        } catch (error) {
            console.error("Error posting notice: ", error);
            toast({ title: "Error", description: "Could not post notice.", variant: "destructive" });
        } finally {
            setIsSubmittingNotice(false);
        }
    };

    const onNotesSubmit = async (data: NotesFormValues) => {
        setIsSubmittingNotes(true);
        const file = data.file[0];
        if (!file) return;

        const storageRef = ref(storage, `documents/${Date.now()}_${file.name}`);

        try {
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            await addDoc(collection(db, "documents"), {
                title: data.title,
                subject: data.subject,
                file_url: downloadURL,
                uploaded_by: "user_faculty_1", // Hardcoded for prototype
                createdAt: serverTimestamp(),
            });

            toast({
                title: "Notes Uploaded!",
                description: `File "${data.title}" has been uploaded successfully.`,
            });
            notesForm.reset({subject: '', title: '', file: undefined});
        } catch (error) {
            console.error("Error uploading file: ", error);
            toast({ title: "Upload Failed", description: "Could not upload the file.", variant: "destructive" });
        } finally {
            setIsSubmittingNotes(false);
        }
    };

    return (
         <div className="container py-12 px-4 md:px-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Welcome, Faculty Member</h1>
                <p className="text-muted-foreground">Manage your academic tasks efficiently.</p>
            </div>

            <Tabs defaultValue="notices" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="notices">Post Notices</TabsTrigger>
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
                                                    <SelectItem value="all_students">All Students</SelectItem>
                                                    <SelectItem value="all_faculty">All Faculty</SelectItem>
                                                    <SelectItem value="CS-A">Computer Science - A</SelectItem>
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

                                    <div className="space-y-4 pt-2">
                                        <Button type="button" variant="outline" className="w-full" onClick={handleValidate} disabled={validation.status === 'loading' || !noticeForm.formState.isValid}>
                                            {validation.status === 'loading' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                                            Validate with AI
                                        </Button>
                                        
                                        {validation.status === 'valid' && (
                                            <Alert variant="default" className="border-green-500 bg-green-50 text-green-800">
                                                <ThumbsUp className="h-4 w-4 !text-green-600" />
                                                <AlertTitle>Notice Looks Good!</AlertTitle>
                                                <AlertDescription>
                                                    {validation.suggestion ? <><strong>Suggestion applied:</strong> {validation.suggestion}</> : "This notice is clear and appropriate."}
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        {validation.status === 'invalid' && (
                                            <Alert variant="destructive">
                                                <ThumbsDown className="h-4 w-4" />
                                                <AlertTitle>Needs Improvement</AlertTitle>
                                                <AlertDescription>
                                                    {validation.reason || "This notice may not be clear or appropriate."}
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    </div>


                                    <Button type="submit" className="w-full" disabled={isSubmittingNotice || validation.status !== 'valid'}>
                                        {isSubmittingNotice && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        <Send className="mr-2 h-4 w-4"/>
                                        Post Notice
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
                                                    <SelectItem value="Operating Systems">Operating Systems</SelectItem>
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
                                     <FormField control={notesForm.control} name="file" render={({ field: { onChange, ...field } }) => (
                                        <FormItem>
                                            <FormLabel>File</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="file" 
                                                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                                                    onChange={(e) => onChange(e.target.files)} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <Button type="submit" className="w-full" disabled={isSubmittingNotes || !notesForm.formState.isValid}>
                                        {isSubmittingNotes && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
