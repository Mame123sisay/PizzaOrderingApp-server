const db = require('../db');

const roles = async (req, res) => {
    const { restaurant_id } = req.params;

    try {
        const result = await db.query(`
            SELECT r.id, r.role_name, r.is_active, r.created_at, 
            ARRAY_AGG(p.label) AS permissions
            FROM roles r
            LEFT JOIN role_permissions rp ON r.id = rp.role_id
            LEFT JOIN permissions p ON rp.permission_id = p.id
            WHERE r.restaurant_id = $1
            GROUP BY r.id
            ORDER BY r.created_at DESC 
        `, [restaurant_id]);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).send('Server error');
    }
};

module.exports = roles;