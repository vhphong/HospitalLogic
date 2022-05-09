import express from "express";

import cors from 'cors';
import { Email } from "./models/email";
import EmailService from "./services/email-service";
import { EmailServiceImpl } from "./services/email-service-impl";
import { connection_pg } from "./connection-pg";
import { ResourceNotFoundException } from "./exceptions/ResourceNotFoundException";


const app = express();
app.use(express.json());
app.use(cors());


const emailService: EmailService = new EmailServiceImpl();


// create a new email
app.post('/emails/create', async (req, res) => {
    try {
        const emailBody = req.body;

        // verify senderEmail and recipientEmail
        const sqlStr1: string = 'SELECT * FROM employee WHERE u_email = $1';
        const values1 = [emailBody.senderEmail];
        const result1 = await connection_pg.query(sqlStr1, values1);

        const sqlStr2: string = 'SELECT * FROM employee WHERE u_email = $1';
        const values2 = [emailBody.recipientEmail];
        const result2 = await connection_pg.query(sqlStr2, values2);

        let senderEmailVerification: Boolean = (result1.rowCount > 0) ? true : false;
        let recipientEmailVerification: Boolean = (result2.rowCount > 0) ? true : false;

        if (!recipientEmailVerification) {
            res.status(405).send('The recipient email does not exist.')
        } else {
            let newEmail: Email = await emailService.composeEmail(emailBody);
            res.status(200).send(newEmail);
        }
    } catch (error) {
        res.status(400).send(error);
    }
});


app.get('/emails', async (req, res) => {
    if (req.query.senderemail) {
        // if emails of sender were asked for
        // GET /emails?senderemail=anyemail
        try {
            const senderEmailQuery = req.query.senderemail;
            const allEmails: Email[] = await emailService.retrieveAllEmailsOfSender(senderEmailQuery);

            res.status(200).send(allEmails);
        } catch (error) {
            if (error instanceof ResourceNotFoundException) {
                res.status(400).send(error);
            }
        }
    } else if (req.query.recipientemail) {
        // if emails of recipient were asked for
        // GET /emails?recipientemail=anyemail
        try {
            const recipientEmailQuery = req.query.recipientemail;
            const allEmails: Email[] = await emailService.retrieveAllEmailsOfRecipient(recipientEmailQuery);

            res.status(200).send(allEmails);
        } catch (error) {
            if (error instanceof ResourceNotFoundException) {
                res.status(400).send(error);
            }
        }
    } else if (req.query.senderemail && req.query.recipient) {
        // if emails of sender and recipient were asked for
        // GET /emails?senderemail=anyemail&recipientemail=anyemail
        try {
            const senderEmailQuery = req.query.senderemail;
            const recipientEmailQuery = req.query.recipientemail;
            // const allEmails: Email[] = await emailService.retrieveAllEmailsOfSenderRecipient(senderEmailQuery, recipientEmailQuery);

            // res.status(200).send(allEmails);
        } catch (error) {
            if (error instanceof ResourceNotFoundException) {
                res.status(400).send(error);
            }
        }
    } else {
        // if neither emails of sender nor recipient were asked for, then get all emails
        // GET /emails
        try {
            const allEmails: Email[] = await emailService.retrieveAllEmails();

            res.status(200).send(allEmails);
        } catch (error) {
            if (error instanceof ResourceNotFoundException) {
                res.status(400).send(error);
            }
        }
    }
});


const PORT = process.env.PORT_emailing || 3003;
app.listen(
    PORT,
    () => console.log('Emailing Service server started on PORT ' + PORT)
);