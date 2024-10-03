
const db=require('../db');
 const getPizza = async (req,res) => {
    const {restaurant_id}=req.params;

   //const s=38
  
  
  try {

    const result = await db.query(`
      SELECT p.id, 
             p.name,
             p.image_path,
             p.price,
              p.is_available,
             ARRAY_AGG(t.name) AS toppings
      FROM pizzas p
      LEFT JOIN pizza_toppings pt ON p.id = pt.pizza_id
      LEFT JOIN toppings t ON pt.topping_id = t.id
      WHERE p.restaurant_id = $1
      GROUP BY p.id
  `, [restaurant_id]);
  
  res.json(result.rows);
} catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).send('Server error');
}
  
}
module.exports =getPizza;