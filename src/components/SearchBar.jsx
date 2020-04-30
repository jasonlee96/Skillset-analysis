import React, { useEffect, useState, useContext } from 'react';
import "../styles/SearchBar.css";
import axios from 'axios';
import { SearchContext } from '../contexts/SearchContext';

const SearchBar = ({ pop, setPop }) => {
    const INITIAL_STATE = {data: [], press: false, loading: false};
    let [query, setQuery] = useState(INITIAL_STATE);
    let [input, setInput] = useState("");
    let { setKeyword } = useContext(SearchContext);

    function search(){
        if(pop){
            setPop(false);
            setTimeout(()=>{
                setPop(true);
            }, 100);
        }else{
            setPop(true);
        }
        setQuery(INITIAL_STATE);
        setInput("");
        setKeyword(input);
    }

    function adjustTextLayer(){
        let w = document.documentElement.clientWidth;
        let offset = 600;
        let searchBar = document.querySelector(".bar");
        searchBar.style.left = ((w - offset)/2) + 'px';
    }

    function activeDropdown(){
        let dropdown = document.getElementsByClassName("dropdown-content")[0];
        dropdown.classList.toggle("show");
    }

    function selectDropdown(i){
        let dropdown = document.getElementsByClassName("dropdown")[0];
        dropdown.value = i;
    }

    useEffect(()=>{
        let searchBar = document.querySelector(".bar");
        let scroll = window.pageYOffset;
        adjustTextLayer();
        window.addEventListener("resize", adjustTextLayer);

        document.addEventListener('scroll', (e)=>{
            let offset = window.pageYOffset;
            scroll = offset;
            searchBar.style.top = 460 + scroll / 1.5 + 'px';

            if(offset >= 500){
                searchBar.classList.add("hide");
            }else{
                searchBar.classList.remove("hide");
            }
        });
    }, []);

    useEffect(()=>{
        async function getQueryData(){
            let data = await axios.get('http://localhost:5000/api/search/'+input).then(res => res.data);

            setQuery({...query, data: data, loading: false});
        }
        
        if(query !== INITIAL_STATE && query.loading === true){
            getQueryData();
        }
    }, [input]);

    return(
        <div className="bar shadow">
            <div className="dropdown-box" onClick={activeDropdown}>
                <select name="type" className="dropdown">
                    <option value="0">Job Title</option>
                    <option value="1">Location</option>
                </select>
                <div className="dropdown-content shadow">
                    <div className="dropdown-item" onClick={()=> selectDropdown(0)}>
                        Job Title
                    </div>
                    <div className="dropdown-item" onClick={()=> selectDropdown(1)}>
                        Location
                    </div>
                </div>
            </div>
            <input className="text-field" placeholder="Keywords...." type="text" value={input} onChange={(e) => {
                setInput(e.target.value)
                setQuery({...query, press: false, loading: true})
            }}/>
            {query.data.length > 0 && !query.press && <QueryBar data={query.data} setQuery={setQuery} setInput={setInput}/>}
            <button className="submit-btn" type="submit" onClick={search}>Search</button>
        </div>
    )
}

const QueryBar = (props) =>{
    const { data, setQuery, setInput } = props;

    function onClickItem(title){
        setQuery({data:[], press: true});
        setInput(title);
    }

    return(
        <div className="query-container">
            {data.map((item)=>{
                return(
                    <div className="query-item" key={item._id} onClick={()=>{onClickItem(item.title)}}>
                        {item.title}
                    </div>
                );
            })}
        </div>
    );
}

export default SearchBar;