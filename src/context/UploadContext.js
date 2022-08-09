import { createContext, useContext, useState } from "react";

const uploadContext = createContext();

export const UploadContext = ({children}) => {
    const [file, setFile] = useState(null);
    const [fileUpload, setFileUpload] = useState(null);
    const [textOfMusic, setTextOfMusic] = useState([
        // {
        //     titleOrigin: ``, 
        //     titleTranslate: ``, 
        //     timeStart: '', 
        // }
    ]);

    const [nameMusic, setNameMusic] = useState('');
    const [album, setAlbum] = useState('');
    const [albumId,setAlbumId] = useState('');
    const [authorMusic, setAuthorMusic] = useState('');
    const [durationMusic, setDurationMusic] = useState('');

    const [loading,setLoading] = useState(false);

    const clearUploadContext = () => {
        setFile(null);
        setFileUpload(null);
        setTextOfMusic([{titleOrigin: '', titleTranslate: '', timeStart: ''}]);
        setNameMusic('');
        setAuthorMusic('');
        setAlbum('');
        setDurationMusic('');
        setAlbumId('');
    };

    const value = {
        file,
        setFile,
        fileUpload,
        loading,
        textOfMusic,
        nameMusic,
        authorMusic,
        album,
        setTextOfMusic,
        setFileUpload,
        setLoading,
        clearUploadContext,
        setNameMusic,
        setAuthorMusic,
        setAlbum,
        durationMusic,
        setDurationMusic,
        albumId,
        setAlbumId
    };
    
    return (
        <uploadContext.Provider value={value}>
            {children}
        </uploadContext.Provider>
    )
};

export const useUploadContext = () => useContext(uploadContext);