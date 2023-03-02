const express = require('express')
const router = express.Router()
const {postarticle} = require('../controllers/adminArticleController')
const { protect } = require('../middleware/authMiddleware')


router.post('/',protect, postarticle)


module.exports = router 