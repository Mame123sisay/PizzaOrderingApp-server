const db=require('../db');

const editPizza= async(req,res)=>{
  const pizzaId = req.params.id;
  const { pizzaName, price, toppings } = req.body;
  console.log(pizzaName,price,toppings);

  try {
      // Update the pizza details
      const updatePizzaQuery = `
          UPDATE pizzas 
          SET name = $1, price = $2 
          WHERE id = $3 RETURNING *;
      `;
      const result = await db.query(updatePizzaQuery, [pizzaName, price, pizzaId]);

      // Check if the pizza was found
      if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Pizza not found' });
      }

      // Update toppings if provided
      if (toppings && toppings.length > 0) {
          // First, delete all existing toppings for the pizza
          await db.query('DELETE FROM pizza_toppings WHERE pizza_id = $1', [pizzaId]);

          // Insert new toppings
          const toppingsQueries = toppings.map(toppingId => 
              db.query('INSERT INTO pizza_toppings (pizza_id, topping_id) VALUES ($1, $2)', [pizzaId, toppingId])
          );
          await Promise.all(toppingsQueries);
      }

      // Return the updated pizza
      res.status(200).json(result.rows[0]);
  } catch (error) {
      console.error('Error updating pizza:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
  }

};module.exports =editPizza;