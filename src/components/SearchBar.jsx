import React, { useEffect, useState, useContext } from 'react';
import "../styles/SearchBar.css";
import axios from 'axios';
import { SearchContext } from '../contexts/SearchContext';

const SearchBar = ({ pop, setPop }) => {
    const INITIAL_STATE = {data: [], press: false, loading: false};
    let [query, setQuery] = useState(INITIAL_STATE);
    let [input, setInput] = useState("");
    let { setKeyword } = useContext(SearchContext);

    function search(keyword){
        if(pop){
            setPop(false);
            setTimeout(()=>{
                setPop(true);
            }, 100);
        }else{
            setPop(true);
        }
        setQuery(INITIAL_STATE);
        if(typeof(keyword) === "string"){
            setKeyword(keyword);
        }else{
            setKeyword(input);
        }
        setInput("");
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

    // Effect Hook that only run once
    useEffect(()=>{
        let searchBar = document.querySelector(".bar");
        let scroll = window.pageYOffset;
        adjustTextLayer();
        window.addEventListener("resize", adjustTextLayer);

        //Scroll effect
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

        // Keyboard event
        document.addEventListener('keydown', (e)=>{
            let querybar = document.getElementsByClassName('query-item');
            let currentSelected = document.getElementsByClassName('keyselect')[0];
            let innerHTML = "";
            if(e.code === "ArrowUp" && document.querySelector(".text-field") === document.activeElement){
                e.preventDefault();
                if(currentSelected){
                    let index = Array.prototype.indexOf.call(querybar, currentSelected);
                    if(index == 0){
                        innerHTML = querybar[index].innerHTML;
                    }else{
                        querybar[index-1].classList.toggle('keyselect');
                        innerHTML = querybar[index-1].innerHTML;
                        currentSelected.classList.toggle('keyselect');
                    }
                }else{
                    innerHTML = document.querySelector(".text-field").value;
                }
                setInput(innerHTML);
            }else if (e.code === "ArrowDown" && document.querySelector(".text-field") === document.activeElement){
                e.preventDefault();
                if(!currentSelected){
                    innerHTML = querybar[0].innerHTML;
                    querybar[0].classList.toggle('keyselect');
                }else{
                    let index = Array.prototype.indexOf.call(querybar, currentSelected);
                    if(index == querybar.length-1){
                        innerHTML = querybar[index].innerHTML;
                    }else{
                        querybar[index+1].classList.toggle('keyselect');
                        innerHTML = querybar[index+1].innerHTML;
                        currentSelected.classList.toggle('keyselect');
                    }
                }
                setInput(innerHTML);
            }

            if(e.keyCode === 13 && document.querySelector(".text-field") === document.activeElement){
                e.preventDefault();
                innerHTML = currentSelected ? currentSelected.innerHTML : document.querySelector(".text-field").value;
                let button = document.querySelector(".submit-btn");
                button.click();
            }
        })
    }, []);

    // Effect Hook that only run when input vary 
    useEffect(()=>{
        async function getQueryData(){
            let data = await axios.get('https://skillset-analyser-api.herokuapp.com/api/search/'+input).then(res => res.data);

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
            {input.length > 0 && query.data.length > 0 && !query.press && <QueryBar data={query.data} setQuery={setQuery} setInput={setInput}/>}
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