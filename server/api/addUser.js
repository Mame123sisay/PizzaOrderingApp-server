const { hash } = require('bcryptjs');
const db = require('../db'); // Ensure your database connection is set up

const addUser = async (req, res) => {
    console.log('Adding user');
    const { fullName, email, password,location, phoneNumber, restaurant_id, roleId } = req.body;

    try {
       

        // Insert the new user
        const hashedPassword = await hash(password, 10);
        const result = await db.query(
            'INSERT INTO users (full_name, email, password, phone_number, restaurant_id, role_id,location,role) VALUES ($1, $2, $3, $4, $5, $6,$7,$8) RETURNING *',
            [fullName, email, hashedPassword, phoneNumber, restaurant_id, roleId,location,'']
        );

        // Respond with the newly created user
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding user:', error);

        // Handle specific error codes
        if (error.code === '23505') { // Unique violation error code for PostgreSQL
            return res.status(409).json({ error: 'Email already exists' });
        }

        // General server error message
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

module.exports = addUser;