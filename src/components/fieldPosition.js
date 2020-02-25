

var startPosKeyName = 'fieldPos/startPos';
var robotDisplayPosKeyName = 'fieldPos/displayPos'; //array of {x,y} with x and y from 0-1, both measured from (0,0) in the top left of the field
var robotDisplayAngleKeyName = 'fieldPos/displayAngle'; //double from 0-2pi
var isMatchStartedKeyName = 'started question mark'; //boolean (TBD); use as boolean
var timeStampKeyName = 'Time Stamp';
var thetaKeyName = 'theta';
var velocityKeyName = 'vel';
var logs = [];

var fieldWidth = 26*12 + 11.25; //in inches, because velocity is imperial
var fieldLength = 52*12 + 5.25; //in inches, because velocity is imperial

/**Position Documentation **/
//X = shorter dimension of field, y in display
//Y = longer dimension of field, x in display


var lastTime = 0;
var startLinePos = 0.207;
var zeroAngle = 0;
var startAngle = Math.PI/2;

var enableDebug = false;


var fieldDisplay = {
    matchStarted: false,
    fieldBounds: [[0,94.3],[0,1133]],
    container: document.getElementById("fieldDisplay-container"),
    image: document.getElementById("fieldDisplay-image"),
    positionIndicator: document.getElementById("fieldDisplay-indicator"),
    positionReadout: {
        container: document.getElementById("fieldDisplay-location"),
        position: document.getElementById("fieldDisplay-position"),
        angle: document.getElementById("fieldDisplay-angle")
    },
    indicatorImage: document.getElementById("fieldDisplay-indicator-image"),
    startContainer: document.getElementById("fieldDisplay-start-container"),
    startingSlider: document.getElementById("fieldDisplay-start"),
    startingSliderOutput: document.getElementById("fieldDisplay-start-output"),
    manualInputs: {
        container: document.getElementById("manual_input"),
        theta_input: document.getElementById("theta"),
        velocity_input: document.getElementById("velocity"),
        step_input: document.getElementById("timeStep"),
        step_button: document.getElementById("timeStepEnter"),
        matchStartedToggle: document.getElementById("match-started")
    },
    log: document.getElementById("log")
};

fieldDisplay.manualInputs.container.style.display = (enableDebug ? "initial" : "none");
fieldDisplay.log.style.display = (enableDebug ? "initial" : "none");


function printLog(text) {
    logs.push(text);
    if (logs.length > 1){
        fieldDisplay.log.innerHTML = logs.slice(-Math.min(20,logs.length)).join(" <br> ");
    }
}

fieldDisplay.manualInputs.matchStartedToggle.oninput = function() {
    NetworkTables.putValue('/SmartDashboard/' + isMatchStartedKeyName, this.value);
}

//All position numbers are in percentage of field width/height (from 0-1) when input by this system for consistency
fieldDisplay.startingSlider.oninput = function() {
    NetworkTables.putValue('/SmartDashboard/' + startPosKeyName, parseFloat(this.value)/1000.0);
};

fieldDisplay.manualInputs.theta_input.oninput = function() {
    NetworkTables.putValue('/SmartDashboard/' + thetaKeyName, parseFloat(this.value)*Math.PI/(180));
};

fieldDisplay.manualInputs.velocity_input.oninput = function() {
    NetworkTables.putValue('/SmartDashboard/' + velocityKeyName, parseFloat(this.value));
    printLog("speed");
};

fieldDisplay.manualInputs.step_button.onclick = function() {
    var currentTime = NetworkTables.getValue('/SmartDashboard/' + timeStampKeyName);
    printLog("time: " + currentTime);

    if (currentTime == null || currentTime == NaN)
    {
        currentTime = 0;
    }

    var newTime = currentTime + parseFloat(fieldDisplay.manualInputs.step_input.value);
    
    printLog("time: " + newTime);
    NetworkTables.putValue('/SmartDashboard/' + timeStampKeyName, newTime);


}

function updateRobotPos(unimportant,variables) {
    printLog("reload");

    let pos = NetworkTables.getValue('/SmartDashboard/' + robotDisplayPosKeyName);
    if (pos == null) {
        pos = [0,0];
    }
    let displayX = pos[0];
    let displayY = pos[1];

    let bounds = fieldDisplay.fieldBounds;
    let scaledX = displayX*(bounds[0][1]-bounds[0][0])+bounds[0][0];
    let scaledY = displayY*(bounds[1][1]-bounds[1][0])+bounds[1][0];

    let angle = NetworkTables.getValue('/SmartDashboard/' + robotDisplayAngleKeyName);


    fieldDisplay.positionIndicator.style.transform = `translate(${scaledX}%,${scaledY}%)`;
    fieldDisplay.indicatorImage.style.transform = `rotate(${angle}rad)`;

    var displayAngle = (angle-startAngle)*180/(Math.PI);
    fieldDisplay.positionReadout.position.innerHTML = `Position: [${pos[0]*100}%,${pos[1]*100}%] of field size`;
    fieldDisplay.positionReadout.angle.innerHTML = `Angle: ${displayAngle} degrees`;
    
}

NetworkTables.addKeyListener('/SmartDashboard/' + robotDisplayAngleKeyName, updateRobotPos);
NetworkTables.addKeyListener('/SmartDashboard/' + robotDisplayPosKeyName, updateRobotPos);

NetworkTables.addKeyListener('/SmartDashboard/' + startPosKeyName, (key,value) => {
    fieldDisplay.startingSliderOutput.textContent = Math.round(value*10000.0)/100.0 + "%";
    NetworkTables.putValue('/SmartDashboard/' + robotDisplayPosKeyName, [startLinePos,value]);
    NetworkTables.putValue('/SmartDashboard/' + robotDisplayAngleKeyName, startAngle);
});

NetworkTables.addKeyListener('/SmartDashboard/' + isMatchStartedKeyName, (key,value) => {
    fieldDisplay.matchStarted = value;
    fieldDisplay.startContainer.style.display = (!value ? "initial" : "none");
    fieldDisplay.positionReadout.container.style.display = (value ? "initial" : "none");
    if (value) { 
        lastTime = NetworkTables.getValue('/SmartDashboard/' + timeStampKeyName);
        if (lastTime == null) {
            lastTime = 0;
        }
        zeroAngle = NetworkTables.getValue('/SmartDashboard/' + thetaKeyName)-startAngle;
    }
});


//calculates dX and dY in 'real-world' x and y (see documentation w/ variables), converts to display units, increments pos
NetworkTables.addKeyListener('/SmartDashboard/' + timeStampKeyName, (key,value) => {
    printLog('ticktock');
    var pos = NetworkTables.getValue('/SmartDashboard/' + robotDisplayPosKeyName);
    var angle = NetworkTables.getValue('/SmartDashboard/' + thetaKeyName);
    var velocity = NetworkTables.getValue('/SmartDashboard/' + velocityKeyName);
    var currentTime = NetworkTables.getValue('/SmartDashboard/' + timeStampKeyName);
    var dT = currentTime - lastTime;
    var offsetTheta = ((angle-zeroAngle + Math.PI*4)%(Math.PI*2)); //[satartangle] different from display angle, 0 is from start alliance to other alliance ends of field
    
    if (pos == null) {
        pos = [0,0];
    }

    var dX = Math.cos(offsetTheta)*velocity*dT;
    var dY = Math.sin(offsetTheta)*velocity*dT;

    //dX relates to display-numbers Y, scale down and increment
    var newY = dX/fieldWidth + pos[1];

    //dY relates to display-numbers X, scale down and increment
    var newX = dY/fieldWidth + pos[0];

    //get display theta
    var newTheta = offsetTheta + startAngle; //account for rotation to zero

    lastTime = currentTime;


    //push variables to update display
    NetworkTables.putValue('/SmartDashboard/' + robotDisplayAngleKeyName, newTheta);
    NetworkTables.putValue('/SmartDashboard/' + robotDisplayPosKeyName, [newX,newY]);

    

});



