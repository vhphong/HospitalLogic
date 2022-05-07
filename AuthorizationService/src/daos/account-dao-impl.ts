import { Account } from "../models/employee";
import { AccountDAO } from "./account-dao";
import { connection_pg } from "../connection-pg";
import { ResourceNotFoundException } from "../exceptions/ResourceNotFoundException";


export class AccountDAOImpl implements AccountDAO {

    async createAccount(account: Account): Promise<Account> {
        const sqlStr: string = 'INSERT INTO employee(u_email, u_pw, is_active) VALUES ($1, $2, $3) RETURNING u_id';
        const values = [account.email, account.password, account.isActive];
        const result = await connection_pg.query(sqlStr, values);
        account.accountID = result.rows[0].u_id;

        return account;
    }


    async getAllAccounts(): Promise<Account[]> {
        const sqlStr: string = 'SELECT * FROM employee ORDER BY u_id';
        const result = await connection_pg.query(sqlStr);
        const allAccounts: Account[] = [];

        for (let eachRow of result.rows) {
            const account: Account = new Account(
                eachRow.u_id,
                eachRow.u_email,
                eachRow.u_pw,
                eachRow.is_active
            );
            allAccounts.push(account);
        }

        return allAccounts;
    }


    async getAccountByEmail(email: string): Promise<Account> {
        const sqlStr: string = 'SELECT * FROM employee WHERE u_email = $1';
        const values = [email];
        const result = await connection_pg.query(sqlStr, values);

        if (result.rowCount === 0) {
            throw new ResourceNotFoundException(`The account with email ${email} does not exist.`);
        }

        const row = result.rows[0];
        const retrievedAccount: Account = new Account(
            row.u_id,
            row.u_email,
            row.u_pw,
            row.is_active
        );

        return retrievedAccount;
    }


    async isAccountExisted(account: Account): Promise<Boolean> {
        const sqlStr: string = 'SELECT * FROM employee WHERE u_email = $1 AND u_pw = $2';
        const values = [account.email, account.password];
        const result = await connection_pg.query(sqlStr, values);

        if (result.rowCount == 0) {
            return false;
        }
        return true;
    }


    async checkIfEmailAvailable(email: string): Promise<Boolean> {
        const sqlStr2: string = 'SELECT * FROM employee WHERE u_email = $1';
        const values2 = [email];
        const result = await connection_pg.query(sqlStr2, values2);

        if (result.rowCount == 0) {
            return false;
        }
        return true;
    }


    async enableAccount(account: Account): Promise<Boolean> {
        const sqlStr1: string = 'UPDATE employee SET is_active = $1 WHERE u_email = $2';
        const values1 = [true, account.email];
        await connection_pg.query(sqlStr1, values1);

        const sqlStr2: string = 'SELECT * FROM employee WHERE u_email = $1';
        const values2 = [account.email];
        const result2 = await connection_pg.query(sqlStr2, values2);

        if (result2.rowCount == 0) {
            throw new ResourceNotFoundException(`The account with email ${account.email} does not exist.`);
        }

        const row = result2.rows[0];
        const retrievedAccount: Account = new Account(
            row.u_id,
            row.u_email,
            row.u_pw,
            row.is_active
        );

        return (retrievedAccount.isActive == true) ? true : false;
    }


    async disableAccount(account: Account): Promise<Boolean> {
        const sqlStr1: string = 'UPDATE employee SET is_active = $1 WHERE u_email = $2';
        const values1 = [false, account.email];
        await connection_pg.query(sqlStr1, values1);

        const sqlStr2: string = 'SELECT * FROM employee WHERE u_email = $1';
        const values2 = [account.email];
        const result2 = await connection_pg.query(sqlStr2, values2);

        if (result2.rowCount == 0) {
            throw new ResourceNotFoundException(`The account with email ${account.email} does not exist.`);
        }

        const row = result2.rows[0];
        const retrievedAccount: Account = new Account(
            row.u_id,
            row.u_email,
            row.u_pw,
            row.is_active
        );

        return (retrievedAccount.isActive == false) ? true : false;
    }


    async alterPassword(account: Account, newPassword: string): Promise<Boolean> {
        const sqlStr: string = 'UPDATE employee SET u_pw = $1 WHERE u_email = $2';
        const values = [newPassword, account.email];
        await connection_pg.query(sqlStr, values);

        const sqlStr2: string = 'SELECT * FROM employee WHERE u_email = $1';
        const values2 = [account.email];
        const result2 = await connection_pg.query(sqlStr2, values2);

        if (result2.rowCount == 0) {
            return false;
        }

        const row = result2.rows[0];
        const retrievedAccount: Account = new Account(
            row.u_id,
            row.u_email,
            row.u_pw,
            row.is_active
        );

        if (retrievedAccount.password === newPassword) {
            return true;
        } else {
            return false;
        }
    }


    async removeAccount(email: string): Promise<Boolean> {
        const sqlStr1: string = 'DELETE FROM employee WHERE u_email = $1';
        const values1 = [email];
        await connection_pg.query(sqlStr1, values1);

        // confirm the account was removed
        const sqlStr2: string = 'SELECT * FROM employee WHERE u_email = $1';
        const values2 = [email];
        const result2 = await connection_pg.query(sqlStr2, values2);

        if (result2.rowCount == 0) {
            return true;
        } else {
            return false;
        }
    }
}