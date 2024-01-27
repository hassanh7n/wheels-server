const User = require('../models/auth');
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');




//register

const register = async(req, res) => {
    const {name, email, password} = req.body;
    const isEmailAlreadyExisted = await User.findOne({email : email});
    if(isEmailAlreadyExisted){
        throw new CustomError.BadRequestError('Email already existed')
    }
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const user = await User.create({name, email, role, password});

    const token = user.createJWT();


    res.status(StatusCodes.CREATED).json({
        user : user,
        token
    })
};




//login

const login = async(req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        throw new CustomError.BadRequestError("Please provide email and password")
    };

    const user = await User.findOne({email});

    if(!user){
        throw new CustomError.UnAuthorizeError("Invalid Credentials")
    };

    const isPasswordCorrect = await user.comparePassword(password);

    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError("Invalid Credentials")
    };

    const token = await user.createJWT();


    res.status(StatusCodes.OK).json({
        user : user,
        token
    })
}







module.exports = {
    register,
    login
}
