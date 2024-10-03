const db=require('../db');


const editUserStatus = async(req,res) => {
  const { id } = req.params;
  const { is_active } = req.body;
  await db.query('UPDATE users SET is_active = $1 WHERE id = $2', [is_active, id]);
  res.sendStatus(204);
}
module.exports =editUserStatus;