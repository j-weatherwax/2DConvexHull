const canvas = document.getElementById('drawpad');

canvas.height = window.innerHeight / 2;
canvas.width = canvas.height;

const ctx = canvas.getContext('2d', { willReadFrequently: true });

//line styling
ctx.strokeStyle = "black";
ctx.lineWidth = 2;

pointList = [];
edgeList = [];


function clearCanvas(reset) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    edgeList = [];

    if (reset == true) {
        pointList = [];
    }
}

function drawLines(){
    for (let i = 0; i < edgeList.length; i++) {
        ctx.beginPath();
        ctx.moveTo(edgeList[i].p1.x, edgeList[i].p1.y);
        ctx.lineTo(edgeList[i].p2.x, edgeList[i].p2.y);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();
        // if (normals == true){
        //     drawNormals();
        // }
    }
}

function drawNormals(){
    for (let i = 0; i < edgeList.length; i++) {
        ctx.beginPath();

        let dx = edgeList[i].p2.x - edgeList[i].p1.x;
        let dy = edgeList[i].p2.y - edgeList[i].p1.y;
        let norm = Math.sqrt(dx*dx + dy*dy);
        
        let scale = canvas.height/15;

        dx = scale*dx/norm;
        dy = scale*dy/norm;

        ctx.moveTo((edgeList[i].p2.x + edgeList[i].p1.x) / 2, (edgeList[i].p2.y + edgeList[i].p1.y) / 2);
        ctx.lineTo((edgeList[i].p2.x + edgeList[i].p1.x) / 2 + dy, (edgeList[i].p2.y + edgeList[i].p1.y) / 2 - dx);
        ctx.strokeStyle = "#507D75";
        ctx.stroke();
        ctx.closePath();
    }
}

function drawPoints(){
    for (let i = 0; i < pointList.length; i++) {
        for (let j = 0; j < edgeList.length; j++) {
            //if point is on the same line as an edge, color it blue.
            ctx.fillStyle = "cornflowerblue";
            if (edgeList[j].p1.x == pointList[i].x && edgeList[j].p1.y == pointList[i].y) {
                ctx.fillStyle = "crimson";
                break;
            }
        }   
        
        if (pointList.length < 3) {
            ctx.fillStyle = "crimson";
        }
        
        ctx.beginPath();
        ctx.arc(pointList[i].x, pointList[i].y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

function main(e) {
    // Transform mouse position to match canvas' coordinate system
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = (e.clientY - rect.top);

    //Add point to list
    if (!pointList.includes({x, y})) {
        pointList.push({x, y});
    }
    
    clearCanvas(false);
    computeHull();

    drawLines(true);
    drawPoints();

}

canvas.addEventListener('click', main);

const clearButton = document.getElementById("clear")
clearButton.addEventListener("click", () => {
    clearCanvas(true);
});

var normSwitch = document.querySelector('input[type="checkbox"]');
normSwitch.addEventListener('change', function () {
    if (normSwitch.checked) {
        drawNormals();
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawLines();
        drawPoints();
    }
  });