var color_value_key = "Color Wheel RGB";
var color_name_key = "Color Wheel Color Name";
var wheel_active_key = "Color Wheel Active";

var name_angle = {'red':22.5,'yellow':22.5+45,'blue':22.5+90,'green':22.5+135} //rotations clockwise in degrees

var colorWheel = {
    container = document.getElementById("colorwheel-container"),
    color_output_text = document.getElementById("colorwheel-color-output-text"),
    color_output_box = document.getElementById("colorwheel-color-output-box"),
    name_output = document.getElementById("colorwheel-name-output"),
    active_output = document.getElementById("colorwheel-enabled-text"),
    wheel = document.getElementById("colorwheel-wheel")
}


function updateWheel(key,name){
    var rotate_angle = name_angle[name];
    colorWheel.wheel.style.transform = `rotate(-${rotate_angle}deg)`;
    colorWheel.name_output.innerHTML = name;
}

NetworkTables.addKeyListener('/SmartDashboard/' + color_name_key, updateWheel);


NetworkTables.addKeyListener('/SmartDashboard/' + color_value_key, (key,value) => {
    colorWheel.color_output_text.innerHTML = 'RGB: (' + value.join(',') + ")";
    colorWheel.color_output_box.style.background_color = "RGB(" + value.join(',') + ")";
});

NetworkTables.addKeyListener('/SmartDashboard/' + wheel_active_key, (key,value) => {
    colorWheel.active_output.innerHTML = "Auto: " + (value ? "Enabled" : "Disabled");
});
