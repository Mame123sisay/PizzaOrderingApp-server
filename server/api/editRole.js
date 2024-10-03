const db = require('../db');
const permissionsList = [
    { id: 1, label: 'Update Order Status' },
    { id: 2, label: 'See Orders' },
    { id: 3, label: 'See Customers' },
    { id: 4, label: 'Add User' },
    { id: 5, label: 'Create Roles' },
];

const editRole = async (req, res) => {
    const { role_name, permissions } = req.body; 
    console.log(permissions); // permissions should be an array of labels
    const roleId = req.params.id;

    // Validate input
    if (!role_name || !Array.isArray(permissions)) {
        return res.status(400).json({ message: 'Role name and permissions are required.' });
    }

    try {
        // Update the role name
        const updateResult = await db.query('UPDATE roles SET role_name = $1 WHERE id = $2', [role_name, roleId]);
        if (updateResult.rowCount === 0) {
            return res.status(404).json({ message: 'Role not found.' });
        }

        // Fetch current permissions for the role
        const { rows: currentPermissions } = await db.query('SELECT permission_id FROM role_permissions WHERE role_id = $1', [roleId]);
        const currentPermissionIds = currentPermissions.map(row => row.permission_id);

        // Map permission labels to their corresponding IDs
        const permissionsToAdd = permissions.map(label => {
            const permission = permissionsList.find(p => p.label === label);
            return permission ? permission.id : null; // Get ID or null if not found
        }).filter(id => id !== null); // Filter out nulls

        // Determine permissions to remove
        const permissionsToRemove = currentPermissionIds.filter(id => !permissionsToAdd.includes(id));

        // Remove permissions that are no longer assigned
        if (permissionsToRemove.length > 0) {
            await db.query('DELETE FROM role_permissions WHERE role_id = $1 AND permission_id = ANY($2)', [roleId, permissionsToRemove]);
        }

        // Add new permissions
        const permissionsAlreadyAssigned = new Set(currentPermissionIds);
        const permissionQueries = permissionsToAdd
            .filter(permissionId => !permissionsAlreadyAssigned.has(permissionId)) // Only add if not already assigned
            .map(permissionId => 
                db.query('INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)', [roleId, permissionId])
            );

        if (permissionQueries.length > 0) {
            await Promise.all(permissionQueries);
        }

        // Fetch the updated permissions for the response
        const updatedPermissions = await db.query('SELECT permission_id FROM role_permissions WHERE role_id = $1', [roleId]);
        const updatedPermissionIds = updatedPermissions.rows.map(row => row.permission_id);

        // Respond with the updated role data
        res.status(200).json({ role_name, permissions: updatedPermissionIds });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ message: 'An error occurred while updating the role.', error: error.message });
    }
};

module.exports = editRole;