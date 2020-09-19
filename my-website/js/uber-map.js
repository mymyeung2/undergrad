var points = [
  [-71.0824,42.3501],   // Back Bay
  [-71.0676,42.3590],   // Beacon Hill
  [-71.1066,42.3507],   // Boston University
  [-71.0974,42.3446],   // Fenway
  [-71.0547,42.3560],   // Financial District
  [-71.0585,42.3639],   // Haymarket Square
  [-71.0545,42.3654],   // North End
  [-71.0618,42.3658],   // North Station
  [-71.0887,42.3403],   // Northeastern University
  [-71.0551,42.3518],   // South Station
  [-71.0646,42.3522],   // Theatre District
  [-71.0666,42.3642]    // West End

]
var freq = [
  [0, 0, 18870, 18945, 0, 19210, 20450, 0, 19163, 18934, 0, 0],   // Freq of Back Bay to all pts
  [0, 0, 18437, 18872, 0, 19132, 20078, 0, 19374, 18913, 0, 0],   // Freq of Beacon Hill to all pts
  [0, 0, 0, 0, 19422, 0, 0, 18960, 0, 0, 19933, 19906],           // Freq of Boston University to all pts
  [0, 0, 0, 0, 19376, 0, 0, 19502, 0, 0, 18489, 20330],           // Freq of Fenway to all pts
  [0, 0, 0, 0, 0, 20267, 18678, 0, 19261, 20704, 0, 0],           // Freq of Financial District to all pts
  [0, 0, 0, 0, 0, 0, 0, 19275, 0, 0, 19304, 18312],               // Freq of Haymarket Square to all pts
  [0, 0, 0, 0, 0, 0, 0, 18843, 0, 0, 19051, 18419],               // Freq of North End to all pts
  [0, 0, 0, 0, 0, 0, 0, 0, 19358, 18299, 0, 0],                   // Freq of North Station to all pts
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19288, 19067],                   // Freq of Northeastern University to all pts
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19546, 19103],                   // Freq of South Station to all pts
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],                           // Freq of Theatre District to all pts
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]                            // Freq of West End to all pts
]

var canvas = document.getElementById("myCanvas");

var vw_det = 70;

if (window.matchMedia("(orientation: landscape)").matches || window.matchMedia( "(min-width: 768px)" ).matches) {
   // you're in LANDSCAPE mode
   vw_det = 25;
}

canvas.setAttribute('width', vw(vw_det));
canvas.setAttribute('height', vw(vw_det));

var canvas_width = canvas.getBoundingClientRect().width;

if (canvas.getContext)
{
  console.log(canvas_width)
   var context = canvas.getContext("2d");
   const img = new Image();
   img.src = "./image/boston_map2.jpg";
   img.onload = () => {
   context.drawImage(img, 0, 0, canvas_width, canvas_width);
      drawLines();
   }
}

function nmlx(num){
  return Math.round(((num-(-71.0778))*canvas_width/0.0607)+0.5*canvas_width)
}

function nmly(num){
  return Math.round((-((num-(42.3539))*canvas_width/0.0607))+0.5*canvas_width)
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
        console.log("one line drawn from",nmlx(points[i][0]),nmly(points[i][1]),"to",nmlx(points[j][0]),nmly(points[j][1]),"with width",nmlf(freq[i][j]),"in red")
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
        console.log("one line drawn from",nmlx(points[i][0]),nmly(points[i][1]),"to",nmlx(points[j][0]),nmly(points[j][1]),"with width",nmlf(freq[i][j]),"in grey")
        drawLine(nmlx(points[i][0]),nmly(points[i][1]),nmlx(points[j][0]),nmly(points[j][1]),nmlf(freq[i][j]),'grey')
      }
    }
  }
  for(i=0;i<points.length;i++){
    for(j=i+1; j<points.length; j++){
      if (nmlf(freq[i][j]) > 0) {
        if (index == i || index == j){
          console.log("one line drawn from",nmlx(points[i][0]),nmly(points[i][1]),"to",nmlx(points[j][0]),nmly(points[j][1]),"with width",nmlf(freq[i][j]),"in red")
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
  context.drawImage(img, 0, 0, canvas_width, canvas_width);
     drawLines();
  }
}

function show_one(index){
  console.log("Back Bay Pressed");
  var context = canvas.getContext("2d");
  const img = new Image();
  img.src = "./image/boston_map2.jpg";
  img.onload = () => {
    context.clearRect(0, 0, canvas_width, canvas_width);
    context.drawImage(img, 0, 0, canvas_width, canvas_width);
    drawLinesColored(index);
  }
}

function vh(v) {
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  return (v * h) / 100;
}

function vw(v) {
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  return (v * w) / 100;
}
