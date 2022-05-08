import { Account } from "../models/employee";


export interface AccountDAO {

    // create new account
    createAccount(account: Account): Promise<Account>;


    // get all accounts
    getAllAccounts(): Promise<Account[]>;


    // get account by email
    getAccountByEmail(email: string): Promise<Account>;


    // verify account
    isAccountExisted(account: Account): Promise<Boolean>;


    // check for account's availibility
    checkIfEmailAvailable(email: string): Promise<Boolean>;


    // activate account
    enableAccount(account: Account): Promise<Boolean>;


    // deactivate account
    disableAccount(account: Account): Promise<Boolean>;


    // change password
    alterPassword(account: Account, newPw: string): Promise<Boolean>;


    // remove account
    removeAccount(email: string): Promise<Boolean>;
};