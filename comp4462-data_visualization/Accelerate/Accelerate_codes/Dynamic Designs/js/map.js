// Uber Map JavaScript
// COMP 4462 Project 2020 Spring
// By: Yeung Man Yin Michael


var points = [
  [-71.0824,42.3501], //  <!-- Back Bay -->
  [-71.0676,42.3590], //  <!-- Beacon Hill -->
  [-71.1066,42.3507], //  <!-- Boston University -->
  [-71.0974,42.3446],  // <!-- Fenway -->
  [-71.0547,42.3560],  // <!-- Financial District -->
  [-71.0585,42.3639],  // <!-- Haymarket Square -->
  [-71.0545,42.3654], //  <!-- North End -->
  [-71.0618,42.3658], //  <!-- North Station -->
  [-71.0887,42.3403], //  <!-- Northeastern University -->
  [-71.0551,42.3518],  // <!-- South Station -->
  [-71.0646,42.3522], //  <!-- Theatre District -->
  [-71.0666,42.3642]   // <!-- West End -->

]
var freq = [
  [0, 0, 18870, 18945, 0, 19210, 20450, 0, 19163, 18934, 0, 0],   //<!-- Freq of Back Bay to all pts -->
  [0, 0, 18437, 18872, 0, 19132, 20078, 0, 19374, 18913, 0, 0],  // <!-- Freq of Beacon Hill to all pts -->
  [0, 0, 0, 0, 19422, 0, 0, 18960, 0, 0, 19933, 19906],          // <!-- Freq of Boston University to all pts -->
  [0, 0, 0, 0, 19376, 0, 0, 19502, 0, 0, 18489, 20330],           // <!-- Freq of Fenway to all pts -->
  [0, 0, 0, 0, 0, 20267, 18678, 0, 19261, 20704, 0, 0],          // <!-- Freq of Financial District to all pts -->
  [0, 0, 0, 0, 0, 0, 0, 19275, 0, 0, 19304, 18312],             //  <!-- Freq of Haymarket Square to all pts -->
  [0, 0, 0, 0, 0, 0, 0, 18843, 0, 0, 19051, 18419],             //  <!-- Freq of North End to all pts -->
  [0, 0, 0, 0, 0, 0, 0, 0, 19358, 18299, 0, 0],                 //  <!-- Freq of North Station to all pts -->
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19288, 19067],                 //  <!-- Freq of Northeastern University to all pts -->
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19546, 19103],                  // <!-- Freq of South Station to all pts -->
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],                         //  <!-- Freq of Theatre District to all pts -->
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]                          //  <!-- Freq of West End to all pts -->
]

var imgSize = 400
var canvas = document.getElementById('myCanvas');
var map_target = 0

if (canvas.getContext)
{
   var context = canvas.getContext("2d");
   const img = new Image();
   img.src = "./image/boston_map2.jpg";
   img.onload = () => {
   context.drawImage(img, 0, 0, imgSize, imgSize);
      drawLines();
   }
}

function getimgSize(){
    return imgSize
}

function set_map(num){
    map_target = num
}

function generate_map(){
  if (map_target == -1){
    show_all();
  }
  else{
    show_one(map_target);
  }
}

function nmlx(num){
  return Math.round(((num-(-71.0778))*imgSize/0.0607)+imgSize/2)
}

function nmly(num){
  return Math.round((-((num-(42.3539))*imgSize/0.0607))+imgSize/2)
}

function nmlf(num){
  return Math.round(Math.pow(num/9500, 4))-14
}

function drawLine(x1, y1, x2, y2, width, color){
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.lineWidth = width;
  context.strokeStyle = color;
  context.stroke();
}

function drawLines(){
  for(i=0;i<points.length;i++){
    for(j=i+1; j<points.length; j++){
      if (nmlf(freq[i][j]) > 0) {
        // console.log("one line drawn from",nmlx(points[i][0]),nmly(points[i][1]),"to",nmlx(points[j][0]),nmly(points[j][1]),"with width",nmlf(freq[i][j]),"in red")
        drawLine(nmlx(points[i][0]),nmly(points[i][1]),nmlx(points[j][0]),nmly(points[j][1]),nmlf(freq[i][j]),'red')
      }
    }
  }
}

function drawLinesColored(index){
  for(i=0;i<points.length;i++){
    for(j=i+1; j<points.length; j++){
      if (nmlf(freq[i][j]) > 0) {
        if (index == i || index == j){
          continue
        }
        // console.log("one line drawn from",nmlx(points[i][0]),nmly(points[i][1]),"to",nmlx(points[j][0]),nmly(points[j][1]),"with width",nmlf(freq[i][j]),"in grey")
        drawLine(nmlx(points[i][0]),nmly(points[i][1]),nmlx(points[j][0]),nmly(points[j][1]),nmlf(freq[i][j]),'grey')
      }
    }
  }
  for(i=0;i<points.length;i++){
    for(j=i+1; j<points.length; j++){
      if (nmlf(freq[i][j]) > 0) {
        if (index == i || index == j){
          // console.log("one line drawn from",nmlx(points[i][0]),nmly(points[i][1]),"to",nmlx(points[j][0]),nmly(points[j][1]),"with width",nmlf(freq[i][j]),"in red")
          drawLine(nmlx(points[i][0]),nmly(points[i][1]),nmlx(points[j][0]),nmly(points[j][1]),nmlf(freq[i][j]),'red')
        }
      }
    }
  }


}

function show_all(){
  var context = canvas.getContext("2d");
  const img = new Image();
  img.src = "./image/boston_map2.jpg";
  img.onload = () => {
  context.drawImage(img, 0, 0, imgSize, imgSize);
     drawLines();
  }
}

function show_one(index){
  var context = canvas.getContext("2d");
  const img = new Image();
  img.src = "./image/boston_map2.jpg";
  img.onload = () => {
    context.clearRect(0, 0, imgSize, imgSize);
    context.drawImage(img, 0, 0, imgSize, imgSize);
    drawLinesColored(index);
  }
}
