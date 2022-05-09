import { connection_pg } from "../connection-pg";
import { Email } from "../models/email";
import { EmailDAO } from "./email-dao";


export class EmailDAOImpl implements EmailDAO {

    async createEmail(email: Email): Promise<Email> {
        const sqlStr: string = 'INSERT INTO email(sender_email, recipient_email, email_subject, email_content) VALUES ($1, $2, $3, $4) RETURNING email_id';
        const values = [email.senderEmail, email.recipientEmail, email.emailSubject, email.content];
        const result = await connection_pg.query(sqlStr, values);

        email.emailID = result.rows[0].email_id;

        return email;
    }

}