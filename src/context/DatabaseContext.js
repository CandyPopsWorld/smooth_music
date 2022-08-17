import { createContext, useContext, useState } from "react";

const databaseContext = createContext();

export const DatabaseContext = ({children}) => {
    const [currentAudio, setCurrentAudio] = useState(null);
    const [currentTextOfMusic, setCurrentTextOfMusic] = useState([]);
    const [currentIdAudio, setCurrentIdAudio] = useState(null);
    const [allDocumentDatabaseAudio, setAllDocumentDatabaseAudio] = useState([]);
    const [ids, setIds] = useState(null);
    const [albumIds, setAlbumIds] = useState(null);
    const [loading, setLoading] = useState(false);
    const [albumsOffset, setAlbumsOffset] = useState(0);
    const [albums, setAlbums] = useState(null);

    const [currentPlayMusicList, setCurrentPlayMusicList] = useState(null);
    const [currentUidMusicList, setCurrentUidMusicList] = useState(null);

    const value = {
        allDocumentDatabaseAudio,
        setAllDocumentDatabaseAudio,
        currentAudio,
        setCurrentAudio,
        currentTextOfMusic,
        setCurrentTextOfMusic,
        ids,
        setIds,
        currentIdAudio,
        setCurrentIdAudio,
        albumIds,
        setAlbumIds,
        loading,
        setLoading,
        albumsOffset,
        setAlbumsOffset,
        albums,
        setAlbums,
        currentPlayMusicList,
        setCurrentPlayMusicList,
        currentUidMusicList,
        setCurrentUidMusicList
    }

    return (
        <databaseContext.Provider value={value}>
            {children}
        </databaseContext.Provider>
    )
};

export const useDatabaseContext = () => useContext(databaseContext);