const express = require('express')
const router = express.Router()
const {postMaterials,getMaterials,updateMaterials,deleteMaterials} = require('../controllers/adminMaterialController')
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

router.post('/', protect ,upload.single("matimg"), postMaterials )
  
router.get('/', getMaterials)
  
router.put('/:id',protect,upload.single("matimg"), updateMaterials)
  
router.delete('/:id',protect,deleteMaterials )

module.exports = router