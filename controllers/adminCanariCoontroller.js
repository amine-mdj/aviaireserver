const oiseaux = require("../models/oiseaux");
const fs = require("fs"); 

const postcanari = (req,res) =>{
    const oiseauximage =  oiseaux({
        title: req.body.title,
        price: req.body.price,
        img: {
          data: fs.readFileSync("uploads/" + req.file.filename),
          contentType: "image/png",
        },
      });
    
      oiseauximage
      .save()
      .then((res) => {
        console.log("image is saved");
      })
      .catch((err) => {
        console.log(err, "error has occur");
      });
      res.send('image is saved')
}

const getcanari = async(req,res) =>{
    const count = await oiseaux.estimatedDocumentCount()
    const allData2 = await oiseaux.find()
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

const updatecanari = async(req,res) =>{
    const canari = await oiseaux.findByIdAndUpdate(
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


const deletecanari = (req,res) =>{
    oiseaux.findByIdAndDelete(req.params.id,  function (err, docs) {
      if (!err){
          console.log( docs);
      }
      else{
          console.log(err);
      }
   })
    
}


module.exports = {
    postcanari,
    getcanari,
    updatecanari,
    deletecanari

}