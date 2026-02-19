import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace these with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyDsV6wKT-O8cG0Lt86wlxT_RKZpLyiIDqc",

  authDomain: "cleantrack-4a970.firebaseapp.com",

  projectId: "cleantrack-4a970",

  storageBucket: "cleantrack-4a970.firebasestorage.app",

  messagingSenderId: "501850274877",

  appId: "1:501850274877:web:184fb9a6d2ddbcec813e54"

};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export default app;
