import React, { createContext, useState } from 'react';

export const SearchContext = createContext(null);

const SearchContextProvider = ({children}) => {
    let [keyword, setKeyword] = useState("");
    let [searchType, setSearchType] = useState(0);
    const store = {
        keyword,
        setKeyword,
        searchType,
        setSearchType
    };
    return(
        <SearchContext.Provider value={store}>
            {children}
        </SearchContext.Provider>
    );
};

export default SearchContextProvider;