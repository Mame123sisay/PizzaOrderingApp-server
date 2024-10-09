// pages/api/login.js
const { compare } = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Query the user by email and join with roles table
        const { rows } = await db.query(
            `SELECT
                u.id,
                u.restaurant_id,
                u.role_id,
                u.role,
                r.role_name 
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.id 
            WHERE u.email = $1`, [email]
        );

        const user = rows[0]; // Get the first user from the result
        const restaurant_id=user.restaurant_id;
        const role_id=user.role_id;
        const role_name=user.role_name;
        const roless=user.role;
        console.log(restaurant_id);
        console.log(role_id);
        console.log(role_name);
        
        if(role_id===0) {

        console.log( roless);}

        else if(role_name!==null) {
            console.log( role_name );
        }
        else{
            console.log( 'invalid cridential' );
        }


       // console.log(roless);

       // Create a JWT token
                //const token = jwt.sign({ id: user.id, role: user.role_id }, 'as123'); // Use role_id or role_name as needed
        res.status(200).json({restaurant_id,role_id,role_name,roless});
        } 
    
          
                
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = login;