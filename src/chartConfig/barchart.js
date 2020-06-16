export default {
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
                fontFamily: 'Baloo Paaji, sans-serif',
                fontStyle: 'bold',
                fontColor: 'black'
            },
            ticks:{
                beginAtZero: true,
                fontSize: 18,
                fontFamily: 'Baloo Paaji, sans-serif',
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
                fontFamily: 'Baloo Paaji, sans-serif',
                fontStyle: 'bold',
                fontColor: 'black'
            },
            gridLines: {
                display: false
            },
            ticks:{
                fontSize: 18,
                fontFamily: 'Baloo Paaji, sans-serif',
                fontColor: 'black'
            }
        }],
    },
    animation: {
        duration: 1500,
        easing: 'easeOutCirc'
    }
};