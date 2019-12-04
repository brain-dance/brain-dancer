const faker = require('faker');
const {generateWireframes} = require('../utils/videoProcessing');
const {
  User,
  UserTeam,
  Team,
  Routine,
  Practice,
  CalibrationFrame,
  VideoFrame,
  Assignment
} = require('../server/db/models');
const db = require('../server/db/db');
const {green, red} = require('chalk');

const {getPose} = require('../../backUtils/canvasify');
const {createCanvas, loadImage} = require('canvas');

const totalSeeds = 100;

//TEST ACCOUNTS - Users
const testUsers = [
  {
    name: 'Misty Copeland',
    email: 'misty.copeland@dance.com',
    password: '12345'
  },
  {
    name: 'Fred Astaire',
    email: 'fred.astaire@dance.com',
    password: '12345'
  }
  //THINK OF EDGE CASES
];

//TEST ACCOUNTS - Team
const testTeams = [
  {
    name: "Waltzin' Matildas",
    description:
      'Australian troupe committed to spreading the love of this ballad to the rest of the world.',
    category: 'Contemporary'
  },
  {
    name: 'Twinkle Toes',
    description:
      'Ballerinas with a passion for glitter and adapting Hollywood musicals for the ballet.',
    category: 'Ballet'
  },
  {
    name: 'Boppin 2 Tha Beat',
    description: 'Dance is life!',
    category: 'Hip hop'
  },
  {
    name: 'The Left Feet',
    description: 'Beginners here to bring coordination into our lives',
    category: 'Line Dance'
  },
  {
    name: 'Country Bumpkins',
    description: 'Solo square dancing is where it is at!',
    category: 'Square Dance'
  },
  {
    name: 'TipTop HipHop',
    description: 'We are all about hip hop.',
    category: 'Hip hop'
  }
  //THINK OF EDGE CASES
];

//TEST ACCOUNTS - Video
const practiceVideo = {
  url:
    'https://res.cloudinary.com/braindance/video/upload/v1575417318/cgtmrwxvchuy7hwcr9je.mp4',
  title: 'My practice'
}; // https://res.cloudinary.com/braindance/image/upload/v1575417047/e3bssmvvdpx5injax450.png

const gorillaDansu = {
  url:
    'http://res.cloudinary.com/braindance/video/upload/v1574881624/db7tcuvwdxvjly2m4rme.mp4',
  title: 'Gorilla Dansu'
};

const idkDance = {
  url:
    'http://res.cloudinary.com/braindance/video/upload/v1574881747/dduo3i3txavwqwx4y8ad.mp4',
  title: 'IDK'
};

const finnDance = {
  url:
    'https://res.cloudinary.com/braindance/video/upload/v1574713680/yu1eqjego1oi8vajvlmr.mp4',
  title: 'The Finn Dance'
};
const armDance = {
  url:
    'http://res.cloudinary.com/braindance/video/upload/v1575416484/fzdfud7ss4yis0you1hm.mp4',
  title: 'Arm Dance'
};
const sumoSquat = {
  url:
    'http://res.cloudinary.com/braindance/video/upload/v1575418342/d5grvawl1kxi08uwt6pz.mp4',
  title: 'The Sumo Squat'
};
const jonathan = {
  url:
    'http://res.cloudinary.com/braindance/video/upload/v1575435105/fbnicwnnlusjsfcrowdm.mp4',
  title: 'Jonathan'
};
const frantic = {
  url:
    'https://res.cloudinary.com/braindance/video/upload/v1575435362/eetrqr1eucsk5so26pe4.mp4',
  title: 'Frantic'
};

const testAssignments = [{completed: true}, {completed: false}];

//CREATE TEST USERS
async function createTestUsers() {
  const seededUsers = await Promise.all(
    testUsers.map(user => User.create(user))
  );

  const seededTeams = await Promise.all(
    testTeams.map(team => Team.create(team))
  );

  const seededPractice = await Practice.create(practiceVideo);

  const seededAssignments = await Promise.all(
    testAssignments.map(assignment => Assignment.create(assignment))
  );

  const gorillaRoutine = await Routine.create(gorillaDansu);
  const idkRoutine = await Routine.create(idkDance);
  const finn = await Routine.create(finnDance);

  // generate lots of wireframes - comment out if this takes too long :)
  const gorillaSkellies = await generateWireframes(gorillaRoutine.url);
  await Promise.all(
    gorillaSkellies.map((skelly, i) => {
      return VideoFrame.create({
        pose: skelly,
        routineId: gorillaRoutine.id,
        frameNumber: i
      });
    })
  );
  const idkSkellies = await generateWireframes(idkRoutine.url);
  await Promise.all(
    idkSkellies.map((skelly, i) => {
      return VideoFrame.create({
        pose: skelly,
        routineId: idkRoutine.id,
        frameNumber: i
      });
    })
  );

  // routine belongs to team
  await gorillaRoutine.setTeam(2);
  await idkRoutine.setTeam(2);
  await finn.setTeam(1);
  // practice belongsto routine
  await seededPractice.setRoutine(1);

  //Associations
  //Team belongsToMany User
  let [waltzinMatildas, twinkleToes, tipTopHipHop] = seededTeams;

  let [choreographer, dancer] = seededUsers;

  //add users to
  await UserTeam.create({
    role: 'choreographer',
    userId: 1,
    teamId: 1
  });
  await UserTeam.create({
    role: 'dancer',
    userId: 1,
    teamId: 2
  });
  await UserTeam.create({
    role: 'choreographer',
    userId: 2,
    teamId: 2
  });
  await UserTeam.create({
    role: 'dancer',
    userId: 2,
    teamId: 3
  });

  let [finishedAssignment, pendingAssignment] = seededAssignments;

  //Video belongsTo User
  await seededPractice.setUser(dancer);

  //Assignment belongsTo User + belongsTo Routine; assign 2 routines to Fred Astaire, one of which is completed
  await finishedAssignment.setRoutine(1);
  await finishedAssignment.setUser(2);
  await pendingAssignment.setRoutine(2);
  await pendingAssignment.setUser(2);

  //Routine / Practice hasMany VideoFrames
  // let [
  //   performanceFrame1,
  //   performanceFrame2,
  //   practiceFrame1,
  //   practiceFrame2
  // ] = seededVideoFrames;

  // await seededPractice.setVideoframes([practiceFrame1, practiceFrame2]);
}

//CREATE FAKE USERS
async function createFakeUsers() {
  //Fake users & teams created at large
  for (let i = 0; i < totalSeeds; i++) {
    const user = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: '12345'
    };

    const team = {
      name: faker.lorem.word() + ' ' + faker.lorem.word(),
      description: faker.lorem.sentence(),
      category: [
        'ballet',
        'hip hop',
        'square dance',
        'line dance',
        'contemporary'
      ][Math.round(Math.random())]
    };

    await Promise.all([User.create(user), Team.create(team)]);
  }
}

//SEED DB (TEST + FAKE USERS)
const seedDB = async () => {
  try {
    await db.sync({force: true});
    await createTestUsers();
    await createFakeUsers();
    let totalUsers = totalSeeds + testUsers.length;

    let totalTeams = totalSeeds + testTeams.length;

    let totalVideos = totalSeeds + 2;

    console.log(
      green(
        `...5, 6, 7, 8! Database seeded with ${totalUsers} users, ${totalTeams} teams, ${totalVideos} videos, ${'totalVideoFrames'} video frames and ${totalCalibrations} calibrations.`
      )
    );
  } catch (err) {
    console.error(red(err));
  }
};

module.exports = seedDB;

if (require.main === module) {
  seedDB()
    .then(() => {
      console.log(green('Time to get dancing!'));
      db.close();
    })
    .catch(err => {
      console.error(red(err));
      db.close();
    });
}
