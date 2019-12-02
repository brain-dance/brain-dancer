const router = require('express').Router();
const {CalibrationFrame} = require('../db/models');
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
    const cFrame = await CalibrationFrame.create(req.body);
    res.json(cFrame);
  } catch (err) {
    next(err);
  }
});
