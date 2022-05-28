import { EmailDAO } from "../daos/email-dao";
import { EmailDAOImpl } from "../daos/email-dao-impl";
import { Email } from "../models/email";
import EmailService from "./email-service";


export class EmailServiceImpl implements EmailService {

    emailDAO: EmailDAO = new EmailDAOImpl();

    createEmailToSql(email: Email): Promise<Email> {
        return this.emailDAO.insertEmailToSql(email);
    }


    sendEmailUsingSendgrid(emailManifest: Email): Promise<Boolean> {
        return this.emailDAO.writeEmail(emailManifest);
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