const express = require('express')
const router = express.Router()
const {login,register, refresh} = require('../controllers/authController')

router.post('/login', login)

router.get('/refresh', refresh)
  
router.post('/register', register)
  
  


module.exports = router