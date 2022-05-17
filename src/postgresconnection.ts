import { Client } from "pg";

require('dotenv').config({ path: 'C:\\Users\\vhpho\\Desktop\\HospitalLogic\\HospitalService\\app.env' })

export const postgres_connection = new Client({
    user: 'postgres',
    database: 'hospitaldb',
    password: 'phong0222',
    port: 5432
});

postgres_connection.connect();
