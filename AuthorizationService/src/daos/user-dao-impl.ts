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

}