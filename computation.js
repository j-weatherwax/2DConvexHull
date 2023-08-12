//If the points are in a clockwise order, the result will be positive. 
//If they are in a counter-clockwise order, the result will be negative. 
//If they are collinear, the result will be 0.
function pointOrientation (p1, p2, p3) {
    return (p2.y - p1.y) * (p3.x - p2.x) - (p3.y - p2.y) * (p2.x - p1.x);
}

//Set edge between two points
function setEdge(p1, p2, list){
    let normDirection = (p2.x - p1.x)*(p2.y + p1.y);
    if (normDirection > 0) {
        list.push({p2, p1});
    } else {
        list.push({p1, p2});
    }
}

function computeHull() {
    if (pointList.length < 3) {
        return;
    }

    initHull();

    for (let i = 3; i < pointList.length; i++) {
        hullStep(pointList[i]);
    }
    return edgeList;
}

//Set initial triangle for hull
function initHull() {
    let sum = 0;
    for (let i = 0; i < pointList.length && i < 2; i++) {
        sum += (pointList[i+1].x - pointList[i].x) * (pointList[i+1].y + pointList[i].y);
    }
    sum += (pointList[0].x - pointList[2].x) * (pointList[0].y + pointList[2].y);

    //If the sum of the normals are negative, the normals face outwards.
    //If the sum of the normals are positive, force them to face outwards.
    if (sum < 0) {
        setEdge(pointList[0], pointList[1], edgeList);
        setEdge(pointList[1], pointList[2], edgeList);
        setEdge(pointList[2], pointList[0], edgeList);
    } else {
        setEdge(pointList[0], pointList[2], edgeList);
        setEdge(pointList[2], pointList[1], edgeList);
        setEdge(pointList[1], pointList[0], edgeList);  
    }
}

function hullStep(testpoint){

    newEdgeList = [];

    //Array for saying whether a line drawn from the test point hits the inside or outside of an edge
    relativePos = [];

    for (let i = 0; i < edgeList.length; i++) {
        if (pointOrientation(testpoint, edgeList[i].p1, edgeList[i].p2) <= 0) {
            relativePos.push("inside");
        } else {
            relativePos.push("outside");
        }
    }

    let previousidx = relativePos.length - 1;
    for (let idx = 0; idx < relativePos.length; idx++) {
        if (relativePos[previousidx] == "inside") {
            if (relativePos[idx] == "inside"){
                newEdgeList.push(edgeList[idx]);
            }
            if (relativePos[idx] == "outside") {
                setEdge(edgeList[previousidx].p2, testpoint, newEdgeList);
            }
        } else {
            if (relativePos[idx] == "inside") {
                setEdge(testpoint, edgeList[idx].p1, newEdgeList);
                
                //If current edge is inside, add it no matter what
                newEdgeList.push(edgeList[idx]);
            }
        }
        previousidx = idx;
    }
    edgeList = newEdgeList;
}
