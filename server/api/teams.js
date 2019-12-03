const router = require('express').Router();
const {Team, User, UserTeam, Routine} = require('../db/models');
module.exports = router;

// /api/teams route

//get all teams a user belongs to
router.get('/', async (req, res, next) => {
  if (req.user) {
    try {
      let {id} = req.user;

      //get user's teams
      const teamIds = await User.findByPk(id, {
        include: {model: Team}
      }).then(user => user.teams.map(team => team.id));

      //load teams with eager-loaded data
      let allTeams = await Team.findAll({
        include: [{model: User}, {model: Routine}],
        where: {
          id: teamIds
        }
      });

      //unwrap sequelize object
      allTeams = allTeams.map(team => team.toJSON());

      //format and return teams
      res.json(
        allTeams.map(team => {
          const thisUser = team.users.find(user => user.id === +id);
          team.members = team.users;
          delete team.users;
          team.role = thisUser.userteams.role;
          return team;
        })
      );
    } catch (err) {
      next(err);
    }
  } else {
    res.end();
  }
});

//get team by id
router.get('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const team = await Team.findByPk(id);
    res.json(team);
  } catch (err) {
    next(err);
  }
});

//add new team member
router.post('/:teamId', async (req, res, next) => {
  try {
    const {role, userId} = req.body;

    await UserTeam.create({
      role,
      userId,
      teamId: req.params.teamId
    });

    const memberToAdd = await User.findByPk(userId);
    res.status(201).json(memberToAdd);
  } catch (err) {
    next(err);
  }
});

//add new team
router.post('/', async (req, res, next) => {
  try {
    const {name, description, category} = req.body;
    const newTeam = await Team.create({name, description, category});
    // creator of team (req.user) is created as a choreographer in the new team
    await UserTeam.create({
      role: 'choreographer',
      userId: req.user.id,
      teamId: newTeam.id
    });
    res.status(201).json(newTeam);
  } catch (err) {
    next(err);
  }
});

// update team (name, etc)
router.put('/:id', async (req, res, next) => {
  try {
    const {name, description, category} = req.body;
    await Team.update(
      {name, description, category},
      {where: {id: req.params.id}, returning: true}
    );
    const updatedTeam = Team.findByPk(req.params.id);
    res.status(201).json(updatedTeam);
  } catch (err) {
    next(err);
  }
});

router.delete('/:teamId/:userId', async (req, res, next) => {
  try {
    await UserTeam.destroy({
      where: {
        teamId: req.params.teamId,
        userId: req.params.userId
      }
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

//remove a team (should be admin?)
router.delete('/:id', async (req, res, next) => {
  try {
    //check if logged in user is choreographer and belongs on team
    // const reqUserTeams = await User.findByPk(req.user.id, {include: [{model: Team}]})
    // const belongsToTeam = reqUserTeams.teams.filter(team=>{
    //   team.id === req.params.id
    // })
    // if (req.user.status === 'choreographer' && belongsToTeam.length > 0)
    // {
    const {id} = req.params;
    await Team.destroy({where: {id: id}});
    res.status(204).end();
    // }
  } catch (err) {
    next(err);
  }
});
