import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { createContext, useContext } from 'react';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_FIREBASE_APPID,
};

const firebaseContext = createContext();

export const FirebaseContext = ({children}) => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const db = getFirestore(app);
    const storage = getStorage(app);

    const value = {
        app,
        auth,
        db,
        storage
    };

    return (
        <firebaseContext.Provider value={value}>
            {children}
        </firebaseContext.Provider>
    )
};

export const useFirebaseContext = () => useContext(firebaseContext);
  