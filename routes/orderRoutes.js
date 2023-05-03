const express = require('express')
const router = express.Router()
const {getorders,postorder} = require('../controllers/orderController')



router.post('/', postorder)
router.get('/', getorders)


module.exports = router 