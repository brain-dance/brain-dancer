const router = require('express').Router();
const {Routine} = require('../db/models');
module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    res.send();
  } catch (err) {}
});

router.get('/:id', async (req, res, next) => {
  res.send();
});

router.post('/', async (req, res, next) => {
  res.send();
});

router.put('/', async (req, res, next) => {
  res.send();
});

router.delete('/', async (req, res, next) => {
  res.send();
});
