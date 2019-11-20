const mathJS=require('mathjs');
const distance=(x1, y1, x2, y2)=>{
    return Math.sqrt(Math.pow(x2-x1, 2)+Math.pow(y2-y1, 2))
}
const angle=(centerX, centerY, x2, y2, x3, y3)=>{
    return (((x2-centerX)*(x3-centerX))+((y2-centerY)*(y3-centerY)))/(distance(centerX, centerY, x2, y2)*distance(centerX, centerY, x3, y3));
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

const FArr=(vec)=>{
    //Do some stuff in a bit
}
const Jacobian=(vec)=>{
    //Do some stuff in a bit
}

const scale=(targets, errBound)=>{
const targetParams=[];
let currVals=[];
let error=[]//mathJS.add(targetParams, mathJS.multiply(currVals-1));
while(mathJS.size(error)>errBound){

}
}