const express = require('express')
const router = express.Router()
const {login,register,refresh,sendpasswordlink,forgotpassword} = require('../controllers/authController')

router.post('/login', login)

router.get('/refresh', refresh)
  
router.post('/register', register)

router.post('/sendpasswordlink', sendpasswordlink)

router.post('/:id/:token', forgotpassword)
  
  


module.exports = router