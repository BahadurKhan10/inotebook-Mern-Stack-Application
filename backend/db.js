const mongoose = require('mongoose');

const mongoURI = "mongodb://localhost:27017"

const connectToMongo=()=>{
   mongoose.connect(mongoURI,{
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      family: 4});

}

module.exports = connectToMongo;
