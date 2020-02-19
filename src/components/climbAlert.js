var is_climbing_key = 'climbing';

var climb_alert = {
    big: {
        showing: true,
        container: document.getElementById("climb_alert_big_container"),
        box: document.getElementById("climb_alert_big_box"),
        text: document.getElementById("climb_alert_big_text")
    }
}
var alert_active = false;
var alert_timeralert_timer;

NetworkTables.addKeyListener('/SmartDashboard/' + is_climbing_key,function(key,value) {setAlertActive(value);});

function setAlertActive(active) {
    if (alert_active && !active)
    {
        alert_active = false;
        window.clearInterval(alert_timer);
    }
    if (!alert_active && active) {
        alert_active = true;
        alert_timer = window.setInterval(toggleBigAlertShowing,500)
    }
}

function toggleBigAlertShowing() {
    climb_alert.big.showing = !climb_alert.big.showing;
    climb_alert.big.container.style.display = (climb_alert.big.showing ? "flex" : "none");
}