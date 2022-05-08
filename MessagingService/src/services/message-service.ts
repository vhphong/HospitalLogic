import { Message } from "../models/message";


export default interface MessageService {

    composeMessage(message: Message): Promise<Message>;

    retrieveAllMessages():Promise<Message[]>;
}
