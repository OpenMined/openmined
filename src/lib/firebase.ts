import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  API_KEY: process.env.NEXT_PUBLIC_API_KEY,
  AUTH_DOMAIN: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  // Mark will complete
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
