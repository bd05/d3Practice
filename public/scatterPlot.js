
var page1 = "/analytics"; //analytics page displayed as default view
var page2 = "";
var page3 = "";
var page4 = "";
var page5 = "";
var page6 = "";
scatterPlot(page1, page2, page3, page4, page5, page6);

//**************************************************************
//                      UI
//******************************************************************

document.getElementById("update-view").onclick = function() {updateView()}

function updateView(){
  //check which options the user has selected
  var checkBox1Status = document.getElementById("checkbox1").checked;
  var checkBox2Status = document.getElementById("checkbox2").checked;
  var checkBox3Status = document.getElementById("checkbox3").checked;
  var checkBox4Status = document.getElementById("checkbox4").checked;
  var checkBox5Status = document.getElementById("checkbox5").checked;
  var checkBox6Status = document.getElementById("checkbox6").checked;

  if(checkBox1Status == true)
    page1="/processes";
  else
    page1="";
  if(checkBox2Status == true)
    page2="/analytics";
  else
    page2="";
  if(checkBox3Status == true)
    page3="/data";
  else
    page3="";
  if(checkBox4Status == true)
    page4="/processes/editor";
  else
    page4="";
  if(checkBox5Status == true)
    page5="/";
  else
    page5="";
  if(checkBox6Status == true)
    page6="/player";
  else
    page6="";

  d3.select("svg").remove(); //remove old scatter plot
  scatterPlot(page1,page2,page3,page4,page5,page6); //create new scatter plot based on user selection
}


//**************************************************************************
//                    D3 code for graphs
//**************************************************************************
//colour scheme for both scatter graph and bar graphs
var colors = d3.scale.ordinal()
    .range(["#f43d55", "#325D7F", "#6D5C7E", "#C06C86", "#F2727F", "#F9B294"]);

function scatterPlot(page1, page2, page3, page4, page5, page6){
var w = 960; //width and height
var h = 500;
var padding = 90;

//load data from external json file
d3.json("data.json", function(data) {
//load data acording to page selection
var filtered = data.filter(function (a) { 
  if ((a.current_page === page1) || (a.current_page === page2) || (a.current_page === page3) || (a.current_page === page4) || (a.current_page === page5) || (a.current_page === page6)){ 
      return a.current_page } 
});
//console.log(JSON.stringify(filtered));

data = filtered; //filtered json returned, with only relevant points
//set x and y axes settings
var xScale = d3.scale.linear()
    .domain(d3.extent(data, function (d) {
        return d.timestamp;
    }))
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
    .ticks(5);

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

var zooming = d3.behavior.zoom()
    .x(xScale)
    .y(yScale)
    .on("zoom", zoom);

//create the scatter plot
var svg = d3.select("#scatter-plot")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "chart")

//address overflow when panning and zooming
svg.append("clipPath")
  .attr("id", "clipping")
  .append("rect")
  .attr("width", w - padding)
  .attr("height", h - padding);

svg.call(zooming);

//create and place data points
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
    .attr("clip-path", "url(#clipping)");

//render the x and y axes
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + (padding) + ", 0)")
    .call(yAxis);

//axis labels
svg.append("text")      // text label for the x axis
    .attr("x", w/2 )
    .attr("y", (h - padding + 40))
    .style("text-anchor", "middle")
    .text("Timestamp (s)");

svg.append("text")   //label for y-axis
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x",0 - (h/2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number of bytes used");
});

}
