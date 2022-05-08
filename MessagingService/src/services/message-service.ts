import { Message } from "../models/message";


export default interface MessageService {

    composeMessage(message: Message): Promise<Message>;

    retrieveAllMessages(): Promise<Message[]>;

    retrieveAllMessagesOfSender(senderEmail: any): Promise<Message[]>;

    retrieveAllMessagesOfRecipient(recipientEmail: any): Promise<Message[]>;

    retrieveAllMessagesOfSenderRecipient(senderEmail: any, recipientEmail: any): Promise<Message[]>;
}
