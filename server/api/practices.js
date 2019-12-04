const router = require('express').Router();
const {Routine, Practice} = require('../db/models');

module.exports = router;

router.get('/', async (req, res, next) => {
  res.json();
});

//is this needed? see routines GET/:id
router.get('/:routineId', async (req, res, next) => {
  try {
    const allPractices = await Routine.findByPk(req.params.routineId, {
      include: [{model: Practice}]
    });
    res.json(allPractices);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    // add row in Practices table
    const {url, title, routineId, userId, grade} = req.body;
    const newPractice = await Practice.create({
      url,
      title,
      routineId,
      userId,
      grade
    });

    // (( skellies are generated client side ))

    // // initiate server side skelly processor
    // const generatedSkellies = generateWireframes(req.body.url);

    // await Promise.all(
    //   generatedSkellies.forEach(skelly => {
    //     VideoFrame.create(skelly);
    //   })
    // );

    res.status(200).json(newPractice);
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  res.json();
});

router.delete('/', async (req, res, next) => {
  res.json();
});
