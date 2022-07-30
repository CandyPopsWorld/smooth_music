import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { createContext, useContext } from 'react';

const firebaseConfig = {
    apiKey: "AIzaSyDOfvQV2zzDxNYSTqQEX9oxiVK8xIq839s",
    authDomain: "smooth-music-4a8a6.firebaseapp.com",
    projectId: "smooth-music-4a8a6",
    storageBucket: "smooth-music-4a8a6.appspot.com",
    messagingSenderId: "230900424564",
    appId: "1:230900424564:web:96c60c7e3f827c83839621"
};

const firebaseContext = createContext();

export const FirebaseContext = ({children}) => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const db = getFirestore(app);

    const value = {
        app,
        auth,
        db
    };

    return (
        <firebaseContext.Provider value={value}>
            {children}
        </firebaseContext.Provider>
    )
};

export const useFirebaseContext = () => useContext(firebaseContext);
  