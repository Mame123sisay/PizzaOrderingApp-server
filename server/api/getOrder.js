const db=require('../db');

const getOrder = async (req, res) => {
    const { restaurant_id } = req.params;
    const { customer_phone, toppings, pizza_name } = req.query;

    try {
        let query = `
            SELECT 
                o.*,
                u.phone_number AS customer_phone,
                t.name AS topping_name
            FROM 
                orders o
            LEFT JOIN 
                users u ON o.customer_id = u.id
            LEFT JOIN 
                toppings t ON t.id::text = ANY(o.toppings)
            WHERE 
                o.restaurant_id = $1
        `;
        
        const params = [restaurant_id];

        // Filter by customer phone if provided
        if (customer_phone) {
            query += ' AND u.phone_number = $2';
            params.push(customer_phone);
        }

        // Filter by toppings if provided
        if (toppings) {
            const toppingsArray = toppings.split(',').map(topping => topping.trim());
            query += ' AND t.name = ANY($3::text[])'; // Explicitly specify the array type
            params.push(toppingsArray);
        }

        // Filter by pizza name if provided
        if (pizza_name) {
            query += ' AND o.pizza_name ILIKE $4'; 
            params.push(`%${pizza_name}%`); // Allow partial matches
        }

        

        const result = await db.query(query, params);

        // Format the result to group toppings by order if needed
        const formattedResult = result.rows.reduce((acc, order) => {
            const existingOrder = acc.find(o => o.id === order.id);
            if (existingOrder) {
                if (order.topping_name) {
                    existingOrder.toppings.push(order.topping_name);
                }
            } else {
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
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
 module.exports =getOrder;