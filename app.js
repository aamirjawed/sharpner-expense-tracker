require('dotenv').config();

const express = require('express');
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const db = require('./utils/db-connection')
const userRoutes  = require('./routes/userRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const helmet = require('helmet')
const compression = require('compression')
const app = express();

const port = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5000',
    credentials: true  
}));

app.use(express.json()); // For JSON requests
app.use(express.urlencoded({ extended: false })); // For HTML form submissions

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());



// userRoutes
app.use('/user', userRoutes)

// expense routes
app.use('/expense', expenseRoutes)

// payment routes
app.use('/payment', paymentRoutes)

app.use(helmet())
app.use(compression())

db.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}).catch((err) => {
  console.log("Error syncing database in app.js")
});
