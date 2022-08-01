import { createContext, useContext, useState } from "react";

const databaseContext = createContext();

export const DatabaseContext = ({children}) => {
    const [currentAudio, setCurrentAudio] = useState(null);
    const [currentTextOfMusic, setCurrentTextOfMusic] = useState([]);
    const [allDocumentDatabaseAudio, setAllDocumentDatabaseAudio] = useState([]);
    const [ids, setIds] = useState(null);

    const value = {
        allDocumentDatabaseAudio,
        setAllDocumentDatabaseAudio,
        currentAudio,
        setCurrentAudio,
        currentTextOfMusic,
        setCurrentTextOfMusic,
        ids,
        setIds
    }

    return (
        <databaseContext.Provider value={value}>
            {children}
        </databaseContext.Provider>
    )
};

export const useDatabaseContext = () => useContext(databaseContext);