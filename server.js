const express = require('express')
require('dotenv').config()
const port = 8000
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session");
const session = require('express-session')
const passportStrategy = require("./passport");
const passportroute = require("./routes/passportroutes");
const { connectDB } = require('./configs/mongodb');
const app = express()
connectDB()

app.use(
	cookieSession({
		name: "session",
		keys: ["cyberwolve"],
		maxAge: 24 * 60 * 60 * 100,
	})
);

app.use(passport.initialize());
app.use(passport.session());


app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));


app.use('/public', express.static('public'));
app.use(express.json());

app.use('/materials', require('./routes/adminMaterialRoutes'))
app.use('/canari', require('./routes/adminCanariRoutes'))
app.use('/articles', require('./routes/adminArticleRoutes'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/guest', require('./routes/guestRoutes'))
app.use("/auth", passportroute)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

















