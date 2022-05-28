import { Email } from "../models/email";


export interface EmailDAO {

    // create a new email
    insertEmailToSql(email: Email): Promise<Email>;


    // create a new email by using SendGrid
    writeEmail(emailManifest: Email): Promise<Boolean>;


    // get all emails
    getAllEmails(): Promise<Email[]>;


    // get all emails of a sender
    getAllEmailsOfSender(senderEmail: string): Promise<Email[]>;


    // get all emails of a recipient
    getAllEmailsOfRecipient(recipientEmail: string): Promise<Email[]>;


    // get all emails of a pair of sender and recipient
    getAllEmailsOfSenderRecipient(senderEmail: string, recipientEmail: string): Promise<Email[]>;
}