
const products = require('../products.js');
const express= require('express')
const router = express.Router();


router.get(`/`, (req, res) => {
    return res.json(products)
})

router.get(`/:id`, (req, res) => {
    return res.json(products.find(item => item.id.toString() === req.params.id))
})


module.exports = router;
