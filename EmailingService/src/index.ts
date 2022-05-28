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


// save a copy of an email into the sql database
app.post('/email/create', async (req, res) => {
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

        if (!senderEmailVerification && !recipientEmailVerification) {
            res.status(404).send('Both sender and recipient emails do not exist.');
        } else if (!recipientEmailVerification) {
            res.status(404).send('The recipient email does not exist.');
        } else if (!senderEmailVerification) {
            res.status(404).send('The sender email does not exist.');
        } else {
            let newEmail: Email = await emailService.createEmailToSql(emailBody);
            res.status(201).send(newEmail);
        }
    } catch (error) {
        res.status(400).send(error);
    }
});


// send a new email by using Sendgrid
app.post('/email/send', async (req, res) => {
    try {
        const emailBody = req.body;

        // verify senderEmail and recipientEmail
        const sqlStr1: string = 'SELECT * FROM employee WHERE u_email = $1';
        const values1 = [emailBody.senderEmail];
        const result1 = await connection_pg.query(sqlStr1, values1);

        const sqlStr2: string = 'SELECT * FROM employee WHERE u_email = $1';
        const values2 = [emailBody.recipientEmail];
        const result2 = await connection_pg.query(sqlStr2, values2);

        // verification of emails is optional if sending external email
        let senderEmailVerification: Boolean = (result1.rowCount > 0) ? true : false;
        let recipientEmailVerification: Boolean = (result2.rowCount > 0) ? true : false;

        const sendEMailResult: Boolean = await emailService.sendEmailUsingSendgrid(emailBody);

        if (sendEMailResult == true) {
            res.status(200).send(true);
        } else {
            res.status(400).send(false);
        }
    } catch (error) {
        res.status(400).send(error);
    }
});


app.get('/email', async (req, res) => {
    if (req.query.senderemail) {
        // if email of sender were asked for
        // GET /email?senderemail=anyemail
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
        // if email of recipient were asked for
        // GET /email?recipientemail=anyemail
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
        // GET /email?senderemail=anyemail&recipientemail=anyemail
        try {
            const senderEmailQuery = req.query.senderemail;
            const recipientEmailQuery = req.query.recipientemail;
            const allEmails: Email[] = await emailService.retrieveAllEmailsOfSenderRecipient(senderEmailQuery, recipientEmailQuery);

            res.status(200).send(allEmails);
        } catch (error) {
            if (error instanceof ResourceNotFoundException) {
                res.status(400).send(error);
            }
        }
    } else {
        // if neither emails of sender nor recipient were asked for, then get all emails
        // GET /email
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