import { Email } from "../models/email";


export interface EmailDAO {

    // create a new email
    createEmail(email: Email): Promise<Email>;


    // get all emails
    getAllEmails(): Promise<Email[]>;

}