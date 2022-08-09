import { useState, createContext, useContext } from "react";

const albumContext = createContext();

export function AlbumContext({children}){
    const [albums, setAlbums] = useState([]);
    const [image, setImage] = useState(null);
    const [albumMusics, setAlbumMusics] = useState([]);
    const [loadingAlbums, setLoadingAlbums] = useState(false);
    const [active, setActive] = useState('');

    const value = {
        albums,
        setAlbums,
        image,
        setImage,
        albumMusics,
        setAlbumMusics,
        loadingAlbums,
        setLoadingAlbums,
        active,
        setActive
    };

    return (
        <albumContext.Provider value={value}>
            {children}
        </albumContext.Provider>
    )
};

export const useAlbumContext = () => useContext(albumContext)