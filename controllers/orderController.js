const order = require("../models/order");

const postorder = (req,res)=>{

    const neworder =  order({
        address: req.body.address,
        numitems: req.body.numitems,
        amount: req.body.amount,
        items: req.body.items,
        status:"pending"
      });
    
      neworder
      .save()
      .then((response) => {
        res.status(200).json({message:"commande ajoutée avec succés"})
      })
      .catch((err) => {
        res.status(400).json({message:"une erreur c'est produite"})
      });

}

const getorders = async(req,res)=>{
  const orderslist = await order.find()
  res.send(orderslist)
}

module.exports = {
  postorder,
  getorders
}