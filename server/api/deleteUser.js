const db=require('../db');

const deleteUser = async (req, res) => {
  const { id } = req.params;
 console.log(id);

  try {
      const result = await db.query('DELETE FROM users WHERE id = $1', [id]);

      // Check if any rows were deleted
      if (result.rowCount === 1) {
          res.send({ message: 'User deleted successfully' });
      } else {
          res.status(404).send({ message: 'User not found' });
      }
  } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).send({ message: 'Internal server error' });
  }
};

module.exports = deleteUser;