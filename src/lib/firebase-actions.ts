
'use client';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { errorEmitter } from '@/lib/error-emitter';
import { FirestorePermissionError } from '@/lib/errors';


export interface ApplicationData {
    student_id: string;
    type: string;
    content: string;
    status: 'pending' | 'approved' | 'rejected';
    faculty_id: string; 
    faculty_name: string;
    faculty_email: string;
}

export async function saveApplicationClient(studentId: string, applicationData: Omit<ApplicationData, 'student_id'>) {
    if (!studentId) {
        throw new Error("User is not authenticated.");
    }
    
    const applicationsRef = collection(db, 'applications');
    const dataToSave: ApplicationData = {
        ...applicationData,
        student_id: studentId,
        createdAt: serverTimestamp(),
    };

    // No try/catch. Chain .catch() to handle the specific permission error.
    return addDoc(applicationsRef, dataToSave)
        .then(docRef => {
            return docRef.id;
        })
        .catch(async (serverError) => {
            // Create the rich, contextual error.
            const permissionError = new FirestorePermissionError({
                path: applicationsRef.path,
                operation: 'create',
                requestResourceData: dataToSave,
            });

            // Emit the error with the global error emitter.
            errorEmitter.emit('permission-error', permissionError);

            // Re-throw the original, detailed error to be caught by the global listener.
            throw permissionError;
        });
}
