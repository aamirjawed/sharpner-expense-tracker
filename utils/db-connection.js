const mongoose  = require("mongoose")
const  { DB_NAME } = require("../constant.js");



const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host} `)
    } catch (error) {
        console.log("MONGODB connection failed:", error);
        process.exit(1)
    }
}

module.exports = connectDb



















// const {Sequelize} = require('sequelize')


// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//     host:process.env.DB_HOST,
//     dialect:"mysql"
// });


// (async () => {
//     try {
//          await sequelize.authenticate();
//     console.log("Database is connected")
//     } catch (error) {
//         console.log("Error connecting database")
//     }
   
// })()

// module.exports = sequelize


