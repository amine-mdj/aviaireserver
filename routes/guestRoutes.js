const express = require('express')
const router = express.Router()
const {getpaginatedcanari,getpaginatedmaterials,getallsearch,getarticles,getsinglearticle} = require('../controllers/guestContoller')

router.get('/paginatedCanari', getpaginatedcanari )

router.get('/paginatedMaterials', getpaginatedmaterials )

router.get('/allsearch', getallsearch)

router.get('/articles', getarticles)
  
router.get('/articles/:id', getsinglearticle)

module.exports = router