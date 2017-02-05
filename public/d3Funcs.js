// call the method below with the current_page name you want to view
//showScatterPlot("/processes");
//showScatterPlot("/analytics", "/processes");
showScatterPlotAllTest(); //shows all the pages's plots
//showBarGraphNumBytes();
//showBarGraphNumFails();
//showBarGraphPercentFails();

var colors = d3.scale.ordinal()
    .range(["#f43d55", "#C0DA74", "#FCA17D", "#6CBEED", "#9A348E", "#F9ECA7"]);

function showScatterPlot(page,page1,page2) {
    var margins = {
        "left": 100,
            "right": 30,
            "top": 30,
            "bottom": 60
    };
    
    var width = 800;
    var height = 800;
    
    //var colors = d3.scale.category10();// ordinal colour scale
    /*var colors = d3.scale.ordinal()
    .range(["#98abc5", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);*/

    //add the SVG component to the scatter-load div
    var svg = d3.select("#scatter-load")
    	.append("svg").attr("width", width)
    	.attr("height", height).append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

// load the data
d3.json("data.json", function(error, data) {
	//set x-axis scale domain and range
  var x = d3.scale.linear()
        .domain(d3.extent(data, function (d) { //domain defines min and max, d3.extent() returns min and max of timestamp
        return d.timestamp;
    }))
        .range([0, width - margins.left - margins.right]);//range maps the domain to values from 0 to the width minus the left and right margins

    //set y-axis scale domain and range
    var y = d3.scale.linear()
        .domain(d3.extent(data, function (d) {
        return d.bytes_used;
    }))
    .range([height - margins.top - margins.bottom, 0]); //height goes first because SVG coordinate system sets downwards to decreasing y

    //add the axes's SVG component. Just a placeholder for now
    svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + y.range()[0] + ")");
    svg.append("g").attr("class", "y axis");

    // X axis label
    svg.append("text")
    	.attr("class", "axis-label")
        .attr("fill", "#414241")
        .attr("text-anchor", "end")
        .attr("x", width / 2)
        .attr("y", height - 35)
        .text("Time elapsed (s)");
    //y axis label
    svg.append("text")
    	.attr("class", "axis-label")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (-70) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text("Bytes Used");

    //define x and y axes
    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickPadding(2);//x axis displayed at bottom of graph
    var yAxis = d3.svg.axis().scale(y).orient("left").tickPadding(2);//y axis displayed at left of graph

    //render axes
    svg.selectAll("g.y.axis").call(yAxis);
    svg.selectAll("g.x.axis").call(xAxis);

    //all nodes (g elements with class node) will have data attached to them. Key is page name(to let D3 know the uniqueness of items) 
    var pagesToPlot = svg.selectAll("g.node").data(data, function (d) {
        if(d.current_page == page){
        	return d.timestamp;
        }
        if(d.current_page == page1){
        	return d.timestamp;
        }
        if(d.current_page == page2){
        	return d.timestamp;
        }
    });

   
    var pageGroup = pagesToPlot.enter().append("g").attr("class", "node")
    // set the position of the items
    .attr('transform', function (d) {
        return "translate(" + x(d.timestamp) + "," + y(d.bytes_used) + ")";
    });


    pageGroup.append("circle")
        .attr("r", 3)
        .attr("class", "dot")
        .style("fill", function (d) { 
            return colors(d.current_page); //colour the data points based on the page they belong to (based on ordinal scale for colour defined earlier)
    	});

     //add colour coded legend
     var legend = svg.selectAll(".legend")
      .data(colors.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect") //legend will appear as rquares
      .attr("x", width - 210) //position legend
      .attr("y", height - 185)
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", colors);

  legend.append("text")
      .attr("x", width - 210 + 120)
      .attr("y", height - 180)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
});
}

function showScatterPlotAll() {
    // just to have some space around items. 
    var margins = {
        "left": 60,
            "right": 30,
            "top": 30,
            "bottom": 30
    };
    
    var width = 800;
    var height = 800;

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

        // we add the SVG component to the scatter-load div
	

    var svg = d3.select("#scatter-all-load")
    	.append("svg").attr("width", width)
    	.attr("height", height)
    	.append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        .call(d3.behavior.zoom().on("zoom", function () {
        	svg.select(".x.axis").call(xAxis);
		  svg.select(".y.axis").call(yAxis);
    svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
  }));

    svg.append("clipPath")
	.attr("id", "clip")
	.append("rect")
	.attr("width", width)
	.attr("height", height);
      

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

    chocolateGroup.append("circle")
        .attr("r", 2)
        .attr("class", "dot")
        .style("fill", function (d) {
            return colors(d.current_page);
    });

     //add colour coded legend
     var legend = svg.selectAll(".legend")
      .data(colors.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 210)
      .attr("y", height - 185)
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", colors);

  legend.append("text")
      .attr("x", width - 210 + 120)
      .attr("y", height - 180)
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


//============zoom test==========
//************************************************************
// Create Margins and Axis and hook our zoom function
//************************************************************
function showScatterPlotAllTest() {
var margin = {"left": 60,
            "right": 30,
            "top": 70,
            "bottom": 30},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

d3.json("data.json", function(error, data) {	
/*var x = d3.scale.linear()
    .domain([0, 12])
    .range([0, width]);
 
var y = d3.scale.linear()
    .domain([-1, 16])
    .range([height, 0]);*/
        var x = d3.scale.linear()
        .domain(d3.extent(data, function (d) {
        return d.timestamp;
    	}))
        .range([0, width]);

    var y = d3.scale.linear()
        .domain(d3.extent(data, function (d) {
        return d.bytes_used;
    }))
    .range([height, 0]);

	
var xAxis = d3.svg.axis()
    .scale(x)
	.tickSize(-height)
	.tickPadding(10)	
	.tickSubdivide(true)	
    .orient("bottom");	
	
var yAxis = d3.svg.axis()
    .scale(y)
	.tickPadding(10)
	.tickSize(-width)
	.tickSubdivide(true)	
    .orient("left");
	
var zoom = d3.behavior.zoom()
    .x(x)
    .y(y)
    .scaleExtent([1, 10])
    .on("zoom", zoomed);	
	
	
 
	
	
//************************************************************
// Generate our SVG object
//************************************************************	
var svg = d3.select("#scatter-all-load").append("svg")
	.call(zoom)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + y.range()[0] + ")")
    .call(xAxis);
 
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);
 
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

svg.append("clipPath")
	.attr("id", "clip")
	.append("rect")
	.attr("width", width -100)
	.attr("height", height - 100);
	
	
	
	
	
//************************************************************
// Create D3 line object and draw data on our SVG object
//************************************************************
/*var line = d3.svg.line()
    .interpolate("linear")	
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });		
	
svg.selectAll('.line')
	.data(data)
	.enter()
	.append("path")
    .attr("class", "line")
	.attr("clip-path", "url(#clip)")
	.attr('stroke', function(d,i){ 			
		return colors[i%colors.length];
	})
    .attr("d", line);		
	
	*/
	
	
//************************************************************
// Draw points on SVG object based on the data given
//************************************************************
/*var points = svg.selectAll('.dots')
	.data(data)
	.enter()
	.append("g")
    .attr("class", "dots")
	.attr("clip-path", "url(#clip)");	
 
points.selectAll('.dot')
	.data(function(d){ 		
		var a = [];
		d.forEach(function(point,i){
			a.push({'index': index, 'point': point});
		});		
		return a;
	})
	.enter()
	.append('circle')
	.attr('class','dot')
	.attr("r", 2.5)
	.attr('fill', function(d){ 	
		return colors(d.current_page);
	})	
	.attr("transform", function(d) { 
		return "translate(" + x(d.point.x) + "," + y(d.point.y) + ")"; }
	);*/
	
	/* var pagesToPlot = svg.selectAll("g.node").data(data, function (d) {
        	return d.timestamp;
    })
	 .attr("clip-path", "url(#clip)");

   
    var pageGroup = pagesToPlot.enter()
    .append("g")
    .attr("class", "node")
    .attr('transform', function (d) {
        return "translate(" + x(d.timestamp) + "," + y(d.bytes_used) + ")";
    })
    .append("circle")
        .attr("r", 3)
        .attr("class", "dot")
        .style("fill", function (d) { 
            return colors(d.current_page); //colour the data points based on the page they belong to (based on ordinal scale for colour defined earlier)
    	})
    	.attr("clip-path", "url(#clip)");*/

    		var poly = svg.selectAll("polygon")
			.data(data)
			.enter()
			.append("polygon")
	        .attr("class","hex")
			.attr("transform", function(d, i) {
				return "translate("+x(d.timestamp)+","+y(d.bytes_used)+")";
			})
			.attr('points','4.569,2.637 0,5.276 -4.569,2.637 -4.569,-2.637 0,-5.276 4.569,-2.637')
			.attr("opacity","0.8")
			.attr("fill",function(d) {
				return colors(d.current_page);
			})
			.attr("clip-path", "url(#clip)");;
	
//************************************************************
// Zoom specific updates
//************************************************************
function zoomed() {
	svg.select(".x.axis").call(xAxis);
	svg.select(".y.axis").call(yAxis);   
	//svg.selectAll('path.line').attr('d', line);  
 
	svg.selectAll('polygon').attr("transform", function(d) { 
		return "translate(" + x(d.timestamp) + "," + y(d.bytes_used) + ")"; }
	);  
}
});
}