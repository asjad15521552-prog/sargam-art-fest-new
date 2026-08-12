import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAlvTpVK-Sg7Eohv7Dv73El9P8XIy3FSdQ",
  authDomain: "keen-synapse-3n50x.firebaseapp.com",
  projectId: "keen-synapse-3n50x",
  storageBucket: "keen-synapse-3n50x.firebasestorage.app",
  messagingSenderId: "265439462457",
  appId: "1:265439462457:web:0117a95ddefbf5fb9939e8"
};

const app = initializeApp(firebaseConfig);

const databaseId = "ai-studio-sargamartfest-e3fecfd8-dd36-446f-a94f-600ac8be23d4";

let db;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
  }, databaseId);
} catch (e) {
  db = getFirestore(app, databaseId);
}

export { app, db };
