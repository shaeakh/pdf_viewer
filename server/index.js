// install these 
// express , cors , dotenv, nodemon , body-parser , mongoose , express-validator , jsonwebtoken , bcryptjs , cookie-parser , express-jwt 

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to Express.js Boilerplate!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:PORT`);
});