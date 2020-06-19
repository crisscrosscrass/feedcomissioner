const log4js = require("log4js");

log4js.addLayout('json', function(config) {
    return function(logEvent) { return JSON.stringify(logEvent) + config.separator; }
});

log4js.configure({
    appenders: {
        console: {
            type: "console",
            layout: {
                type: 'pattern',
                pattern: '%d{yyyy/MM/dd-hh:mm:ss} %[%f{depth}:%l:%o%] %[%n%p%] %m',
                tokens: {
                    message: (logEvent) => { logEvent }
                }
            }
        },
        file: {
            type: "file",
            layout: {
                type: 'pattern',
                pattern: '%d{yyyy/MM/dd-hh:mm:ss}|%f{depth}:%l:%o|%p|%m',
                tokens: {
                    message: (logEvent) => { logEvent }
                }
            },
            filename: "ressources/data/file.log",
            maxLogSize: 10485760,
            backups: 3,
        }
    },
    categories: { default: { appenders: ["console", "file"], level: "debug", enableCallStack: true } }
});

const logger = log4js.getLogger("file");

module.exports = logger;

//old settings
// log4js.configure({
//     appenders: {
//         console: {
//             type: "console",
//             layout: {
//                 type: 'pattern',
//                 pattern: '%d{yyyy/MM/dd-hh:mm:ss} %[%f{depth}:%l:%o%] %[%n%p%] %m',
//                 tokens: {
//                     message: (logEvent) => { logEvent }
//                 }
//             }
//         },
//         file: { type: "file", layout: { type: 'json', separator: ',' }, filename: "ressources/data/log.json", maxLogSize: 10485760, backups: 3, }
//     },
//     categories: { default: { appenders: ["console", "file"], level: "debug", enableCallStack: true } }
// });