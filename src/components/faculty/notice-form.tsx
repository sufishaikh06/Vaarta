'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { validateFacultyNotice } from "@/ai/flows/faculty-notice-validation";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters.").max(100),
  content: z.string().min(20, "Notice content must be at least 20 characters.").max(500),
});

type NoticeFormValues = z.infer<typeof formSchema>;

interface NoticeFormProps {
    onSubmit: (data: NoticeFormValues) => void;
}

type ValidationState = {
    status: 'idle' | 'loading' | 'valid' | 'invalid';
    reason?: string;
}

export function NoticeForm({ onSubmit }: NoticeFormProps) {
  const [validation, setValidation] = useState<ValidationState>({ status: 'idle' });

  const form = useForm<NoticeFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const handleValidate = async () => {
    const noticeText = `Title: ${form.getValues("title")}\nContent: ${form.getValues("content")}`;
    if(noticeText.length < 30) {
        setValidation({ status: 'invalid', reason: 'Please provide more details in the notice.'});
        return;
    }
    
    setValidation({ status: 'loading' });
    try {
        const result = await validateFacultyNotice({ noticeText });
        if (result.isValid) {
            setValidation({ status: 'valid' });
        } else {
            setValidation({ status: 'invalid', reason: result.reason });
        }
    } catch (error) {
        console.error("Validation failed:", error);
        setValidation({ status: 'invalid', reason: 'AI validation failed. Please try again.' });
    }
  }

  const noticeContent = form.watch('content');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notice Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Exam Schedule Change" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notice Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter the full details of the notice here..." {...field} rows={6} />
              </FormControl>
               <FormDescription>
                {noticeContent?.length || 0}/500 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
             <Button type="button" variant="outline" className="w-full" onClick={handleValidate} disabled={validation.status === 'loading' || !form.formState.isValid}>
                {validation.status === 'loading' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                Analyze Notice with AI
            </Button>
            
            {validation.status === 'valid' && (
                <Alert variant="default" className="border-green-500 bg-green-50 text-green-800">
                    <ThumbsUp className="h-4 w-4 !text-green-600" />
                    <AlertTitle>Notice Looks Good!</AlertTitle>
                    <AlertDescription>
                        This notice is clear and appropriate for broadcast.
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
        
        <Button type="submit" className="w-full" disabled={validation.status !== 'valid'}>
            Post Notice
        </Button>
      </form>
    </Form>
  );
}
