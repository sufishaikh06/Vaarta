
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'firestore.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    const batch = writeBatch(db);

    for (const collectionName in data) {
      const collectionData = data[collectionName];
      for (const docId in collectionData) {
        const docData = collectionData[docId];
        const docRef = doc(db, collectionName, docId);
        batch.set(docRef, docData);
      }
    }

    await batch.commit();

    return NextResponse.json({ message: 'Database seeded successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Error seeding database:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to seed database', details: errorMessage }, { status: 500 });
  }
}
