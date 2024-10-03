const db = require('../db');
const bcrypt = require('bcryptjs'); // Ensure bcrypt is installed for password hashing

const editUser = async (req, res) => {
    const id = req.params.id;
    const { fullName, email, phoneNumber, location, password, roleId } = req.body;

    // Input validation
    if (!fullName || !email || !phoneNumber || !roleId || !password || !location) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Hash the password if it's being updated
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            'UPDATE users SET full_name = $1, email = $2, role_id = $3, phone_number = $4, password = $5, location = $6 WHERE id = $7',
            [fullName, email, roleId, phoneNumber, hashedPassword, location, id]
        );

        // Check if the update was successful
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ message: 'Successfully edited' });
    } catch (error) {
        console.error('Error editing user:', error);
        res.status(500).json({ message: 'An error occurred while editing the user.' });
    }
};

module.exports = editUser;