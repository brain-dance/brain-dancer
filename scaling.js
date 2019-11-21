const mathJS=require('mathjs');
const distance=(x1, y1, x2, y2)=>{
    return Math.sqrt(Math.pow(x2-x1, 2)+Math.pow(y2-y1, 2))
}
const angle=(centerX, centerY, x2, y2, x3, y3)=>{
    //Need to include a check for sign of the angle
    return Math.acos((((x2-centerX)*(x3-centerX))+((y2-centerY)*(y3-centerY)))/(distance(centerX, centerY, x2, y2)*distance(centerX, centerY, x3, y3)));
}

const nextPoint=(x1, y1, x2, y2, theta, distance)=>{
    let temp=angle(x1, y1, x2, y2, x2, y1)+theta;
    return {x: x1+distance*Math.cos(temp), y: y1+distance*Math.sin(temp)}
}

const dDistancedX1=(x1, y1, x2, y2)=>{
    return ((1/2)*Math.pow(Math.pow((x2-x1), 2)+Math.pow((y2-y1), 2), -0.5)*(2*x1-2*x2))
}
const dAngledcenterX=(centerX, centerY, x2, y2, x3, y3)=>{
    let u=((x2-centerX)*(x3-centerX))+((y2-centerY)*(y3-centerY));
    let du=(centerX*(x3+x2-(2*centerX)))*-1;
    let v=distance(centerX, centerY, x2, y2)*distance(centerX, centerY, x3, y3);
    let dv=dDistancedX1(centerX, centerY, x2, y2)*distance(centerX, centerY, x3, y3)+dDistancedX1(centerX, centerY, x3, y3)*distance(centerX, centerY, x2, y2);
    return (((u*dv)-(v*du))/(Math.pow(v, 2)))
}
const dAngledx2=(centerX, centerY, x2, y2, x3, y3)=>{
    let u=((x2-centerX)*(x3-centerX))+((y2-centerY)*(y3-centerY));
    let v=distance(centerX, centerY, x2, y2)*distance(centerX, centerY, x3, y3);
    let du=x3-centerX;
    let dv=dDistancedX1(x2, y2, centerX, centerY)*distance(centerX, centerY, x3, y3);
    return (((u*dv)-(v*du))/(Math.pow(v, 2)))

}
/*
    We have 16 nodes
    Hence, 32 values we're optimizing over
    We

*/
const FArr=(vec)=>{
    //Do some stuff in a bit
}
const Jacobian=(vec)=>{
    //Do some stuff in a bit
}
const vecToFrame=(vec)=>{
    //Do some stuff
}

const scale=(targets, errBound)=>{
const targetParams=[];
let currVals=[];
let currFArr=FArr(currVals)
let error=(mathJS.add(targetParams, mathJS.multiply(currFArr,-1)));
while(mathJS.dot(error, error)>errBound){
    currVals=mathJS.add(currVals, mathJS.multiply(mathJS.multiply(mathJS.inv(Jacobian(currVals)), currFArr), -1));
    currFArr=FArr(currVals);
}
return currVals;
}


module.exports={
    scale, angle, distance
}