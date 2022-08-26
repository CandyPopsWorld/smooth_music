import { createContext, useContext, useState } from "react";
const settingContext = createContext();

export const SettingContext = ({children}) => {
    const [activeSlide, setActiveSlide] = useState(1);
    const [currentLocalization, setCurrentLocalization] = useState(null);

    const value = {
        activeSlide,
        setActiveSlide,
        currentLocalization,
        setCurrentLocalization
    };

    return (
        <settingContext.Provider value={value}>
            {children}
        </settingContext.Provider>
    )
};

export const useSettingContext = () => useContext(settingContext); 