const db=require('../db');
const addRole = async (req, res) => {
    const { role_name, restaurant_id, permissions } = req.body;

    try {
        const result = await db.query('INSERT INTO roles (role_name, restaurant_id) VALUES ($1, $2) RETURNING id', [role_name, restaurant_id]);
        const roleId = result.rows[0].id;

        const permissionQueries = permissions.map(permissionId => 
            db.query('INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)', [roleId, permissionId])
        );

        await Promise.all(permissionQueries);

        res.status(201).json({ id: roleId, role_name, permissions });
    } catch (error) {
        console.error('Error adding role:', error);
        res.status(500).send('Server error');
    }
};
module.exports = addRole;