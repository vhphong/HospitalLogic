import { connection_pg } from "../connection-pg";
import { Message } from "../models/message";
import { MessageDAO } from "./message-dao";


export class MessageDAOImpl implements MessageDAO {

    async createMessage(message: Message): Promise<Message> {
        const sqlStr: string = 'INSERT INTO messages(sender_email, recipient_email, m_content) VALUES ($1, $2, $3) RETURNING m_id';
        const values = [message.senderEmail, message.recipientEmail, message.content];

        // verify senderEmail and recipientEmail


        const result = await connection_pg.query(sqlStr, values);
        message.messageID = result.rows[0].m_id;

        return message;
    }

}