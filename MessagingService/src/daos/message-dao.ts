import { Message } from "../models/message";


export interface MessageDAO {

    // create a new message
    createMessage(message: Message): Promise<Message>;


    // get all messages
    getAllMessages(): Promise<Message[]>;


    // get all messages of a sender
    getAllMessagesOfSender(senderEmail: string): Promise<Message[]>;


    // get all messages of a recipient
    getAllMessagesOfRecipient(recipientEmail: string): Promise<Message[]>;
}