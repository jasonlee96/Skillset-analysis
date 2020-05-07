import React, { useEffect, useContext, useState } from 'react';
import "../styles/ResultPage.css";
import axios from 'axios';
import Loading from './Loading';
import { SearchContext } from '../contexts/SearchContext';
import Chart from 'chart.js';
import ReactWordcloud from "react-wordcloud";

const ResultPage = () => {
    let { keyword } = useContext(SearchContext);
    const INITIAL_STATE = { data: {}, loading: true };
    let [state, setState] = useState(INITIAL_STATE);
    let [type, setType] = useState(0);

    const wordCloudOptions = {
        colors: ["#669911", "#119966", "#63c6c9", "#66A2EB", "#e45b65", "#b8412e", "#e568bd", "#5974c7"],
        enableTooltip: true,
        deterministic: true,
        fontFamily: "Baloo Paaji, cursive",
        fontSizes: [20, 100],
        fontStyle: "normal",
        fontWeight: "normal",
        padding: 5,
        rotations: 0,
        rotationAngles: [0],
        scale: "log",
        spiral: "rectangular",
        transitionDuration: 1000
      };
 
    useEffect(() => {
        let box = document.getElementById("section3");
        let position = box.getBoundingClientRect().top + 50;

        window.scrollTo({
            top: window.pageYOffset + position,
            behavior: "smooth"
        });
    }, []);

    useEffect(()=>{
        setState({ data: {}, loading: true });
        async function getResultData(){
            let data = await axios.get('https://skillset-analyser-api.herokuapp.com/api/result/' + encodeURI(keyword)).then((result)=> result.data[0]);
            setState({data: data, loading: false});
        }
        getResultData();
    }, [keyword]);


    function getColors(number){
        let colorLoop = ["#669911", "#119966", "#63c6c9", "#66A2EB", "#FCCE56", "#e45b65", "#b8412e", "#e568bd", "#5974c7", "#f3d174"]
        let colors = []
        for (let i = 0; i < number; i++){
            colors.push(colorLoop[i % 10]);
        }
        return colors;
    }

    useEffect(()=>{
        let { data, loading } = state;

        if(data === undefined || !data.title){
            return ;
        }

        if(!loading){
            let choices = document.querySelectorAll(".result-chart-type>div");
            console.log(choices[0].classList);
            for (let i = 0; i < choices.length; i++){
                choices[i].classList.remove('selected');
            }
            choices[type].classList.add('selected');
        }

        if(type === 0){
            let dataset = data.results.slice(0,20);
            let term = [];
            let value = [];
            dataset.map((data)=>{
                term.push(data.text);
                value.push(data.value);
            });

            let canvas = document.querySelector('#chart');
            let processData = {
                labels: term,
                datasets: [{
                    label: "Score Value",
                    data: value,
                    backgroundColor: getColors(term.length),
                    barPercentage: 0.95,
                    barThickness: 'flex',
                    categoryPercentage: 1.0
                }]
            };

            let chartOption = {
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel:{
                            display:true,
                            labelString: "Score",
                            fontSize: 26,
                            fontFamily: 'Baloo Paaji, cursive',
                            fontStyle: 'bold',
                            fontColor: 'black'
                        },
                        ticks:{
                            beginAtZero: true,
                            fontSize: 18,
                            fontFamily: 'Baloo Paaji, cursive',
                            fontColor: 'black'
                        },
                        gridLines: {
                            display: true
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel:{
                            display:true,
                            labelString: "Term",
                            fontSize: 26,
                            fontFamily: 'Baloo Paaji, cursive',
                            fontStyle: 'bold',
                            fontColor: 'black'
                        },
                        gridLines: {
                            display: false
                        },
                        ticks:{
                            fontSize: 18,
                            fontFamily: 'Baloo Paaji, cursive',
                            fontColor: 'black'
                        }
                    }],
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutCirc'
                }
            };
            new Chart(canvas, {
                type: 'horizontalBar',
                data: processData,
                options: chartOption
            });
        }
    }, [state.data, type]);

    return(
        <div className="result-container" id="section3">
            {state.loading ? <Loading/> :
            <div className="result-box shadow">
                <div className="result-title">
                    {state.data ? state.data.title.toLowerCase() === keyword.toLowerCase() ? <h3>Result for <span>{state.data.title}</span></h3> : <h3>Keyword Not Found. Do You Mean <span>{state.data.title}</span>?</h3> : <h3>Keyword Not Found. </h3>}
                </div>
                {state.data &&
                <div className="result-chart-type">
                    <div onClick={()=>{ setType(0) }}>Bar Chart</div>
                    <div onClick={()=>{ setType(1) }}>Word Cloud</div>
                </div>}
                <div className="result-chart">
                    {type === 0 && <canvas id="chart"></canvas>}
                    {type === 1 && <ReactWordcloud options={wordCloudOptions} words={state.data.results} />}
                </div>
            </div>
            }
        </div>
    );
}

export default ResultPage;