let mongoose = require('mongoose');

//product schema
let productSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    company:{
        type: String,
        required: true
    },
    manDate:{
        type: Date,
        required: true
    },
    expDate:{
        type: Date,
        required: true
    }
});

let Product = module.exports = mongoose.model('Product',productSchema);