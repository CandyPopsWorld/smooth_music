import { createContext, useContext, useState } from "react";

const searchContext = createContext();

export function SearchContext({children}){
    const [search, setSearch] = useState('');
    const [audios, setAudios] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [searchInfoAboutItem, setSearchInfoAboutItem] = useState(null);

    const value = {
        audios,
        setAudios,
        albums,
        setAlbums,
        authors,
        setAuthors,
        showModal,
        setShowModal,
        search,
        setSearch,
        searchInfoAboutItem,
        setSearchInfoAboutItem
    };

    return (
        <searchContext.Provider value={value}>
            {children}
        </searchContext.Provider>
    )
};

export const useSearchContext = () => useContext(searchContext);