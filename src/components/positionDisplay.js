

var namesKeyName = 'locations/location_names';
var locationsKeyName = 'locations/locations'
var logs = [];

var fieldWidth = 26*12 + 11.25; //in inches, because velocity is imperial
var fieldLength = 52*12 + 5.25; //in inches, because velocity is imperial

/**Position Documentation **/
//X = shorter dimension of field, y in display
//Y = longer dimension of field, x in display


var startLinePos = 0.207;
var zeroAngle = 0;
var startAngle = Math.PI/2;

var enableDebug = true;


var fieldDisplay = {
    fieldBounds: [[0,94.3],[0,1133]],
    container: document.getElementById("positionDisplay-container"),
    image: document.getElementById("positionDisplay-image"),
    indicatorContainer: document.getElementById("fieldDisplay-indicator-container"),
    indicators: [1,2,3,4,5,6,7].forEach((num) => {
        return document.getElementById("positionDisplay-indicator-" + num);
    }),
    images: [1,2,3,4,5,6,7].forEach((num) => {
        return document.getElementById("positionDisplay-image-" + num);
    }),
    log: document.getElementById("log")
};

fieldDisplay.positionIndicatorContainer.

fieldDisplay.log.style.display = (enableDebug ? "initial" : "none");

function printLog(text) {
    logs.push(text);
    if (logs.length > 1){
        fieldDisplay.log.innerHTML = logs.slice(-Math.min(20,logs.length)).join(" <br> ");
    }
}

function updateRobotPos(unimportant,variables) {
    printLog("reload");

    let locations = NetworkTables.getValue('/SmartDashboard/' + locationsKeyName);
    for(let i = 0; i < locations.length; i++){
        location = locations[i];
        let displayX = location[0];
        let displayY = location[1];

        let bounds = fieldDisplay.fieldBounds;
        let scaledX = displayX*(bounds[0][1]-bounds[0][0])+bounds[0][0];
        let scaledY = displayY*(bounds[1][1]-bounds[1][0])+bounds[1][0];

        angle = location[2];

        fieldDisplay.indicators[i].style.transform = `translate(${scaledX}%,${scaledY}%)`;
        fieldDisplay.images[i].style.transform = `rotate(${angle}rad)`;

        //var displayAngle = (angle-startAngle)*180/(Math.PI);
        //fieldDisplay.positionReadout.position.innerHTML = `Position: [${pos[0]*100}%,${pos[1]*100}%] of field size`;
        //fieldDisplay.positionReadout.angle.innerHTML = `Angle: ${displayAngle} degrees`;
    }
    
}

NetworkTables.addKeyListener('/SmartDashboard/' + locationsKeyName, updateRobotPos);
//NetworkTables.addKeyListener('/SmartDashboard/' + robotDisplayPosKeyName, updateRobotPos);
/*
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

    

});*/



