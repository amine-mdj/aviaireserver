const mongoose = require('mongoose')
const { Schema } = mongoose


const UserSchema = Schema(
	{
        name: String,
        email: String,
        password: String,
        role:{
          type:String,
          default:"user",
          enum:["user","admin"]
        }
      },
      { collection: 'user' }
)


const User = mongoose.model('User', UserSchema)
module.exports = User