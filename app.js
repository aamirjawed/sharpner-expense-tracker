require('dotenv').config();

const express = require('express');
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const userRoutes  = require('./routes/userRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const premiumRoutes = require('./routes/premiumRoutes')
const helmet = require('helmet')
const compression = require('compression');
const connectDb = require('./utils/db-connection');
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

app.use('/premium', premiumRoutes )

app.use(helmet())
app.use(compression())

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}).catch((err) => {
  console.log("Error syncing database in app.js")
});
