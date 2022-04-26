import { connection_pg } from "../src/connection-pg";
import { UserDAO } from "../src/daos/user-dao";
import { UserDAOImpl } from "../src/daos/user-dao-impl";
import { User } from "../src/models/employee";


const userDAO: UserDAO = new UserDAOImpl();


// PASSED
test('Test: DAO createUser', async () => {
    let sampleUser1: User = new User(0, 'sampleUser1@email.com', 'pw1', false);
    sampleUser1 = await userDAO.createUser(sampleUser1);

    console.log(sampleUser1);

    expect(sampleUser1.userID).not.toBe(0);
});


// PASSED
test('Test: DAO getAllUsers', async () => {
    let sampleUser1: User = new User(0, 'sampleUser1@email.com', 'pw1', false);
    let sampleUser2: User = new User(0, 'sampleUser2@email.com', 'pw2', false);
    let sampleUser3: User = new User(0, 'sampleUser3@email.com', 'pw3', false);

    sampleUser1 = await userDAO.createUser(sampleUser1);
    sampleUser2 = await userDAO.createUser(sampleUser2);
    sampleUser3 = await userDAO.createUser(sampleUser3);

    const allUsers: User[] = await userDAO.getAllUsers();

    expect(allUsers.length).toBeGreaterThanOrEqual(3);
});


// PASSED
test('Test: getAccountByEmail', async () => {
    let sampleUser1: User = new User(0, 'sampleUser1@email.com', 'pw1', false);

    sampleUser1 = await userDAO.createUser(sampleUser1);

    const retrievedUser: User = await userDAO.getAccountByEmail(sampleUser1.email);

    expect(retrievedUser.email).toBe(sampleUser1.email);
});


// PASSED
test('Test: verifyAccount',async () => {
    let sampleUser1: User = new User(0, 'sampleUser1@email.com', 'pw1', false);

    sampleUser1 = await userDAO.createUser(sampleUser1);

    const userVerification:Boolean= await userDAO.verifyAccount(sampleUser1);

    expect(userVerification).toBeTruthy;
});


afterAll(async () => {
    connection_pg.end();
});