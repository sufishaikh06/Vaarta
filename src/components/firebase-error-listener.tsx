
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/lib/error-emitter';
import { FirestorePermissionError } from '@/lib/errors';
import { useToast } from '@/hooks/use-toast';

// This component listens for globally emitted permission errors and displays them.
// In a dev environment, this could throw the error to be caught by Next.js's overlay.
export function FirebaseErrorListener() {
    const { toast } = useToast();

    useEffect(() => {
        const handleError = (error: FirestorePermissionError) => {
            console.error("A Firestore permission error was caught by the global listener:", error);

            // In a real development environment, we would throw this error
            // to leverage the Next.js error overlay for a better debugging experience.
            if (process.env.NODE_ENV === 'development') {
                 // Throwing the error will display it in the Next.js error overlay
                throw error;
            } else {
                // In production, we might show a generic toast notification.
                toast({
                    variant: 'destructive',
                    title: 'Permission Denied',
                    description: 'You do not have permission to perform this action.',
                });
            }
        };

        errorEmitter.on('permission-error', handleError);

        return () => {
            errorEmitter.off('permission-error', handleError);
        };
    }, [toast]);

    return null; // This component does not render anything.
}
