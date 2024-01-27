const jwt = require('jsonwebtoken');
const { token } = require('morgan');

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

const isTokenValid = ( {token} ) => jwt.verify(token, process.env.JWT_SECRET);




const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: {user} });
  const refreshTokenJWT = createJWT({ payload: {user, refreshToken} });


  const oneDay = 1000 * 60 * 60 * 24;
  const LongerDay = 1000 * 60 * 60 * 24 * 30;

  const fiveSeconds = 1000 * 5;

  res.cookie('token', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });

  // res.cookie('refreshToken', refreshTokenJWT, {
  //   httpOnly: true,
  //   expires: new Date(Date.now() + LongerDay),
  //   secure: process.env.NODE_ENV === 'production',
  //   signed: true,
  // });
};




// const attachCookiesToResponse = ({ res, user }) => {
//   const token = createJWT({ payload: user });

//   const oneDay = 1000 * 60 * 60 * 24;

//   const fiveSeconds = 1000 * 5;

//   res.cookie('token', token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + oneDay + fiveSeconds),
//     secure: process.env.NODE_ENV === 'production',
//     signed: true,
//   });
// };

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
