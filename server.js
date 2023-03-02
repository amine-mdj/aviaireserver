const express = require('express')
require('dotenv').config()
const port = 8000
const cors = require("cors");
const { connectDB } = require('./configs/mongodb');
const app = express()
connectDB()


app.use(cors());
app.use('/public', express.static('public'));
app.use(express.json());

app.use('/materials', require('./routes/adminMaterialRoutes'))
app.use('/canari', require('./routes/adminCanariRoutes'))
app.use('/articles', require('./routes/adminArticleRoutes'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/guest', require('./routes/guestRoutes'))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

















