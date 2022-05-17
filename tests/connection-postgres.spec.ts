import { connection_postgres } from "../src/connection-postgres";


test('Test: creating a connection', async () => {
    const result = await connection_postgres.query('SELECT * FROM patient');
    console.log(result);
});

afterAll(async () => {
    connection_postgres.end();
});