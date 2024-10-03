const db = require('../db'); // Import the database module
const { hash } = require('bcryptjs'); // Ensure bcrypt is installed

// Define the registration handler function
const registerRestaurant = async (req, res) => {
   // const location=req.file;
    try {
        const { adminName, superAdminEmail, superAdminPassword,phoneNumber,location,restaurantName } = req.body;

        const logo = req.file ? `/uploads/${req.file.filename}` : null; //   
        console.log(logo);

        // Insert the restaurant into the database
        const result = await db.query('INSERT INTO restaurants (name,logo_location) VALUES ($1,$2) RETURNING id', [restaurantName,logo]);
        const restaurantId = result.rows[0].id;

        // Create super admin user
        await db.query('INSERT INTO users (email, password, role, restaurant_id,full_name,location,phone_number,role_id) VALUES ($1, $2, $3, $4,$5,$6,$7,$8)', [
            superAdminEmail,
            await hash(superAdminPassword, 10),
            'Super Admin',
            restaurantId,
            adminName,
            location,
            phoneNumber,
            0
        ]);

        res.status(201).json({restaurantId:restaurantId}) ;
    } catch (error) {
        console.error('Error registering restaurant:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Export the registerRestaurant function
module.exports = registerRestaurant;