
'use server';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface ApplicationData {
    student_id: string;
    type: string;
    content: string;
    status: 'pending' | 'approved' | 'rejected';
    faculty_id: string;
}

export async function saveApplication(applicationData: ApplicationData) {
    try {
        const docRef = await addDoc(collection(db, "applications"), {
            ...applicationData,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding document to 'applications' collection: ", error);
        throw new Error("Failed to save application to the database.");
    }
}
