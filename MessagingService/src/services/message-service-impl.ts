import { Message } from "../models/message";

import { MessageDAO } from "../daos/message-dao";
import { MessageDAOImpl } from "../daos/message-dao-impl";

import MessageService from "./message-service";


export class MessageServiceImpl implements MessageService {

    messageDAO: MessageDAO = new MessageDAOImpl();


    composeMessage(message: Message): Promise<Message> {
        return this.messageDAO.createMessage(message);
    }


    retrieveAllMessages(): Promise<Message[]> {
        return this.messageDAO.getAllMessages();
    }


    retrieveAllMessagesOfSender(senderEmail: any): Promise<Message[]> {
        return this.messageDAO.getAllMessagesOfSender(senderEmail);
    }


    retrieveAllMessagesOfRecipient(recipientEmail: any): Promise<Message[]> {
        return this.messageDAO.getAllMessagesOfRecipient(recipientEmail);
    }


    retrieveAllMessagesOfSenderRecipient(senderEmail: any, recipientEmail: any): Promise<Message[]> {
        return this.messageDAO.getAllMessagesOfSenderRecipient(senderEmail, recipientEmail);
    }
}