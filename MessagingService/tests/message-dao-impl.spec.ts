import { connection_pg } from "../src/connection-pg";
import { MessageDAO } from "../src/daos/message-dao";
import { MessageDAOImpl } from "../src/daos/message-dao-impl";
import { Message } from "../src/models/message";


const messageDAO: MessageDAO = new MessageDAOImpl();


//
test('Test: DAO createMessage', async () => {
    let sampleMessage: Message = new Message(0, 'sampleAccount1@email.com', 'sampleAccount2@email.com', 'Hi!');;
    sampleMessage = await messageDAO.createMessage(sampleMessage);

    console.log(sampleMessage);

    expect(sampleMessage.messageID).not.toBe(0);
});


afterAll(async () => {
    connection_pg.end();
});