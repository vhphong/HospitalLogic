import express from 'express';
import { User } from './models/employee';
import { UserServiceImpl } from './services/user-service-impl';
import UserService from './services/user-service';

import cors from 'cors';
import { ResourceNotFoundException } from './exceptions/ResourceNotFoundException';

const app = express();
app.use(express.json());    // Middleware
app.use(cors());

const userService: UserService = new UserServiceImpl();


// register a new user, NOT using hashing password
app.post('/users/register', async (req, res) => {
    try {

        // read in email and password
        const bodyEmail = req.body.email;
        const bodyPassword = req.body.password;

        // if email is invalid or unavailable
        // code here

        // if email is valid and available
        let newUser: User = req.body;
        newUser = await userService.registerUser(newUser);
        res.status(200).send(newUser);
    } catch (error) {
        res.status(400).send(error);
    }
});


// get all users
app.get('/users', async (req, res) => {
    try {
        const allUsers: User[] = await userService.retrieveAllUsers();
        res.status(200).send(allUsers);
    } catch (err) {
        if (err instanceof ResourceNotFoundException) {
            res.status(400).send(err);
        }
    }
});


// get user by email
app.get('/users/email/:email', async (req, res) => {
    try {
        const emailParam = req.params.email;
        const retrievedEmail: User = await userService.retrieveUserByEmail(emailParam);

        res.status(200).send(retrievedEmail);
    } catch (error) {
        if (error instanceof ResourceNotFoundException) {
            res.status(400).send(error);
        }
    }
});


// verify user by {email, password} value pair
app.patch('/users/verify', async (req, res) => {
    try {
        const reqBody = req.body;

        const userVerification: Boolean = await userService.verifyUser(reqBody);
        if (userVerification == true) {
            res.status(201).send(true);
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
app.patch('/users/login', async (req, res) => {
    try {
        const reqBody = req.body;
        const emailBody = req.body.email;
        const passwordBody = req.body.password;

        const userVerification: Boolean = await userService.verifyUser(reqBody);
        const retrievedUser: User = await userService.retrieveUserByEmail(emailBody);

        // compare the credentials saved in database with the input
        if (userVerification && (retrievedUser.password === passwordBody)) {
            res.status(200).send('logged in');
        } else {
            res.status(403).send('bad credentials');
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