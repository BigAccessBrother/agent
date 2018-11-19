const { app, BrowserWindow } = require('electron')

let win;

const createWindow = () => {
    win = new BrowserWindow({ 
        width: 800,
        height: 600
    });

    win.loadFile('index.html');

    win.on('closed', () => {
        win = null;
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    // quit when all windows are closed except for macOS
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', () => {
    // re-create window (again for macOS)
    if (win === null) {
        createWindow();
    }
})