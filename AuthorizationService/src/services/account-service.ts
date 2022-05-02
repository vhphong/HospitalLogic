import { Account } from "../models/employee";


export default interface AccountService {

    registerAccount(account: Account): Promise<Account>;

    retrieveAllAccounts(): Promise<Account[]>;

    retrieveAccountByEmail(email: string): Promise<Account>;

    verifyAccount(account: Account): Promise<Boolean>;

    isEmailAvailable(email: string): Promise<Boolean>;

    activateAccount(account: Account): Promise<Boolean>;
};