const router = require('express').Router();
const {Assignment, User, Routine} = require('../db/models');
module.exports = router;

// get all a user's assignments
router.get('/', async (req, res, next) => {
  try {
    let {id} = req.user;

    const assignments = await Assignment.findAll({
      where: {userId: id},
      include: [Routine]
    });
    console.log('TCL: assignments', assignments);
    // //get user's teams
    // const teamIds = await User.findByPk(id, {
    //   include: {model: Team}
    // }).then(user => user.teams.map(team => team.id));

    //load teams with eager-loaded data
    // let allTeams = await Team.findAll({
    //   include: [{model: User}, {model: Routine}],
    //   where: {
    //     id: teamIds
    //   }
    // });
  } catch (err) {
    next(err);
  }
});
