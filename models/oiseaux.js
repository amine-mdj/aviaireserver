const mongoose = require('mongoose')
const { Schema } = mongoose

const oiseauxSchema = Schema(
	{
        title: String,
        price: String,
        img: {
          data: Buffer,
          contentType: String,
        },
      },
      { collection: 'oiseaux' }
)

const Oiseaux = mongoose.model('Oiseaux', oiseauxSchema)
module.exports = Oiseaux