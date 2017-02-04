// call the method below with the current_page name you want to view
//showScatterPlot("/processes");
//showScatterPlot("/analytics");
//showScatterPlotAll(); //shows all the pages's plots
//showBarGraph();
showBarGraphNumFails();
showBarGraphPercentFails();

function showScatterPlot(page) {
    // just to have some space around items. 
    var margins = {
        "left": 60,
            "right": 30,
            "top": 30,
            "bottom": 30
    };
    
    var width = 800;
    var height = 800;
    
    // this will be our colour scale. An Ordinal scale.
    var colors = d3.scale.category10();

    // we add the SVG component to the scatter-load div
    var svg = d3.select("#scatter-load").append("svg").attr("width", width).attr("height", height).append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

// load the data
d3.json("data.json", function(error, data) {
    // this sets the scale that we're using for the X axis. 
    // the domain define the min and max variables to show. In this case, it's the min and max timestamps of items.
    // this is made a compact piece of code due to d3.extent which gives back the max and min of the timestamp variable within the dataset

    var x = d3.scale.linear()
        .domain(d3.extent(data, function (d) {
        return d.timestamp;
    }))
    // the range maps the domain to values from 0 to the width minus the left and right margins (used to space out the visualization)
        .range([0, width - margins.left - margins.right]);

    // this does the same as for the y axis but maps from the bytes_used variable to the height to 0. 
    var y = d3.scale.linear()
        .domain(d3.extent(data, function (d) {
        return d.bytes_used;
    }))
    // Note that height goes first due to the weird SVG coordinate system
    .range([height - margins.top - margins.bottom, 0]);

    // we add the axes SVG component. At this point, this is just a placeholder. The actual axis will be added in a bit
    svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + y.range()[0] + ")");
    svg.append("g").attr("class", "y axis");

    // this is our X axis label. Nothing too special to see here.
    svg.append("text")
    	.attr("class", "axis-label")
        .attr("fill", "#414241")
        .attr("text-anchor", "end")
        .attr("x", width / 2)
        .attr("y", height - 35)
        .text("timestamp (ms)");
    //y axis label
    svg.append("text")
    	.attr("class", "axis-label")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (-50) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text("Bytes");


    // this is the actual definition of our x and y axes. The orientation refers to where the labels appear - for the x axis, below or above the line, and for the y axis, left or right of the line. Tick padding refers to how much space between the tick and the label. There are other parameters too - see https://github.com/mbostock/d3/wiki/SVG-Axes for more information
    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickPadding(2);
    var yAxis = d3.svg.axis().scale(y).orient("left").tickPadding(2);

    // this is where we select the axis we created a few lines earlier. See how we select the axis item. in our svg we appended a g element with a x/y and axis class. To pull that back up, we do this svg select, then 'call' the appropriate axis object for rendering.    
    svg.selectAll("g.y.axis").call(yAxis);
    svg.selectAll("g.x.axis").call(xAxis);

    // now, we can get down to the data part, and drawing stuff. We are telling D3 that all nodes (g elements with class node) will have data attached to them. The 'key' we use (to let D3 know the uniqueness of items) will be the name. Not usually a great key, but fine for this example.
    var chocolate = svg.selectAll("g.node").data(data, function (d) {
        //return d.name;
        if(d.current_page == page ){
        	return d.timestamp;
        }
    });

    // we 'enter' the data, making the SVG group (to contain a circle and text) with a class node. This corresponds with what we told the data it should be above.
    
    var chocolateGroup = chocolate.enter().append("g").attr("class", "node")
    // this is how we set the position of the items. Translate is an incredibly useful function for rotating and positioning items 
    .attr('transform', function (d) {
        return "translate(" + x(d.timestamp) + "," + y(d.bytes_used) + ")";
    });

    // we add our first graphics element! A circle! 
    chocolateGroup.append("circle")
        .attr("r", 3)
        .attr("class", "dot")
        .style("fill", function (d) {
            // remember the ordinal scales? We use the colors scale to get a colour for our manufacturer. Now each node will be coloured
            // by who makes the chocolate. 
            return colors(d.current_page);
    });

    // now we add some text, so we can see what each item is.
 /*   chocolateGroup.append("text")
        .style("text-anchor", "middle")
        .attr("dy", -10)
        .text(function (d) {
            // this shouldn't be a surprising statement.
            return d.name;
    });*/
});
}

function showScatterPlotAll() {
	console.log("in func");
    // just to have some space around items. 
    var margins = {
        "left": 60,
            "right": 30,
            "top": 30,
            "bottom": 30
    };
    
    var width = 800;
    var height = 800;
    
    // this will be our colour scale. An Ordinal scale.
    var colors = d3.scale.category10();

    // we add the SVG component to the scatter-load div
    var svg = d3.select("#scatter-all-load").append("svg").attr("width", width).attr("height", height).append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

// load the data
d3.json("data.json", function(error, data) {
    // this sets the scale that we're using for the X axis. 
    // the domain define the min and max variables to show. In this case, it's the min and max timestamps of items.
    // this is made a compact piece of code due to d3.extent which gives back the max and min of the timestamp variable within the dataset
    var x = d3.scale.linear()
        .domain(d3.extent(data, function (d) {
        return d.timestamp;
    }))
    // the range maps the domain to values from 0 to the width minus the left and right margins (used to space out the visualization)
        .range([0, width - margins.left - margins.right]);

    // this does the same as for the y axis but maps from the bytes_used variable to the height to 0. 
    var y = d3.scale.linear()
        .domain(d3.extent(data, function (d) {
        return d.bytes_used;
    }))
    // Note that height goes first due to the weird SVG coordinate system
    .range([height - margins.top - margins.bottom, 0]);

    // we add the axes SVG component. At this point, this is just a placeholder. The actual axis will be added in a bit
    svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + y.range()[0] + ")");
    svg.append("g").attr("class", "y axis");

    // this is our X axis label. Nothing too special to see here.
    svg.append("text")
        .attr("fill", "#414241")
        .attr("text-anchor", "end")
        .attr("x", width / 2)
        .attr("y", height - 35)
        .text("timestamp (ms)");
    //y axis label
    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (-50) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text("Bytes");


    // this is the actual definition of our x and y axes. The orientation refers to where the labels appear - for the x axis, below or above the line, and for the y axis, left or right of the line. Tick padding refers to how much space between the tick and the label. There are other parameters too - see https://github.com/mbostock/d3/wiki/SVG-Axes for more information
    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickPadding(2);
    var yAxis = d3.svg.axis().scale(y).orient("left").tickPadding(2);

    // this is where we select the axis we created a few lines earlier. See how we select the axis item. in our svg we appended a g element with a x/y and axis class. To pull that back up, we do this svg select, then 'call' the appropriate axis object for rendering.    
    svg.selectAll("g.y.axis").call(yAxis);
    svg.selectAll("g.x.axis").call(xAxis);

    // now, we can get down to the data part, and drawing stuff. We are telling D3 that all nodes (g elements with class node) will have data attached to them. The 'key' we use (to let D3 know the uniqueness of items) will be the name. Not usually a great key, but fine for this example.
    var chocolate = svg.selectAll("g.node").data(data, function (d) {
        	return d.timestamp;
    });

    // we 'enter' the data, making the SVG group (to contain a circle and text) with a class node. This corresponds with what we told the data it should be above.
    
    var chocolateGroup = chocolate.enter().append("g").attr("class", "node")
    // this is how we set the position of the items. Translate is an incredibly useful function for rotating and positioning items 
    .attr('transform', function (d) {
        return "translate(" + x(d.timestamp) + "," + y(d.bytes_used) + ")";
    });

    // we add our first graphics element! A circle! 
    chocolateGroup.append("circle")
        .attr("r", 1)
        .attr("class", "dot")
        .style("fill", function (d) {
            // remember the ordinal scales? We use the colors scale to get a colour for our manufacturer. Now each node will be coloured
            // by who makes the chocolate. 
            return colors(d.current_page);
    });

});
}

//bar graph for avg #bytes used vs page
function showBarGraph() {
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
      .attr("height", function(d) { return height - y(d.values); });

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
      .attr("height", function(d) { return height - y(d.values); });

});

}


//bar graph for %fails vs page

function showBarGraphPercentFails() {
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
      .text("percent Crashes");

  // Add bar chart
  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.key); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.values); })
      .attr("height", function(d) { return height - y(d.values); });

});

}
