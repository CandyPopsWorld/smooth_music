import { createContext, useContext, useState } from "react";

const searchContext = createContext();

export function SearchContext({children}){
    const [audios, setAudios] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [authors, setAuthors] = useState([]);

    const value = {
        audios,
        setAudios,
        albums,
        setAlbums,
        authors,
        setAuthors
    };

    return (
        <searchContext.Provider value={value}>
            {children}
        </searchContext.Provider>
    )
};

export const useSearchContext = () => useContext(searchContext);