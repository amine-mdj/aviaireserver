const express = require('express')
require('dotenv').config()
const port = 8000
const cors = require("cors");
const multer = require("multer");
const bcrypt = require('bcrypt');
const fs = require("fs"); 
const oiseaux = require("./models/oiseaux");
const User = require("./models/user");
const { connectDB } = require('./configs/mongodb');
const { title } = require('process');
const app = express()
const ITEMS_PER_PAGE = 13
connectDB()


app.use(cors());
app.use('/public', express.static('public'));
app.use(express.json());


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });






app.post('/login', async (req,res)=>{
  const email = req.body.email
  const password = req.body.password
  // Check if username and password is provided
  if (!email || !password) {
    return res.status(400).json({
      message: "Username or Password not present",
    })
  }
  try {
    const user2 = await User.findOne({ email: email })
    if (!user2) {
      res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      })
    } else {
      // comparing given password with hashed password
      bcrypt.compare(password, user2.password).then(function (result) {
        result
          ? res.status(200).json({
              message: "Login successful",
              user2: user2,
            })
          : res.status(400).json({ message: "Login not succesful" })
      })
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    })
  }
})

app.post('/register', async (req,res)=>{
  
   hashedPass = await bcrypt.hash(req.body.password,10)
  const user =  User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPass
    
  });
  user
  .save()
  .then((res) => {
    console.log("user is saved");
  })
  .catch((err) => {
    console.log(err, "error has occur");
  });
  
  res.send('user is saved')

})

app.get('/oiseaux',  async (req,res)=>{
  
  const allData = await oiseaux.find()
  const allDatacvrt =  allData.map((item) => {
    return {
      b64: Buffer.from(item.img.data).toString('base64'),
      title: item.title,
      price: item.price,
    }
  });
  
    
  res.send(allDatacvrt)
})

app.get('/canarilist',  async (req,res)=>{
    const page = req.query.page
    const count = await oiseaux.estimatedDocumentCount()
    const allData = await oiseaux.find().limit(ITEMS_PER_PAGE).skip(page*ITEMS_PER_PAGE)
    const numberofpages = count / ITEMS_PER_PAGE
    const allDatacvrt =  allData.map((item) => {
      return {
        b64: Buffer.from(item.img.data).toString('base64'),
        title: item.title,
        price: item.price,
      }
    });

    const body = {allDatacvrt, numberofpages}
    
      
    res.send(body)
})

app.get('/canarilistsearch', async (req, res)=>{
  const search = req.query.search
  
  const data = await oiseaux.find({ "title": { "$regex": search, "$options": "x" } },).limit(5)

  res.send(data)
}
)

app.post('/oiseaux',upload.single("oiseauximg"), (req, res)=> {
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

} )

app.post('/oiseaux')



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})