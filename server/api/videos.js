const router = require('express').Router();
const {Video} = require('../db/models');
module.exports = router;

//NOTE: Can add gateway middleware (requireLoggedIn, requireOnTeam, requireOwnVideo)
// /api/videos route
router.get('/', async (req, res, next) => {
  //NOTE: Will have to send in userId and/or teamId from thunk [either / or]
  const {teamId, userId} = req.body;
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
    const video = await Video.findByPk({
      attributes: ['url', 'status'],
      where: {id: id}
    });
    //NOTE: Sending back the video url + status; not the video file
    res.json(video);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {id} = req.user;
    //NOTE: Will need thunk to provide teamId
    const {url, status, teamId} = req.body;
    const video = await Video.create(url, status);
    video.setUser(id);
    video.setTeam(teamId);
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
