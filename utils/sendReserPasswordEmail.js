const sendEmail = require('./sendEmail');

const sendResetPasswordEmail = async({name, email, token, origin}) => {

    const resetUrl = `${origin}/user/reset-password?token=${token}&email=${email}`

    const message = `<p>Please confirm your email by clicking this link : <a href="${resetUrl}">Reset Password</a>  </p>`

    return sendEmail({
        to : email,
        subject : "Reset Password",
        html : `<h4>Hello ${name} ${message}</h4>`
    })
}



module.exports = sendResetPasswordEmail;