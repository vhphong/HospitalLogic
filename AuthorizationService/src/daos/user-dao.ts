import { User } from "../models/employee";


export interface UserDAO {

    // create new user
    createUser(user: User): Promise<User>;


    // get all accounts


    // get account by email


    // update account


    // enable account


    // disable account


    // delete account

};