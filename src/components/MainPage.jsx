import React, { useEffect, useState } from 'react';
import '../App.css';
import { LandingPage, SearchBar, AboutPage, ResultPage } from './';
import SearchContextProvider from '../contexts/SearchContext';

const MainPage = () => {
    let [pop, setPop] = useState(false);

    useEffect(()=>{
        let body = document.getElementsByTagName('body')[0];
        setTimeout(()=>{
        body.classList.toggle('fade');
        }, 500)
    });

    return (
        <SearchContextProvider>
            <div className="Main" id="section1">
                <LandingPage>
                    <SearchBar pop={pop} setPop={setPop} />
                </LandingPage>
                {pop && <ResultPage />}
                <AboutPage />
            </div>
        </SearchContextProvider>
    );
}

export default MainPage;