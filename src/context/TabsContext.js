import { createContext, useContext, useState } from "react";

const tabsContext = createContext();

export const TabsContext = ({children}) => {
    const [activeSlide, setActiveSlide] = useState(1);
    const [searchTab, setSearchTab] = useState(null);

    const value = {
        activeSlide,
        setActiveSlide,
        searchTab,
        setSearchTab
    };

    return (
        <tabsContext.Provider value={value}>
            {children}
        </tabsContext.Provider>
    )
};

export const useTabsContext = () => useContext(tabsContext); 