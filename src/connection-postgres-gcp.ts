import { Client } from "pg";

require('dotenv').config({ path: 'C:\\Users\\vhpho\\Desktop\\HospitalLogic\\HospitalService\\app.env' })

export const connection = new Client({
    user: 'root',
    database: 'hospitaldb',
    password: process.env.DATABASEPASSWORD,
    port: 5432,
    host: '34.72.73.159'
});

connection.connect();
