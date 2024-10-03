const db=require('../db');
const customerOrderDetail=async(req,res)=>{
const { customer_id } = req.params;
//console.log(customer_id);
try {
    const result = await db.query(`
        SELECT 
            o.*,
            u.phone_number AS customer_phone,
            t.name AS topping_name
        FROM 
            orders o
        LEFT JOIN 
            users u ON o.customer_id = u.id
        LEFT JOIN 
            toppings t ON t.id::text = ANY(o.toppings)  -- Cast t.id to text to match the array type
        WHERE 
            o.customer_id = $1
    `, [customer_id]);

    // Format the result to group toppings by order if needed
    const formattedResult = result.rows.reduce((acc, order) => {
        const existingOrder = acc.find(o => o.id === order.id);
        if (existingOrder) {
            // Add topping name to existing order if it exists
            if (order.topping_name) {
                existingOrder.toppings.push(order.topping_name);
            }
        } else {
            // Create a new order entry with toppings array
            acc.push({
                ...order,
                toppings: order.topping_name ? [order.topping_name] : [],
                customer_phone: order.customer_phone
            });
        }
        return acc;
    }, []);

    res.status(200).json(formattedResult);
} catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
}
}; module.exports =customerOrderDetail;
