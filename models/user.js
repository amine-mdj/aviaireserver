const mongoose = require('mongoose')
const { Schema } = mongoose


const UserSchema = Schema(
	{
        name: String,
        email: String,
        password: String,
        address: String,
        role:{
          type:String,
          default:"user",
          enum:["user","admin"]
        }
      },
      { collection: 'user',
        strict: false,
        strictQuery: false, }
      
)


const User = mongoose.model('User', UserSchema)
module.exports = User