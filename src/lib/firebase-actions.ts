import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

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
