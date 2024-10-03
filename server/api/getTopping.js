const db=require('../db');
const getTopping=async (req,res)=>{
  const{restaurant_id} =req.params;
  
  const getTopping = await db.query('select * from toppings where restaurant_id=$1',[restaurant_id]);
  res.json(getTopping.rows);
 




};
module.exports =getTopping;