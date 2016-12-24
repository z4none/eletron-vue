'use strict'

const config = require('../config')

const electron = require('electron');
const path = require('path');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
let url;

if (process.env.NODE_ENV === 'development') {
    url = `http://localhost:${config.port}`
} else {
    url = `file://${__dirname}/dist/index.html`
}

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800
    });

    mainWindow.loadURL(url);
    mainWindow.on('closed', () => {
        mainWindow = null
    });

    console.log('mainWindow opened')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})