import { connection_pg } from "../src/connection-pg";
import { EmailDAO } from "../src/daos/email-dao";
import { EmailDAOImpl } from "../src/daos/email-dao-impl";
import { Email } from "../src/models/email";


const emailDAO: EmailDAO = new EmailDAOImpl();


// PASSED
test('Test: DAO createMessage', async () => {
    let sampleEmail: Email = new Email(0, 'sampleAccount1@email.com', 'sampleAccount2@email.com', 'subject 1', 'Hi!');
    sampleEmail = await emailDAO.createEmail(sampleEmail);

    expect(sampleEmail.emailID).not.toBe(0);
});


afterAll(async () => {
    connection_pg.end();
});