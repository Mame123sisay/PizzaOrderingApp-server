
const db=require('../db');
 const users = async (req,res) => {
const {restaurant_id}=req.params;
//console.log(restaurant_id);

const result = await db.query(`
  SELECT
  u.id,
      u.full_name,
      u.phone_number,
      u.email,
      u.is_active,
      u.location,
      u.password,
      r.role_name
  FROM users u
  LEFT JOIN roles r ON r.id = u.role_id
  WHERE u.restaurant_id = $1
`, [restaurant_id]);

res.json(result.rows);
  
}
module.exports =users;