import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_DATABASE_URL,
  projectId: process.env.NEXT_PROJECT_ID,
  storageBucket: process.env.NEXT_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_MEASUREMENT_ID,
};

if (!firebase.apps.length) {  
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const provider = new firebase.auth.GithubAuthProvider();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
