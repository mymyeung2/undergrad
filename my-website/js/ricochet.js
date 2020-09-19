// Ricochet Robots JS Ver.
// ricochet.js
// By: Yeung Man Yin Michael
// 31/07/2020

var c_cols = 16;
var n_walls = 20;
var c_width = 450;
var target_robot = 0;

var builtWalls = [];
var builtDests = [];
var robots = [];
var markers = [];
var cardhere = [];
var moves = 0;
var timer_on = 0;
var timer_time = 60;
var canvas = document.getElementById("ricoCanvas");
var starts = [[0, 0],[0, c_cols-1],[c_cols-1, 0],[c_cols-1, c_cols-1]]

// clockwise, start from left-top
var boardA1 = [[0,1,1],[0,1,6],[0,4,6],[0,5,0],[0,6,3],[0,6,7],[1,0,2],[1,2,6],[1,4,0],[1,6,1],[1,6,5],[1,6,7]];
var boardB1 = [[0,0,2],[0,3,6],[0,4,0],[0,4,4],[0,6,1],[0,6,7],[1,1,1],[1,1,6],[1,4,0],[1,4,5],[1,5,3],[1,6,7]];
var boardC1 = [[0,1,1],[0,1,6],[0,4,2],[0,4,7],[0,5,0],[0,6,7],[1,0,1],[1,2,4],[1,3,0],[1,6,2],[1,6,5],[1,6,7]];
var boardD1 = [[0,1,2],[0,3,1],[0,3,6],[0,4,0],[0,5,5],[0,6,7],[0,7,3],[1,0,3],[1,2,1],[1,3,7],[1,4,0],[1,5,4],[1,5,6],[1,6,7]];
var boards = [boardA1,boardB1,boardC1,boardD1];

// num str pos
var destA1 = [[0,"C",[3,6]],[1,"&",[6,5]],[2,"#",[6,1]],[3,"@",[1,2]]];
var destB1 = [[0,"&",[4,5]],[1,"@",[6,3]],[2,"C",[2,1]],[3,"#",[1,6]]];
var destC1 = [[0,"@",[1,1]],[1,"#",[2,4]],[2,"&",[7,5]],[3,"C",[6,2]]];
var destD1 = [[0,"#",[2,1]],[1,"C",[5,6]],[2,"@",[6,4]],[3,"&",[1,3]],[4,"$",[3,7]]];
var dests = [destA1, destB1, destC1, destD1];

var boardSeq = [0,1,2,3];

var cards = [["red","@"],["red","#"],["red","C"],["red","&"],["blue","@"],["blue","#"],["blue","C"],["blue","&"],["DarkOrange","@"],["DarkOrange","#"],["DarkOrange","C"],["DarkOrange","&"],["DarkGreen","@"],["DarkGreen","#"],["DarkGreen","C"],["DarkGreen","&"],["silver","$"]];

var Wall = class {
  constructor(dir, row, col) {
    this.dir = dir;
    this.row = row;
    this.col = col;
  }
};

var Robot = class {
  constructor(num, pos){
    this.num = num;
    this.pos = pos;
  }
};

var Marker = class{
  constructor(num, pos){
    this.num = num;
    this.pos = pos;
  }
}

var context = canvas.getContext("2d");

if (canvas.getContext)
{
  console.log("canvas get context");
  context.font = "18px Comic Sans MS";
  context.fillStyle = "red";
  context.textAlign = "center";
   const img = new Image();
   img.src = "./image/boston_map2.jpg";
   img.onload = () => {
   context.drawImage(img, 0, 0, 0, 0);
      //drawLines();
   }
}

function shuffleCards(cards){
  cards = shuffle(cards);
}

function getCard(cards){
  return cards.pop();
}

function drawCard(){
    if(cards.length == 0){
      changeText("current_card","NO MORE CARDS");
      changeColor("current_card","black");
      return;
    }
    reset_timer();
    shuffleCards(cards);
    cardhere = getCard(cards);
    changeText("current_card",cardhere[1]);
    changeColor("current_card",cardhere[0]);
    markOrigins();
    reDraw();
    resetMoves();
}

function markOrigins(){
  for(var i=0; i<5; i++){
    var pos = robots[i].pos;
    var num = robots[i].num;
    markers[i].pos = pos.slice(0);
    markers[i].num = num;
  }
}

function undo(){
  for(var i=0; i<5; i++){
    var pos = markers[i].pos;
    var num = markers[i].num;
    robots[i].pos = pos.slice(0);
    robots[i].num = num;
  }
  reDraw();
  resetMoves();
  reset_timer();
}

function claimed(){
  changeText("current_card","_");
  changeColor("current_card","black");
  changeText("moves","0");
  cardhere = 0;
  console.log("claimed ",current_card);
}

function discard(){
  if (cardhere != 0){
    cards.push(cardhere);
    changeText("current_card","_");
    changeColor("current_card","black");
    changeText("moves","0");
    cardhere = 0;
  }
  else{
    console.log("no card");
  }
}

function resetMoves(){
  changeText("moves","0");
  moves = 0;
}

function markDest(num,str,pos){
  console.log("mark dest");
  switch(num){
    case 0:{
      context.fillStyle = "#FF0000";
      break;
    }
    case 1:{
      context.fillStyle = "#0000FF";
      break;
    }
    case 2:{
      context.fillStyle = "DarkOrange";
      break;
    }
    case 3:{
      context.fillStyle = "DarkGreen";
      break;
    }
    case 4:{
      context.fillStyle = "#999999";
      break;
    }
  }
  context.fillText(str, trs(pos[0]), trs(pos[1]));
}

function spawnRobot(num, pos){
  console.log("spawn robot");
  var robot = new Robot(num,pos);
  robots.push(robot);
  drawRobot(num, pos);
}

function spawnMarker(num, pos){
  var marker = new Marker(num,pos);
  markers.push(marker);
  drawMarker(num, pos);
}

function drawRobot(num,pos){
  console.log("draw robot");
  context.beginPath();
  console.log("draw robot at:",pos);
  context.arc(trs(pos[0]), trs(pos[1]), c_width/c_cols*0.3, 0, Math.PI*2);
  if (num == 0){
    context.fillStyle = "#FF0000";
  }
  if (num == 1){
    context.fillStyle = "#0000FF";
  }
  if (num == 2){
    context.fillStyle = "DarkOrange";
  }
  if (num == 3){
    context.fillStyle = "DarkGreen";
  }
  if (num == 4){
    context.fillStyle = "#666666";
  }
  context.fill();
  context.closePath();
}

function drawMarker(num,pos){
  context.beginPath();
  context.arc(trs(pos[0]), trs(pos[1]), c_width/c_cols*0.15, 0, Math.PI*2);
  if (num == 0){
    context.fillStyle = "Red";
  }
  if (num == 1){
    context.fillStyle = "#0000FF";
  }
  if (num == 2){
    context.fillStyle = "DarkOrange";
  }
  if (num == 3){
    context.fillStyle = "DarkGreen";
  }
  if (num == 4){
    context.fillStyle = "#666666";
  }
  context.fill();
  context.closePath();
}

// translate coor to px
function trs(coor){
  var grid_width = c_width/c_cols;
  var px = (coor+0.5)*grid_width;
  return px;
}

function shuffle(a) {
    console.log(shuffle);
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function generateDests(dest1,dest2,dest3,dest4) {
  console.log("gen dests");
  var destLen1 = dest1.length;
  var destLen2 = dest2.length;
  var destLen3 = dest3.length;
  var destLen4 = dest4.length;
  // left top
  for(var i=0; i<destLen1; i++){
    var temp = dest1.pop();
    builtDests.push([temp[0],temp[1],temp[2]]);
  }
  // right top
  for(var i=0; i<destLen2; i++){
    var temp = dest2.pop();
    var x = 15 - temp[2][1];
    var y = temp[2][0];
    builtDests.push([temp[0],temp[1],[x,y]]);
  }
  // right bottom
  for(var i=0; i<destLen3; i++){
    var temp = dest3.pop();
    var x = 15 - temp[2][0];
    var y = 15 - temp[2][1];
    builtDests.push([temp[0],temp[1],[x,y]]);
  }
  // right bottom
  for(var i=0; i<destLen4; i++){
    var temp = dest4.pop();
    var x = temp[2][1];
    var y = 15 - temp[2][0];
    builtDests.push([temp[0],temp[1],[x,y]]);
  }
}

function spawnMarkers(){
  for (var i=0; i<5; i++){
    var temp = robots[i].pos.slice(0);
    spawnMarker(i, temp);
  }
}

// jQ for keyup
// W 87; A 65; S 83; D 68; 1 49; 2 50; 3 51; 4 52; 5 53
$(document).ready(function () {
    console.log("main");
    generateGridlines();
    // canvas_width, canvas_cols, num_walls
    // random --> generateWalls(c_width,c_cols,n_walls);
    var shuffSeq = shuffle(boardSeq);
    console.log("shuffle");
    var starts2 = shuffle(starts).slice(0);
    spawnRobot(0, starts2.pop()); // num, pos
    spawnRobot(1, starts2.pop());
    spawnRobot(2, starts2.pop());
    spawnRobot(3, starts2.pop());
    generateRicochetWalls(boards[shuffSeq[0]],boards[shuffSeq[1]],boards[shuffSeq[2]],boards[shuffSeq[3]]);
    generateDests(dests[shuffSeq[0]],dests[shuffSeq[1]],dests[shuffSeq[2]],dests[shuffSeq[3]]);
    for (var i=0;i<builtDests.length;i++){
      if (builtDests[i][0] == 4){
        var temp = builtDests[i][2].slice(0);
        spawnRobot(4,temp);
        console.log("cp1");
      }
      markDest(builtDests[i][0],builtDests[i][1],builtDests[i][2]);
      console.log("cp2");
    }
    spawnMarkers();
    console.log("ROBOTS: ",robots);
    $(document).keyup(function(e){
      console.log("key",e);
      console.log("target",target_robot);
        if(e.keyCode == 87){
          upPressed();
        }
        if(e.keyCode == 65){
          leftPressed();
        }
        if(e.keyCode == 83){
          downPressed();
        }
        if(e.keyCode == 68){
          rightPressed();
        }
        if(e.keyCode == 49){
          numPressed(1);
        }
        if(e.keyCode == 50){
          numPressed(2);
        }
        if(e.keyCode == 51){
          numPressed(3);
        }
        if(e.keyCode == 52){
          numPressed(4);
        }
        if(e.keyCode == 53){
          numPressed(5);
        }
    });
});

function upPressed(){
  if(checkUp()){
    moveUp();
    reDraw();
  }
}

function downPressed(){
  if(checkDown()){
    moveDown();
    reDraw();
  }
}

function leftPressed(){
  if(checkLeft()){
    moveLeft();
    reDraw();
  }
}

function rightPressed(){
  if(checkRight()){
    moveRight();
    reDraw();
  }
}

function numPressed(num){
  target_robot = num-1;
  switch(num){
    case 1:{
      changeText("robot", "Red");
      break;
    }
    case 2:{
      changeText("robot", "Blue");
      break;
    }
    case 3:{
      changeText("robot", "Yellow");
      break;
    }
    case 4:{
      changeText("robot", "Green");
      break;
    }
    case 5:{
      changeText("robot", "Silver");
      break;
    }
  }
}

function generateRicochetWalls(board1,board2,board3,board4){
  console.log("gen rico walls");
  var len1 = board1.length;
  var len2 = board2.length;
  var len3 = board3.length;
  var len4 = board4.length;

  // left top
  for(var i=0; i<len1; i++){
    wall_list = board1.pop();
    var wall_new = new Wall(wall_list[0],wall_list[1],wall_list[2]);
    builtWalls.push(wall_new);
    drawWall(wall_new, c_width, c_cols);
  }
  // right top
  for(var i=0; i<len2; i++){
    wall_list = board2.pop();
    if(wall_list[0] == 0){
      wall_list[0] = 1;
      wall_list[1] = 14 - wall_list[1];
    }
    else if(wall_list[0] == 1){
      wall_list[0] = 0;
      wall_list[2] = 15 - wall_list[2];
    }
    var wall_new = new Wall(wall_list[0],wall_list[1],wall_list[2]);
    builtWalls.push(wall_new);;
    drawWall(wall_new, c_width, c_cols);
  }
  // right bottom
  for(var i=0; i<len3; i++){
    wall_list = board3.pop();
    wall_list[1] = 14 - wall_list[1];
    wall_list[2] = 15 - wall_list[2];
    var wall_new = new Wall(wall_list[0],wall_list[1],wall_list[2]);
    builtWalls.push(wall_new);
    drawWall(wall_new, c_width, c_cols);
  }
  // left bottom
  for(var i=0; i<len4; i++){
    wall_list = board4.pop();
    if(wall_list[0] == 1){
      wall_list[0] = 0;
      wall_list[1] = 14 - wall_list[1];
    }
    else if(wall_list[0] == 0){
      wall_list[0] = 1;
      wall_list[2] = 15 - wall_list[2];
    }
    var wall_new = new Wall(wall_list[0],wall_list[1],wall_list[2]);
    builtWalls.push(wall_new);
    drawWall(wall_new, c_width, c_cols);
  }
}

// random walls
function generateWalls(canvas_width, canvas_cols, num_walls){
  console.log("inval");
  for (i=0; i<num_walls;){
    // return 0 or 1; orientation / direction
    var wallDir = Math.floor(Math.random() * 2);
    // return col num
    var wallCol = Math.floor(Math.random() * (canvas_cols-1));
    //return row num
    var wallRow = Math.floor(Math.random() * canvas_cols);
    // check if wall already exist
    var wall_new = new Wall(wallDir,wallCol,wallRow);
    if (!isWallExist(wall_new)){
      builtWalls.push(wall_new);
      console.log("New Wall:",wallDir,wallCol,wallRow);
      drawWall(wall_new, canvas_width, canvas_cols);
      i++;
    }
  }
}

function isWallExist(wall){
  console.log("is Wall Exist");
  for (i=0; i<builtWalls.length; i++){
    if (wall.dir == builtWalls[i].dir && wall.col == builtWalls[i].col && wall.row == builtWalls[i].row){
      return 1;
    }
  }
  return 0;
}

function drawWall(wall, canvas_width, canvas_cols){
  console.log("draw wall");
  if (wall.dir == 0){
    var y = canvas_width/(canvas_cols)*(wall.row+1);
    var x1 = canvas_width/(canvas_cols)*(wall.col);
    var x2 = canvas_width/(canvas_cols)*(wall.col+1);
    drawLine(x1,y,x2,y,canvas_width/(canvas_cols*20),"black");
  }
  if (wall.dir == 1){
    var y1 = canvas_width/(canvas_cols)*(wall.col);
    var y2 = canvas_width/(canvas_cols)*(wall.col+1);
    var x = canvas_width/(canvas_cols)*(wall.row+1);
    drawLine(x,y1,x,y2,canvas_width/(canvas_cols*20),"black");
  }
}

function drawLine(x1, y1, x2, y2, width, color){
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.lineWidth = width;
  context.strokeStyle = color;
  context.stroke();
}

function rebuildExistingWalls(){
  console.log("rebuild exist walls");
  for(i=0; i<builtWalls.length; i++){
    drawWall(builtWalls[i],c_width,c_cols)
  }
}

function clearCanvas(){
  context.clearRect(0, 0, c_width,c_width);
}

// check if a robot can move left for 1 unit
function checkLeft(){
  var x = robots[target_robot].pos[0];
  var y = robots[target_robot].pos[1];
  if(x == 0){
    console.log("hit boundary");
    return 0;
  }
  testWall = new Wall(1,x-1,y);
  if(isWallExist(testWall)){
    console.log("hit wall");
    return 0;
  }
  if(isRobotExist(x-1,y)){
    console.log("hit robot");
    return 0;
  }
  return 1;
}

function moveLeft(){
  robots[target_robot].pos[0] -= 1;
  console.log("move left, new coor:",robots[target_robot].pos);
  console.log("move left");
  if (checkLeft()){
    moveLeft();
  }
}

function checkRight(){
  var x = robots[target_robot].pos[0];
  var y = robots[target_robot].pos[1];
  if(x == c_cols-1){
    console.log("hit boundary");
    return 0;
  }
  testWall = new Wall(1,x,y);
  console.log("testing wall",1,x,y);
  if(isWallExist(testWall)){
    console.log("hit wall");
    return 0;
  }
  if(isRobotExist(x+1,y)){
    console.log("hit robot");
    return 0;
  }
  return 1;
}

function moveRight(){
  robots[target_robot].pos[0] += 1;
  console.log("move right, new coor:",robots[target_robot].pos);
  if (checkRight()){
    moveRight();
  }
  return 0;
}

function checkUp(){
  var y = robots[target_robot].pos[0];
  var x = robots[target_robot].pos[1];
  if(x == 0){
    console.log("hit boundary");
    return 0;
  }
  testWall = new Wall(0,x-1,y);
  if(isWallExist(testWall)){
    console.log("hit wall");
    return 0;
  }
  if(isRobotExist(y,x-1)){
    console.log("hit robot");
    return 0;
  }
  return 1;
}

function moveUp(){
  robots[target_robot].pos[1] -= 1;
  console.log("move up, new coor:",robots[target_robot].pos);
  if (checkUp()){
    moveUp();
  }
}

function checkDown(){
  var y = robots[target_robot].pos[0];
  var x = robots[target_robot].pos[1];
  if(x == c_cols-1){
    console.log("hit boundary");
    return 0;
  }
  testWall = new Wall(0,x,y);
  console.log("testing wall",1,x,y);
  if(isWallExist(testWall)){
    console.log("hit wall");
    return 0;
  }
  if(isRobotExist(y,x+1)){
    console.log("hit robot");
    return 0;
  }
  return 1;
}

function moveDown(){
  robots[target_robot].pos[1] += 1;
  console.log("move down, new coor:",robots[target_robot].pos);
  if (checkDown()){
    moveDown();
  }
  return 0;
}

function reDraw(){
  console.log("reDraw");
  moves += 1;
  changeText("moves", moves.toString());
  clearCanvas();
  generateGridlines();
  rebuildExistingWalls();
  for (var i=0;i<robots.length;i++){
    drawRobot(i,robots[i].pos);
  }
  for (var i=0;i<robots.length;i++){
    drawMarker(i,markers[i].pos);
  }
  for (var i=0;i<builtDests.length;i++){
    markDest(builtDests[i][0],builtDests[i][1],builtDests[i][2])
  }
}

function generateGridlines(){
  console.log("gen grid");
  for(x=0;x<c_cols; x++){
    drawLine(trs(x+0.5),0,trs(x+0.5),c_width,c_width/(c_cols*20),"#EEEEEE");

  }
  for(x=0;x<c_cols; x++){
    drawLine(0,trs(x+0.5),c_width,trs(x+0.5),c_width/(c_cols*20),"#EEEEEE");
  }
}

function changeText(iden, new_str){
  var element = document.getElementById(iden);
  element.innerHTML = new_str;
}

function changeColor(iden, new_color){
  var element = document.getElementById(iden);
  $(element).css('color', new_color);
}

function isRobotExist(x,y){
  for(i=0; i<robots.length;i++){
    if(robots[i].pos[0] == x && robots[i].pos[1] == y){
      return 1;
    }
  }
  return 0;
}

var var1 = setInterval(oneSecondPassed, 1000);

function oneSecondPassed(){
  console.log("one sec");
  if (timer_on){
    timer_time--;
    changeText("timer",timer_time);
    if (timer_time < 10){
      changeColor("timer","red");
    }
    if (timer_time == 0){
      timer_on = 0;
    }
  }
}

function start_timer(){
  timer_time = 60;
  timer_on = 1;
  changeText("timer",60);
}

function reset_timer(){
  timer_time = 61;
  timer_on = 0;
  changeText("timer",60);
  changeColor("timer","black");
}

var score = [0,0,0,0];

function player1(num){
  changeText("player1",score[0]+num);
  score[0]+=num;
}

function player2(num){
  changeText("player2",score[1]+num);
  score[1]+=num;
}

function player3(num){
  changeText("player3",score[2]+num);
  score[2]+=num;
}

function player4(num){
  changeText("player4",score[3]+num);
  score[3]+=num;
}
