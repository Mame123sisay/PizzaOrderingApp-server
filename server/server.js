const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const registerRestaurant = require('./api/register');
const login=require('./api/login');
const toppings=require('./api/toppings');
const getRoles=require('./api/roles');
const addRole = require('./api/addRole');
const editRole = require('./api/editRole');
const deleteRole = require('./api/deleteRole');
const getUsers = require('./api/users');
const deleteUser = require('./api/deleteUser');
const editUser= require('./api/editUser');
const editUserStatus= require('./api/editUserStatus');
const customerSignup = require('./api/customerSignup');
const customerLogin = require('./api/customerLogin');
const getRestaurants=require('./api/getRestaurants');
const PORT = process.env.PORT || 5000;
const db=require('./db');

const multer = require('multer');
const path = require('path');
const upload = multer({ dest: 'uploads/' }); // Set the destination for uploaded files
const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors());
// CORS configuration

const corsOptions = {
  origin: 'https://pizzaapp-client.onrender.com', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));

app.use(express.json());


app.get('/api/render', async (req, res) => {
  try {
    // Test the connection
    await db.query('SELECT NOW()'); // A simple query to check connection
    res.status(200).json({ message: 'Database is connected!' });
    res.send('well');
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed!' });
  }
});



app.get('/api/test', async (req, res) => {
  res.send('server run in test mode');
});

//  Restaurant Registration route
app.post('/api/register',upload.single('logo'), registerRestaurant);

app.get('/api/restaurants/', getRestaurants);
//login routes
app.post('/api/login', login);
app.post('/api/customer/signup', customerSignup);
app.post('/api/customer/login', customerLogin);
//updateorderstatus
app.put('/api/order/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
      const result = await db.query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
      res.json(result.rows[0]);
  } catch (error) {
      res.status(500).json({ error: 'Failed to update order status' });
  }
});


//Toppings Route

// Endpoint to get toppings
app.post('/api/toppings',toppings);
const getToppings =require('./api/getTopping');
app.get('/api/toppings/:restaurant_id',getToppings);
// Placeholder for restaurant menus
let menus = {};

//end point to add pizza and toppings
const addPizza = require('./api/addPizza');
app.post('/api/menu/addpizza/:restaurant_id',upload.single('image'), addPizza);
const getPizza = require('./api/getPizza');
app.get('/api/pizzas/:restaurant_id', getPizza);
const editPizza = require('./api/editPizza');
app.put('/api/menu/updatepizza/:id',editPizza);
const getAllPizza= require('./api/getAllPizza');
app.get('/api/allpizzas/',getAllPizza);
const getPizzaDetail = require('./api/getPizzaDetail');
app.get('/api/pizza/:id', getPizzaDetail);
const addOrder = require('./api/addOrder');
app.post('/api/order/', addOrder);
const getOrder = require('./api/getOrder');
app.get('/api/order/:restaurant_id',getOrder);
const customerOrderDetail= require('./api/customerOrderDetails')

;
app.get('/api/orderdetail/:customer_id', customerOrderDetail);

 
//Get Users
const getSpecificRoles=require('./api/specificRoles');
app.get('/api/users/:restaurant_id',getUsers);
app.delete('/api/user/delete/:id',deleteUser);
app.put('/api/user/editstatus/:id',editUserStatus);
app.put('/api/user/edituser/:id',editUser);
app.get('/api/roles/:id',getSpecificRoles);
const addUser = require('./api/addUser');
app.post('/api/users',addUser);
// Get roles
app.get('/api/roles/restaurant/:restaurant_id',getRoles);
//get role only each restaurant


// Add a role
app.post('/api/roles',addRole);
// Update a role's status
app.put('/api/roles/:id',editRole);

// Delete a role
app.delete('/api/roles/:id',deleteRole);
// Start the server

app.get('/api/render',()=>{
  // Check database connection
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
