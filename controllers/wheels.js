const Wheels = require('../models/wheels');
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const User = require('../models/auth');
const mongoose = require('mongoose')
const moment = require('moment');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');


//get all wheels 
const getAllWheels = async(req, res) => {
    const wheels = await Wheels.find({createdBy : req.user.userId});



    res.status(StatusCodes.OK).json({
        wheels,
        nbhits : wheels.length
    })
};



//single wheel
const getSingleWheel = async(req, res) => {
    const wheel = await Wheels.findOne({_id : req.params.id})

    if(!wheel){
        throw new CustomError.NotFoundError(`No item with this id ${req.params.id}`)
    }

    res.status(StatusCodes.OK).json({
       wheel
    })
}



//create wheel
const createWheel = async(req, res) => {
    // console.log(req.body);
    req.body.createdBy = req.user.userId;
    const wheel = await Wheels.create(req.body);



    res.status(StatusCodes.CREATED).json({
        wheel
    })
};





//edit or update wheel 
const updateWheel = async(req, res) => {
    // console.log(req.user.userId);
    const {
        user : {userId},
        params : {id : wheelId},
    } = req;
    console.log(userId);
    // const isSame = await Wheels.find({_id : wheelId});
    const wheel = await Wheels.findOneAndUpdate(
        {createdBy : req.user.userId, _id : wheelId },
        req.body,
        { new : true, runValidators : true}
    )
    // const wheel = await Wheels.findByIdAndUpdate({_id : wheelId, createdBy : userId}, req.body, {
    //     new : true,
    //     runValidators :true,
    // });
    if(!wheel){
        throw new CustomError.NotFoundError(`No product with this id : ${wheelId}`)
    }

    res.status(StatusCodes.OK).json({
        wheel
    })
};



// delete wheel
const deleteWheel = async(req, res) => {
    const {
        user : {userId},
        params : {id : wheelId},
    } = req;

    const wheel = await Wheels.findOneAndDelete({createdBy : req.user.userId, _id : wheelId})
    if(!wheel){
        throw new CustomError.NotFoundError(`No item with this id${wheelId}`)
    }

    res.status(StatusCodes.OK).json({
        msg : "Deleted Successfuly!"
    })
};


//stats
const showStats = async(req, res) => {

    let stats = await Wheels.aggregate([
      {$match : {createdBy : mongoose.Types.ObjectId(req.user.userId)}},
      {$group:{_id:'$type', count : {$sum : 1}}}
    ])
  
  
    // stats = stats.reduce((acc, curr) => {
    //   const { _id: title, count } = curr;
    //   acc[title] = count;
    //   return acc;
    // }, {});
  
    // const defaultStats = {
    //   pending: stats.pending || 0,
    //   interview: stats.interview || 0,
    //   declined: stats.declined || 0,
    // };
  
    let monthlyApplications = await Wheels.aggregate([
      { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 },
      
    ]);
  
    monthlyApplications = monthlyApplications
      .map((item) => {
        const {
          _id: { year, month },
          count,
        } = item;
        const date = moment()
          .month(month - 1)
          .year(year)
          .format('MMM Y');
        return { date, count };
      })
      .reverse();
  
  
  
    res.status(StatusCodes.OK).json({
      monthlyApplications
    })
  }



const uploadProductImage = async(req, res) => {
    // console.log(req);
    try {
  
      let images = (req.files.file);
      let imagesBuffer = [];
        // console.log(images);
      for (let i =0; i < images.length;  i++){
            const result = await cloudinary.uploader.upload(images[i].tempFilePath, {
            folder: "banners",
      });
      
        imagesBuffer.push({
          url: result.secure_url
        })
  
        // console.log(result.secure_url);
      }
      console.log(imagesBuffer);
  
      // req.body.images = imagesBuffer
      //  const banner = await Banner.create(req.body)
       if(imagesBuffer.length === 0){
          img = images
       }else{
        img = imagesBuffer
       }
      res.status(201).json({
          success: true,
          img 
      })
      
  } catch (error) {
      console.log(error);
      
  }
}



module.exports = {
    getAllWheels,
    getSingleWheel,
    createWheel,
    updateWheel,
    deleteWheel,
    showStats,
    uploadProductImage
};