const {app, screen, BrowserWindow} = require('electron')

function createWindow () {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 960,
		height: 440, 
		transparent: true,
		frame:false
	})

	let displays = screen.getAllDisplays();
	if (displays.length >= 2){
		let x = displays[0].bounds.width + displays[1].bounds.width/2 - mainWindow.getSize()[0]/2;
		let y = displays[1].bounds.height/2 - mainWindow.getSize()[1]/2;
		mainWindow.setPosition(x, y);
	}
	
	mainWindow.setAlwaysOnTop(true, "screen-saver");

	// and load the index.html of the app.
	mainWindow.loadURL(`http://localhost:4218`)

	// Open the DevTools.
	//mainWindow.webContents.openDevTools()

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null
	})
	
	return mainWindow
}

function visualizeWindow(){
	let win = createWindow()
	win.show()
}

app.whenReady().then(visualizeWindow)