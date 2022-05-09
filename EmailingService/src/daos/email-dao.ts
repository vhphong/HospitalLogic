import { Email } from "../models/email";


export interface EmailDAO {

    // create a new message
    createEmail(email: Email): Promise<Email>;

}