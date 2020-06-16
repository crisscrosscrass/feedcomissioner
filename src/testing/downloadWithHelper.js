const { DownloaderHelper } = require('node-downloader-helper');
const path = require('path');

url = 'https://docs.google.com/spreadsheets/d/16xXH9qj5dHhxAruxGFrnvANplpPhQC8CSS0R0NsNgGc/export?format=csv'
dest = "" + path.dirname(__dirname) + '\\feeds\\';
var task = null;
var dl = new DownloaderHelper(url, dest, {
    fileName: "sample.csv",
    override: true,
    httpRequestOptions: {
        timeout: 5 * 60 * 1000
    }
});
dl.on('stateChanged', (state) => console.log(state));
dl.on('start', () => console.log('*** Start event'));
//        dl.on('download', () => console.log('*** Download event'));
dl.on('pause', () => console.log('*** Pause event'));
dl.on('resume', () => console.log('*** Resume event'));
dl.on('stop', () => console.log('*** Stop event'));
dl.on('progress', (stats) => {
    var progress = Math.floor(stats.progress);
    console.log(`${progress}%`);
});
dl.on('end', () => {
    console.log('*** End event');
    task = null;
});
dl.on('error', (error) => {
    console.log('*** Error event', error);
    dl.stop();
    task = null;
});
dl.once('download', () => {
    dl.__request.connection.on('close', () => console.log('*** Request connection close'));
    dl.__request.connection.on('connect', () => console.log('*** Request connected again'));
    dl.__request.on('timeout', () => {
        console.log("Timeout Trigger");
        dl.__request.destroy();
    });
});

task = dl;
task.start();