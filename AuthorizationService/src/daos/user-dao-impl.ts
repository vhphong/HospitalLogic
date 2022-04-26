import { User } from "../models/employee";
import { UserDAO } from "./user-dao";
import { connection_pg } from "../connection-pg";
import { ResourceNotFoundException } from "../exceptions/ResourceNotFoundException";


export class UserDAOImpl implements UserDAO {

    async createUser(user: User): Promise<User> {
        const sqlStr: string = 'INSERT INTO employee(u_email, u_pw, is_active) VALUES ($1, $2, $3) RETURNING u_id';
        const values = [user.email, user.password, user.isActive];
        const result = await connection_pg.query(sqlStr, values);
        user.userID = result.rows[0].u_id;

        return user;
    }


    async getAllUsers(): Promise<User[]> {
        const sqlStr: string = 'SELECT * FROM employee ORDER BY u_id';
        const result = await connection_pg.query(sqlStr);
        const allUsers: User[] = [];

        for (let eachRow of result.rows) {
            const user: User = new User(
                eachRow.u_id,
                eachRow.u_email,
                eachRow.u_pw,
                eachRow.is_active
            );
            allUsers.push(user);
        }

        return allUsers;
    }


    async getAccountByEmail(email: string): Promise<User> {
        const sqlStr: string = 'SELECT * FROM employee WHERE u_email = $1';
        const values = [email];
        const result = await connection_pg.query(sqlStr, values);

        if (result.rowCount === 0) {
            throw new ResourceNotFoundException(`The account with email ${email} does not exist.`);
        }

        const row = result.rows[0];
        const retrievedUser: User = new User(
            row.u_id,
            row.u_email,
            row.u_pw,
            row.is_active
        );

        return retrievedUser;
    }


    async verifyAccount(user: User): Promise<Boolean> {
        const sqlStr: string = 'SELECT * FROM employee WHERE u_email = $1 AND u_pw = $2';
        const values = [user.email, user.password];
        const result = await connection_pg.query(sqlStr, values);

        if (result.rowCount == 0) {
            return false;
        }
        return true;
    }

}