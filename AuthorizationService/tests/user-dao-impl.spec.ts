import { connection_pg } from "../src/connection-pg";
import { AccountDAO } from "../src/daos/account-dao";
import { AccountDAOImpl } from "../src/daos/account-dao-impl";
import { Account } from "../src/models/employee";


const accountDAO: AccountDAO = new AccountDAOImpl();


// PASSED
test('Test: DAO createAccount', async () => {
    let sampleAccount1: Account = new Account(0, 'sampleAccount1@email.com', 'pw1', false);
    sampleAccount1 = await accountDAO.createAccount(sampleAccount1);

    console.log(sampleAccount1);

    expect(sampleAccount1.accountID).not.toBe(0);
});


// PASSED
test('Test: DAO getAllAccounts', async () => {
    let sampleAccount1: Account = new Account(0, 'sampleAccount1@email.com', 'pw1', false);
    let sampleAccount2: Account = new Account(0, 'sampleAccount2@email.com', 'pw2', false);
    let sampleAccount3: Account = new Account(0, 'sampleAccount3@email.com', 'pw3', false);

    sampleAccount1 = await accountDAO.createAccount(sampleAccount1);
    sampleAccount2 = await accountDAO.createAccount(sampleAccount2);
    sampleAccount3 = await accountDAO.createAccount(sampleAccount3);

    const allAccounts: Account[] = await accountDAO.getAllAccounts();

    expect(allAccounts.length).toBeGreaterThanOrEqual(3);
});


// PASSED
test('Test: getAccountByEmail', async () => {
    let sampleAccount1: Account = new Account(0, 'sampleAccount1@email.com', 'pw1', false);

    sampleAccount1 = await accountDAO.createAccount(sampleAccount1);

    const retrievedAccount: Account = await accountDAO.getAccountByEmail(sampleAccount1.email);

    expect(retrievedAccount.email).toBe(sampleAccount1.email);
});


// PASSED
test('Test: verifyAccount', async () => {
    let sampleAccount1: Account = new Account(0, 'sampleAccount1@email.com', 'pw1', false);

    sampleAccount1 = await accountDAO.createAccount(sampleAccount1);

    const accountVerification: Boolean = await accountDAO.isAccountExisted(sampleAccount1);

    expect(accountVerification).toBeTruthy;
});


// PASSED
test('Test: checkIfEmailAvailable', async () => {
    let sampleAccount1: Account = new Account(0, 'sampleAccount1@email.com', 'pw1', false);

    sampleAccount1 = await accountDAO.createAccount(sampleAccount1);

    const accountAvailibility: Boolean = await accountDAO.checkIfEmailAvailable(sampleAccount1.email);

    expect(accountAvailibility).toBeFalsy;
});


// PASSED
test('Test: activateAccount', async () => {
    let sampleAccount1: Account = new Account(0, 'sampleAccount1@email.com', 'pw1', false);

    sampleAccount1 = await accountDAO.createAccount(sampleAccount1);

    const accountActiveStatus: Boolean = await accountDAO.enableAccount(sampleAccount1.email);

    expect(accountActiveStatus).toBeTruthy;
});


// PASSED
test('Test: deactivateAccount', async () => {
    let sampleAccount1: Account = new Account(0, 'sampleAccount1@email.com', 'pw1', true);

    sampleAccount1 = await accountDAO.createAccount(sampleAccount1);

    const accountActiveStatus: Boolean = await accountDAO.disableAccount(sampleAccount1.email);

    expect(accountActiveStatus).not.toBeTruthy;
});


// PASSED
test('Test: changePassword', async () => {
    let sampleAccount1: Account = new Account(0, 'sampleAccount1@email.com', 'pw1', true);

    sampleAccount1 = await accountDAO.createAccount(sampleAccount1);

    await accountDAO.alterPassword(sampleAccount1.email, 'newpw');

    const retrievedAccount: Account = await accountDAO.getAccountByEmail(sampleAccount1.email);

    expect(retrievedAccount.password).toBe('newpw');
});


// PASSED
test('Test: removeAccount', async () => {
    let sampleAccount1: Account = new Account(0, 'sampleAccount1@email.com', 'pw1', true);

    sampleAccount1 = await accountDAO.createAccount(sampleAccount1);

    await accountDAO.removeAccount(sampleAccount1.email);

    const sqlStr: string = 'SELECT * FROM employee WHERE u_email = $1';
    const values = [sampleAccount1.email];
    const result = await connection_pg.query(sqlStr, values);

    expect(result.rowCount).toBe(0);
});


afterAll(async () => {
    connection_pg.end();
});