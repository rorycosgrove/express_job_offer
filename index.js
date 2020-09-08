const express = require('express')
const mongoose = require('mongoose')
const offerRoutes = require('./routes/offer.js')
const productRoutes = require('./routes/product.js')
const bodyParser = require('body-parser')

const app = express();
const port = 3000;
const version = 1;

mongoose.connect(process.env.DB_CONNECTION_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => console.log('connected to DB')
)

app.use(bodyParser.json())
app.use('/offers', offerRoutes)
app.use('/products', productRoutes)

app.listen(port, () => console.log("listening on port" + port))


