const db=require('../db');

 const deleteRole =async ( req,res) => {
  const { id } = req.params;
  await db.query('DELETE FROM roles WHERE id = $1', [id]);
  res.sendStatus(204);
}
module.exports=deleteRole;