import { Client } from "pg";

require('dotenv').config({ path: 'app.env' });

export const connection_pg = new Client({
    user: 'postgres',
    database: 'hospitaldb',
    password: 'phong0222',
    port: 5432
});

connection_pg.connect();