import { logger } from "react-native-logs";

const log = logger.createLogger();

abstract class LoggableError extends Error {
    /**
     * this is a base class for all erors and logs the messages
     */
    constructor(msg: string) {
        super(msg);
        log.error(msg);
        
    }
}

export class AuthError extends LoggableError {
    constructor(msg: string) {
        super(msg);

    }
}
