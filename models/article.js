const mongoose = require('mongoose')
const { Schema } = mongoose

const articleSchema = Schema(
	{
        title: String,
        img: {
          data: Buffer,
          contentType: String,
        },
        content: String
      },
      { collection: 'article' }
)

const Article = mongoose.model('Article', articleSchema)
module.exports = Article