import { EmailDAO } from "../daos/email-dao";
import { EmailDAOImpl } from "../daos/email-dao-impl";
import { Email } from "../models/email";
import EmailService from "./email-service";


export class EmailServiceImpl implements EmailService {

    emailDAO: EmailDAO = new EmailDAOImpl();

    composeEmail(email: Email): Promise<Email> {
        return this.emailDAO.createEmail(email);
    }


    retrieveAllEmails(): Promise<Email[]> {
        return this.emailDAO.getAllEmails();
    }


    retrieveAllEmailsOfSender(senderEmail: any): Promise<Email[]> {
        return this.emailDAO.getAllEmailsOfSender(senderEmail);
    }


    retrieveAllEmailsOfRecipient(recipientEmail: any): Promise<Email[]> {
        return this.emailDAO.getAllEmailsOfRecipient(recipientEmail);
    }


    retrieveAllEmailsOfSenderRecipient(senderEmail: any, recipientEmail: any): Promise<Email[]> {
        return this.emailDAO.getAllEmailsOfSenderRecipient(senderEmail, recipientEmail);
    }
}