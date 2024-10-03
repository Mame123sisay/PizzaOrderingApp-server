const db=require('../db');
const getRestaurants=async(req,res)=>{

  try {
    const result = await db.query(`
        SELECT u.location, r.name
        FROM users u
        LEFT JOIN restaurants r ON u.restaurant_id = r.id
    `);
   // console.log(result.rows);
    res.json(result.rows);
} catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}

}; 
module.exports = getRestaurants;