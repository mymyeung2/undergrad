// import {d3tip} from 'd3-tip.js';
// set the dimensions and margins of the graph
var margin = {top: 20, right: 30, bottom: 20, left: 50},
    width = 460 - margin.left - margin.right,
    height = 260 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// // console.log("append svg object")
// var svg = d3.select("#my_dataviz")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");

// function process(){
//   var data2 = _(global)
//   .filter(d=> Number(d.weekday) == 1)
//   .filter(d=> d.source === "Back Bay")
//   .value()
//   // console.log(data2)

//   return data2
// }

function processDataByWeekendByCab_type(data){
  var data2 = _(data)
  .groupBy('weekday')
  .map((objs, key)=>{
    // console.log(moment().isoWeekday(Number(key)).format('LL'))
    return{
      'weekday': moment(new Date(moment().isoWeekday(Number(key)).format('LL'))),
      'Lyft': _(objs).filter( d=> d.cab_type==='Lyft').sumBy(d=> Number(d.count)),
      'Uber': _(objs).filter( d=> d.cab_type==='Uber').sumBy(d=> Number(d.count))
    }

  })
  .value()
  // console.log(data2)
  return data2
}

function processDataByHourByCab_type(data){
  var data2 = _(data)
  .groupBy('hour')
  .map((objs, key)=>{
    // console.log(moment().isoWeekday(Number(key)).format('LL'))
    return{
      'hour': Number(key),
      'Lyft': _(objs).filter( d=> d.cab_type==='Lyft').sumBy(d=> Number(d.count)),
      'Uber': _(objs).filter( d=> d.cab_type==='Uber').sumBy(d=> Number(d.count))
    }

  })
  .value()
  // console.log(data2)
  return data2
}

var parseTime = d3.timeParse("%m/%d/%Y");
var xFormat = "%d-%b";
var weekday_name = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function processDataByDateByCab_type(data){
  // console.log(data)
  var data2 = _(data)
  .sortBy(function(d) {
    return new Date(d.date)
  })
  .groupBy('date')
  .map((objs, key)=>{
    // console.log(key)
    return{
      // 'date': parseTime(key),
      'date': moment(parseTime(key)),
      'Lyft': _(objs).filter( d=> d.cab_type==='Lyft').sumBy(d=> Number(d.count)),
      'Uber': _(objs).filter( d=> d.cab_type==='Uber').sumBy(d=> Number(d.count))
    }
  })
  .value()
  // console.log(data2)
  return data2
}

//time_mode: 1(date), 2(weekday), 3(hour)
function processDataByName(data, isLyft, time_mode){
  if(time_mode == 1 ){ //date
    if(isLyft){
      var data2 = _(data)
      .sortBy(function(d) {
        return new Date(d.date)
      })
      .groupBy('date')
      .map((objs, key)=>{
        return{
          'date': moment(parseTime(key)),
          'Lux': _(objs).filter( d=> d.cab_type==='Lyft').filter(d=> d.name==='Lux').sumBy(d=> Number(d.count)),
          'Lux Black': _(objs).filter( d=> d.cab_type==='Lyft').filter(d=> d.name==='Lux Black').sumBy(d=> Number(d.count)),
          'Lux Black XL': _(objs).filter( d=> d.cab_type==='Lyft').filter(d=> d.name==='Lux Black XL').sumBy(d=> Number(d.count)),
          'Lyft': _(objs).filter( d=> d.cab_type==='Lyft').filter(d=> d.name=== 'Lyft').sumBy(d=> Number(d.count)),
          'Lyft XL': _(objs).filter( d=> d.cab_type==='Lyft').filter(d=> d.name==='Lyft XL').sumBy(d=> Number(d.count)),
          'Shared': _(objs).filter( d=> d.cab_type==='Lyft').filter(d=> d.name==='Shared').sumBy(d=> Number(d.count))
        }
      })
      .value()
    }else{
      var data2 = _(data)
      .sortBy(function(d) {
        return new Date(d.date)
      })
      .groupBy('date')
      .map((objs, key)=>{
        return{
          'date': moment(parseTime(key)),
          'Black': _(objs).filter( d=> d.cab_type==='Uber').filter(d=> d.name==='Black').sumBy(d=> Number(d.count)),
          'Black SUV': _(objs).filter( d=> d.cab_type==='Uber').filter(d=> d.name==='Black SUV').sumBy(d=> Number(d.count)),
          'Taxi': _(objs).filter( d=> d.cab_type==='Uber').filter(d=> d.name==='Taxi').sumBy(d=> Number(d.count)),
          'UberPool': _(objs).filter( d=> d.cab_type==='Uber').filter(d=> d.name=== 'UberPool').sumBy(d=> Number(d.count)),
          'UberX': _(objs).filter( d=> d.cab_type==='Uber').filter(d=> d.name==='UberX').sumBy(d=> Number(d.count)),
          'UberXL': _(objs).filter( d=> d.cab_type==='Uber').filter(d=> d.name==='UberXL').sumBy(d=> Number(d.count)),
          'WAV': _(objs).filter( d=> d.cab_type==='Uber').filter(d=> d.name==='WAV').sumBy(d=> Number(d.count))
        }
      })
      .value()
    }
  }else if(time_mode == 2){ //Weekday
    if(isLyft){
      var data2 = _(data)
      .groupBy('weekday')
      .map((objs, key)=>{
        return{
          'weekday': moment(new Date(moment().isoWeekday(Number(key)).format('LL'))),
          'Lux': _(objs).filter( d=> d.cab_type==='Lyft').filter(d=> d.name==='Lux').sumBy(d=> Number(d.count)),
          'Lux Black': _(objs).filter( d=> d.cab_type==='Lyft').filter(d=> d.name==='Lux Black').sumBy(d=> Number(d.count)),
          'Lux Black XL': _(objs).filter( d=> d.cab_type==='Lyft').filter(d=> d.name==='Lux Black XL').sumBy(d=> Number(d.count)),
          'Lyft': _(objs).filter( d=> d.cab_type==='Lyft').filter(d=> d.name=== 'Lyft').sumBy(d=> Number(d.count)),
          'Lyft XL': _(objs).filter( d=> d.cab_type==='Lyft').filter(d=> d.name==='Lyft XL').sumBy(d=> Number(d.count)),
          'Shared': _(objs).filter( d=> d.cab_type==='Lyft').filter(d=> d.name==='Shared').sumBy(d=> Number(d.count))
        }
      })
      .value()
    }else{
      var data2 = _(data)
      .sortBy(function(d) {
        return new Date(d.date)
      })
      .groupBy('weekday')
      .map((objs, key)=>{
        return{
          'weekday': moment(new Date(moment().isoWeekday(Number(key)).format('LL'))),
          'Black': _(objs).filter( d=> d.cab_type==='Uber').filter(d=> d.name==='Black').sumBy(d=> Number(d.count)),
          'Black SUV': _(objs).filter( d=> d.cab_type==='Uber').filter(d=> d.name==='Black SUV').sumBy(d=> Number(d.count)),
          'Taxi': _(objs).filter( d=> d.cab_type==='Uber').filter(d=> d.name==='Taxi').sumBy(d=> Number(d.count)),
          'UberPool': _(objs).filter( d=> d.cab_type==='Uber').filter(d=> d.name=== 'UberPool').sumBy(d=> Number(d.count)),
          'UberX': _(objs).filter( d=> d.cab_type==='Uber').filter(d=> d.name==='UberX').sumBy(d=> Number(d.count)),
          'UberXL': _(objs).filter( d=> d.cab_type==='Uber').filter(d=> d.name==='UberXL').sumBy(d=> Number(d.count)),
          'WAV': _(objs).filter( d=> d.cab_type==='Uber').filter(d=> d.name==='WAV').sumBy(d=> Number(d.count))
        }
      })
      .value()
    }

  }else{ //hour
    if(isLyft){
      var data2 = _(data)
      .groupBy('hour')
      .map((objs, key)=>{
        return{
          'hour': Number(key),
          'Lux': _(objs).filter( d=> d.cab_type==='Lyft').filter(d=> d.name==='Lux').sumBy(d=> Number(d.count)),
          'Lux Black': _(objs).filter( d=> d.cab_type==='Lyft').filter(d=> d.name==='Lux Black').sumBy(d=> Number(d.count)),
          'Lux Black XL': _(objs).filter( d=> d.cab_type==='Lyft').filter(d=> d.name==='Lux Black XL').sumBy(d=> Number(d.count)),
          'Lyft': _(objs).filter( d=> d.cab_type==='Lyft').filter(d=> d.name=== 'Lyft').sumBy(d=> Number(d.count)),
          'Lyft XL': _(objs).filter( d=> d.cab_type==='Lyft').filter(d=> d.name==='Lyft XL').sumBy(d=> Number(d.count)),
          'Shared': _(objs).filter( d=> d.cab_type==='Lyft').filter(d=> d.name==='Shared').sumBy(d=> Number(d.count))
        }
      })
      .value()
    }else{
      var data2 = _(data)
      .sortBy(function(d) {
        return new Date(d.date)
      })
      .groupBy('hour')
      .map((objs, key)=>{
        return{
          'hour': Number(key),
          'Black': _(objs).filter( d=> d.cab_type==='Uber').filter(d=> d.name==='Black').sumBy(d=> Number(d.count)),
          'Black SUV': _(objs).filter( d=> d.cab_type==='Uber').filter(d=> d.name==='Black SUV').sumBy(d=> Number(d.count)),
          'Taxi': _(objs).filter( d=> d.cab_type==='Uber').filter(d=> d.name==='Taxi').sumBy(d=> Number(d.count)),
          'UberPool': _(objs).filter( d=> d.cab_type==='Uber').filter(d=> d.name=== 'UberPool').sumBy(d=> Number(d.count)),
          'UberX': _(objs).filter( d=> d.cab_type==='Uber').filter(d=> d.name==='UberX').sumBy(d=> Number(d.count)),
          'UberXL': _(objs).filter( d=> d.cab_type==='Uber').filter(d=> d.name==='UberXL').sumBy(d=> Number(d.count)),
          'WAV': _(objs).filter( d=> d.cab_type==='Uber').filter(d=> d.name==='WAV').sumBy(d=> Number(d.count))
        }
      })
      .value()
    }

  }
  // console.log(data2)
  return data2
}


/**
 *
 * @param {raw data} data
 * @param {array of targeted source} source
 */
function FilterDataBySource(data, source){
  // console.log("source")
  // console.log(source)
  var data2 = _(data).filter(d => source.includes(d.source)).value()
  return data2
}

function FilterDataByDest(data, dest){
  // console.log('dest')
  // console.log(dest)
  var data2 = _(data).filter(d => dest.includes(d.destination)).value()
  // console.log("data2", data2)
  return data2
}

function FilterDataByDate(data){
  // console.log(current_selected_lb)
  // console.log(current_selected_ub)
  // console.log(new Date(current_selected_lb))
  // console.log(data)
  // console.log(new Date(data[0].date))
  var data2 = _(data)
  .filter(d =>
    new Date(d.date) >=  new Date(current_selected_lb) && new Date(d.date) <= new Date(current_selected_ub))
  .value()
  // console.log(data2)
  // var data3 = _(data2).filter(d => d.date.getTime() < current_selected_ub)
  return data2
}

function FilterDataByWeekdays(data){
  var data2 = _(data)
  .filter(d=> Number(d.weekday) >= Number(current_selected_lb) && Number(d.weekday) <= Number(current_selected_ub))
  .value()
  // console.log(data2)
  return data2
}

function FilterDataByHours(data){
  var data2 = _(data)
  .filter(d=> Number(d.hour) >= Number(current_selected_lb) && Number(d.hour) <= Number(current_selected_ub))
  .value()
  return data2
}

// haymarket_square, back_bay, beacon_hill, boston_university,
    //  fenway, south_station, theatre_district, west_end, northeastern_university
function genSourceArray(){

  var arr = []
  if(financial_district_source) arr.push("Financial District")
  if(north_end_source) arr.push("North End")
  if(north_station_source) arr.push("North Station")
  if(haymarket_square_source) arr.push("Haymarket Square")
  if(back_bay_source) arr.push("Back Bay")
  if(beacon_hill_source) arr.push("Beacon Hill")
  if(boston_university_source) arr.push("Boston University")
  if(fenway_source) arr.push("Fenway")
  if(south_station_source) arr.push("South Station")
  if(theatre_district_source) arr.push("Theatre District")
  if(west_end_source) arr.push("West End")
  if(northeastern_university_source) arr.push("Northeastern University")

  return arr
}
// financial_district, north_end, north_station, haymarket_square, back_bay, beacon_hill, boston_university,
                        // fenway, south_station, theatre_district, west_end, northeastern_university

function genDestArray(){

  var arr = []
  if(financial_district_dest) arr.push("Financial District")
  if(north_end_dest) arr.push("North End")
  if(north_station_dest) arr.push("North Station")
  if(haymarket_square_dest) arr.push("Haymarket Square")
  if(back_bay_dest) arr.push("Back Bay")
  if(beacon_hill_dest) arr.push("Beacon Hill")
  if(boston_university_dest) arr.push("Boston University")
  if(fenway_dest) arr.push("Fenway")
  if(south_station_dest) arr.push("South Station")
  if(theatre_district_dest) arr.push("Theatre District")
  if(west_end_dest) arr.push("West End")
  if(northeastern_university_dest) arr.push("Northeastern University")

  return arr
}

function genKeysByCab_type(){
    return ["Lyft", "Uber"]
}

function genKeysByName_Lyft(){
    return ["Lux", "Lux Black", "Lux Black XL", "Lyft", "Lyft XL", "Shared"]
}

function genKeysByName_Uber(){
    return ["Black", "Black SUV", "Taxi", "UberPool","UberX", "UberXL", "WAV"]
}

function genXScaleByWeekday(data){
  // console.log(d3.extent(data, function(d){ return d.weekday;}))
  var x = d3.scaleTime()
  .domain(d3.extent(data, function(d) {
    // console.log(d.weekday)
     return d.weekday;
  }))
  .range([ 0, width ]);
  return x
}

function genAreaByWeekday(x, y){
  var area = d3.area()
    .x(function(d) {
      // console.log(d.data.weekday)
      return x(d.data.weekday);
    })
    // .x(function(d){ return x(d.data)
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); })

  return area
}

function genXScaleByDate(data){
  // console.log(d3.extent(data, function(d){return d.data }))
  var x = d3.scaleTime()
  .domain(d3.extent(data, function(d) {
    // console.log(d)
      // console.log(parseTime(d.date))
      return d.date;
   }))

  .range([ 0, width ]);
  return x
}

function genAreaByDate(x, y){
  var area = d3.area()
    .x(function(d)  {
      // console.log(d)
      // console.log("d.data:",d.data)
      // console.log("x(parseTime(d.data.date):", x(parseTime(d.data.date)));
      return x(d.data.date);
     })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); })

  return area
}

function genXScaleByHour(data){
  // console.log(d3.extent(data, function(d){return d.hour}))
  var x = d3.scaleLinear()
  .domain(d3.extent(data, function(d) {
    // console.log(d.weekday)
     return d.hour;
  }))
  .range([ 0, width ]);
  return x
}

function genAreaByHour(x,y){
  var area = d3.area()
    .x(function (d) {
      return x(d.data.hour)
    })

    .y0(function(d){return y(d[0]);})
    .y1(function(d){return y(d[1]);})

  return area
}

// stackedData
function calMax(stackedData){
  // console.log(data2)
  var max = 0
  var length = stackedData.length
  // console.log(stackedData)
  // console.log(stackedData[length-1])
  _(stackedData[length-1]).forEach(function(d){
    if(max < d[1]) max = d[1]
  })

  return max + 1000
}

/**
 *  data: source data
 *  time_mode: 1(Date), 2(weekday), 3(hour)
 *  isUber, isLyft: T,T (Uber & Lyft) T,F (Uber only) F,T (Lyft only)
 *
*/
function genGraph(data){
  //remove the existing graph
  // d3.select('svg').remove()
  $("#my_dataviz").empty()

  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

  // console.log(data)
  //weekday as x axis
  if(time_mode == 2){
    console.log("weekday")
    if(isUber && isLyft){
      data2= processDataByWeekendByCab_type(data)
      keys = genKeysByCab_type()
    }else if(isUber){
      data2= processDataByName(data, false, 2)
      keys = genKeysByName_Uber()
    }else{
      data2 = processDataByName(data, true, 2)
      keys= genKeysByName_Lyft()
    }

    // console.log(data2)
    // console.log(data2)
    //add x-axis
    x = genXScaleByWeekday(data2)
    // console.log(x)
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%a")).ticks(7))

    // throw new Error
    // Customization
    svg.selectAll(".tick line").attr("stroke", "#b8b8b8")

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height-10 )
        .text("Time (Weekday)");

    // Add Y axis
    // var y = d3.scaleLinear()
    //   .domain([-100000, 100000])
    //   .range([ height, 0 ]);

    // svg.append("g")
    //   .call(d3.axisLeft(y))

    // color palette
    var color = d3.scaleOrdinal()
      .domain(keys)
      .range(d3.schemePaired);

    //stack the data?
    var stackedData = d3.stack()
      .offset(d3.stackOffsetSilhouette)
      .keys(keys)
      (data2)

    var max = calMax(stackedData)
    // console.log("Max:", max)
    var y = d3.scaleLinear()
      .domain([-max, max])
      .range([ height, 0 ]);

    svg.append("g")
      .call(d3.axisLeft(y))

    // console.log(stackedData)
    // create a tooltip
    var Tooltip = svg
    .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .style("opacity", 0)
    .style("font-size", 17)

    d3.selectAll("#my_dataviz .tooltip").remove()
    var tooltip = d3.select("#my_dataviz")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")


    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      // console.log(d)
      // console.log("over")
      Tooltip.style("opacity", 1)
      tooltip.style("opacity", 1)
      // console.log(this)
      d3.selectAll(".myArea").style("opacity", .2)
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }


    var mousemove = function(d,i) {
      grp = keys[i]
      Tooltip.text(grp)

      mousex = d3.mouse(this);
      mousex = mousex[0];
      var invertedx = x.invert(mousex);
      invertedx = invertedx.getDay()
      // console.log(d)
      // console.log(invertedx)
      // console.log(current_selected_lb)
      var selected = d[invertedx-current_selected_lb]
      var value = selected[1] - selected[0]
      tooltip.text("Weekday: "+ moment(new Date(moment().isoWeekday(Number(invertedx)).format('LL'))).format('dddd') +" count: "+ value)
    }

    var mouseleave = function(d) {
      Tooltip.style("opacity", 0)
      tooltip.style("opacity", 0)
      d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
    }

    var mouseclick = function(d){
      // console.log("mouseclick")
      // console.log(this)
      // console.log(d)
      // console.log(i)
      if(d.key === 'Lyft'){
        isUber = false
        isLyft = true
        genGraph(data)
      }else{
        isUber = true
        isLyft = false
        genGraph(data)
      }
    }

    // Area generator
    var area = genAreaByWeekday(x, y)

    // Show the areas
    svg
      .selectAll("mylayers")
      .data(stackedData)
      .enter()
      .append("path")
        .attr("class", "myArea")
        .style("fill", function(d) { return color(d.key); })
        .attr("d", area)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    if(isUber && isLyft){
      svg.selectAll("path")
        .on("click", mouseclick)
    }


  }else if(time_mode == 1){ //date as x axis
    // console.log("date")
    // console.log(data)
    if(isUber && isLyft){ //uber and lyft graph
      data2 = processDataByDateByCab_type(data)
      keys = genKeysByCab_type()
    }else if(isUber){ //only Uber graph
      data2 = processDataByName(data, false, 1)
      keys = genKeysByName_Uber()
    }else{  //only Lyft graph
      data2 = processDataByName(data, true, 1)
      keys= genKeysByName_Lyft()
    }

    // console.log(data2)
    x = genXScaleByDate(data2)
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat(xFormat)).ticks(17))


    // Customization
    svg.selectAll(".tick line").attr("stroke", "#b8b8b8")

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height-10 )
        .text("Time (Date)");

    // color palette
    var color = d3.scaleOrdinal()
      .domain(keys)
      .range(d3.schemePaired);

    //stack the data?
    var stackedData = d3.stack()
      .offset(d3.stackOffsetSilhouette)
      .keys(keys)
      (data2)

    // console.log(stackedData)
    var max = calMax(stackedData)
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([-max, max])
      .range([ height, 0 ]);

    svg.append("g")
      .call(d3.axisLeft(y))

    // create a tooltip
    var Tooltip = svg
    .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .style("opacity", 0)
    .style("font-size", 17)

    d3.selectAll("#my_dataviz .tooltip").remove()
    var tooltip = d3.select("#my_dataviz")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      Tooltip.style("opacity", 1)
      tooltip.style("opacity", 1)
      d3.selectAll(".myArea").style("opacity", .2)
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }

    var mousemove = function(d,i) {
      grp = keys[i]
      Tooltip.text(grp)

      mousex = d3.mouse(this);
      mousex = mousex[0];
      var invertedx = x.invert(mousex);
      // console.log(moment(invertedx))
      // console.log(invertedx)
      invertedx = moment(invertedx).format('YYYY-MM-DD')
      var pos;
      // console.log(d)
      for(var i=0; i< d.length; i++){
        var time1 = d[i].data.date.format('YYYY-MM-DD');
        // console.log(invertedx == time1)
        if(invertedx == time1){
          pos = i
          // console.log("pos:", pos)
          break;
        }
      }
      if(pos == null) return
      var selected = d[pos]
      var value = selected[1] - selected[0]
      tooltip.text("Date: "+ invertedx +" count: "+ value)
    }
    var mouseleave = function(d) {
      Tooltip.style("opacity", 0)
      tooltip.style("opacity", 0)
      d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
    }

    var mouseclick = function(d){
      // console.log("mouseclick")
      // console.log(this)
      // console.log(d)
      // console.log(i)
      if(d.key === 'Lyft'){
        isUber = false
        isLyft = true
        genGraph(data)
      }else{
        isUber = true
        isLyft = false
        genGraph(data)
      }
    }

    // Area generator
    var area = genAreaByDate(x, y)

    // Show the areas
    svg
      .selectAll("mylayers")
      .data(stackedData)
      .enter()
      .append("path")
        .attr("class", "myArea")
        .style("fill", function(d) { return color(d.key); })
        .attr("d", area)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    if(isUber && isLyft){
      svg.selectAll("path")
        .on("click", mouseclick)
    }
  }else{ //hour
    // console.log("hour")
    if(isUber && isLyft){
      data2= processDataByHourByCab_type(data)
      keys = genKeysByCab_type()
    }else if(isUber){
      data2= processDataByName(data, false, 3)
      keys = genKeysByName_Uber()
    }else{
      data2 = processDataByName(data, true, 3)
      keys= genKeysByName_Lyft()
    }


    //add x-axis
    x = genXScaleByHour(data2)
    // console.log(x)
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(24))

    // throw new Error
    // Customization
    svg.selectAll(".tick line").attr("stroke", "#b8b8b8")

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height-10 )
        .text("Time (Hours)");

    // color palette
    var color = d3.scaleOrdinal()
      .domain(keys)
      .range(d3.schemePaired);

    //stack the data?
    var stackedData = d3.stack()
      .offset(d3.stackOffsetSilhouette)
      .keys(keys)
      (data2)

    var max = calMax(stackedData)
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([-max, max])
      .range([ height, 0 ]);

    svg.append("g")
      .call(d3.axisLeft(y))

    // console.log(stackedData)
    // create a tooltip
    var Tooltip = svg
    .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .style("opacity", 0)
    .style("font-size", 17)

    d3.selectAll("#my_dataviz .tooltip").remove()
    var tooltip = d3.select("#my_dataviz")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      // .style("float", 'left')
      // .style('font-family', 'monospace')

    // var tooltip = d3.select("#my_dataviz")
    // .style('border', 'solid 3px black')
    // .style('background-color', 'white')
    // .style('border-radius', '10px')
    // .style('float', 'left')
    // .style('font-family', 'monospace')
    // .html(d => `
    //   <img style='float: left' width=96 height=96 src="${getPokemonPNG(d.pokedex_number)}"/>
    //   <div style='float: right'>
    //     Pokedex: ${d.pokedex_number} <br/>
    //     Name: ${d.name} <br/>
    //     Base Total: ${d.base_total} <br/>
    //     Types: ${d.type1} ${d.type2}
    //   </div>`)

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      Tooltip.style("opacity", 1)
      tooltip.style("opacity", 1)
      d3.selectAll(".myArea").style("opacity", .2)
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }

    var mousemove = function(d,i) {
      grp = keys[i]
      Tooltip.text(grp)

      mousex = d3.mouse(this);
      mousex = mousex[0];
      var invertedx = x.invert(mousex);
      // console.log(invertedx)
      invertedx = Math.floor(invertedx)
      var selected = d[invertedx-current_selected_lb]
      var value = selected[1] - selected[0]
      // console.log(value)
      tooltip.text("Hour: "+ Number(invertedx)+" count: "+ value)
    }
    var mouseleave = function(d) {
      Tooltip.style("opacity", 0)
      tooltip.style("opacity", 0)
      d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
    }

    var mouseclick = function(d){
      // console.log("mouseclick")
      // console.log(this)
      // console.log(d)
      // console.log(i)
      if(d.key === 'Lyft'){
        isUber = false
        isLyft = true
        genGraph(data)
      }else{
        isUber = true
        isLyft = false
        genGraph(data)
      }
    }


    // Area generator
    var area = genAreaByHour(x, y)

    // Show the areas
    svg
      .selectAll("mylayers")
      .data(stackedData)
      .enter()
      .append("path")
        .attr("class", "myArea")
        .style("fill", function(d) { return color(d.key); })
        .attr("d", area)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    if(isUber && isLyft){
      svg.selectAll("path")
        .on("click", mouseclick)
    }
  }

}

var global = null
function loadData(){
  d3.csv("./rideshare_kaggle-final.csv", function(data){
    global = data
    // dt_from = 0;
    // dt_to = 23;
    // process()
    // time_mode = 3
    // slider()
    document.getElementById("Uber").checked = true
    document.getElementById("Lyft").checked = true
    //genGraph(global)
    slider()
    // $("#Uber").checked = true
    // $("#Lyft").checked = true
    addBumpAll();
    generate_all();
  })
}

//source
var financial_district_source = false
var north_end_source =false
var north_station_source = false
var haymarket_square_source = false
var back_bay_source = false
var beacon_hill_source = false
var boston_university_source= false
var fenway_source = false
var south_station_source = false
var theatre_district_source = false
var west_end_source = false
var northeastern_university_source = false

//dest
var financial_district_dest =false
var north_end_dest = false
var north_station_dest =false
var haymarket_square_dest = false
var back_bay_dest = false
var beacon_hill_dest = false
var boston_university_dest = false
var fenway_dest =false
var south_station_dest = false
var theatre_district_dest = false
var west_end_dest = false
var northeastern_university_dest = false

//mode
var time_mode = 1
var isUber = true
var isLyft = true

//slider
var dt_from = "2018/11/26 00:00:00";
var dt_to = "2018/12/18 23:59:59";
var current_selected_lb= dt_from;
var current_selected_ub= dt_to;

function date_scale(checkbox){
  if(checkbox.checked){
    time_mode = 1
  }
  document.getElementById("hours").checked = false
  document.getElementById("weekdays").checked = false
  dt_from = "2018/11/26 00:00:00";
  dt_to = "2018/12/18 23:59:59";
  current_selected_lb = dt_from
  current_selected_ub = dt_to
  slider()
  regen(global)
}

function weekdays_scale(checkbox){
  if(checkbox.checked){
    time_mode = 2
  }
  document.getElementById("date").checked = false
  document.getElementById("hours").checked = false
  current_selected_lb = 1
  current_selected_ub = 7
  slider()
  regen(global)
}

function hours_scale(checkbox){
  if(checkbox.checked){
    time_mode = 3
  }
  document.getElementById("date").checked = false
  document.getElementById("weekdays").checked = false
  current_selected_lb = 0;
  current_selected_ub = 23;
  slider()
  regen(global)
}

$(document).ready(function(){
  $('input[type=radio][name=x-axis]').change(function(){
    if(this.value == 'date'){
      dt_from = "2018/11/26 00:00:00";
      dt_to = "2018/12/18 23:59:59";
      current_selected_lb = dt_from
      current_selected_ub = dt_to
      time_mode = 1
    }else if(this.value == 'weekday'){
      current_selected_lb = 1
      current_selected_ub = 7
      time_mode = 2
    }else{
      current_selected_lb = 0;
      current_selected_ub = 23;
      time_mode = 3
    }
  });
});

function filter_source(checkbox){
  switch(checkbox.id){
    case 'financial_district_source': financial_district_source = checkbox.checked; break;
    case 'North_end_source':  north_end_source = checkbox.checked; break;
    case 'North_station_source': north_station_source = checkbox.checked; break;
    case 'Haymarket_square_source': haymarket_square_source = checkbox.checked; break;
    case 'Back_bay_source': back_bay_source = checkbox.checked; break;
    case 'Beacon_hill_source':  beacon_hill_source = checkbox.checked; break;
    case 'Boston_university_source':  boston_university_source = checkbox.checked; break;
    case 'Fenway_source': fenway_source = checkbox.checked; break;
    case 'South_station_source':  south_station_source = checkbox.checked; break;
    case 'Theatre_district_source': theatre_district_source = checkbox.checked; break;
    case 'West_end_source': west_end_source = checkbox.checked; break;
    case 'Northeastern_university_source':  northeastern_university_source = checkbox.checked; break;
  }
  // regen(global)
}

function filter_dest(checkbox){
  switch(checkbox.id){
    case 'financial_district_dest': financial_district_dest = checkbox.checked; break;
    case 'North_end_dest':  north_end_dest = checkbox.checked; break;
    case 'North_station_dest': north_station_dest = checkbox.checked; break;
    case 'Haymarket_square_dest': haymarket_square_dest = checkbox.checked; break;
    case 'Back_bay_dest': back_bay_dest = checkbox.checked; break;
    case 'Beacon_hill_dest':  beacon_hill_dest = checkbox.checked; break;
    case 'Boston_university_dest':  boston_university_dest = checkbox.checked; break;
    case 'Fenway_dest': fenway_dest = checkbox.checked; break;
    case 'South_station_dest':  south_station_dest = checkbox.checked; break;
    case 'Theatre_district_dest': theatre_district_dest = checkbox.checked; break;
    case 'West_end_dest': west_end_dest = checkbox.checked; break;
    case 'Northeastern_university_dest':  northeastern_university_dest = checkbox.checked; break;
  }
  // regen(global)
}

function change_cab_type(checkbox){
  switch(checkbox.id){
    case 'Uber': isUber = checkbox.checked; break;
    case 'Lyft': isLyft = checkbox.checked; break;
  }
}

function regen2(){
  // console.log(global)
  regen(global)
  slider()
}

function regen(data) {
  //filter out by x axis
  // console.log(data)
  // console.log(time_mode)
  if(time_mode == 1){ //date
    var data1 = FilterDataByDate(data)
  }else if(time_mode == 2){ //weekdays
    var data1 = FilterDataByWeekdays(data)
  }else{  //hours
    var data1 = FilterDataByHours(data)
  }

  // console.log(data1)
  //filter out source and dest
  var source = genSourceArray();
  var dest = genDestArray();

  if(source.length ==0 && dest.length == 0){
    // console.log("genGraph")
    // console.log(data1)
    genGraph(data1)
  }else if(source.length != 0 && dest.length != 0){
    var data2 = FilterDataBySource(data1, source)
    var data3 = FilterDataByDest(data2, dest)
    // console.log("data3")
    genGraph(data3)
  }else if(source.length != 0){
    // console.log(data1)
    var data2 =FilterDataBySource(data1, source)
    // console.log(data2)
    genGraph(data2)
  }else{
    var data2 =FilterDataByDest(data1, dest)
    genGraph(data2)
  }

}

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

function formatDT(__dt) {
  var year = __dt.getFullYear();
  var month = zeroPad(__dt.getMonth()+1, 2);
  var date = zeroPad(__dt.getDate(), 2);
  var hours = zeroPad(__dt.getHours(), 2);
  var minutes = zeroPad(__dt.getMinutes(), 2);
  var seconds = zeroPad(__dt.getSeconds(), 2);
  return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
}

function formatWeekdays(wd){
  var temp;
  switch(wd){
    case 1: temp = "Mon"; break;
    case 2: temp = "Tue"; break;
    case 3: temp = "Wed"; break;
    case 4: temp = "Thu"; break;
    case 5: temp = "Fri"; break;
    case 6: temp = "Sat"; break;
    case 7: temp = "Sun"; break;
  }
  return temp
}

function formatHours(__hr){
  var hours = zeroPad(__hr.getHours(),2)
  return hours
}

function slider(){

  $('#slider-range').empty();

  if(time_mode == 1){ //date
    $('.slider-time').html(dt_from);
    $('.slider-time2').html(dt_to);
    var min_val = Date.parse(dt_from)/1000;
    var max_val = Date.parse(dt_to)/1000;

    $("#slider-range").slider({
        range: true,
        min: min_val,
        max: max_val,
        step: 17,
        values: [min_val, max_val],
        slide: function (e, ui) {

            var dt_cur_from = new Date(ui.values[0]*1000); //.format("yyyy-mm-dd hh:ii:ss");
            $('.slider-time').html(formatDT(dt_cur_from));
            // console.log("dt_cur_from: ", dt_cur_from)
            current_selected_lb = dt_cur_from;
            // console.log(current_selected_lb)
            var dt_cur_to = new Date(ui.values[1]*1000); //.format("yyyy-mm-dd hh:ii:ss");
            $('.slider-time2').html(formatDT(dt_cur_to));
            current_selected_ub = dt_cur_to;
        }
    });

  }else if(time_mode ==2){ //weekdays
    $('.slider-time').html("Mon");
    $('.slider-time2').html("Sun");
    var min_val = 1;
    var max_val = 7*1000;

    $("#slider-range").slider({
        range: true,
        min: min_val,
        max: max_val,
        step: 7,
        values: [min_val, max_val],
        slide: function (e, ui) {

            var lb = Math.ceil(ui.values[0]/1000);
            $('.slider-time').html(formatWeekdays(lb));
            current_selected_lb = lb;
            // console.log(current_selected_lb)
            var ub = Math.ceil(ui.values[1]/1000);
            $('.slider-time2').html(formatWeekdays(ub));
            current_selected_ub = ub;
            // console.log(current_selected_ub)
        }
    });


  }else{ //hour

    $('.slider-time').html(0);
    $('.slider-time2').html(23);
    var min_val = 0
    var max_val = 23*1000

    $("#slider-range").slider({
        range: true,
        min: min_val,
        max: max_val,
        step: 24,
        values: [min_val, max_val],
        slide: function (e, ui){
          var lb = Math.ceil(ui.values[0]/1000)
          $(".slider-time").html(lb)
          current_selected_lb = lb
          // console.log(current_selected_lb)

          // console.log(ub/1000)
          var ub = Math.ceil(ui.values[1]/1000)
          $(".slider-time2").html(ub)
          current_selected_ub = ub
          // console.log(current_selected_ub)
        }

    });

  }

}

function reset(){
  financial_district_source = false
  north_end_source =false
  north_station_source = false
  haymarket_square_source = false
  back_bay_source = false
  beacon_hill_source = false
  boston_university_source= false
  fenway_source = false
  south_station_source = false
  theatre_district_source = false
  west_end_source = false
  northeastern_university_source = false

  financial_district_dest = false
  north_end_dest =false
  north_station_dest = false
  haymarket_square_dest = false
  back_bay_dest = false
  beacon_hill_dest = false
  boston_university_dest= false
  fenway_dest = false
  south_station_dest = false
  theatre_district_dest = false
  west_end_dest = false
  northeastern_university_dest = false

  time_mode = 1
  isUber = true
  isLyft = true
  // dt_from = "2018/11/26 00:00:00";
  // dt_to = "2018/12/18 23:59:59";
  current_selected_lb = dt_from
  current_selected_ub = dt_to
  slider()
  regen(global)
  d3.selectAll("input[type=checkbox]").property("checked", false);
  $('input:radio[name=x-axis][value=date]').click();
}

// slider();
loadData();
