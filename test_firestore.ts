import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const app = initializeApp({});
const db = getFirestore(app, "my-db");
