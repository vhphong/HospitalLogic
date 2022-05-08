import express from "express";

import cors from 'cors';
import { connection_pg } from "./connection-pg";
import { Message } from "./models/message";
import MessageService from "./services/message-service";
import { MessageServiceImpl } from "./services/message-service-impl";
import { ResourceNotFoundException } from "./exceptions/ResourceNotFoundException";

const app = express();
app.use(express.json());
app.use(cors());


const messageService: MessageService = new MessageServiceImpl();


// create a new message
app.post('/messages/create', async (req, res) => {
    try {
        const messageBody = req.body;

        // verify senderEmail and recipientEmail
        const sqlStr1: string = 'SELECT * FROM employee WHERE u_email = $1';
        const values1 = [messageBody.senderEmail];
        const result1 = await connection_pg.query(sqlStr1, values1);

        const sqlStr2: string = 'SELECT * FROM employee WHERE u_email = $1';
        const values2 = [messageBody.recipientEmail];
        const result2 = await connection_pg.query(sqlStr2, values2);

        let senderEmailVerification: Boolean = false;
        let recipientEmailVerification: Boolean = false;

        if (result1.rowCount > 0) {
            senderEmailVerification = true;
        }

        if (result2.rowCount > 0) {
            recipientEmailVerification = true;
        }

        if (!recipientEmailVerification) {
            res.status(405).send('The recipient email does not exist.')
        } else {
            let newMessage: Message = await messageService.composeMessage(messageBody);
            res.status(200).send(newMessage);
        }
    } catch (error) {
        res.status(400).send(error);
    }
});


// get all messages
app.get('/messages', async (req, res) => {
    try {
        const allMessages: Message[] = await messageService.retrieveAllMessages();
        res.status(200).send(allMessages);
    } catch (error) {
        if (error instanceof ResourceNotFoundException) {
            res.status(400).send(error);
        }
    }
});


// get all message of a sender
app.get('/messages/sender/:senderemail', async (req, res) => {
    try {
        const emailParam = req.params.senderemail;
        const allMessages: Message[] = await messageService.retrieveAllMessagesOfSender(emailParam);
        res.status(200).send(allMessages);
    } catch (error) {
        if (error instanceof ResourceNotFoundException) {
            res.status(400).send(error);
        }
    }
});


// get all message of a sender
app.get('/messages/recipient/:recipientemail', async (req, res) => {
    try {
        const emailParam = req.params.recipientemail;
        const allMessages: Message[] = await messageService.retrieveAllMessagesOfRecipient(emailParam);
        res.status(200).send(allMessages);
    } catch (error) {
        if (error instanceof ResourceNotFoundException) {
            res.status(400).send(error);
        }
    }
});


const PORT = process.env.PORT_messaging || 3002;
app.listen(
    PORT,
    () => console.log('Messaging Service server started on PORT ' + PORT)
);