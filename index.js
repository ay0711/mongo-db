const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT;
const mongoose = require('mongoose');

const uri = process.env.mongodb_uri;
app.use(express.urlencoded({ extended: true }));
const nodemailer = require('nodemailer');
const userRoute = require("./routes/user.route")
app.use('/user', userRoute)



mongoose.connect(uri)
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });



app.post('/submit', async (req, res) => {
    try {
        const data = new userModel(req.body)
        await data.save()
        res.status(201).json({ message: data })

    } catch (error) {
        res.status(501).json({ message: error })
    }
})
app.listen(port, () => {
    console.log('Server is running on port');
});
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.send('hello world');
});

app.get('/index', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});






