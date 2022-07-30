import { Alert } from "react-native";

abstract class LoggableError extends Error {
    /**
     * this is a base class for all erors and logs the messages
     */
    constructor(msg: string) {
        super(msg);
        
        //TODO log this error
    }
}

export class AuthError extends LoggableError {
    constructor(msg: string) {
        super(msg);

        // log this error
    }
}
