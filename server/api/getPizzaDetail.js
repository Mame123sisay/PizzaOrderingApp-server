const db = require('../db');

const getPizzaDetail = async (req, res) => {
  const { id } = req.params;
 // console.log('Received ID:', id); // Log the received ID

  try {
    const result = await db.query(`
      SELECT p.id AS pizza_id, 
             p.name AS pizza_name, 
             p.price,
             r.id as restaurant_id, 
             p.image_path, 
             ARRAY_AGG(t.id) AS topping_ids,
             ARRAY_AGG(t.name) AS toppings
      FROM pizzas p
      LEFT JOIN pizza_toppings pt ON p.id = pt.pizza_id
      LEFT JOIN toppings t ON pt.topping_id = t.id
       LEFT JOIN restaurants r ON r.id = p.restaurant_id
      WHERE p.id = $1
      GROUP BY p.id,r.id;
    `, [id]);
    
    // Check if the pizza exists
    if (result.rows.length === 0) {
      return res.status(404).send('Pizza not found');
    }

    res.json(result.rows[0]); // Return the first (and only) row
  } catch (error) {
    console.error('Error fetching pizza:', error);
    res.status(500).send('Server error');
  }
};

module.exports = getPizzaDetail;