const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pino = require('pino');
const { body, validationResult } = require('express-validator');

const app = express();
const logger = pino();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        // Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
         const db = await connectToDatabase();

        // Task 2: Access MongoDB collection
         const collection = db.collection('gifts')

        //Task 3: Check for existing email
         const existingEmail = await collection.findOne({ email: req.body.email });
         if (existingEmail) {
            res.status(404).json({message: 'email already exists'});
         }
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const email = req.body.email;

        // Save user details in database
        const newUser = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        }
        const savedUser =  db.collection.insertOne(newUser);
         // Create JWT authentication with user._id as payload
         const payload = {
            user: {
                id: savedUser.insertedId
            }
         };
         const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('User registered successfully');
        res.json({authtoken,email});
    } catch (e) {
         return res.status(500).send('Internal server error');
    }
});

module.exports = router;




