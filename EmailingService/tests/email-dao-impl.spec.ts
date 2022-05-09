import { connection_pg } from "../src/connection-pg";
import { EmailDAO } from "../src/daos/email-dao";
import { EmailDAOImpl } from "../src/daos/email-dao-impl";
import { Email } from "../src/models/email";


const emailDAO: EmailDAO = new EmailDAOImpl();


// PASSED
test('Test: DAO createEmail', async () => {
    let sampleEmail: Email = new Email(0, 'sampleAccount1@email.com', 'sampleAccount2@email.com', 'subject 1', 'Hi!');
    sampleEmail = await emailDAO.createEmail(sampleEmail);

    expect(sampleEmail.emailID).not.toBe(0);
});


// PASSED
test('Test: DAO getAllEmails', async () => {
    let sampleEmail1: Email = new Email(0, 'sampleAccount1@email.com', 'sampleAccount2@email.com', 'subject 1', 'Hi!');
    let sampleEmail2: Email = new Email(0, 'sampleAccount1@email.com', 'sampleAccount2@email.com', 'subject 1', 'Hi!');
    let sampleEmail3: Email = new Email(0, 'sampleAccount1@email.com', 'sampleAccount2@email.com', 'subject 1', 'Hi!');

    sampleEmail1 = await emailDAO.createEmail(sampleEmail1);
    sampleEmail2 = await emailDAO.createEmail(sampleEmail2);
    sampleEmail3 = await emailDAO.createEmail(sampleEmail3);

    const allEmails: Email[] = await emailDAO.getAllEmails();

    expect(allEmails.length).toBeGreaterThanOrEqual(3);
});


// PASSED
test('Test: DAO getAllEmailsOfSender', async () => {
    let sampleEmail1: Email = new Email(0, 'sampleAccount1@email.com', 'sampleAccount2@email.com', 'subject 1', 'Hi!');
    let sampleEmail2: Email = new Email(0, 'sampleAccount1@email.com', 'sampleAccount2@email.com', 'subject 1', 'Hi!');
    let sampleEmail3: Email = new Email(0, 'sampleAccount1@email.com', 'sampleAccount2@email.com', 'subject 1', 'Hi!');

    sampleEmail1 = await emailDAO.createEmail(sampleEmail1);
    sampleEmail2 = await emailDAO.createEmail(sampleEmail2);
    sampleEmail3 = await emailDAO.createEmail(sampleEmail3);

    const allEmails: Email[] = await emailDAO.getAllEmailsOfSender(sampleEmail1.senderEmail);

    expect(allEmails.length).toBeGreaterThanOrEqual(3);
});


afterAll(async () => {
    connection_pg.end();
});