const { StatusCodes } = require('http-status-codes');
const Wheels = require('../models/wheels');
const CustomError = require('../errors');
const WheelsSlider = require('../models/WheelsAll');



const getAllWheels = async(req, res) => {
    const {name, type, category, sort, numericFilters, company, location } = req.query;


    const queryObject = {};


    if(name){
        queryObject.name = { $regex : name, $options : "i"}
    }
    if(company){
        queryObject.company = { $regex : company, $options : "i"}
    }
    if(location){
      queryObject.location = { $regex : location, $options : "i"}
  }
    if (type && type !== 'all'){
        queryObject.type = type;
    };
    if (category && category !== 'all'){
        queryObject.category = category;
    };

    if (numericFilters) {
        const operatorMap = {
          '>': '$gt',
          '>=': '$gte',
          '=': '$eq',
          '<': '$lt',
          '<=': '$lte',
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(
          regEx,
          (match) => `-${operatorMap[match]}-`
        );
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((item) => {
          const [field, operator, value] = item.split('-');
          if (options.includes(field)) {
            queryObject[field] = { [operator]: Number(value) };
          }
        });
      }
    


    let result = WheelsSlider.find(queryObject);


    if (sort === 'latest') {
        result = result.sort('-createdAt');
      }
      if (sort === 'oldest') {
        result = result.sort('createdAt');
      }
    if(sort === 'a-z'){
        result = result.sort('position');
    }
    if(sort === 'z-a'){
        result = result.sort('-position');
    }
    
    // pagination

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    
    const skip = (page - 1) * limit;


    result = result.skip(skip).limit(limit);


    const wheels = await result;

    const totalwheels = await WheelsSlider.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalwheels / limit);



    res.status(StatusCodes.OK).json({
        wheels, totalwheels, numOfPages
    })
};

const sliderWheel = async(req, res) => {
  const allWheels = await Wheels.find({});


  res.status(StatusCodes.OK).json({
    allWheels
  })

}


const getSingleWheel = async(req, res) => {
    const wheel = await WheelsSlider.findOne({_id : req.params.id})

    if(!wheel){
        throw new CustomError.NotFoundError(`No item with this id ${req.params.id}`)
    }

    res.status(StatusCodes.OK).json({
       wheel
    })
}


module.exports = {
    getAllWheels,
    getSingleWheel,
    sliderWheel
}