import { Account } from "../models/employee";


export interface AccountDAO {

    // create new account
    createAccount(account: Account): Promise<Account>;


    // get all accounts
    getAllAccounts(): Promise<Account[]>;


    // get account by email
    getAccountByEmail(email: string): Promise<Account>;


    // verify account
    verifyAccount(account: Account): Promise<Boolean>;


    // update account
    checkIfEmailAvailable(Account: string): Promise<Boolean>;


    // activate account
    activateAccount(account: Account): Promise<Boolean>;


    // deactivate account


    // delete account

};