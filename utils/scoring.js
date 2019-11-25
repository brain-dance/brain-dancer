const {angleDifferences}=require('./formatting');
const {translate, centroid}=require('./scaling');
import {drawSkeleton} from '../brain/posenet2';
const errCost=(wfOne, wfTwo)=>{
    let errs=angleDifferences(wfOne.pose, wfTwo.pose);
    let temp=Object.keys(errs);
    //let count = 0;
    return ((temp.reduce((acc, curr)=>acc+(curr**2), 0))**0.5)/temp.length;


}
const minCostPairings=(playerwfs, choreowfs)=>{
    //So, what do these wireframes actually look like?
    //A playerwireframe is an object with a pose array, a timestamp, and a confidence score?

    const costarr=(new Array(playerwfs.length)).fill(new Array(choreowfs.length));
    const minCostDynamic=(playerwfs, choreowfs, playerind=0, choreoind=0)=>{
            if(costarr[playerind][choreoind]) return costarr[playerind][choreoind]
            if(playerwfs.length-playerind>choreowfs.length-choreoind) return Infinity;
            let currcost=errCost(playerwfs[playerind], choreowfs[choreoind])+minCostDynamic(playerwfs, choreowfs, playerind+1, choreoind);
            for(let j=choreoind; j<choreowfs.length; j++){
                let jcost=errCost(playerwfs[playerind], choreowfs[j])+minCostDynamic(playerwfs, choreowfs, playerind+1, j);
                if(jcost<currcost) currcost=jcost;			
                
            }
            costarr[playerind][choreoind]=currcost;
            return currcost;
        }
        minCostDynamic(playerwfs, choreowfs);
        let pairs=[];
        let currj=0;
        
        for(let i=0; i<costarr.length; i++){
            let currcost=Infinity;
            for(let j=currj; j<choreowfs.length; j++){
                if(costarr[i][j]&&costarr[i][j]<currcost){
                    currcost=costarr[i][j];
                    currj=j;
                }
            }
            pairs.push([playerwfs[i], choreowfs[j]]);
        }
        return pairs;
    }

    const rendermistakes=(playerwf, choreowf, errbound)=>{
        let temp=angleDifferences(playerwf.pose, choreowf.pose);

        let toDisplay=Object.keys(angleDifferences).filter(angle=>temp[angle]>errbound).join('');
        let toReturn=translate(choreowf.pose, centroid(playerwf.pose))
        return toReturn.filter(el=>toDisplay.includes(el.part));
        //Path needs to be written.
        //Takes the list of displayable angles, maps them to the relevant points.
        //Implementation depends sufficiently on the actual wireframe object structure that I'm not touching it yet.
        

        //const path=()=>{}
        //return toDisplay.map(path);
       

    }

    const parseForReplay=(pwfs, cws, center, errbound, refreshrate)=>{
        //Start with an array of player wireframes and choreographer wireframes
        //Map to player wireframes paired with the mistake set of the choreo wireframes
        //Center in the canvas
        //Transform into the lookup map
        //Return the new arr, which then gets interacted with by an event handler
        let globalTranslate={x: centroid(pwfs[0].pose).x-center.x, y: centroid(pwfs[0].pose).y-center.y};
        const translator=wireframe=>wireframe.map(
            coord=>({x: coord.x-globalTranslate.x, y: coord.y-globalTranslate.y})
        );
        //Note - optimal implementation does all the transformations in a single map
        //No reason not to do that, except that this approach is easier to reason about
        //May be worth changing if we run into performance issues
        return new Map(minCostPairings(pwfs, cws).map(
            pair=>{
                return [{...pair[0], pose: translator(pair[0].pose)}, {...pair[1], pose: translator(pair[1].pose)}]
            }
        ).map(pair=>{
            [pair[0], rendermistakes(pair[0], pair[1], errbound)]
        }).map(pair=>[pair[0].timestamp-pair[0].timestamp%refreshrate, pair]))
    }
    const timeChangeCallback=(timestamp, map, ctx, width, height, refreshrate, lastupdate)=>{
        let temp=timestamp-timestamp%refreshrate;
        let newDraws=map.get(temp);
        if(temp!==lastupdate&&newDraws){
            ctx.clearRect(0, 0, width, height);
            drawSkeleton(newDraws[0].pose, 0, ctx);
            drawSkeleton(newDraws[1].pose, 0, ctx);
            //newDraws[1] contains the error path, which should also be drawn.

        }
    }
    module.exports={minCostPairings, parseForReplay, timeChangeCallback}