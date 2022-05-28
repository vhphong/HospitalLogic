import { connection_pg } from "../connection-pg";
import { Message } from "../models/message";
import { MessageDAO } from "./message-dao";


export class MessageDAOImpl implements MessageDAO {

    async createMessage(message: Message): Promise<Message> {
        let dateTimeNowStr = new Date().toLocaleString('en-us');     // 2022-05-28 11:56:02
        const sqlStr: string = 'INSERT INTO messages(sender_email, recipient_email, m_content, sending_timestamp) VALUES ($1, $2, $3, $4) RETURNING m_id';
        const values = [message.senderEmail, message.recipientEmail, message.content, dateTimeNowStr];
        const result = await connection_pg.query(sqlStr, values);

        message.messageID = result.rows[0].m_id;

        return message;
    }


    async getAllMessages(): Promise<Message[]> {
        const sqlStr: string = 'SELECT * FROM messages ORDER BY m_id';
        const result = await connection_pg.query(sqlStr);

        const allMessages: Message[] = [];

        for (let eachRow of result.rows) {
            const eachMessage: Message = new Message(
                eachRow.m_id,
                eachRow.sender_email,
                eachRow.recipient_email,
                eachRow.m_content,
                eachRow.sending_timestamp
            );
            allMessages.push(eachMessage);
        }

        return allMessages;
    }


    async getAllMessagesOfSender(senderEmail: string): Promise<Message[]> {
        const sqlStr: string = 'SELECT * FROM messages WHERE sender_email = $1 ORDER BY m_id';
        const values = [senderEmail];
        const result = await connection_pg.query(sqlStr, values);

        const allMessages: Message[] = [];

        for (let eachRow of result.rows) {
            const eachMessage: Message = new Message(
                eachRow.m_id,
                eachRow.sender_email,
                eachRow.recipient_email,
                eachRow.m_content,
                eachRow.sending_timestamp
            );
            allMessages.push(eachMessage);
        }

        return allMessages;
    }


    async getAllMessagesOfRecipient(recipientEmail: string): Promise<Message[]> {
        const sqlStr: string = 'SELECT * FROM messages WHERE recipient_email = $1 ORDER BY m_id';
        const values = [recipientEmail];
        const result = await connection_pg.query(sqlStr, values);

        const allMessages: Message[] = [];

        for (let eachRow of result.rows) {
            const eachMessage: Message = new Message(
                eachRow.m_id,
                eachRow.sender_email,
                eachRow.recipient_email,
                eachRow.m_content,
                eachRow.sending_timestamp
            );
            allMessages.push(eachMessage);
        }

        return allMessages;
    }


    async getAllMessagesOfSenderRecipient(senderEmail: string, recipientEmail: string): Promise<Message[]> {
        const sqlStr: string = 'SELECT * FROM messages WHERE sender_email = $1 AND recipient_email = $2 ORDER BY m_id';
        const values = [senderEmail, recipientEmail];
        const result = await connection_pg.query(sqlStr, values);

        const allMessages: Message[] = [];

        for (let eachRow of result.rows) {
            const eachMessage: Message = new Message(
                eachRow.m_id,
                eachRow.sender_email,
                eachRow.recipient_email,
                eachRow.m_content,
                eachRow.sending_timestamp
            );
            allMessages.push(eachMessage);
        }

        return allMessages;
    }
}