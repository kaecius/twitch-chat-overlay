const {
    app,
    BrowserWindow,
    Tray,
    Menu,
    nativeImage
} = require('electron');
const path = require('path');
//const properties = require('js/properties');
const windowStateKeeper = require('electron-window-state');

let mainWin;
let selector;
let tray;

function init() {
    initMainWindow();
    initSelectorModal();
    initTray();
    //console.info(app.getPath("userData"));
}

function initMainWindow() {
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

}

function initSelectorModal() {
    selector = new BrowserWindow({
        parent: mainWin,
        backgroundColor: '#BF4B0082', // Indigo 35% transp
        icon : 'resources/twitch.ico',
        width: 400,
        height: 300,
        autoHideMenuBar: true,
        resizable: false,
        minimizable: false,
        maximizable: false,
        fullscreenable: false,
        transparent: true,
        movable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    selector.setVisibleOnAllWorkspaces(true);
    selector.loadFile('view/channel-selection.html');

    selector.on('closed', () => {
        selector = null;
        mainWin.close();
    });
}

function initTray(){
    console.log(__dirname);
    tray = new Tray(nativeImage.createFromPath(path.join(__dirname,'../resources/twitch.ico')));
    tray.setToolTip('Twitch chat overlay');
    let contextMenu = Menu.buildFromTemplate([
        { label : 'Close', click : function(){
            app.quit();
        }}
    ])
    tray.setContextMenu(contextMenu);
}

app.on('ready', () => {
    setTimeout(init, 300);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWin === null) {
        init();
    }
});