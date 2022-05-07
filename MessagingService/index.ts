const { Datastore } = require('@google-cloud/datastore');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const datastore = new Datastore();

/**
 *  {
        "time": "11:26:14 PM",
        "recipient": "phong@email.com",
        "date": "11/24/2021",
        "isRead": false,
        "content": "Hello",
        "mid": 1,
        "sender": "phong1@email.com"
    }
 */


app.post('/messages', async (req, res) => {
    const dateStamp = new Date().toLocaleDateString('en-US');   // today
    const timeStamp = new Date().toLocaleTimeString('en-US');   // right moment

    // makes the message id auto-increased, started from 1
    const query = datastore.createQuery('Message');
    const response = await datastore.runQuery(query);
    const runningId: number = Number(response[0].length + 1);

    // verifies the existence of sender and recipient
    const senderQuery = datastore.createQuery('User').filter('email', '=', req.body.sender);
    const recipientQuery = datastore.createQuery('User').filter('email', '=', req.body.recipient);
    const [senderData] = await datastore.runQuery(senderQuery);
    const [recipientData] = await datastore.runQuery(recipientQuery);

    // console.log("senderData.isActive: " + senderData[0].isActive);

    // senderData.length = 0 if email DNE; > 0 if exists
    if (senderData.length < 1) {
        res.status(404).send('Sender email is invalid.');
    } else if (!senderData[0].isActive) {
        res.status(404).send('Sender email is inactive.');
    } else if (recipientData.length < 1) {
        res.status(404).send('Recipient email is invalid.');
    } else {
        const messageKey = datastore.key('Message');
        const messageData = {
            mid: runningId,
            sender: req.body.sender,
            recipient: req.body.recipient,
            content: req.body.content,
            isRead: req.body.isRead,
            date: dateStamp,
            time: timeStamp
        }
        const entity = {
            key: messageKey,
            data: messageData
        }

        datastore.insert(entity).then(() => {
            // Created Successfully a new message
        });

        res.status(200).send(messageData);
    }
});


app.get('/messages', async (req, res) => {
    // GET /messages?sender=someone&recipient=someoneelse
    if (req.query.sender && req.query.recipient) {
        const query = datastore.createQuery('Message').filter('sender', '=', req.query.sender).filter('recipient', '=', req.query.recipient);
        const [data, metaInfo] = await datastore.runQuery(query);

        res.status(200).send(data);
    } else if (req.query.recipient) {
        // if only recipient's email is asked for
        // GET messages received by recipient
        // GET /messages?recipient=someone
        const query = datastore.createQuery('Message').filter('recipient', '=', req.query.recipient);
        const [data, metaInfo] = await datastore.runQuery(query);

        res.status(200).send(data);
    } else if (req.query.sender) {
        // if only sender's email is asked for
        // GET messages sent by sender
        // GET /messages?sender=someone
        const query = datastore.createQuery('Message').filter('sender', '=', req.query.sender);
        const [data, metaInfo] = await datastore.runQuery(query);

        res.status(200).send(data);
    } else {
        // if neither sender nor recipient was asked for, show all messages
        const query = datastore.createQuery('Message');
        const [data, metaInfo] = await datastore.runQuery(query);

        res.status(200).send(data);
    }
});


app.get('/messages/:mid', async (req, res) => {
    const messageQuery = datastore.createQuery('Message').filter('mid', '=', Number(req.params.mid));
    const [messageData] = await datastore.runQuery(messageQuery);

    res.status(200).send(messageData[0]);
});


const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log("Messaging Service server started on PORT " + PORT));