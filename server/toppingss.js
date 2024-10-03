// pages/api/toppings.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
      const { name, restaurantId } = req.body;
      await db.query('INSERT INTO toppings (name, restaurant_id) VALUES ($1, $2)', [name, restaurantId]);
      res.status(201).json({ message: 'Topping added' });
  }
}