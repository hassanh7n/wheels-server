const express = require('express');
const router = express.Router();


const {
    getAllWheels,
    getSingleWheel,
    createWheel,
    updateWheel,
    deleteWheel,
    showStats,
    uploadProductImage
} = require('../controllers/wheels');


router.route('/').get(getAllWheels);
router.route('/').post(createWheel);
router.route('/stats').get(showStats)
router.route('/uploads').post(uploadProductImage)
router.route('/:id').get(getSingleWheel);
router.route('/:id').patch(updateWheel);
router.route('/:id').delete(deleteWheel);


module.exports = router;