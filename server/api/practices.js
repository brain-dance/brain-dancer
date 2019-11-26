const router = require('express').Router();
const {Routine, Practice} = require('../db/models');
module.exports = router;

router.get('/', async (req, res, next) => {
  res.json();
});

//is this needed? see routines GET/:id
router.get('/:routineId', async (req, res, next) => {
  const allPractices = await Routine.findByPk(req.params.routineId, {
    include: [{model: Practice}]
  });
  res.json(allPractices);
});

router.post('/', async (req, res, next) => {
  res.json();
});

router.put('/', async (req, res, next) => {
  res.json();
});

router.delete('/', async (req, res, next) => {
  res.json();
});
