require('../db/server');
const mongoose = require("mongoose");


const dataschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
      
    },
    price   : {
        type: String,
        required: true,
       
    }

})



const Data = new mongoose.model('Data', dataschema);
module.exports = Data