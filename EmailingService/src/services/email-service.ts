import { Email } from "../models/email";


export default interface EmailService {

    composeEmail(email: Email): Promise<Email>;

    retrieveAllEmails(): Promise<Email[]>;

    retrieveAllEmailsOfSender(senderEmail: any): Promise<Email[]>;

    retrieveAllEmailsOfRecipient(recipientEmail: any): Promise<Email[]>;

    retrieveAllEmailsOfSenderRecipient(senderEmail: any, recipientEmail: any): Promise<Email[]>;
}