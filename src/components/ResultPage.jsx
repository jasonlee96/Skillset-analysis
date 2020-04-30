import React, { useEffect, useContext, useState } from 'react';
import "../styles/ResultPage.css";
import axios from 'axios';
import { SearchContext } from '../contexts/SearchContext';
import Chart from 'chart.js';
import ReactWordcloud from "react-wordcloud";

const ResultPage = () => {
    let { keyword } = useContext(SearchContext);
    let [data, setData] = useState({});
    let [type, setType] = useState(0);

    const wordCloudOptions = {
        colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
        enableTooltip: true,
        deterministic: true,
        fontFamily: "Baloo Paaji, cursive",
        fontSizes: [20, 100],
        fontStyle: "normal",
        fontWeight: "normal",
        padding: 2,
        rotations: 0,
        rotationAngles: [0],
        scale: "sqrt",
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
        setData({});
        async function getResultData(){
            let data = await axios.get('http://localhost:5000/api/result/' + encodeURI(keyword)).then((result)=> result.data[0]);
            setData(data);
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
        let choices = document.querySelectorAll(".result-chart-type>div");
        console.log(choices[0].classList);
        for (let i = 0; i < choices.length; i++){
            choices[i].classList.remove('selected');
        }
        choices[type].classList.add('selected');

        if(!data.title){
            return ;
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
    }, [data, type]);
    console.log(data);
    return(
        <div className="result-container" id="section3">
            <div className="result-box shadow">
                <div className="result-title">
                    {data.title && data.title.toLowerCase() === keyword.toLowerCase() ? <h3>Result for <span>{data.title}</span></h3> : <h3>Keyword Not Found. Do You Mean <span>{data.title}</span>?</h3>  }
                </div>
                <div className="result-chart-type">
                    <div onClick={()=>{ setType(0) }}>Bar Chart</div>
                    <div onClick={()=>{ setType(1) }}>Word Cloud</div>
                </div>
                <div className="result-chart">
                    {type === 0 && <canvas id="chart"></canvas>}
                    {type === 1 && <ReactWordcloud options={wordCloudOptions} words={data.results} />}
                </div>
            </div>
        </div>
    );
}

export default ResultPage;