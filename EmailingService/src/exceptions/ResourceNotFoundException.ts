export class ResourceNotFoundException {
    message: string;
    description: string = "Resource could not be found";

    constructor(message: string) {
        this.message = message;
    }
}