import { Message } from "../models/message";


export default interface MessageService {

    composeMessage(message: Message): Promise<Message>;

    retrieveAllMessages(): Promise<Message[]>;

    retrieveAllMessagesOfSender(senderEmail: string): Promise<Message[]>;

    retrieveAllMessagesOfRecipient(recipientEmail: string): Promise<Message[]>;

    retrieveAllMessagesOfSenderRecipient(senderEmail: string, recipientEmail: string): Promise<Message[]>;
}
