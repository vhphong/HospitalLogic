import { Datastore } from '@google-cloud/datastore';
import express from 'express';
import cors from 'cors';
import decryptPassword from './decryption';
import jwt from 'jsonwebtoken';
import encryptPassword from './encryption';

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

const datastore = new Datastore();


/**
 *  {
 *      "userid": 1,
        "email": "phong@email.com",
        "password": "phong",
        "isActive": true
    }
 */
// register a new user, with no hashing password
app.post('/users/register', async (req, res) => {
    // check if email has been taken
    const emailQuery = datastore.createQuery('User').filter('email', '=', req.body.email);
    const [emailData] = await datastore.runQuery(emailQuery);

    if (emailData.length >= 1) {
        // verify if email input has been taken
        return res.status(403).send(`Email ${req.body.email} has been taken. Choose another one.`);
    } else {
        // make user id auto-increased, started at 1
        const query = datastore.createQuery('User');
        const response = await datastore.runQuery(query);
        const runningId: number = Number(response[0].length + 1);

        const userKey = datastore.key('User');
        const userData = {
            userid: runningId,
            email: req.body.email,
            password: req.body.password,
            isActive: true
        };
        const entity = {
            key: userKey,
            data: userData
        }

        await datastore.save(entity);

        res.status(201).send(userData);
    }
});


// register a new user, using hashing password
app.post('/users/create', async (req, res) => {
    // get in the email and password
    const bodyEmail = req.body.email;
    const bodyPassword = encryptPassword(req.body.password);

    // check if email has been taken
    const emailQuery = datastore.createQuery('User').filter('email', '=', req.body.email);
    const [emailData, metaInfo] = await datastore.runQuery(emailQuery);

    if (emailData.length >= 1) {
        // verify if email input has been taken
        return res.status(403).send(`Email ${req.body.email} has been taken. Choose another one.`);
    }
    // make user id auto-increased, started at 1
    const query = datastore.createQuery('User');
    const response = await datastore.runQuery(query);
    const runningId: number = Number(response[0].length + 1);

    const userKey = datastore.key('User');
    const userData = {
        userid: runningId,
        email: bodyEmail,
        password: bodyPassword,
        isActive: true
    };

    // save the email and password in the datastore
    const entity = {
        key: userKey,
        data: userData
    };

    await datastore.save(entity);

    return res.status(201).send(true);
});


// GET all users
app.get('/users', async (req, res) => {
    const queryUser = datastore.createQuery('User');
    const [data, metaInfo] = await datastore.runQuery(queryUser);

    res.status(200).send(data);
});


// GET user by user id
app.get('/users/:id', async (req, res) => {
    const userQuery = datastore.createQuery('User').filter('userid', '=', Number(req.params.id));
    const [userData] = await datastore.runQuery(userQuery);

    res.status(200).send(userData[0]);
});


// verify user by userid
/**
 * check if user email exists in database. 
 * if yes, return true, else false
 */
app.get('/users/verify/:email', async (req, res) => {
    const query = datastore.createQuery('User').filter('email', '=', req.params.email);
    const [emailData] = await datastore.runQuery(query);

    if (emailData.length >= 1) {
        res.status(200).send(true);
    } else {
        res.status(404).send(false);
    }
});


// login using userid
/**
 * check if user email is valid and inActive
 * if yes, return the email and password
 * else, return false
 */
app.patch('/users/login', async (req, res) => {
    const emailInput = req.body.email;
    const passwordInput = req.body.password;

    const query = datastore.createQuery('User').filter('email', '=', emailInput);
    const [data, metaInfo] = await datastore.runQuery(query);

    console.log(data);
    // console.log(data.length);

    const user = {
        email: emailInput,
        password: passwordInput
    }

    if (data[0].length > 0) { // if email is valid, check if its password is valid
        if (decryptPassword(data[0][0].password) === passwordInput) {
            // create JWT
            const tokenDuration = {
                expiresIn: '30m'
            };

            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, tokenDuration);

            return res.status(200).send({ 'token': accessToken });
        }
    }

    return res.status(401).send(false);








    // const query = datastore.createQuery('User').filter('email', '=', emailInput).filter('password', '=', passwordInput);
    // const [data, metaInfo] = await datastore.runQuery(query);

    // // console.log('data.length: ' + data.length);

    // if (data.length >= 1) {
    //     const query = datastore.createQuery('User').filter('email', '=', req.body.email).filter('isActive', '=', true);
    //     const [emailData, metaInfo] = await datastore.runQuery(query);
    //     if (emailData.length >= 1) {
    //         res.status(200).send(emailData[0]);
    //     } else {
    //         res.status(401).send(false);
    //     }
    // } else {
    //     res.status(401).send(false);
    // }
});


// UPDATE user by user id
app.put('/users/:email', async (req, res) => {
    // req.body: { "userid": 1, "password": "phong1", "isActive": false }
    try {
        const key = datastore.key(['User', req.params.email]);

        // retrieve user by the email
        const retrievedUser = await datastore.get(key);

        console.log('----------');
        console.log('retrievedUser: ' + JSON.stringify(retrievedUser));
        console.log('retrievedUser.password: ' + (retrievedUser[0].password));
        console.log('retrievedUser.isActive: ' + (retrievedUser[0].isActive));

        const currentUserId: number = retrievedUser[0].userid;
        const currentPassword: string = retrievedUser[0].password;
        const currentIsActive: boolean = retrievedUser[0].isActive;

        // update with new values
        const newData = req.body;

        console.log('req.body.password: ' + req.body.password);
        console.log('req.body.isActive: ' + req.body.isActive);

        // keep user id persistent
        newData.userid = currentUserId;

        if ((req.body.password === '') ||
            (!req.body.hasOwnProperty('password'))) {
            // keep the old value
            newData.password = currentPassword;
        }

        if ((req.body.isActive === '') ||
            (!req.body.hasOwnProperty('isActive'))) {
            // keep the old value
            newData.isActive = currentIsActive;
        }

        const entity = {
            key: key,
            data: newData
        };

        await datastore.update(entity);
        const updatedUser = await datastore.get(key);

        res.status(200).send(updatedUser);
    } catch (err) {
        res.status(404).send(false);
    }

});


// DELETE user by userid
app.delete('/users/:email', async (req, res) => {
    try {
        const key = datastore.key(['User', req.params.email]);
        await datastore.delete(key);

        res.status(201).send(true);
    } catch (err) {
        res.status(404).send(false);
    }
});





const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Authorization Service server started on PORT " + PORT));