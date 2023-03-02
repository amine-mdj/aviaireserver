const article = require("../models/article");
const oiseaux = require("../models/oiseaux");
const materiels = require("../models/materiels");
const ITEMS_PER_PAGE = 13

const getpaginatedcanari = async(req,res)=>{
    const page = req.query.page
    const count = await oiseaux.estimatedDocumentCount()
    const allData = await oiseaux.find().limit(ITEMS_PER_PAGE).skip(page*ITEMS_PER_PAGE)
    const numberofpages = count / ITEMS_PER_PAGE
    const allDatacvrt =  allData.map((item) => {
      return {
        b64: Buffer.from(item.img.data).toString('base64'),
        title: item.title,
        price: item.price,
      }
    });

    const body = {allDatacvrt, numberofpages}
    
      
    res.send(body)
}

const getpaginatedmaterials = async(req,res)=>{
    const page = req.query.page
  const count = await materiels.estimatedDocumentCount()
  const allData = await materiels.find().limit(ITEMS_PER_PAGE).skip(page*ITEMS_PER_PAGE)
  const numberofpages = count / ITEMS_PER_PAGE
  const allDatacvrt =  allData.map((item) => {
    return {
      b64: Buffer.from(item.img.data).toString('base64'),
      title: item.title,
      price: item.price,
    }
  });

  const body = {allDatacvrt, numberofpages}
  
    
  res.send(body)

}

const getallsearch = async(req,res)=>{
    const search = req.query.search
    
    const data = await oiseaux.find({ "title": { "$regex": search, "$options": "x" } },).limit(5)
  
    res.send(data)

}

const getarticles = async(req,res)=>{
    const artcl = await article.find()
    res.send(artcl)

}

const getsinglearticle = async(req,res)=>{
    const artcl = await article.findById(req.params.id).exec()
    res.send(artcl)

}

module.exports = {
    getpaginatedcanari,
    getpaginatedmaterials,
    getallsearch,
    getarticles,
    getsinglearticle
}