import { connection_pg } from "../connection-pg";
import { Email } from "../models/email";
import { EmailDAO } from "./email-dao";
import sg from '@sendgrid/mail';

require('dotenv').config({ path: 'app.env' });

sg.setApiKey(process.env.SENDGRID_FULL_ACCESS_API_KEY);

export class EmailDAOImpl implements EmailDAO {

    async createEmail(email: Email): Promise<Email> {
        const sqlStr: string = 'INSERT INTO email(sender_email, recipient_email, email_subject, email_content) VALUES ($1, $2, $3, $4) RETURNING email_id';
        const values = [email.senderEmail, email.recipientEmail, email.emailSubject, email.content];
        const result = await connection_pg.query(sqlStr, values);

        email.emailID = result.rows[0].email_id;

        return email;
    }


    /**
     * emailManifest {
        to: recipientData,
        from: senderData,
        subject: subjectData,
        text: textData,
        html: `<h2>${textData}</h2>`,
     * }
     */
    /**
     *  {
            "recipientEmail": "vh...@gmail.com",
            "emailSubject": "greeting",
            "content": "Hello vh..., sent by Sendgrid at 9:55 PM 05/10/2022"
        }
     */
    async writeEmail(emailManifest: Email): Promise<Boolean> {
        let retValue: Boolean;

        const recipientData = emailManifest.recipientEmail;

        const senderData = {
            name: 'Phong Vo 02',                            // name of the sender
            email: process.env.VERIFIED_SENDER_EMAIL        // sender email verified by Sendgrid.com
        }

        const subjectData = emailManifest.emailSubject;

        const textData = emailManifest.content;

        const message = {
            to: recipientData,
            from: senderData,
            subject: subjectData,
            text: textData,
            html: `<h2>${textData}</h2>`
        };

        sg
            .send(message)
            .then((resp) => {
                console.log(`Email sent successfully to ${message.to}! \n`, resp);
                retValue = true;
            })
            .catch((error) => {
                console.error('error: ' + error);
                retValue = false;
            });

        return retValue;
    }


    async getAllEmails(): Promise<Email[]> {
        const sqlStr: string = 'SELECT * FROM email ORDER BY email_id';
        const result = await connection_pg.query(sqlStr);

        const allEmails: Email[] = [];

        for (let eachRow of result.rows) {
            const eachEmail: Email = new Email(
                eachRow.email_id,
                eachRow.sender_email,
                eachRow.recipient_email,
                eachRow.email_subject,
                eachRow.email_content
            );
            allEmails.push(eachEmail);
        }

        return allEmails;
    }


    async getAllEmailsOfSender(senderEmail: string): Promise<Email[]> {
        const sqlStr: string = 'SELECT * FROM email WHERE sender_email = $1 ORDER BY email_id';
        const values = [senderEmail];
        const result = await connection_pg.query(sqlStr, values);

        const allEmails: Email[] = [];

        for (let eachRow of result.rows) {
            const eachEmail: Email = new Email(
                eachRow.email_id,
                eachRow.sender_email,
                eachRow.recipient_email,
                eachRow.email_subject,
                eachRow.email_content
            );
            allEmails.push(eachEmail);
        }

        return allEmails;
    }


    async getAllEmailsOfRecipient(recipientEmail: string): Promise<Email[]> {
        const sqlStr: string = 'SELECT * FROM email WHERE recipient_email = $1 ORDER BY email_id';
        const values = [recipientEmail];
        const result = await connection_pg.query(sqlStr, values);

        const allEmails: Email[] = [];

        for (let eachRow of result.rows) {
            const eachEmail: Email = new Email(
                eachRow.email_id,
                eachRow.sender_email,
                eachRow.recipient_email,
                eachRow.email_subject,
                eachRow.email_content
            );
            allEmails.push(eachEmail);
        }

        return allEmails;
    }


    async getAllEmailsOfSenderRecipient(senderEmail: string, recipientEmail: string): Promise<Email[]> {
        const sqlStr: string = 'SELECT * FROM email WHERE sender_email = $1 AND recipient_email = $2 ORDER BY email_id';
        const values = [senderEmail, recipientEmail];
        const result = await connection_pg.query(sqlStr, values);

        const allEmails: Email[] = [];

        for (let eachRow of result.rows) {
            const eachEmail: Email = new Email(
                eachRow.email_id,
                eachRow.sender_email,
                eachRow.recipient_email,
                eachRow.email_subject,
                eachRow.email_content
            );
            allEmails.push(eachEmail);
        }

        return allEmails;
    }
}