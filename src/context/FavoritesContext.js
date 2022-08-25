import { createContext, useContext, useState } from "react";

const favoritesContext = createContext();
export function FavoritesContext({children}){
    const [activeTab, setActiveTab] = useState(3);
    // Album Tab
    const [favoriteAlbums, setFavoriteAlbums] = useState([]);
    const [albumMusics, setAlbumMusics] = useState(null);
    const [albums, setAlbums] = useState([]);
    //Playlist Tab
    const [playlistMusic, setPlaylistMusic] = useState([]);
    const [activePlaylist, setActivePlaylist] = useState(0);
    const [favoriteAudio, setFavoriteAudio] = useState([]);

    //Authors Tab
    const [favoriteAuthors, setFavoriteAuthors] = useState([]);
    const [authors, setAuthors] = useState([]);

    const value = {
        activeTab,
        setActiveTab,
        favoriteAlbums,
        setFavoriteAlbums,
        albumMusics,
        setAlbumMusics,
        albums,
        setAlbums,
        playlistMusic,
        setPlaylistMusic,
        activePlaylist,
        setActivePlaylist,
        favoriteAudio,
        setFavoriteAudio,
        authors,
        setAuthors,
        favoriteAuthors,
        setFavoriteAuthors
    };

    return(
        <favoritesContext.Provider value={value}>
            {children}
        </favoritesContext.Provider>
    )
};

export const useFavoritesContext = () => useContext(favoritesContext);