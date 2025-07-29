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



router.post('/login', (req, res) => {
    const userData = {
        email: req.body.email,
        password: req.body.password
    }
    console.log(userData);
    userModel.findOne({ email: userData.email })
        .then(user => {
            console.log(user);
            if (!user || user == null) {
                return res.status(400).send('User not found; please register!');
            }
            else {
                console.log('user found:', user);
                if(user.password==userData.password){
                    res.redirect('ejs')
                    // res.status(200).send(`welcome ${userData.email}`);
                }
                else{
                    console.log({passwordInput:userData.password, Foundassword:user.password});
                    res.status(401).send('Incorrect password')
                    // res.render('/register')
                }
            }
        })
    });

module.exports = router;