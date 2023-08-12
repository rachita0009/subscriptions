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
    password: {
        type: String,
        required: true,
      
    },
    subscriptions_Status   : {
        type: Number,
        default:0
       
    }

})



const User = new mongoose.model('User', dataschema);
module.exports = User