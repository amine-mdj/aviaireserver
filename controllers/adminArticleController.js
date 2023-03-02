const article = require("../models/article");

const postarticle = (req, res)=>{
    const articles =  article({
        title: req.body.title,
        content: req.body.article,
        });
        articles.save()
      .then((res) => {
        console.log("article is saved");
      })
      .catch((err) => {
        console.log(err, "error has occur");
      });
      res.send('image is saved')
}

module.exports = {
    postarticle
}