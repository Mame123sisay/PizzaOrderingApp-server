const db=require('../db');
const addOrder=async(req,res)=>{
  
  const { customerId, toppings, totalPrice, status, quantity, pizzaName,restaurant_id } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO orders (customer_id, toppings, total_price, status, quantity, pizza_name,restaurant_id) VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING *',
      [customerId, toppings, totalPrice, status, quantity, pizzaName,restaurant_id]
    );
    
    res.status(201).json(result.rows[0]); // Send back the created order
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: error.message });
  }

};module.exports=addOrder;