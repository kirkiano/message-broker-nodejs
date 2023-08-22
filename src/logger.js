import {createLogger, format, transports} from 'winston';
const {/*label,*/ timestamp, combine, printf, prettyPrint, colorize} = format;


const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        // label({ label: 'right meow!' }),
        timestamp(),
        colorize(),
        prettyPrint(),
        // printf(({ level, message, label, timestamp }) => `${timestamp}[${label}] ${level}: ${message}`),
        printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`),
        /*printf(msg => `${JSON.stringify({timestamp: msg.timestamp,
                                            shortmessage: msg.message, 
                                            level: msg.level, 
                                            // source: config.programName, 
                                            // file: __filename,
                                            line: '' })}`)*/
    ),
    transports: [new transports.Console()]
});


export { logger }