const db=require('../db');

const addPizza = async (req, res) => {
  const image=req.file;
  const { restaurant_id } = req.params;
  const { pizzaName, price } = req.body;
  const toppings = JSON.parse(req.body.toppings || '[]'); // Parse toppings safely
  console.log(toppings); //

   // Save pizza data to the database, including the image path
   const imagePath = image ? `/uploads/${image.filename}` : null;


  console.log(`Restaurant ID: ${restaurant_id}`);
  console.log(`Pizza Name: ${pizzaName}, Price: ${price}, Toppings: ${toppings}`);
  console.log(imagePath);

  try {
      // Insert the new pizza into the database
      const result = await db.query(
          'INSERT INTO pizzas (name, restaurant_id, price,image_path) VALUES ($1, $2, $3,$4) RETURNING *',
          [pizzaName, restaurant_id, price,imagePath]
      );

      const pizzaId = result.rows[0].id;

      // If the insert was successful and toppings are provided
      if (toppings && toppings.length > 0) {
          const toppingsQueries = toppings.map(topping => 
              db.query('INSERT INTO pizza_toppings (pizza_id, topping_id) VALUES ($1, $2)', [pizzaId, topping])
          );
          await Promise.all(toppingsQueries);
      }

      // Return the newly created pizza details
      res.status(201).json({ id: pizzaId, pizzaName, price, toppings });
  } catch (error) {
      console.error('Error adding pizza:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = addPizza;