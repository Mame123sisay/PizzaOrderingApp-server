// pages/api/login.js
const { compare } = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');


const customerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
      
        // Query the user by email
        const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = rows[0]; // Get the first user from the result
        const userId=user.id;
        const userName = user.full_name;
        // Check if user exists and compare passwords
        if (user && (await compare(password, user.password))) {
            const token = jwt.sign({ id: user.id, role: user.role }, 'as123');

            res.status(200).json({ token,userId,userName});
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = customerLogin;