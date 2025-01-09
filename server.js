const express = require('express');
const connectDB = require('./config/database');
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');

const app = express();
require('dotenv').config();
connectDB();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/books', bookRoutes);
app.use('/api/users',userRoutes); 


 app.listen(PORT, () =>{
     console.log(`Server running on port ${PORT}`);
     });

