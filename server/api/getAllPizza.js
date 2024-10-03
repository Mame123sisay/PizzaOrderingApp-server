const db=require('../db');
const getAllPizza=async (req,res)=>{
  try {

    const result = await db.query(`
      SELECT p.id, 
             p.name,
             p.image_path,
             p.price,
              p.is_available,
              r.name as restaurant_name,
             ARRAY_AGG(t.name) AS toppings
      FROM pizzas p
      LEFT JOIN pizza_toppings pt ON p.id = pt.pizza_id
      LEFT JOIN toppings t ON pt.topping_id = t.id
      LEFT JOIN restaurants r ON p.restaurant_id = r.id
    
      GROUP BY p.id,r.name
  `);
  
  res.json(result.rows);
} catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).send('Server error');
}
  

};
module.exports=getAllPizza;