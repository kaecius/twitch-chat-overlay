const {
    app,
    BrowserWindow,
    Tray,
    Menu,
    nativeImage,
    ipcMain
} = require('electron');
const path = require('path');
const properties = require('./properties.js');
const windowStateKeeper = require('electron-window-state');

var mainWin;
var settingsWindow;
let selector;
let tray;

function init() {
    initMainWindow();
    //new properties.UserSettingsStore();
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
        show : true,
        resizable: true,
        autoHideMenuBar: true,
        transparent: true,
        alwaysOnTop: true,
        focusable: true,
        minimizable: false,
        maximizable: false,
        fullscreenable: false,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWin.setVisibleOnAllWorkspaces(true);
    mainWin.webContents.openDevTools();
    mainWinState.manage(mainWin);

    mainWin.loadFile('view/index.html');

    mainWin.on('closed', () => {
        mainWin = null;
    });
    
    initTray();
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
    if (mainWin === null && selector ===null) {
        initMainWindow();
    }
});

ipcMain.on('lock',(event) => {
    mainWin.setResizable(false);
});

ipcMain.on('unlock',(event) => {
    mainWin.setResizable(true);
});

ipcMain.on('config',(event,show) => {
    if(show){
        settingsWindow =  new BrowserWindow({
            parent : mainWin,
            modal: false,
            width: 320,
            height:340,
            frame:false,
            //resizable : false,
            //maximizable : false,
            //minimizable : false,
            alwaysOnTop:true,
            webPreferences:{
                nodeIntegration:true
            }
        });
        settingsWindow.loadFile('./view/config.html');
        settingsWindow.once('ready-to-show', () => {
            settingsWindow.show()
        })
    }else{
        if(settingsWindow != null){
            console.info("cerrando");
            settingsWindow.close();
            settingsWindow = null;
        }
    }
});