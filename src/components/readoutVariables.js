

let readouts = {
    alignment: {
        variable_name: 'isAligned',
        container: document.getElementById('alignment-readout'),
        color_readout: document.getElementById('alignment-color'),
        text_readout: document.getElementById('alignment-text')
    }
}


let updateAlignmentReadout = (key,value) => {
    colorDiv = readouts.alignment.color_readout;
    textReadout = readouts.alignment.text_readout;
    if (value) {
        colorDiv.style.backgroundColor = 'green';
        textReadout.textContent = 'Aligned!'
    } else {
        colorDiv.style.backgroundColor = 'red';
        textReadout.textContent = 'Not Aligned';
    }
}
NetworkTables.addKeyListener('/SmartDashboard/' + readouts.alignment.variable_name, updateAlignmentReadout);
