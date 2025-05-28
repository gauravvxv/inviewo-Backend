const {Pool} = require('pg')
const dotenv = require('dotenv')
dotenv.config()

// const pool = new Pool({
//     user: process.env.user,
//     host: process.env.host,
//     database: process.env.database,
//     password: process.env.password,
//     port: process.env.port 
// })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.host,
  family: 4, // 👈 forces IPv4 instead of IPv6
});



module.exports = pool;