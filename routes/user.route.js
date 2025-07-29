const express = require('express')
const nodemailer = require('nodemailer');
const router = express.Router();
const userModel = require("../models/user.model");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {fetchData, logData} = require('../controllers/user.controller');



router.get('/register', fetchData);


router.get('/login', logData);

router.get('/ejs', (req, res) => {
    res.render('index')
});

router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, password} = req.body
        console.log(req.body);
        if(!email){
            return res.status(400).send('email is required')
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new userModel({ firstName, lastName, email, password: hashedPassword});
        await newUser.save()
        console.log('User saved successfully');
    
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASSWORD
                }
            });
            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: newUser.email,
                subject: 'Test Email',
                text: 'This is an email sent from Node.js using Nodemailer!',
                html: '<p>This is a test email sent from <strong>Node.js</strong> using <strong>Nodemailer</strong></p>'
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).send('Error sending email: ' + error.message);
                }
                // Only redirect after successful email send
                res.redirect('login');
            });
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(500).send(`Error saving user: ${err.message}`);
    }
});



router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!email || !password) {
            return res.status(400).send('Email and password are required');
        }
        if (!user) {
            return res.status(400).send('User not found; please register!');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            res.redirect('ejs');
        } else {
            console.log({passwordInput: password, foundPassword: user.password});
            res.status(401).send('Incorrect password');
        }
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;