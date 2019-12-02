const router = require('express').Router();
const {Assignment, Routine, Team} = require('../db/models');
module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    let {id} = req.user;
    if (id) {
      //find all user's assignments + team routine belongs to
      const userAssignments = await Assignment.findAll({
        include: [{model: Routine, include: [Team]}],
        where: {userId: id}
      });
      res.send(userAssignments);
    }
  } catch (err) {
    next(err);
  }
});
