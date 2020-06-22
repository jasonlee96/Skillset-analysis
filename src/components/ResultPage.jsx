import React, { useEffect, useContext, useState } from 'react';
import "../styles/ResultPage.css";
import axios from 'axios';
import Loading from './Loading';
import { SearchContext } from '../contexts/SearchContext';
import Chart from 'chart.js';
import ReactWordcloud from "react-wordcloud";
import config from '../config';
import barchartConfig from '../chartConfig/barchart';
import piechartConfig from '../chartConfig/piechart';

const ResultPage = () => {
    let { keyword, searchType } = useContext(SearchContext);
    const INITIAL_STATE = { data: {}, loading: true };
    const url = config.url;
    let [state, setState] = useState(INITIAL_STATE);
    let [type, setType] = useState(0);
    let [type1, setType1] = useState(0);
    let [selectType, setSelectType] = useState(0);

    const wordCloudOptions = {
        colors: ["#669911", "#119966", "#63c6c9", "#66A2EB", "#e45b65", "#b8412e", "#e568bd", "#5974c7"],
        enableTooltip: true,
        deterministic: false,
        fontFamily: "Baloo Paaji, sans-serif",
        fontSizes: [20, 70],
        fontStyle: "normal",
        fontWeight: "normal",
        padding: 5,
        rotations: 0,
        rotationAngles: [0],
        scale: "log",
        spiral: "rectangular",
        transitionDuration: 1000,
        enableOptimizations: true
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
        setSelectType(searchType);
        // TODO: C# keyword doesnot processed, need do extra url encode
        async function getResultData(){
            let data;
            if(searchType === 0){
                data = await axios.get(url+'api/result/' + encodeURI(keyword).replace("#", "%23")).then((result)=> result.data[0]);
            }else{
                data = await axios.get(url+'api/title/' + encodeURI(keyword).replace("#", "%23")).then((result)=> result.data[0]);
            }
            console.log(data);
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
        if(searchType === 0){
            loadSkillSet(data, loading);
        }else{
            loadTitleDemand(data, loading);
        }
        
    }, [state.data, type]);

    function loadSkillSet(data, loading){
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

            new Chart(canvas, {
                type: 'horizontalBar',
                data: processData,
                options: barchartConfig
            });
        }
    }

    function loadTitleDemand(data, loading){
        if(!loading){
            let choices = document.querySelectorAll(".result-chart-type>div");
            console.log(choices[0].classList);
            for (let i = 0; i < choices.length; i++){
                choices[i].classList.remove('selected');
            }
            choices[type1].classList.add('selected');
        }

        if(type1===0){
            let industry = []
            let count = []
            let dataArr = data.results.sort((x, y) => y.count-x.count);
            let top8Arr = dataArr.slice(0,8); 
            let otherArr = dataArr.slice(8,dataArr.length);
            let sum = dataArr.reduce((accumulator, currentVal)=>{
                return accumulator + currentVal.count;
            }, 0)
            top8Arr.map((data)=>{
                industry.push(data.industry);
                count.push((data.count/sum * 100).toFixed(2));
            });
            let otherSum = otherArr.reduce((accumulator, currentVal)=>{
                return accumulator + currentVal.count;
            }, 0)
            industry.push("Others");
            count.push((otherSum/sum * 100).toFixed(2));

            let canvas = document.querySelector('#chart');
            let processData = {
                labels: industry,
                datasets: [{
                    label: "Score Value",
                    data: count,
                    backgroundColor: ["#f03434", "#19b5fe", "#7befb2", "#f5d76e", "#f2784b", "#67809f" ,"#ec644b" ,
                    "#be90d4" ,"#c8f7c5" ,"#89c4f4" ,"#65c6bb" ,"#446cb3"],
                    borderColor: '#6667'
                }]
            };
            piechartConfig["tooltips"]["custom"] = function(tooltipModel) {
                // Tooltip Element
                var tooltipEl = document.getElementById('chartjs-tooltip');
    
                // Create element on first render
                if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.id = 'chartjs-tooltip';
                    tooltipEl.innerHTML = '<table style="border-spacing: 0 5px; background: #333;  color: white; border-radius: 15px; border-width: 2px; padding: 15px"></table>';
                    document.body.appendChild(tooltipEl);
                }
    
                // Hide if no tooltip
                if (tooltipModel.opacity === 0) {
                    tooltipEl.style.opacity = 0;
                    return;
                }
    
    
                // Set Text
                if (tooltipModel.body) {
                    var style = 'font-size: 16px;border-spacing: 0px;'
                    let innerHtml = '<tbody style="'+style+'">';
                    var rowHeader = '<tr rowspacing="5px"><td><span>';
                    let rowFooter = '</span></td></tr>'
                    innerHtml += rowHeader + tooltipModel.body[0].lines[0] + ' %' + rowFooter;
                   
                    let industryLabel = tooltipModel.body[0].lines[0].split(':')[0];
                    let arrIndex = dataArr.findIndex((element)=>{
                        return element.industry === industryLabel
                    });
                    let listHeader = "<ul style='padding: 0; margin: 0;padding-left: 20px;'>";
                    let listFooter = "</ul>";
                    let listContent = "";
                    if(arrIndex >= 0){
                        dataArr[arrIndex].results.map((object)=>{
                            listContent += "<li style='padding: 7px 0px;'>" + object[0] + "</li>";
                        })
                    }
                    let count = 0;
                    const MAX_COUNT = 13;
                    if (arrIndex === -1){
                        for(let i = 0; i < otherArr.length; i++){
                            if(count > MAX_COUNT){
                                break;
                            }
                            for (let j = 0; j < otherArr[i].results.length; j++){
                                if(count > MAX_COUNT){
                                    break;
                                }
                                listContent += "<li style='padding: 7px 0px;'>" + otherArr[i].results[j][0] + "</li>";
                                count++;
                            }
                        }
                    }
                    if (listContent !== ""){
                        innerHtml += rowHeader +'Vacancy Demand in ' + industryLabel+ rowFooter;
                    }
                    innerHtml += rowHeader + listHeader + listContent + listFooter + rowFooter;
                    
                    var tableRoot = tooltipEl.querySelector('table');
                    innerHtml += '</tbody>';
                    tableRoot.innerHTML = innerHtml;
                    
                }
    
                // `this` will be the overall tooltip
                var position = this._chart.canvas.getBoundingClientRect();
    
                // Display, position, and set styles for font
                tooltipEl.style.opacity = 1;
                tooltipEl.style.position = 'absolute';
                tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                tooltipEl.style.pointerEvents = 'none';
            }

            new Chart(canvas, {
                type: 'pie',
                data: processData,
                options: piechartConfig
            });
        }
    }

    return(
        <div className="result-container" id="section3">
            {state.loading ? <Loading/> :
            <div className="result-box shadow">
                <div className="result-title">
                    {state.data ? state.data.title.toLowerCase() === keyword.toLowerCase() ? <h3>Result for <span>{state.data.title}</span></h3> : <h3>Keyword Not Found. Do You Mean <span>{state.data.title}</span>?</h3> : <h3>Keyword Not Found. </h3>}
                </div>
                {state.data && selectType===0 &&
                <div className="result-chart-type">
                    <div onClick={()=>{ setType(0) }}>Bar Chart</div>
                    <div onClick={()=>{ setType(1) }}>Word Cloud</div>
                </div>}
                {state.data && selectType===1 &&
                <div className="result-chart-type">
                    <div onClick={()=>{ setType1(0) }}>Pie Chart</div>
                </div>}
                <div className="result-chart">
                    {type === 0 && <canvas id="chart"></canvas>}
                    {type === 1 && <ReactWordcloud options={wordCloudOptions} words={state.data.results.slice(0,70)} />}
                    
                </div>
            </div>
            }
        </div>
    );
}

export default ResultPage;