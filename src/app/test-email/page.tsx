
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Loader2, MailCheck, AlertTriangle } from 'lucide-react';
import { app } from '@/lib/firebase';

export default function TestEmailPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSendTestEmail = async () => {
        setIsLoading(true);
        try {
            const functions = getFunctions(app);
            const sendTestEmail = httpsCallable(functions, 'sendTestEmail');
            const result = await sendTestEmail();
            
            const data = result.data as { success: boolean; message: string };

            if (data.success) {
                toast({
                    title: 'Test Successful!',
                    description: data.message,
                });
            } else {
                throw new Error(data.message);
            }

        } catch (error: any) {
            console.error(error);
            toast({
                title: 'Test Failed',
                description: error.message || 'An unknown error occurred.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container py-12 px-4 md:px-6 flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>SendGrid Email Test</CardTitle>
                    <CardDescription>
                        Click the button below to send a test email to{' '}
                        <span className="font-semibold text-primary">priya.mehta@example.com</span>.
                        This will verify that the SendGrid API key and Cloud Function are configured correctly.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleSendTestEmail} disabled={isLoading} className="w-full">
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <MailCheck className="mr-2" />
                        )}
                        Send Test Email
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
