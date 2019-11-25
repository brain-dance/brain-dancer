const {angleDifferences}=require('./formatting');

const errCost=(firstPose, secondPose)=>{
    let errs=angleDifferences(firstPose, secondPose);
    let temp=Object.keys(errs);
    //let count = 0;
    return ((temp.reduce((acc, curr)=>acc+(curr**2), 0))**0.5)/temp.length;


}
const minCostPairings=(playerwfs, choreowfs)=>{
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

    }
    module.exports={minCostPairings}