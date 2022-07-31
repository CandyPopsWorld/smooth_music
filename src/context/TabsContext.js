import { createContext, useContext, useState } from "react";

const tabsContext = createContext();

export const TabsContext = ({children}) => {
    const [activeSlide, setActiveSlide] = useState(1);

    const value = {
        activeSlide,
        setActiveSlide
    };

    return (
        <tabsContext.Provider value={value}>
            {children}
        </tabsContext.Provider>
    )
};

export const useTabsContext = () => useContext(tabsContext); 