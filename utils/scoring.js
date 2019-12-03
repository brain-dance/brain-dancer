const {angleDifferences} = require('./formatting');
const {translate, centroid, deepCopy} = require('./scaling');
const {drawSkeleton} = require('../frontUtils/draw');
const errCost = (wfOne, wfTwo) => {
  let errs = angleDifferences(wfOne.pose, wfTwo.pose);
  let temp = Object.keys(errs);
  //let count = 0;
  const toRet =
    temp.reduce((acc, curr) => acc + errs[curr] ** 2, 0) ** 0.5 / temp.length;

  //console.log("In errCost, cost is: ", toRet);
  return toRet;
};
const costToScore = (errcost, framecount) =>
  Math.round(10000 - (10000 * errcost) / (2 * Math.PI * framecount));
const minCostPairings = (playerwfs, choreowfs, callback) => {
  //So, what do these wireframes actually look like?
  //A playerwireframe is an object with a pose array, a timestamp, and a confidence score?

  //const costarr=(new Array(playerwfs.length)).fill(new Array(choreowfs.length));
  const costarr = [];
  for (let i = 0; i < playerwfs.length; i++) {
    costarr[i] = new Array(choreowfs.length);
  }
  const illegalRepCheck = deepCopy(costarr).map(row => row.fill(0));

  console.log('cost arr initialized to: ', deepCopy(costarr));
  let count = 0;
  const minCostDynamic = (
    playerwfs,
    choreowfs,
    playerind = 0,
    choreoind = 0
  ) => {
    console.log(
      'IN MCD, count, playerind, choreoind: ',
      count,
      playerind,
      choreoind
    );
    count++;
    if (playerind === playerwfs.length) return 0;
    //console.log("Here?")
    if (typeof costarr[playerind][choreoind] === 'number') {
      //console.log("This is being reached?");
      //console.log("IF so, ")
      return costarr[playerind][choreoind];
    }
    // console.log("Or here?");
    if (playerwfs.length - playerind > choreowfs.length - choreoind) {
      illegalRepCheck[playerind][choreoind]++;
      costarr[playerind][choreoind] = Infinity;
      return Infinity;
    }
    let paircost = errCost(playerwfs[playerind], choreowfs[choreoind]);
    let currcost = Infinity; //paircost+minCostDynamic(playerwfs, choreowfs, playerind+1, choreoind+1);
    for (let j = choreoind; j < choreowfs.length; j++) {
      let jcost =
        paircost + minCostDynamic(playerwfs, choreowfs, playerind + 1, j);
      //costarr[playerind][j]=jcost;
      if (jcost < currcost) currcost = jcost;
    }
    illegalRepCheck[playerind][choreoind]++;
    costarr[playerind][choreoind] = currcost;
    //console.log(currcost);
    return currcost;
  };
  const cost = minCostDynamic(playerwfs, choreowfs);
  let pairs = [];
  let currj = 0;
  console.log('Cost Array: ', costarr);
  console.log('Reps?', illegalRepCheck);
  for (let i = 0; i < costarr.length; i++) {
    let currcost = Infinity;
    for (let j = currj; j < choreowfs.length; j++) {
      if (typeof costarr[i][j] == 'number' && costarr[i][j] < currcost) {
        currcost = costarr[i][j];
        currj = j;
      }
    }
    pairs.push([playerwfs[i], choreowfs[currj]]);
  }
  console.log('Minimized cost pairings are:', {pairs, cost});
  if (callback) callback(costToScore(cost, playerwfs.length));
  return {pairs, cost: costToScore(cost, playerwfs.length)};
};

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

const parseForReplay = (pwfs, cws, center, errbound, refreshrate, callback) => {
  //Start with an array of player wireframes and choreographer wireframes
  //Map to player wireframes paired with the mistake set of the choreo wireframes
  //Center in the canvas
  //Transform into the lookup map
  //Return the new arr, which then gets interacted with by an event handler
  let globalTranslate = {
    x: centroid(pwfs[0].pose.keypoints).x - center.x,
    y: centroid(pwfs[0].pose.keypoints).y - center.y
  };
  const translator = wireframe =>
    wireframe.map(keypoint => ({
      ...keypoint,
      position: {
        x: keypoint.position.x - globalTranslate.x,
        y: keypoint.position.y - globalTranslate.y
      }
    }));
  //Note - optimal implementation does all the transformations in a single map
  //No reason not to do that, except that this approach is easier to reason about
  //May be worth changing if we run into performance issues
  const toReturn = new Map(
    minCostPairings(pwfs, cws, callback)
      .pairs.map(pair => {
        //    console.log("In pfr, first map statement, pair is: ", pair);
        return [
          {
            ...pair[0],
            pose: {
              ...pair[0].pose,
              keypoints: translator(pair[0].pose.keypoints)
            }
          },
          {
            ...pair[1],
            pose: {
              ...pair[1].pose,
              keypoints: translator(pair[1].pose.keypoints)
            }
          }
        ];
      })
      .map(pair => {
        //Theoretically, render mistakes should be the only time it's even possible to get deviation; everything else is equivalent
        console.log('We expect the pairs to be the same here: ', pair);
        let toReturn = [pair[0], rendermistakes(pair[0], pair[1], errbound)];
        console.log('We expect them to be different here: ', toReturn);
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
  console.log('Parsed: result is: ', toReturn);
  return toReturn;
};
const timeChangeCallback = (
  timestamp,
  map,
  ctx,
  width,
  height,
  refreshrate,
  lastupdate
) => {
  let temp = timestamp - (timestamp % refreshrate);
  let newDraws = map.get(temp);
  if (temp !== lastupdate && newDraws) {
    console.log('Context, width, height: ', ctx, width, height);
    ctx.clearRect(0, 0, width, height);
    drawSkeleton(newDraws[0].pose.keypoints, 0, ctx);
    drawSkeleton(newDraws[1], 0, ctx);
    //newDraws[1] contains the error path, which should also be drawn.
  }
};
module.exports.minCostPairings = minCostPairings;
module.exports.parseForReplay = parseForReplay;
module.exports.timeChangeCallback = timeChangeCallback;
//    module.exports={minCostPairings, parseForReplay, timeChangeCallback}
