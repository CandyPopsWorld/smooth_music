import { createContext, useContext, useState } from "react";

const audioContext = createContext();

export function AudioContext({children}){

    const [textOfMusic, setTextOfMusic] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [titleOrigin, setTitleOrigin] = useState(<span style={{opacity: '0.1'}}>{textOfMusic !== null ? textOfMusic[0].titleOrigin : null}</span>);
    const [titleTranslate, setTitleTranslate] = useState(<span style={{opacity: '0.1'}}>{textOfMusic !== null ? textOfMusic[0].titleTranslate : null}</span>);
    const [viewTitle, setViewTitle] = useState(false);
    const [played, setPlayed] = useState(true);

    const [originalTextMute, setOriginalTextMute] = useState(true);
    const [translateTextMute, setTranslateTextMute] = useState(true);
    const [autoPlay, setAutoPlay] = useState(true);
    const [showModalPlaylist, setShowModalPlaylist] = useState(false);


    const value = {
        currentTime,
        titleOrigin,
        titleTranslate,
        viewTitle,
        textOfMusic,
        setCurrentTime,
        setTitleOrigin,
        setTitleTranslate,
        setViewTitle,
        setTextOfMusic,
        played,
        setPlayed,
        originalTextMute,
        setOriginalTextMute,
        translateTextMute,
        setTranslateTextMute,
        autoPlay,
        setAutoPlay,
        setShowModalPlaylist,
        showModalPlaylist
    }

    return (
        <audioContext.Provider value={value}>
            {children}
        </audioContext.Provider>
    )
};

export const useAudioContext = () => useContext(audioContext);