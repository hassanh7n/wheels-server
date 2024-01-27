const express = require('express');
const router = express.Router();
const {
    getAllWheels,
    getSingleWheel,
    sliderWheel
} = require('../controllers/allWheels');

router.route('/').get(getAllWheels)
router.route('/slider').get(sliderWheel)
router.route('/:id').get(getSingleWheel)




module.exports = router;