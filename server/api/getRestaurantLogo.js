const db=require('../db');
const getRestaurantLogo=async(req,res)=>{

  try {
    const {restaurantId}=req.params;
    const result = await db.query(`
        SELECT u.location, r.name,r.logo_location
        FROM users u
        LEFT JOIN restaurants r ON u.restaurant_id = r.id where restaurant_id =$1
    `,[restaurantId]);
   // console.log(result.rows);
    res.json(result.rows);
} catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}

}; 
module.exports = getRestaurantLogo;