const router = require('express').Router();
const {Assignment, User} = require('../db/models');
module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    let {id} = req.user;
    const userAssignments = await Assignment.findAll({
      include: [{model: User, where: {id: id}}]
    });
    res.send(userAssignments);
  } catch (err) {
    next(err);
  }
});
