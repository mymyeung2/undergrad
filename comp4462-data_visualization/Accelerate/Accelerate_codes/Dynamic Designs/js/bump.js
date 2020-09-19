// Bump Chart JavaScript
// COMP 4462 Project 2020 Spring
// By: Yeung Man Yin Michael


//global variables
var x_type = "week"; // type of x-axis (x-type default: week)
var l_type = "source"; // type of locations
var max_x = 7;  // number of columns (default: 7 (weekdays))
var col_data = [];  // store 2D array of data
var chartData = []; // store all data in required string format
var len_l_type = {"source": 12, "dest": 12,"comb": 12, "uber": 7, "lyft": 6}
var locations = ["Back Bay","Beacon Hill","Boston University","Fenway",
"Financial District","Haymarket Square","North End","North Station",
"Northeastern University","South Station","Theatre District","West End"]
var uberTypes = ["WAV","UberXL","UberX","UberPool","Taxi","Black SUV","Black"]
var lyftTypes = ["Shared","Lyft XL","Lyft","Lux Black XL","Lux Black","Lux"]
var bump_series = "";
var layoutStr = "";
var chartVars = "KoolOnLoadCallFunction=chartReadyHandler";


// reset bumps
function addBumpAll(){
  bump_series = "";
  // console.log("reset bumps")
  for (var x=1; x<=len_l_type[l_type]; x++){
    switch(l_type){
      case "uber":
        addBump(x.toString(), uberTypes[x-1]);
        // console.log("set bump",x,l_type,uberTypes[x-1]);
        break;
      case "lyft":
        addBump(x.toString(), lyftTypes[x-1]);
        // console.log("set bump",x,l_type,lyftTypes[x-1]);
        break;
      default:
        addBump(x.toString(), locations[x-1]);
        // console.log("set bump",x,l_type,locations[x-1]);
        break;
    }
  }
}


// set to different x-types
function set_x(str){
  switch(str){
    case "week":
      max_x = 7;
      break;
    case "date":
      max_x = 31;
      break;
    case "hour":
      max_x = 24;
      break;
  }
  x_type = str;
}


// set to different l-types (location/y-types)
function set_y(str){
  l_type = str
  addBumpAll();
}


// gen relevant data and gen graph
function genGraphBump(){
    console.log("x_type:",x_type);
    console.log("l_type:",l_type);
    genColData(); // gen relevant data
    chartData.length = 0;
    for (var i=1; i<=max_x; i++){
      chartData.push(colSet(i.toString(), col_data[i-1])); // transfer the data to bumps
    }
    generate(); // gen graph
}


// gen data of a particular x-type, default: week
function genColData(){
  col_data.length = 0; // clear data
  for(var i=0; i<max_x; i++){
    genCol(i);  // gen cols of data
  }
}


// gen one column of data
function genCol(col){
  one_col = [];
  for (var i=1; i<=len_l_type[l_type]; i++){
      switch(l_type){
        case "uber":
          one_col.push(getCount(col+1, uberTypes[i-1]));
          break;
        case "lyft":
          one_col.push(getCount(col+1, lyftTypes[i-1]));
          break;
        default:
          one_col.push(getCount(col+1, locations[i-1]));
          break;
      }
  }
  col_data.push(one_col); //push one col to 2D array
  // console.log("col",col,one_col)
}


// get the count (one data) from global
function getCount(daynum, location){
  switch(l_type){
    case "source":
      switch(x_type){
        case "week":
          var data2 = _(global)
            .filter(d=> Number(d.weekday) == daynum)
            .filter(d=> d.source === location)
            .value().length
          break;
        case "date":
          var data2 = _(global)
            .filter(d=> Number(d.day) == daynum)
            .filter(d=> d.source === location)
            .value().length
          break;
        case "hour":
          var data2 = _(global)
            .filter(d=> Number(d.hour) == daynum-1)
            .filter(d=> d.source === location)
            .value().length
          break;
      }
      break;
    case "dest":
      switch(x_type){
        case "week":
          var data2 = _(global)
            .filter(d=> Number(d.weekday) == daynum)
            .filter(d=> d.destination === location)
            .value().length
          break;
        case "date":
          var data2 = _(global)
            .filter(d=> Number(d.day) == daynum)
            .filter(d=> d.destination === location)
            .value().length
          break;
        case "hour":
          var data2 = _(global)
            .filter(d=> Number(d.hour) == daynum-1)
            .filter(d=> d.destination === location)
            .value().length
          break;
      }
      break;
      case "comb":
        switch(x_type){
          case "week":
            var data2 = _(global)
              .filter(d=> Number(d.weekday) == daynum)
              .filter(d=> d.destination === location)
              .value().length
              + _(global)
                .filter(d=> Number(d.weekday) == daynum)
                .filter(d=> d.source === location)
                .value().length
            break;
          case "date":
            var data2 = _(global)
              .filter(d=> Number(d.day) == daynum)
              .filter(d=> d.destination === location)
              .value().length
              + _(global)
                .filter(d=> Number(d.day) == daynum)
                .filter(d=> d.source === location)
                .value().length
            break;
          case "hour":
            var data2 = _(global)
              .filter(d=> Number(d.hour) == daynum-1)
              .filter(d=> d.destination === location)
              .value().length
              + _(global)
                .filter(d=> Number(d.hour) == daynum-1)
                .filter(d=> d.source === location)
                .value().length
            break;
        }
        break;
        case "uber":
        case "lyft":
          switch(x_type){
            case "week":
              var data2 = _(global)
                .filter(d=> Number(d.weekday) == daynum)
                .filter(d=> d.name === location)
                .value().length
              break;
            case "date":
              var data2 = _(global)
                .filter(d=> Number(d.day) == daynum)
                .filter(d=> d.name === location)
                .value().length
              break;
            case "hour":
              var data2 = _(global)
                .filter(d=> Number(d.hour) == daynum-1)
                .filter(d=> d.name === location)
                .value().length
              break;
          }

  }
  return data2
}


// create a bump
function addBump(x_num, display){
  bump_series = bump_series + '<Bump2DSeries id="bump'+x_num+'" yField="X'+ x_num +'" displayName="'+ display +'" itemRenderer="CircleItemRenderer" labelPosition="inside" form="curve">'
                      +'<showDataEffect>'
                        + '<SeriesClip duration="1000"/>'
                      +'</showDataEffect>'
                    +'</Bump2DSeries>';
}


// transfer data to string
function colSet(x_name,d){
  var dstr =  {"week":x_name,"X1":d[0],"X2":d[1],"X3":d[2],"X4":d[3],"X5":d[4],
          "X6":d[5],"X7":d[6],"X8":d[7],"X9":d[8],"X10":d[9],"X11":d[10],"X12":d[11]}
  return dstr
}


// convert to display string
function display(str){
  switch (str){
    case "dest":
      return "destination"
    case "week":
      return "weekday"
    case "comb":
      return "sum of sources and destination"
    default:
      return str
  }
}


function loadStr(){
  layoutStr =
    '<KoolChart backgroundColor="#FFFFFF"  borderThickness="1" borderStyle="none">'
      +'<Options>'
        +'<Caption text="Frequencies of '+ display(l_type) +'s by '+ display(x_type) +'s" />'
        +'<Legend />'
      +'</Options>'
      +'<NumberFormatter id="numFmt" precision="0"/>'
      +'<Bump2DChart showDataTips="true" dataTipDisplayMode="axis" endPointDisplayName="true" startPointDisplayName="true">'
        +'<horizontalAxis>'
          +'<CategoryAxis categoryField="week"/>'
        +'</horizontalAxis>'
        +'<verticalAxis>'
          +'<LinearAxis/>'
        +'</verticalAxis>'
        +'<series>'
          + bump_series
        +'</series>'
        +'<annotationElements>'
          +'<CrossRangeZoomer enableZooming="false" horizontalLabelFormatter="{numFmt}" horizontalStrokeEnable="false"/>'
        +'</annotationElements>'
      +'</Bump2DChart>'
    +'</KoolChart>';
}


// gen graph
function generate(){
  KoolChart.create("chart1", "chartHolder", chartVars, "100%", "100%");
}


function chartReadyHandler(id) {
  document.getElementById(id).setLayout(layoutStr);
  document.getElementById(id).setData(chartData);
}

$(document).ready(function(){
  $('input[type=radio][name=bump_x]').change(function(){
    set_x(this.value);
    console.log(this.value);
  });
});

function generate_bump(){
  loadStr(); // bumps
  genGraphBump(); // bump chart
}
