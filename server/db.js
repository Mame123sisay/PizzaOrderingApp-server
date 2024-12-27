
{/*const {Pool}=require('pg');
const pool=new Pool({
  user: 'postgres',
    host: 'localhost',
    database: 'pizzadb',
    password: 'postgres',
    port: 5432,


  });
*/}
// Log the DATABASE_URL for debugging
//console.log('Database URL:', process.env.DATABASE_URL);
require('dotenv').config(); // Load environment variables
const { Pool } = require('pg');

// Create a pool instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Use caution with this setting
  },
});

// Function to test the connection once
const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database is connected:', res.rows[0]);
  } catch (error) {
    console.error('Database connection error:', error.message || error);
  }
};

// Test the connection when the module is loaded
testConnection();

module.exports = pool; // Export the pool for use in other files



