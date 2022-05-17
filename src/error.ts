export class MissingResourceError {
    message: string;
    description: string = "This error means a resource could not be found";

    constructor(message: string) {
        this.message = message;
    }
}