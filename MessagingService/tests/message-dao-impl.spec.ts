import { connection_pg } from "../src/connection-pg";
import { MessageDAO } from "../src/daos/message-dao";
import { MessageDAOImpl } from "../src/daos/message-dao-impl";
import { Message } from "../src/models/message";


const messageDAO: MessageDAO = new MessageDAOImpl();


// PASSED
test('Test: DAO createMessage', async () => {
    let sampleMessage: Message = new Message(0, 'sampleAccount1@email.com', 'sampleAccount2@email.com', 'Hi!');
    sampleMessage = await messageDAO.createMessage(sampleMessage);

    console.log(sampleMessage);

    expect(sampleMessage.messageID).not.toBe(0);
});


// PASSED
test('Test: DAO getAllMessages', async () => {
    let sampleMessage1: Message = new Message(0, 'sampleAccount1@email.com', 'sampleAccount2@email.com', 'Hi!');
    let sampleMessage2: Message = new Message(0, 'sampleAccount1@email.com', 'sampleAccount2@email.com', 'Hi!');
    let sampleMessage3: Message = new Message(0, 'sampleAccount1@email.com', 'sampleAccount2@email.com', 'Hi!');

    sampleMessage1 = await messageDAO.createMessage(sampleMessage1);
    sampleMessage2 = await messageDAO.createMessage(sampleMessage2);
    sampleMessage3 = await messageDAO.createMessage(sampleMessage3);

    const allMessages: Message[] = await messageDAO.getAllMessages();

    expect(allMessages.length).toBeGreaterThanOrEqual(3);
});


// PASSED
test('Test: DAO getAllMessagesOfSender', async () => {
    let sampleMessage1: Message = new Message(0, 'sampleAccount1@email.com', 'sampleAccount2@email.com', 'Hi!');
    let sampleMessage2: Message = new Message(0, 'sampleAccount1@email.com', 'sampleAccount2@email.com', 'Hi!');
    let sampleMessage3: Message = new Message(0, 'sampleAccount1@email.com', 'sampleAccount2@email.com', 'Hi!');

    sampleMessage1 = await messageDAO.createMessage(sampleMessage1);
    sampleMessage2 = await messageDAO.createMessage(sampleMessage2);
    sampleMessage3 = await messageDAO.createMessage(sampleMessage3);

    const allMessages: Message[] = await messageDAO.getAllMessagesOfSender(sampleMessage1.senderEmail);

    expect(allMessages.length).toBeGreaterThanOrEqual(3);
});


// PASSED
test('Test: DAO getAllMessagesOfRecipient', async () => {
    let sampleMessage1: Message = new Message(0, 'sampleAccount1@email.com', 'sampleAccount2@email.com', 'Hi!');
    let sampleMessage2: Message = new Message(0, 'sampleAccount1@email.com', 'sampleAccount2@email.com', 'Hi!');
    let sampleMessage3: Message = new Message(0, 'sampleAccount1@email.com', 'sampleAccount2@email.com', 'Hi!');

    sampleMessage1 = await messageDAO.createMessage(sampleMessage1);
    sampleMessage2 = await messageDAO.createMessage(sampleMessage2);
    sampleMessage3 = await messageDAO.createMessage(sampleMessage3);

    const allMessages: Message[] = await messageDAO.getAllMessagesOfRecipient(sampleMessage1.recipientEmail);

    expect(allMessages.length).toBeGreaterThanOrEqual(3);
});


// PASSED
test('Test: getAllMessagesOfSenderRecipient', async () => {
    let sampleMessage1: Message = new Message(0, 'sampleAccount1@email.com', 'sampleAccount2@email.com', 'Hi!');
    let sampleMessage2: Message = new Message(0, 'sampleAccount1@email.com', 'sampleAccount2@email.com', 'Hi!');
    let sampleMessage3: Message = new Message(0, 'sampleAccount1@email.com', 'sampleAccount2@email.com', 'Hi!');

    sampleMessage1 = await messageDAO.createMessage(sampleMessage1);
    sampleMessage2 = await messageDAO.createMessage(sampleMessage2);
    sampleMessage3 = await messageDAO.createMessage(sampleMessage3);

    const allMessages: Message[] = await messageDAO.getAllMessagesOfSenderRecipient(sampleMessage1.senderEmail, sampleMessage1.recipientEmail);

    expect(allMessages.length).toBeGreaterThanOrEqual(3);
});


afterAll(async () => {
    connection_pg.end();
});