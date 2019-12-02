const router = require('express').Router();
const {Assignment, Routine} = require('../db/models');
module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    let {id} = req.user;
    if (id) {
      const userAssignments = await Assignment.findAll({
        include: [Routine],
        where: {userId: id}
      });
      res.send(userAssignments);
    }
  } catch (err) {
    next(err);
  }
});
