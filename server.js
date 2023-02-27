const express = require('express')
require('dotenv').config()
const port = 8000
const cors = require("cors");
const multer = require("multer");
const bcrypt = require('bcrypt');
const fs = require("fs"); 
const jwt = require('jsonwebtoken')
const oiseaux = require("./models/oiseaux");
const article = require("./models/article");
const materiels = require("./models/materiels");
const User = require("./models/user");
const { connectDB } = require('./configs/mongodb');
const { title } = require('process');
const app = express()
const ITEMS_PER_PAGE = 13
connectDB()

function altertable () {
  
}


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
    const accesstoken = jwt.sign({id: user2._id, role:user2.role}, process.env.ACCESS_TOKEN_SECRET )
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
              // user2: user2,
              accesstoken: accesstoken
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

app.get('/materiels',  async (req,res)=>{
  const page = req.query.page
  const count = await materiels.estimatedDocumentCount()
  const allData = await materiels.find().limit(ITEMS_PER_PAGE).skip(page*ITEMS_PER_PAGE)
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





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


//  ------------------- admin routes  -------------------------------

// --------------------- canari routes --------------------------------

app.get('/canari', async (req, res) =>{
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
})

app.post('/canari',upload.single("oiseauximg"), (req,res) =>{
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
})

app.put('/canari/:id',upload.single("oiseauximg"), async(req, res) =>{
  
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
	
})

app.delete('/canari/:id', (req, res) =>{

})

app.post('/article', (req, res) =>{
  const articles =  article({
    title: req.body.title,
    content: req.body.article,
    });
    articles.save()
  .then((res) => {
    console.log("article is saved");
  })
  .catch((err) => {
    console.log(err, "error has occur");
  });
  res.send('image is saved')

})

app.get('/article', async (req, res) =>{
  const artcl = await article.find()
  res.send(artcl)
})

app.get('/1article/:id', async (req, res) =>{
  const artcl = await article.findById(req.params.id).exec()
  res.send(artcl)
})

// ------------- materiels routes ---------------------

app.post('/materiels',upload.single("matimg"), (req, res)=>{
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
})

app.get('/materials', async (req, res) =>{
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
})