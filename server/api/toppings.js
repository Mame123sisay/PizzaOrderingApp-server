const db=require('../db');
const topping = async (req, res) => {
  const { newToppingName, restaurant_id } = req.body;

  try {
      // Insert the new topping into the database
      const result = await db.query('INSERT INTO toppings (name, restaurant_id) VALUES ($1, $2) RETURNING *', [newToppingName, restaurant_id]);

      // If the insert was successful, return the newly created topping
      if (result.rows.length > 0) {
          console.log(result.rows[0]);
          return res.status(201).json(result.rows[0]); // Return the new topping with a 201 status
      } else {
          return res.status(500).json({ message: 'Failed to create topping' });
      }
  } catch (error) {
      console.error('Error adding topping:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
module.exports =topping