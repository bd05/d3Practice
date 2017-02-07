showBarGraphNumBytes();
showBarGraphNumFails();
showBarGraphPercentFails();
document.getElementById('bar-graph-num-fails').style.display = 'none';
//***************************************************************
//                        UI
//****************************************************************

document.getElementById("toggle-graph").onclick = function() {toggleGraph()};

function toggleGraph() {
    var percentage = document.getElementById('bar-graph-percent-fails');
    var absSum = document.getElementById('bar-graph-num-fails');
    if (percentage.style.display === 'none') {
        percentage.style.display = 'block';
        absSum.style.display = 'none';

    } else {
        percentage.style.display = 'none';
        absSum.style.display = 'block';
    }
}

//***************************************************************
//                        bar graphs
//****************************************************************


//****************************************************
//bar graph for #fails vs page
//****************************************************
function showBarGraphNumFails() {
 var margin = {top: 20, right: 20, bottom: 100, left: 70},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;


// x and y axis settings
var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(6);


// svg element for bar graph
var svg = d3.select("#bar-graph-num-fails").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");


// load the data from external json file
d3.json("data.json", function(error, data) {
//reformat data so the json only contains crashes for each page
var numCrashes = d3.nest()
  .key(function(d) { return d.current_page; })
  .rollup(function(v) { return d3.sum(v, function(d) { return d.did_aww_snap==true; }); })
  .entries(data);
 // console.log(JSON.stringify(numCrashes));

data = numCrashes; //assign data variable to reformatted data

  // based on data, apply more settings to x and y axis (apply domain and range)
  x.domain(data.map(function(d) { return d.key; }));
  y.domain([0, d3.max(data, function(d) { return d.values; })]);

  // render x and y axes
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of crashes");

  // Add data to the bar chart
  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.key); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.values); })
      .attr("height", function(d) { return height - y(d.values); })
      .attr("fill", function(d, i) {
		    return colors(i);
		});;

});

}

//********************************************************
//bar graph for %fails vs page
//*********************************************************
function showBarGraphPercentFails() {
 var margin = {top: 20, right: 20, bottom: 100, left: 70},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(7);

var svg = d3.select("#bar-graph-percent-fails").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// load the data
d3.json("data.json", function(error, data) {
//reformat data to include only pages and their crashes, but divide by number of points for each page to get percentage
var percentCrashes = d3.nest()
  .key(function(d) { return d.current_page; })
  .rollup(function(v) { 
    return (d3.sum(v, function(d) { return d.did_aww_snap==true; }))/v.length; 
  })
  .entries(data);
  //console.log(JSON.stringify(percentCrashes));

data = percentCrashes; //assign 

  // apply domain and range to x and y axes based on reformatted data
  x.domain(data.map(function(d) { return d.key; }));
  y.domain([0, d3.max(data, function(d) { return d.values; })]);

  // render axis
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("percent Crashes");

  // Add data to bar chart
  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.key); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.values); })
      .attr("height", function(d) { return height - y(d.values); })
      .attr("fill", function(d, i) {
		    return colors(i);
		});

});

}

//*********************************************************************
//                avg #bytes used vs page
//***********************************************************************
//bar graph for avg #bytes used vs page
function showBarGraphNumBytes() {
 var margin = {top: 20, right: 20, bottom: 100, left: 100},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(6);

var svg = d3.select("#bar-graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// load the data
d3.json("data.json", function(error, data) {

var freqTotal = d3.nest()
  .key(function(d) { return d.current_page; })
  .rollup(function(v) { return d3.mean(v, function(d) { return d.bytes_used; }); })
  .entries(data);
  //console.log(JSON.stringify(freqTotal));

data = freqTotal;

  x.domain(data.map(function(d) { return d.key; }));
  y.domain([0, d3.max(data, function(d) { return d.values; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Average bytes used");

  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.key); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.values); })
      .attr("height", function(d) { return height - y(d.values); })
      .attr("fill", function(d, i) {
        return colors(i);
    });;

});

}