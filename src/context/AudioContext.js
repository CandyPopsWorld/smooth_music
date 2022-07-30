import { createContext, useContext, useState } from "react";

const audioContext = createContext();

const initialize_text_music = [
    {
        titleOrigin: `Come as you are, as you were`, 
        titleTranslate: `Приди таким, какой ты есть и каким ты был,`, 
        timeStart: 16, 
        timeEnd: 0
    },

    {
        titleOrigin: `As I want you to be`, 
        titleTranslate: `Таким, каким я хочу, чтоб ты стал.`, 
        timeStart: 21, 
        timeEnd: 30
    },

    {
        titleOrigin: `As a friend, as a friend, as an old enemy`, 
        titleTranslate: `Как друг, как друг, как старый враг.`, 
        timeStart: 25, 
        timeEnd: 0
    },

    {
        titleOrigin: `Take your time, hurry up`, 
        titleTranslate: `Не торопись, поспеши,`, 
        timeStart: 34, 
        timeEnd: 0
    },

    {
        titleOrigin: `The choice is your, don't be late`, 
        titleTranslate: `Это твой выбор, не опаздывай.`, 
        timeStart: 38, 
        timeEnd: 0
    },

    {
        titleOrigin: `Take a rest as a friend as an old memoria`, 
        titleTranslate: `Отдохни, как друг, как старая память.`, 
        timeStart: 42, 
        timeEnd: 0
    },

    {
        titleOrigin: `Come dowsed in mud, soaked in bleach`, 
        titleTranslate: `Приди, весь в грязи, пропитанный известью,`, 
        timeStart: 66, 
        timeEnd: 0
    },

    {
        titleOrigin: `As I want you to be`, 
        titleTranslate: `Таким, каким я хочу, чтоб ты стал.`, 
        timeStart: 71, 
        timeEnd: 0
    },

    {
        titleOrigin: `As a trend, as a friend, as an old memoria`, 
        titleTranslate: `Как раньше, как друг, как старая память.`, 
        timeStart: 74, 
        timeEnd: 0
    },

    {
        titleOrigin: `And I swear that I don't have a gun`, 
        titleTranslate: `Клянусь, я безоружен,`, 
        timeStart: 99, 
        timeEnd: 0
    },

    {
        titleOrigin: `No I don't have a gun`, 
        titleTranslate: `Да, я безоружен.`, 
        timeStart: 105, 
        timeEnd: 0
    },
];

export function AudioContext({children}){

    const [currentTime, setCurrentTime] = useState(0);
    const [titleOrigin, setTitleOrigin] = useState(<span style={{opacity: '0.1'}}>{initialize_text_music[0].titleOrigin}</span>);
    const [titleTranslate, setTitleTranslate] = useState(<span style={{opacity: '0.1'}}>{initialize_text_music[0].titleTranslate}</span>);
    const [viewTitle, setViewTitle] = useState(false);
    const [textOfMusic, setTextOfMusic] = useState(initialize_text_music);

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
        setTextOfMusic
    }

    return (
        <audioContext.Provider value={value}>
            {children}
        </audioContext.Provider>
    )
};

export const useAudioContext = () => useContext(audioContext);