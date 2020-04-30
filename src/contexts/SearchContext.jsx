import React, { createContext, useState } from 'react';

export const SearchContext = createContext(null);

const SearchContextProvider = ({children}) => {
    let [keyword, setKeyword] = useState("");

    const store = {
        keyword,
        setKeyword
    };
    return(
        <SearchContext.Provider value={store}>
            {children}
        </SearchContext.Provider>
    );
};

export default SearchContextProvider;