// Ricochet Robots JS Ver.
// ricochet_plus.js
// By: Yeung Man Yin Michael
// Last Update: 07/07/2020

// variables
var c_cols = 16; // number of clomuns in canvas grids map
var c_width = 450; // width (and height) of the canvas in px
var target_robot = 0; // default taget: robot 0 (red)
var builtWalls = []; // store built walls (array of Wall instances)
var builtDests = []; // store destinations (array of Dest instances)
var robots = []; // store robots (arrat of Robot instances)
var markers = []; // stire markeers (arrat of Marker instances)
var cardhere_1 = []; // current card 1, color and string
var cardhere_2 = []; // current card 2, color and string
var cardhere_3 = []; // curent card 3, color and string
var moves = 0; // number moves incurred
var timer_on = 0; // boolean: is Timer On
var timer_time = 60; // Timer string (in sec)
var mode = 1; // mode (number of cards drawn per round)
var canvas = document.getElementById("ricoCanvas");
var context = canvas.getContext("2d");
var starts = [[0, 0],[0, c_cols-1],[c_cols-1, 0],[c_cols-1, c_cols-1]] // staring coordinates of robots 0-3
var boardSeq = [0,1,2,3]; // sequence of boards being placed, to be shuffled
// quarter boards, clockwise, starting from left-top
// placed in shuffled order
var boardA1 = [[0,1,1],[0,1,6],[0,4,6],[0,5,0],[0,6,3],[0,6,7],[1,0,2],[1,2,6],[1,4,0],[1,6,1],[1,6,5],[1,6,7]];
var boardB1 = [[0,0,2],[0,3,6],[0,4,0],[0,4,4],[0,6,1],[0,6,7],[1,1,1],[1,1,6],[1,4,0],[1,4,5],[1,5,3],[1,6,7]];
var boardC1 = [[0,1,1],[0,1,6],[0,4,2],[0,4,7],[0,5,0],[0,6,7],[1,0,1],[1,2,4],[1,3,0],[1,6,2],[1,6,5],[1,6,7]];
var boardD1 = [[0,1,2],[0,3,1],[0,3,6],[0,4,0],[0,5,5],[0,6,7],[0,7,3],[1,0,3],[1,2,1],[1,3,7],[1,4,0],[1,5,4],[1,5,6],[1,6,7]];
var boards = [boardA1,boardB1,boardC1,boardD1];
// destinations: robot number, string, and position
var destA1 = [[0,"C",[3,6]],[1,"&",[6,5]],[2,"#",[6,1]],[3,"@",[1,2]]];
var destB1 = [[0,"&",[4,5]],[1,"@",[6,3]],[2,"C",[2,1]],[3,"#",[1,6]]];
var destC1 = [[0,"@",[1,1]],[1,"#",[2,4]],[2,"&",[7,5]],[3,"C",[6,2]]];
var destD1 = [[0,"#",[2,1]],[1,"C",[5,6]],[2,"@",[6,4]],[3,"&",[1,3]],[4,"$",[3,7]]];
var dests = [destA1, destB1, destC1, destD1];
// cards to be drawn
var cards = [["red","@"],["red","#"],["red","C"],["red","&"],["blue","@"],["blue","#"],["blue","C"],["blue","&"],["DarkOrange","@"],["DarkOrange","#"],["DarkOrange","C"],["DarkOrange","&"],["DarkGreen","@"],["DarkGreen","#"],["DarkGreen","C"],["DarkGreen","&"],["#999999","$"]];
// classes
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

// cards
function shuffleCards(cards){
  cards = shuffle(cards);
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

function getCard(cards){
  return cards.pop();
}

function isIn(elm, sett){
  var sethere = sett.slice(0);
  while (sethere.length > 0){
    temp = sethere.pop();
    if (temp == elm){
      return 1;
    }
  }
  return 0;
}

function getColors(sett){
  var colorSet = [];
  var sethere = sett.slice(0);
  while (sethere.length > 0){
    var elm = sethere.pop();
    if (!isIn(elm[0],colorSet)){
      colorSet.push(elm[0]);
    }
  }
  console.log("getColors:",colorSet);
  return colorSet.length;
}

function drawCard(){
    if(cards.length == 0){
      alert("The Deck is Empty!");
      return;
    }
    if (mode == 2 && cards.length == 1){
      alert("Insufficient Cards!");
      return;
    }
    if (mode == 2 && getColors(cards) < 2){
      alert("No Possible Combinations!");
      return;
    }
    if (mode == 3 && cards.length < 3){
      alert("Insufficient Cards!");
      return;
    }
    if (mode == 3 && getColors(cards) < 3){
      alert("No Possible Combinations!");
      return;
    }
    document.getElementById('textbox1').value = "";
    reset_timer();
    shuffleCards(cards);
    switch(mode){
      case 1:{
        cardhere_1 = getCard(cards);
        changeText("current_card_1",cardhere_1[1]);
        changeColor("current_card_1",cardhere_1[0]);
        break;
      }
      case 2:{
        cardhere_1 = getCard(cards);
        cardhere_2 = getCard(cards);
        while (cardhere_1[0] == cardhere_2[0]){
          cards.push(cardhere_2)
          shuffle(cards);
          cardhere_2 = getCard(cards);
        }
        changeText("current_card_1",cardhere_1[1]);
        changeColor("current_card_1",cardhere_1[0]);
        changeText("current_card_2",cardhere_2[1]);
        changeColor("current_card_2",cardhere_2[0]);
        break;
      }
      case 3:{
        console.log("case 3");
        cardhere_1 = getCard(cards);
        cardhere_2 = getCard(cards);
        cardhere_3 = getCard(cards);
        while (getColors([cardhere_1,cardhere_2,cardhere_3]) < 3){
          cards.push(cardhere_2)
          cards.push(cardhere_3)
          shuffle(cards);
          cardhere_2 = getCard(cards);
          cardhere_3 = getCard(cards);
        }
        changeText("current_card_1",cardhere_1[1]);
        changeColor("current_card_1",cardhere_1[0]);
        changeText("current_card_2",cardhere_2[1]);
        changeColor("current_card_2",cardhere_2[0]);
        changeText("current_card_3",cardhere_3[1]);
        changeColor("current_card_3",cardhere_3[0]);
        break;
      }
    }
    markOrigins();
    reDraw();
    resetMoves();
    refreshDeckSize();
}

function refreshDeckSize(){
  changeText("decksize",cards.length);
  return;
}

function claimed(){
  changeText("current_card_1","_");
  changeColor("current_card_1","black");
  if (mode >= 2){
    changeText("current_card_2","_");
    changeColor("current_card_2","black");
  }
  if (mode >= 3){
    changeText("current_card_3","_");
    changeColor("current_card_3","black");
  }
  changeText("moves","0");
  cardhere_1 = 0;
  cardhere_2 = 0;
  cardhere_3 = 0;
  console.log("claimed ",current_card_1, current_card_2, current_card_3);
}

function discard(){
  if (cardhere_1 != 0){
    cards.push(cardhere_1);
    changeText("current_card_1","_");
    changeColor("current_card_1","black");
    changeText("moves","0");
    cardhere_1 = 0;
  }
  if (mode >= 2 && cardhere_2 != 0){
    cards.push(cardhere_2);
    changeText("current_card_2","_");
    changeColor("current_card_2","black");
    changeText("moves","0");
    cardhere_2 = 0;
  }
  if (mode >= 3 && cardhere_3 != 0){
    cards.push(cardhere_3);
    changeText("current_card_3","_");
    changeColor("current_card_3","black");
    changeText("moves","0");
    cardhere_3 = 0;
  }
  refreshDeckSize();
}

// robots
function spawnRobot(num, pos){
  var robot = new Robot(num,pos);
  robots.push(robot);
  drawRobot(num, pos);
}

function drawRobot(num,pos){
  context.beginPath();
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

// markers
function spawnMarkers(){
  for (var i=0; i<5; i++){
    var temp = robots[i].pos.slice(0);
    spawnMarker(i, temp);
  }
}

function spawnMarker(num, pos){
  var marker = new Marker(num,pos);
  markers.push(marker);
  drawMarker(num, pos);
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

function resetMoves(){
  changeText("moves","0");
  moves = 0;
}

// destinations
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

function markDest(num,str,pos){
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

// walls
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

function rebuildExistingWalls(){
  console.log("rebuild exist walls");
  for(i=0; i<builtWalls.length; i++){
    drawWall(builtWalls[i],c_width,c_cols)
  }
}

// gridlines
function generateGridlines(){
  console.log("gen grid");
  for(x=0;x<c_cols; x++){
    drawLine(trs(x+0.5),0,trs(x+0.5),c_width,c_width/(c_cols*20),"#EEEEEE");

  }
  for(x=0;x<c_cols; x++){
    drawLine(0,trs(x+0.5),c_width,trs(x+0.5),c_width/(c_cols*20),"#EEEEEE");
  }
}

// canvas
function drawLine(x1, y1, x2, y2, width, color){
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.lineWidth = width;
  context.strokeStyle = color;
  context.stroke();
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

function clearCanvas(){
  context.clearRect(0, 0, c_width,c_width);
}

// translate coor to px
function trs(coor){
  var grid_width = c_width/c_cols;
  var px = (coor+0.5)*grid_width;
  return px;
}

// control buttons
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
      changeColor("robot", "Red");
      break;
    }
    case 2:{
      changeColor("robot", "#0000FF");
      break;
    }
    case 3:{
      changeColor("robot", "DarkOrange");
      break;
    }
    case 4:{
      changeColor("robot", "DarkGreen");
      break;
    }
    case 5:{
      changeColor("robot", "#666666");
      break;
    }
  }
}

function ePressed(){
  target_robot += 1;
  if (target_robot == 5){
    target_robot = 0;
  }
  switch(target_robot+1){
    case 1:{
      changeColor("robot", "Red");
      break;
    }
    case 2:{
      changeColor("robot", "#0000FF");
      break;
    }
    case 3:{
      changeColor("robot", "DarkOrange");
      break;
    }
    case 4:{
      changeColor("robot", "DarkGreen");
      break;
    }
    case 5:{
      changeColor("robot", "#666666");
      break;
    }
  }
}

// moving robots
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

function isRobotExist(x,y){
  for(i=0; i<robots.length;i++){
    if(robots[i].pos[0] == x && robots[i].pos[1] == y){
      return 1;
    }
  }
  return 0;
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

// timer
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

// Scoreboard
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

// modes
function cMode(det){
  if (cardhere_1 != 0){
    alert("You cannot do it now. Please claim the card(s) first, or send them back to the deck.");
    return;
  }
  switch(det){
    case 0:{
      if (mode == 1){
        alert("Already Easiest (Level 1)");
        return;
      }
      if (mode == 2){
        changeMode(1);
        return;
      }
      if (mode == 3){
        changeMode(2);
        return;
      }
    }
    case 1:{
      if (mode == 1){
        changeMode(2);
        return;
      }
      if (mode == 2){
        changeMode(3);
        return;
      }
      if (mode == 3){
        alert("Already Hardest (Level 3)");
        return;
      }
    }
  }
}

function changeMode(num){
  mode = num;
  switch(mode){
    case 1:{
      changeText("current_card_1","_");
      changeText("current_card_2","");
      changeText("current_card_3","");
      break;
    }
    case 2:{
      changeText("current_card_1","_");
      changeText("current_card_2","_");
      changeText("current_card_3","");
      break;
    }
    case 3:{
      changeText("current_card_1","_");
      changeText("current_card_2","_");
      changeText("current_card_3","_");
      break;
    }
  }
}

// change html elements
function changeText(iden, new_str){
  var element = document.getElementById(iden);
  element.innerHTML = new_str;
}

function changeColor(iden, new_color){
  var element = document.getElementById(iden);
  $(element).css('color', new_color);
}

// main, config
$(document).ready(function () {
    context.font = "18px Comic Sans MS";
    context.fillStyle = "red";
    context.textAlign = "center";
    document.getElementById('textbox1').value = "";
    generateGridlines();
    var shuffSeq = shuffle(boardSeq);
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
      }
      markDest(builtDests[i][0],builtDests[i][1],builtDests[i][2]);
    }
    spawnMarkers();
    $(document).keyup(function(e){
      if(e.keyCode == 87 | e.keyCode == 38){
        upPressed();
      }
      if(e.keyCode == 65 | e.keyCode == 37){
        leftPressed();
      }
      if(e.keyCode == 83 | e.keyCode == 40){
        downPressed();
      }
      if(e.keyCode == 68 | e.keyCode == 39){
        rightPressed();
      }
      if(e.keyCode == 90){
        numPressed(1);
      }
      if(e.keyCode == 88){
        numPressed(2);
      }
      if(e.keyCode == 67){
        numPressed(3);
      }
      if(e.keyCode == 86){
        numPressed(4);
      }
      if(e.keyCode == 66){
        numPressed(5);
      }
      if(e.keyCode == 69){
        ePressed();
      }
    });
});
