import { createContext, useContext, useState } from "react";

const loginAndSignUpContext = createContext();

export function LoginAndSignUpContext({children}){

    const [currentLocalization, setCurrentLocalization] = useState('ru');

    const value = {
        currentLocalization,
        setCurrentLocalization
    };

    return (
        <loginAndSignUpContext.Provider value={value}>
            {children}
        </loginAndSignUpContext.Provider>
    )
};

export const useLoginAndSignUpContext = () => useContext(loginAndSignUpContext);