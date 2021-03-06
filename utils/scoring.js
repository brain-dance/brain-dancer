const {angleDifferences, labelPose} = require('./formatting');
const {
  translate,
  centroid,
  deepCopy,
  scaler,
  getCalibration
} = require('./scaling');

const {drawSkeleton, drawKeypoints} = require('../frontUtils/draw');

/**
 * Calculates the error between two wireframes (usually dancer vs choreographer)
 * @TODO please clarify the purpose of this function :)
 * @param {object} wfOne
 * @param {object} wfTwo
 */
const errCost = (wfOne, wfTwo) => {
  let errs = angleDifferences(wfOne.pose, wfTwo.pose);
  let temp = Object.keys(errs);
  //let count = 0;
  const toRet =
    temp.reduce((acc, curr) => acc + errs[curr] ** 2, 0) ** 0.5 / temp.length;

  return toRet;
};

/**
 * @TODO decent description of function
 * @param {number} errcost
 * @param {number} framecount
 */
const costToScore = (errcost, framecount) =>
  Math.round(10000 - (10000 * errcost) / (2 * Math.PI * framecount));

/**
 * @TODO decent description of function
 * @param {object} playerwfs
 * @param {object} choreowfs
 * @param {function} callback
 */
const minCostPairings = (playerwfs, choreowfs, callback) => {
  //So, what do these wireframes actually look like?
  //A playerwireframe is an object with a pose array, a timestamp, and a confidence score?

  //const costArr=(new Array(playerwfs.length)).fill(new Array(choreowfs.length));
  const costArr = [];
  for (let i = 0; i < playerwfs.length; i++) {
    costArr[i] = new Array(choreowfs.length);
  }
  const illegalRepCheck = deepCopy(costArr).map(row => row.fill(0));

  // console.log('cost arr initialized to: ', deepCopy(costArr));
  // let count=0;
  const minCostDynamic = (
    playerwfs,
    choreowfs,
    playerind = 0,
    choreoind = 0
  ) => {
    // console.log("IN MCD, count, playerind, choreoind: ", count, playerind, choreoind);
    // count++;
    if (playerind === playerwfs.length) return 0;
    //console.log("Here?")
    if (typeof costArr[playerind][choreoind] === 'number') {
      //console.log("This is being reached?");
      //console.log("IF so, ")
      return costArr[playerind][choreoind];
    }
    // console.log("Or here?");
    if (playerwfs.length - playerind > choreowfs.length - choreoind) {
      illegalRepCheck[playerind][choreoind]++;
      costArr[playerind][choreoind] = Infinity;
      return Infinity;
    }
    let paircost = errCost(playerwfs[playerind], choreowfs[choreoind]);
    let currcost = Infinity; //paircost+minCostDynamic(playerwfs, choreowfs, playerind+1, choreoind+1);
    for (let j = choreoind; j < choreowfs.length; j++) {
      let jcost =
        paircost + minCostDynamic(playerwfs, choreowfs, playerind + 1, j);
      //costArr[playerind][j]=jcost;
      if (jcost < currcost) currcost = jcost;
    }
    illegalRepCheck[playerind][choreoind]++;
    costArr[playerind][choreoind] = currcost;
    //console.log(currcost);
    return currcost;
  };
  const cost = minCostDynamic(playerwfs, choreowfs);
  let pairs = [];
  let currj = 0;
  // console.log('Cost Array: ', costArr);
  // console.log('Reps?', illegalRepCheck);
  for (let i = 0; i < costArr.length; i++) {
    let currcost = Infinity;
    for (let j = currj; j < choreowfs.length; j++) {
      if (typeof costArr[i][j] == 'number' && costArr[i][j] < currcost) {
        currcost = costArr[i][j];
        currj = j;
      }
    }
    pairs.push([playerwfs[i], choreowfs[currj]]);
  }
  console.log('Minimized cost pairings are:', {pairs, cost});
  if (callback) callback(costToScore(cost, playerwfs.length));
  return {pairs, cost: costToScore(cost, playerwfs.length)};
};

/**
 * @TODO decent description of function
 * @param {object} playerwf
 * @param {object} choreowf
 * @param {number} errbound
 */
const rendermistakes = (playerwf, choreowf, errbound) => {
  //console.log("In render mistakes, player wireframe is: ", playerwf);
  //console.log("In render mistakes, choreo wireframe is: ", choreowf);
  let temp = angleDifferences(playerwf.pose, choreowf.pose);
  //console.log("IRM, temp: ", temp);

  let toDisplay = Object.keys(temp)
    .filter(angle => temp[angle] > errbound)
    .join('')
    .toLowerCase();
  let toReturn = translate(
    choreowf.pose.keypoints,
    centroid(playerwf.pose.keypoints)
  );
  // console.log("IRM, RETURNING: ", toReturn);
  //console.log("IRM, toDisplay: ", toDisplay);
  //  console.log("IRM, post-filter: ", toReturn.filter(el=>{
  //    toDisplay.includes(el.part.toLowerCase())}));
  return toReturn; /*.filter((el)=>{
            //console.log("In filter, element is: ", el);
            //console.log("And, to be thorough, part is: ", el.part);
            return true/*toDisplay.includes(el.part.toLowerCase())});*/
  //Path needs to be written.
  //Takes the list of displayable angles, maps them to the relevant points.
  //Implementation depends sufficiently on the actual wireframe object structure that I'm not touching it yet.

  //const path=()=>{}
  //return toDisplay.map(path);
};

/**
 * Starts with an array of dancer wireframes and choreographer wireframes.
 * Map to dancer wireframes paired with mistake set of choreographer wireframes.
 * Center in the canvas, transform into lokoup map. Retun new array, which gets interacted with by event handler.
 * @param {array} pwfs dancer (player) wireframes
 * @param {array} cws choreographer wireframes
 * @param {object} center
 * @param {number} errbound
 * @param {number} refreshrate
 * @param {function} callback
 * @param {object} practiceCalibration
 * @param {object} routineCalibration
 */
const parseForReplay = (
  pwfs,
  cws,
  center,
  errbound,
  refreshrate,
  callback,
  practiceCalibration,
  routineCalibration
) => {
  //Start with an array of player wireframes and choreographer wireframes
  //Map to player wireframes paired with the mistake set of the choreo wireframes
  //Center in the canvas
  //Transform into the lookup map
  //Return the new arr, which then gets interacted with by an event handler

  // const labeledPracticeCalibration = labelPose(practiceCalibration);
  // const labeledRoutineCalibration = labelPose(routineCalibration);
  // const calibrator = getCalibration(
  //   labeledRoutineCalibration,
  //   labeledPracticeCalibration
  // );

  // let globalTranslate = {
  //   x: centroid(pwfs[0].pose.keypoints).x - center.x,
  //   y: centroid(pwfs[0].pose.keypoints).y - center.y
  // };
  // const translator = wireframe =>
  //   wireframe.map(keypoint => ({
  //     ...keypoint,
  //     position: {
  //       x: keypoint.position.x - globalTranslate.x,
  //       y: keypoint.position.y - globalTranslate.y
  //     }
  //   }));
  //Note - optimal implementation does all the transformations in a single map
  //No reason not to do that, except that this approach is easier to reason about
  //May be worth changing if we run into performance issues
  const toReturn = new Map(
    minCostPairings(pwfs, cws, callback)
      .pairs // .map(pair => {
      //   //pairs: first elem = dancer; second elem = choreographer
      //   //this is scaling the choreographer to match the dancer
      //   const target = labelPose(pair[0].pose); // practice
      //   const source = labelPose(pair[1].pose); //routine
      //   const scaledRoutine = scaler(source, target, calibrator); // the routine bit but corrected

      //   // const routineCopy = {...pair[1]}
      //   // const scaledRoutineCopy = routineCopy.keypoints.map(point=> {
      //   //   point.position.x = scaledRoutine[point.part].x
      //   // })
      //   // const unlabeledScaledRoutine = unLabelPose(scaledRoutine);
      //   return [
      //     pair[0],
      //     {
      //       ...pair[1],
      //       pose: {
      //         ...pair[1].pose,
      //         keypoints: pair[1].pose.keypoints.map(point => ({
      //           part: point.part,
      //           score: point.score,
      //           position: {
      //             x: scaledRoutine[point.part]
      //               ? scaledRoutine[point.part].x
      //               : scaledRoutine['head'].x,
      //             y: scaledRoutine[point.part]
      //               ? scaledRoutine[point.part].y
      //               : scaledRoutine['head'].y
      //           }
      //         }))
      //       }
      //     }
      //   ];
      // })
      // .map(pair => {
      //   //    console.log("In pfr, first map statement, pair is: ", pair);
      //   return [
      //     {
      //       ...pair[0],
      //       pose: {
      //         ...pair[0].pose,
      //         keypoints: translator(pair[0].pose.keypoints)
      //       }
      //     },
      //     {
      //       ...pair[1],
      //       pose: {
      //         ...pair[1].pose,
      //         keypoints: translator(pair[1].pose.keypoints)
      //       }
      //     }
      //   ];
      // })
      .map(pair => {
        //Theoretically, render mistakes should be the only time it's even possible to get deviation; everything else is equivalent
        // console.log('We expect the pairs to be the same here: ', pair);
        let toReturn = [pair[0], rendermistakes(pair[0], pair[1], errbound)];
        // console.log('We expect them to be different here: ', toReturn);
        //  console.log("In pfr, map statement two, toReturn is", toReturn);
        //  console.log("IPFRMS2, pair is : ", pair);
        return toReturn;
      })
      .map(pair => [
        pair[0].timestamp -
          pwfs[0].timestamp -
          ((pair[0].timestamp - pwfs[0].timestamp) % refreshrate),
        pair
      ])
  );
  // console.log('Parsed: result is: ', toReturn);
  return toReturn;
};

/**
 * @TODO description of what this does... -jyw
 * @param {timestamp} timestamp amount of time passed since video started playing
 * @param {array} processedFrames processed video frame data
 * @param {context} ctx for the canvas to display skellies
 * @param {number} width of canvas/video player
 * @param {number} height of canvas/video player
 * @param {number} refreshrate timeSlice
 * @param {number} lastupdate last time updated
 */
const timeChangeCallback = (
  timestamp,
  processedFrames,
  ctx,
  width,
  height,
  refreshrate,
  lastupdate
) => {
  let temp = timestamp - (timestamp % refreshrate);
  let newDraws = processedFrames.get(temp);
  if (temp !== lastupdate && newDraws) {
    ctx.clearRect(0, 0, width, height);

    // dancer
    // drawSkeleton(newDraws[0].pose.keypoints, 0, ctx, 0.35);
    // drawKeypoints(newDraws[0].pose.keypoints, 0, ctx, 0.35);

    // choreographer
    //newDraws[1] contains the error path, which should be drawn.
    drawSkeleton(newDraws[1], 0, ctx, 1, 'yellow');
    drawKeypoints(newDraws[1], 0, ctx, 1, 'yellow');
  }
};

module.exports.minCostPairings = minCostPairings;
module.exports.parseForReplay = parseForReplay;
module.exports.timeChangeCallback = timeChangeCallback;
//    module.exports={minCostPairings, parseForReplay, timeChangeCallback}
