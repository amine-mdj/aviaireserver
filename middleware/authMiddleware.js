const jwt = require('jsonwebtoken')
const protect = async (req, res, next) => {
  let token

 
    try {
      // Get token from header
      console.log(req.headers.authorization)
      token = JSON.parse(req.headers.authorization.split(' ')[1])
      
      

      // Verify token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      console.log(decoded)

      
       next()
    } catch (error) {
      res.sendStatus(403);
      console.log(error)
      
    }
  }

  


module.exports = { protect }
