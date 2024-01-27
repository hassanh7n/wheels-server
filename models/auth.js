const mongoose = require('mongoose');
const validator = require('validator');
const bcryptJs = require('bcryptjs');
const jwt = require('jsonwebtoken');



const UserModel = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please provide your name"],
        maxlength : 30
    },
    email : {
        type : String,
        required : [true, "Please provide your email address"],
        unique : true,
        validate : {
            validator : validator.isEmail,
            message : "Please provide valid email"
        }
    },
    password : {
        type : String,
        required : [true, "Please provide password"],
        minlength : [7, "password must contain 7 letters"],
    },
    role : {
        type : String,
        enum : ["admin", "user"],
        default : "user"
    }
});




UserModel.pre('save', async function(){
    if(!this.isModified('password')) return;
    const salt = await bcryptJs.genSalt(10);
    this.password = await bcryptJs.hash(this.password, salt)
});


UserModel.methods.createJWT = function(){
    return jwt.sign(
        {userId : this._id, name : this.name},
        process.env.JWT_SECRET,
        {
            expiresIn : process.env.JWT_LIFETIME,
        }
    )
};


UserModel.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcryptJs.compare(candidatePassword, this.password);
    return isMatch;
}

module.exports = mongoose.model("User", UserModel);