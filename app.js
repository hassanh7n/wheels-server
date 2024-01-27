require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const morgan = require('morgan');
const cookieParser  = require('cookie-parser')
const fileUpload = require('express-fileupload')
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const authenticateUser = require('./middleware/authentication');
// USE V2
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//routes
const authRoutes = require('./routes/auth');
const wheelsRoutes = require('./routes/wheels');
const allWheelRoutes = require('./routes/allWheels');
const WheelsAllRoutes = require('./routes/WheelsAll');

app.use(express.json());
app.use(express.static('./public'));
// extra packages
// app.use(morgan());
app.use(cookieParser(process.env.JWT_SECRET))
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(helmet());

app.use(xss());
app.use(cors());
app.use(fileUpload({ useTempFiles: true }));

// routes



app.get('/', (req, res) => {
  res.status(200).send("Wheels-API")
})
app.get('/api/v1', (req, res) => {
  console.log(req.signedCookies)
  res.status(200).send("cookies Routes")
})
app.use('/api/v1/auth', authRoutes);
app.use("/api/v1/wheel", authenticateUser ,wheelsRoutes);
app.use('/api/v1/allWheels', allWheelRoutes);
app.use('/api/v1/wheelsAll', authenticateUser, WheelsAllRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);




const port = process.env.PORT || 5000;

const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.MONGO_URI);
    //await EventsSchema.create(EventsData);
    //await BlogsSchema.create(BlogsData);
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};


start()