const db = require('../db'); // Import the database module
const { hash } = require('bcryptjs'); // Ensure bcrypt is installed

// Define the registration handler function
const customerSignup = async (req, res) => {
    try {
        const { email, password,location,phoneNumber } = req.body;
        
        // Insert the restaurant into the database
        const result = await db.query('INSERT INTO users (email,password,location,phone_number,role,full_name,role_id) VALUES ($1,$2,$3,$4,$5,$6,$7) returning id ', [email,await hash(password,10),location,phoneNumber,'Customer','',parseInt(0)]);
       const userId=result.rows[0].id;
       res.status(200).json({userId});
       
    } catch (error) {
        console.error('Error registering customer:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Export the registerRestaurant function
module.exports = customerSignup;