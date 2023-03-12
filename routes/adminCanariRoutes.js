const express = require('express')
const router = express.Router()
const {postcanari,getcanari,updatecanari,deletecanari} = require('../controllers/adminCanariCoontroller')
const { protect } = require('../middleware/authMiddleware')
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });

router.get('/', getcanari)
  
router.post('/', protect ,upload.single("oiseauximg"), postcanari)
  
router.put('/:id', protect ,upload.single("oiseauximg"), updatecanari)
  
router.delete('/:id', protect , deletecanari)

module.exports = router
  