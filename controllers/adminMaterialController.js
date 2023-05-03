const materiels = require("../models/materiels");
const fs = require("fs"); 

const postMaterials = (req, res) =>{
  if(!req.file){
    return res.status(400).json({message:"veuillez ajouter une image"})
  }
    const materielsimg =  materiels({
        title: req.body.title,
        price: req.body.price,
        img: {
          data: fs.readFileSync("uploads/" + req.file.filename),
          contentType: "image/png",
        },
    });
    
    materielsimg
      .save()
      .then((response) => {
        res.status(200).json({message:"ajouté avec succés"})
      })
      .catch((err) => {
        res.status(400).json({message:"une erreur c'est produite"})
        
      });
      
}


const getMaterials = async(req, res) =>{
    const count = await materiels.estimatedDocumentCount()
    const allData2 = await materiels.find()
    const allDatacvrt2 =  allData2.map((item) => {
      return {
        id:item._id,
        b64: Buffer.from(item.img.data).toString('base64'),
        title: item.title,
        price: item.price,
      }
    })
    
    res.send(allDatacvrt2)
}

const updateMaterials = async(req, res) =>{
  try{
    const canari = await materiels.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            title: req.body.title,
            price: req.body.price,
            img: {
              data: fs.readFileSync("uploads/" + req.file.filename),
              contentType: "image/png",
            
        }
      }
    },
        {
          new: true,
          runValidators: true,
        }
      
      )
    
      res.status(200).json({ message:"modifié avec succés" })
    }catch(error)
    {
      res.status(400).json({ message:"une erreur c'est produite" })
    }
}

const deleteMaterials = (req, res) =>{
    materiels.findByIdAndDelete(req.params.id,  function (err, docs) {
      if (!err){
        res.status(200).json({ message:"supprimé avec succés" })
      }
      else{
        res.status(400).json({ message:"une erreur c'est produite" })
      }
   })
}


module.exports = {
    postMaterials,
    getMaterials,
    updateMaterials,
    deleteMaterials
}