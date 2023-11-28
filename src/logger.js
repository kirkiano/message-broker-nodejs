
/**
 * @module logger
 */

import {createLogger, format, transports} from 'winston';
const {timestamp, combine, printf, prettyPrint, colorize} = format;


/**
 * The logger
 */
const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        timestamp(),
        colorize(),
        prettyPrint(),
        printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`),
    ),
    transports: [new transports.Console()]
});


export { logger }