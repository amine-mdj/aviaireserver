const mongoose = require('mongoose')
const { Schema } = mongoose

const materielsSchema = Schema(
	{
        title: String,
        price: String,
        img: {
          data: Buffer,
          contentType: String,
        },
      },
      { collection: 'materiels' }
)

const Materiels = mongoose.model('materiels', materielsSchema)
module.exports = Materiels