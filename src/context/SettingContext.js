import { createContext, useContext, useState } from "react";

const settingContext = createContext();

export const SettingContext = ({children}) => {
    const [activeSlide, setActiveSlide] = useState(1);

    const value = {
        activeSlide,
        setActiveSlide
    };

    return (
        <settingContext.Provider value={value}>
            {children}
        </settingContext.Provider>
    )
};

export const useSettingContext = () => useContext(settingContext); 