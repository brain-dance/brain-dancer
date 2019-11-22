const router = require('express').Router();
const {Video} = require('../db/models');
module.exports = router;

//NOTE: Can add gateway middleware (requireLoggedIn, requireOnTeam, requireOwnVideo)
// /api/videos route
router.get('/', async (req, res, next) => {
  //NOTE: Hardcoded teamId for now; thunk will send in userId and/or teamId
  // const {teamId, userId} = req.body;
  const teamId = 1;
  try {
    let videos;
    if (teamId) {
      videos = await Video.findAll({
        where: {teamId: teamId}
      });
    } else if (userId) {
      videos = await Video.findAll({
        where: {userId: userId}
      });
    }
    res.json(videos);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const video = await Video.findByPk(id);
    //NOTE: Sending back the video url + status; not the video file
    res.json(video);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    //NOTE: Will have req.user eventually via passport
    // const {id} = req.user;
    const id = 2;
    //NOTE: Will need thunk to provide teamId
    const {url, status, teamId} = req.body;
    const video = await Video.create({url, status});
    if (id) {
      video.setUser(id);
    }
    if (teamId) {
      video.setTeam(teamId);
    }
    res.status(200).json(video);
    //NOTE: Sends video url + status; doesn't upload to Cloudinary
  } catch (err) {
    next(err);
  }
});

//NOTE: May need PUT later but cannot think of where it fits in user stories

router.delete('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    await Video.destroy({where: {id: id}});
    //NOTE: This will only delete Postgres entry; not video in Cloudinary
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
