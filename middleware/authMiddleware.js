const jwt = require('jsonwebtoken')
const protect = async (req, res, next) => {
  let token

 
    try {
      // Get token from header
      token = JSON.parse(req.headers.authorization.split(' ')[1])
      

      // Verify token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

      
       next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Not authorized')
    }
  }

  


module.exports = { protect }
