const mongoose = require('mongoose')
const { Schema } = mongoose

const orderSchema = Schema(
	{
        address: String,
        numitems: Number,
        amount: Number,
        items: Array,
        status: String,
      },
      { collection: 'order' }
)

const Order = mongoose.model('Order', orderSchema)
module.exports = Order