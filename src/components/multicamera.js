// Set a global alias for the camera and related elements.
ui.camera = {
	viewer: document.getElementById('camera'),
	image: document.getElementById('camera_image'),
	id: 0,
	srcs: [ // Will default to first camera
		"10.51.60.2:1181/?action=stream",
		"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/EE_logo.svg/1200px-EE_logo.svg.png"
    ]
};



   
// Unlike most addons, this addon doesn't interact with NetworkTables. Therefore, we won't need to add any NT listeners.

// When camera is clicked on, change to the next source.
ui.camera.image.onclick = function() {
	ui.camera.id++;
	if (ui.camera.id >= ui.camera.srcs.length) {ui.camera.id = 0};
	ui.camera.image.src = ui.camera.srcs[ui.camera.id];
};

