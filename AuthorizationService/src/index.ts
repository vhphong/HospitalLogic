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
    // read in email and password
    const bodyEmail = req.body.email;
    const bodyPassword = req.body.password;

    // if email is invalid or unavailable
    // code here

    // if email is valid and available
    let newUser: User = req.body;
    newUser = await userService.registerUser(newUser);
    res.status(200).send(newUser);
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


const PORT = process.env.PORT_auth || 3001;
app.listen(
    PORT,
    () => console.log('Authorization Service server started on PORT ' + PORT)
); 