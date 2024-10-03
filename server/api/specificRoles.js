const db=require('../db');



 const specificRoles = async(req,res) => {
  const roleId = req.params.id;
  try {
      const result = await db.query(`
          SELECT r.id, r.role_name, r.is_active, r.created_at, 
                 ARRAY_AGG(p.label) AS permissions
          FROM roles r
          LEFT JOIN role_permissions rp ON r.id = rp.role_id
          LEFT JOIN permissions p ON rp.permission_id = p.id
          WHERE r.id = $1
          GROUP BY r.id
      `, [roleId]);
  
      if (result.rows.length === 0) {
          return res.status(404).send('Role not found');
      }
  
      res.json(result.rows[0]);
  } catch (error) {
      console.error('Error fetching role:', error);
      res.status(500).send('Server error');
  }
}
module.exports =specificRoles;
//postgresql://postgres:gmyYKxInKdgxXDQbolnYOzJyckPCOQdU@postgres.railway.internal:5432/railway
//postgresql://postgres:MVGXTpcuZfRfOcYxejuObgCwANjXOPfd@autorack.proxy.rlwy.net:16873/railway