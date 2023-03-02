const materiels = require("../models/materiels");
const fs = require("fs"); 

const postMaterials = (req, res) =>{
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
      .then((res) => {
        console.log("materiel is saved");
      })
      .catch((err) => {
        console.log(err, "error has occur");
      });
      res.send('materiel is saved')
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
    
      res.status(200).json({ canari })
}

const deleteMaterials = (req, res) =>{
    materiels.deleteOne({ _id: req.params.id })
}


module.exports = {
    postMaterials,
    getMaterials,
    updateMaterials,
    deleteMaterials
}