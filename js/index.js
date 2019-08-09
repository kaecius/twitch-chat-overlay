const {
    app,
    BrowserWindow
} = require('electron');
const windowStateKeeper = require('electron-window-state');

let mainWin;
let selector;


function init() {
    let mainWinState = windowStateKeeper({
        defaultWidth: 800,
        defaultHeight: 600
    });

    mainWin = new BrowserWindow({
        backgroundColor: '#40000000', // Black 25% transp
        width: mainWinState.width,
        height: mainWinState.height,
        x: mainWinState.x,
        y: mainWinState.y,
        resizable: false,
        autoHideMenuBar: true,
        transparent: true,
        alwaysOnTop: true,
        focusable: false,
        minimizable: false,
        maximizable: false,
        fullscreenable: false,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWin.setVisibleOnAllWorkspaces(true);
    mainWinState.manage(mainWin);

    mainWin.loadFile('view/index.html');

    mainWin.on('closed', () => {
        mainWin = null;
    });

    selector = new BrowserWindow({
        parent : mainWin,
        backgroundColor: '#FF4B0082', // Indigo 35% transp
        width : 400,
        height : 300,
        autoHideMenuBar : true,
        resizable : false,
        minimizable : false,
        maximizable : false,
        fullscreenable : false,
        transparent : true,
        webPreferences : {
            nodeIntegration : true
        }
    });
    selector.setVisibleOnAllWorkspaces(true);
    selector.loadFile('view/channel-selection.html');
    
    selector.on('closed', () => {
        selector = null;
        mainWin.close();
    });
    console.info("PATH-------------");
    console.info(app.getPath("userData"));
}


app.on('ready',() => {
    setTimeout(init, 300);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate',() => {
    if(mainWin === null){
        init();
    }
});