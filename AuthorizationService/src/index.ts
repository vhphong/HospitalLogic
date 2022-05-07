import express from 'express';
import { Account } from './models/employee';
import { AccountServiceImpl } from './services/account-service-impl';
import AccountService from './services/account-service';

import cors from 'cors';
import { ResourceNotFoundException } from './exceptions/ResourceNotFoundException';
import encrypt from './encryption';

const app = express();
app.use(express.json());    // Middleware
app.use(cors());

const accountService: AccountService = new AccountServiceImpl();


// register a new account, using hashing password
app.post('/accounts/register', async (req, res) => {
    try {

        // read in email and password
        const bodyEmail = req.body.email;
        const bodyPassword = encrypt(req.body.password);

        // if the email exists in the database, do not register for a new account
        const accountVerification: Boolean = await accountService.isEmailAvailable(bodyEmail);
        if (accountVerification == true) {
            res.status(403).send(false);
            return;
        }

        // if email is invalid 
        // code here

        // if email is valid and available
        let newAccount: Account = req.body;
        newAccount.password = bodyPassword;
        newAccount = await accountService.registerAccount(newAccount);
        res.status(200).send(newAccount);
        return;
    } catch (error) {
        res.status(400).send(error);
    }
});


// get all accounts
app.get('/accounts', async (req, res) => {
    try {
        const allAccounts: Account[] = await accountService.retrieveAllAccounts();
        res.status(200).send(allAccounts);
    } catch (err) {
        if (err instanceof ResourceNotFoundException) {
            res.status(400).send(err);
        }
    }
});


// get an account by email
app.get('/accounts/email/:email', async (req, res) => {
    try {
        const emailParam = req.params.email;
        const retrievedEmail: Account = await accountService.retrieveAccountByEmail(emailParam);

        res.status(200).send(retrievedEmail);
    } catch (error) {
        if (error instanceof ResourceNotFoundException) {
            res.status(400).send(error);
        }
    }
});


// verify an account by {email, password} value pair
app.patch('/accounts/verify', async (req, res) => {
    try {
        const reqBody = req.body;

        const accountVerification: Boolean = await accountService.verifyAccount(reqBody);
        if (accountVerification == true) {
            res.status(200).send(true);
        } else {
            res.status(401).send(false);
        }
    } catch (error) {
        if (error instanceof ResourceNotFoundException) {
            res.status(401).send(false);
        }
    }
});


// logging in by email
app.patch('/accounts/login', async (req, res) => {
    try {
        const reqBody = req.body;
        const emailBody = reqBody.email;
        const passwordBody = reqBody.password;

        const accountVerification: Boolean = await accountService.verifyAccount(reqBody);
        const retrievedAccount: Account = await accountService.retrieveAccountByEmail(emailBody);

        // compare the credentials saved in database with the input
        if (!retrievedAccount.isActive) {
            res.status(403).send('inactive account');
        } else {
            if (accountVerification && (retrievedAccount.password === passwordBody)) {
                res.status(200).send('logged in');
            } else {
                res.status(403).send('bad credentials');
            }
        }
    } catch (error) {
        if (error instanceof ResourceNotFoundException) {
            res.status(404).send(error);
        }
    }
});


// activate an account
app.put('/accounts/activate', async (req, res) => {
    try {
        const reqBody = req.body;
        const accountActivationResult: Boolean = await accountService.activateAccount(reqBody);

        res.status(200).send(accountActivationResult);
    } catch (error) {
        if (error instanceof ResourceNotFoundException) {
            res.status(404).send(error);
        }
    }
});


// deactivate an account
app.put('/accounts/deactivate', async (req, res) => {
    try {
        const reqBody = req.body;
        const accountDeactivationResult: Boolean = await accountService.deactivateAccount(reqBody);

        res.status(200).send(accountDeactivationResult);
    } catch (error) {
        if (error instanceof ResourceNotFoundException) {
            res.status(404).send(error);
        }
    }
});


// change account's password
app.put('/accounts/changepassword/:email', async (req, res) => {
    try {
        // retrieve the account by email
        const emailParam = req.params.email;
        const newPassword = req.body.newPassword;
        const retrievedAccount: Account = await accountService.retrieveAccountByEmail(emailParam);

        const changePasswordResult: Boolean = await accountService.changePassword(retrievedAccount, newPassword)

        res.status(200).send(changePasswordResult);
    } catch (error) {
        if (error instanceof ResourceNotFoundException) {
            res.status(404).send(error);
        }
    }
});


// remove an account
app.delete('/accounts/delete/:email', async (req, res) => {
    try {
        const emailParam = req.params.email;

        const deleteAccountResult: Boolean = await accountService.deleteAccount(emailParam);

        if (deleteAccountResult) {
            res.status(200).send(deleteAccountResult);  // will send T/F
        } else {
            res.status(400).send(false);  // will send T/F
        }
    } catch (error) {
        if (error instanceof ResourceNotFoundException) {
            res.status(404).send(error);
        }
    }
});


const PORT = process.env.PORT_auth || 3001;
app.listen(
    PORT,
    () => console.log('Authorization Service server started on PORT ' + PORT)
); 