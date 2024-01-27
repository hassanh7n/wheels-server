const  {
    createJWT,
    isTokenValid,
    attachCookiesToResponse
    
} = require('./jwt');
const createTokenUser = require('./createToken');
const checkPermissions = require('./checkPermissions');
const sendVerificationEmail = require('./sendVerificationToken');
const sendResetPasswordEmail = require('./sendReserPasswordEmail');
const hashString = require('./createHash')

module.exports  =  {
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
     createTokenUser,
    checkPermissions,
    sendVerificationEmail,
    sendResetPasswordEmail,
    hashString
}