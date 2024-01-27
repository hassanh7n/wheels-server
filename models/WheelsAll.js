const mongoose = require('mongoose');



const WheelsSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please provide name"],
        maxlength : [100, "Name cannot contain more than 100 characters"]
    },
    price : {
        type : Number,
        default : 0
    },
    discription : {
        type : String,
    },
    images : {
        type : Array,
        required : true
    },
    company:{
        type : String,
        required : [true, "Please provide company name"]
    },
    contactNo: {
        type : String,
        minlength : 11,
        required : [true, "Please provide Contact-No"]
    },
    category : {
        type : String,
        required : [true, "please provide wheels category"],
        enum : ['Motorbike', 'Car', 'Bus', 'Cycle', 'Sports']
    },
    location : {
        type : String,
        required : [true, "please provide your  address category"],
    },
    type : {
        type : String,
        required : [true, "Please provide wheels type"],
        enum : ["Auto", "Manual"]
    },
    color : {
        type : String
    },
    verified:{
        type : Boolean,
        default : 'false'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user'],
    },
},
{timestamps : true, toJSON : {virtuals : true},
toObject : {virtuals : true}
}
);














module.exports = mongoose.model("WheelsAll", WheelsSchema);