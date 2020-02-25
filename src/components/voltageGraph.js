var Chart = require('chart.js');
var moment = require('moment');

var displayRelative = false;
var relativeTimeDuration = moment.duration(15,'seconds');

var loggedData = []

var voltageNTName = 'Voltage';

function pushData(value) {
    loggedData.push({time: moment(), voltage: value});
    vGraph.data.datasets[0].data.push({x:moment(),y:value});
}
function graphUpdateTick() {
    pushData(NetworkTables.getValue('/SmartDashboard/' + voltageNTName));
}


var ctx = document.getElementById("voltageGraph").getContext('2d');
var vGraph = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Voltage',
            data: [{
                x: moment().add(moment.duration(200)),
                y: 12
            },{
                x: moment().add(moment.duration(1000)),
                y: 13
            }],
            borderColor: 'red',
            borderWidth: 1
        }]
    },
    options: {
        layout: {
            padding: {
                left: 0,
                right: 20,
                top: 0,
                bottom: 0
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    callback: function(value, index, values) {
                        return value + 'V';
                    },
                    autoSkipPadding: 5
                }
            }],
            xAxes: [{
                type: 'time',
                ticks: {
                    min: function() {return moment().subtract(relativeTimeDuration)},
                    callback: function(value, index, values) {
                        return ' ';
                    },
                    autoSkipPadding: 5
                }
            }]
        }
    }
});

window.setInterval(graphUpdateTick,50)
