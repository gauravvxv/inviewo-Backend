const express = require('express')
const route = express.Router()
const {postBooking,getBooking} = require('../controller/bookController')

route.post('/api/booking',postBooking)
route.get('/api/booking/:id',getBooking)


module.exports = route