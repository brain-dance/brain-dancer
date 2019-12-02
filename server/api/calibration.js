const router = require('express').Router();
const {CalibrationFrame} = require('../db/models');
const {getPose, canvasify} = require('../../utils/formatting');

module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const cFrame = await CalibrationFrame.findAll();
    res.json(cFrame);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const fetchedSkelly = await getPose(await canvasify(req.body));
    // const calibrationSkelly = await getPose(fetchedSkelly);
    console.log('calib', fetchedSkelly);
    const cFrame = await CalibrationFrame.create(fetchedSkelly);
    res.json(cFrame);
  } catch (err) {
    next(err);
  }
});
