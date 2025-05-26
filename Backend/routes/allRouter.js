const express = require('express')
const route = express.Router()
const {postBooking,getBooking,updateBooking} = require('../controller/bookController')

route.post('/api/booking',postBooking)
route.get('/api/booking/:id',getBooking)
route.put('/api/booking/:id',updateBooking)



module.exports = route