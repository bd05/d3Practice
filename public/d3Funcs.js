// call the method below with the current_page name you want to view
//showScatterPlot("/processes");
scatterPlot("/analytics","/data","");
showBarGraphNumBytes();
showBarGraphNumFails();
showBarGraphPercentFails();

var colors = d3.scale.ordinal()
    .range(["#f43d55", "#C0DA74", "#FCA17D", "#6CBEED", "#9A348E", "#F9ECA7"]);

function scatterPlot(page, page2, page3){
w = 960;
h = 500;

var padding = 100;

d3.json("data.json", function(data) {

var filtered = data.filter(function (a) { 
  if ((a.current_page === page) || (a.current_page === page2)){ return a.current_page } 
});
//console.log(JSON.stringify(filtered));

data = filtered;

var xScale = d3.scale.linear()
    .domain([d3.min(data, function (d) {
    return d.timestamp;
}), d3.max(data, function (d) {
    return d.timestamp;
})])
    .range([padding, w - padding]);


var yScale = d3.scale.linear()
    .domain(d3.extent(data, function (d) {
        return d.bytes_used;
    }))
    .range([h - padding,padding]);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(6);
var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(4);

function zoom() {

    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
    .attr("cx", function (d) {
    return xScale(d.timestamp);
    })
    .attr("cy", function (d) {
    return yScale(d.bytes_used);
});

}


var zoomBeh = d3.behavior.zoom()
    .x(xScale)
    .y(yScale)
    .on("zoom", zoom);

var svg = d3.select("#scatter-plot")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "chart")

svg.append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("width", w - padding)
  .attr("height", h - padding);

svg.call(zoomBeh);


svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", function (d) {
    return xScale(d.timestamp);
})
    .attr("cy", function (d) {
    return yScale(d.bytes_used);
})
    .attr("r", 2)
    .attr("stroke", "black")
    .attr("stroke-width", 0.2)
          .style("fill", function (d) { 
            return colors(d.current_page); //colour the data points based on the page they belong to (based on ordinal scale for colour defined earlier)
      })
    .attr("clip-path", "url(#clip)");


svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + (padding) + ", 0)")
    .call(yAxis);

//add colour coded legend
     var legend = svg.selectAll(".legend")
      .data(colors.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect") //legend will appear as rquares
      .attr("x", w - 210) //position legend
      .attr("y", h - 185)
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", colors);

  legend.append("text")
      .attr("x", w - 210 + 120)
      .attr("y", h - 180)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});

}

//bar graph for avg #bytes used vs page
function showBarGraphNumBytes() {
 var margin = {top: 20, right: 20, bottom: 70, left: 100},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;


// set the ranges
var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
var y = d3.scale.linear().range([height, 0]);

// define the axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")


var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);


// add the SVG element
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
  console.log(JSON.stringify(freqTotal));

data = freqTotal;

  // scale the range of the data
  x.domain(data.map(function(d) { return d.key; }));
  y.domain([0, d3.max(data, function(d) { return d.values; })]);

  // render axis
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

  // Add bar chart
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

  //zoom
  		function zoom() {
		  svg.select(".x.axis").call(xAxis);
		  svg.select(".y.axis").call(yAxis);
          svg.selectAll("polygon")			
            .attr("transform", function(d, i) {
				return "translate("+x(d.TotalEmployed2011)+","+y(d.MedianSalary2011)+")";
			})
	        .attr('points','4.569,2.637 0,5.276 -4.569,2.637 -4.569,-2.637 0,-5.276 4.569,-2.637')
		}

});

}


//bar graph for #fails vs page

function showBarGraphNumFails() {
 var margin = {top: 20, right: 20, bottom: 70, left: 100},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;


// set the ranges
var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
var y = d3.scale.linear().range([height, 0]);

// define the axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")


var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);


// add the SVG element
var svg = d3.select("#bar-graph-num-fails").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");


// load the data
d3.json("data.json", function(error, data) {

var numCrashes = d3.nest()
  .key(function(d) { return d.current_page; })
  .rollup(function(v) { return d3.sum(v, function(d) { return d.did_aww_snap==true; }); })
  .entries(data);
  console.log(JSON.stringify(numCrashes));

data = numCrashes;

  // scale the range of the data
  x.domain(data.map(function(d) { return d.key; }));
  y.domain([0, d3.max(data, function(d) { return d.values; })]);

  // render axis
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
      .text("Number of Crashes");

  // Add bar chart
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


//bar graph for %fails vs page

function showBarGraphPercentFails() {
 var margin = {top: 20, right: 20, bottom: 70, left: 100},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

 //var colors = d3.scale.category10();

// set the ranges
var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

var y = d3.scale.linear().range([height, 0]);

// define the axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")


var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);


// add the SVG element
var svg = d3.select("#bar-graph-percent-fails").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");


// load the data
d3.json("data.json", function(error, data) {

var percentCrashes = d3.nest()
  .key(function(d) { return d.current_page; })
  .rollup(function(v) { return (d3.sum(v, function(d) { return d.did_aww_snap==true; }))/v.length; })
  .entries(data);
  console.log(JSON.stringify(percentCrashes));

data = percentCrashes;

  // scale the range of the data
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

  // Add bar chart
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

