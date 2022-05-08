import { connection_pg } from "../src/connection-pg";


test('Test: creating a connection', async () => {
    const result = await connection_pg.query('SELECT * FROM messages');
    console.log(result);
});

afterAll(async () => {
    connection_pg.end();
});