const {
    app,
    BrowserWindow
} = require('electron');
const windowStateKeeper = require('electron-window-state');

let mainWin;
//console.info(app.getPath("userData"));


function init() {
    let mainWinState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 600
    });

    mainWin = new BrowserWindow({
        backgroundColor: '40000000', // Black 25% transp
        width: mainWinState.width,
        height: mainWinState.height,
        x: mainWinState.x,
        y: mainWinState.y,
        resizable: false,
        autoHideMenuBar: true,
        transparent: true,
        maximizable: false,
        alwaysOnTop: true,
        focusable: false,
        minimizable: false,
        maximizable: false,
        resizable: false,
        fullscreenable: false,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWin.setVisibleOnAllWorkspaces(true);
    mainWinState.manage(mainWin);

    mainWin.on('close', () => {
        mainWin = null;
    });


    mainWin.loadFile('view/index.html');

}


app.on('ready',() => {
    init();
});

