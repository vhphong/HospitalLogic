import { User } from "../models/employee";


export interface UserDAO {

    // create new user
    createUser(user: User): Promise<User>;


    // get all accounts
    getAllUsers(): Promise<User[]>;


    // get account by email
    getAccountByEmail(email: string): Promise<User>;


    // verify account
    verifyAccount(user: User): Promise<Boolean>;


    // update account


    // enable account


    // disable account


    // delete account

};