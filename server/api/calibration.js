const router = require('express').Router();
const {CalibrationFrame} = require('../db/models');
const {getPose} = require('../../backUtils/canvasify');
const {createCanvas, loadImage} = require('canvas');

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
    const canvas = createCanvas(480, 360);
    const ctx = canvas.getContext('2d');
    loadImage(req.body.url).then(image => {
      ctx.drawImage(image, 0, 0, 480, 360);
    });
    const fetchedSkelly = await getPose(canvas);
    // const calibrationSkelly = await getPose(fetchedSkelly);
    console.log('calib', fetchedSkelly);
    const cFrame = await CalibrationFrame.create({
      pose: fetchedSkelly,
      routineId: req.body.routineId
    });
    res.json(cFrame);
  } catch (err) {
    next(err);
  }
});
