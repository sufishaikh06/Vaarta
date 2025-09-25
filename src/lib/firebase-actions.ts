
'use server';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { errorEmitter } from '@/lib/error-emitter';
import { FirestorePermissionError } from '@/lib/errors';


export interface ApplicationData {
    student_id: string;
    type: string;
    content: string;
    status: 'pending' | 'approved' | 'rejected';
    faculty_id: string; // Keep for potential linking, but email is now primary
    faculty_name: string;
    faculty_email: string;
}

export async function saveApplicationClient(applicationData: ApplicationData) {
    const applicationsRef = collection(db, 'applications');
    const dataToSave = {
        ...applicationData,
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

            // Throw a new error to be caught by the calling function.
            throw new Error("Failed to save application to the database.");
        });
}
