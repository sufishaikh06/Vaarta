
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'vaartabot-d2iav',
  appId: '1:907576861315:web:9d34a5a63c39f2e97bb1b6',
  storageBucket: 'vaartabot-d2iav.firebasestorage.app',
  apiKey: 'AIzaSyCQYetVzK5qnjUwRLWWHp-RuCxex05ftOk',
  authDomain: 'vaartabot-d2iav.firebaseapp.com',
  messagingSenderId: '907576861315',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
