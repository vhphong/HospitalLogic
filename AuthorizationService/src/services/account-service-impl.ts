import { Account } from "../models/employee";
import { AccountDAOImpl } from "../daos/account-dao-impl";

import AccountService from "./account-service";
import { AccountDAO } from "../daos/account-dao";


export class AccountServiceImpl implements AccountService {

    accountDAO: AccountDAO = new AccountDAOImpl();


    registerAccount(account: Account): Promise<Account> {
        return this.accountDAO.createAccount(account);
    }


    retrieveAllAccounts(): Promise<Account[]> {
        return this.accountDAO.getAllAccounts();
    }


    retrieveAccountByEmail(email: string): Promise<Account> {
        return this.accountDAO.getAccountByEmail(email);
    }


    verifyAccount(account: Account): Promise<Boolean> {
        return this.accountDAO.verifyAccount(account);
    }


    isEmailAvailable(email: string): Promise<Boolean> {
        return this.accountDAO.checkIfEmailAvailable(email);
    }


    activateAccount(account: Account): Promise<Boolean> {
        return this.accountDAO.activateAccount(account);
    }
}