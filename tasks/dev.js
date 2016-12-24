'use strict'

const config = require('../config')
const exec = require('child_process').exec
const treeKill = require('tree-kill')

let YELLOW = '\x1b[33m'
let GREEN = '\x1b[32m'
let BLUE = '\x1b[34m'
let END = '\x1b[0m'
let CYAN = '\x1b[96m'

function printLog(message, tag) {
    if(tag) {
        console.log(tag + "  " + message);
    }
    else {
        console.log(message);
    }
}

let provcesses = [];
let processWebpack =null,
    processElectron = null;

function runDevServer() {
    processWebpack = exec(`webpack-dev-server --inline --hot --colors --port ${config.port} --content-base ./dist`);

    processWebpack.stdout.on('data', data => {
        printLog(data);

        if(/VALID/g.test(data.toString().trim()) && processElectron == null) {
            console.log(`${CYAN}Starting electron...\n${END}`);
            runElectorn();
        }
    });

    processWebpack.stderr.on('data', data => console.error(data));
    processWebpack.on('exit', code => exit(code));

    provcesses.push(processWebpack);
}

function runElectorn() {
    processElectron = exec(`cross-env NODE_ENV=development electron ./tasks/electron.js`);

    processElectron.stdout.on('data', data => {
        printLog(data);
    });

    processElectron.stderr.on('data', data => console.error(data));
    processElectron.on('exit', code => exit(code));

    provcesses.push(processElectron);
}

function exit (code) {
    provcesses.forEach(process => {
        treeKill(process.pid)
    });
}

//  cross-env NODE_ENV=development webpack-dev-server --open --inline --hot
console.log(`${CYAN}Starting webpack-dev-server(${config.port})...\n${END}`)
runDevServer()