
var page1 = "/analytics";
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
  var checkBox1Status = document.getElementById("checkbox1").checked;
  var checkBox2Status = document.getElementById("checkbox2").checked;
  var checkBox3Status = document.getElementById("checkbox3").checked;
  var checkBox4Status = document.getElementById("checkbox4").checked;
  var checkBox5Status = document.getElementById("checkbox5").checked;
  var checkBox6Status = document.getElementById("checkbox6").checked;

  console.log(checkBox1Status);
  console.log(checkBox2Status);
  console.log(checkBox3Status);


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
  console.log(page1 + " " + page2 + " " + page3);
    d3.select("svg").remove();
    console.log("removed scatterplot");
    scatterPlot(page1,page2,page3,page4,page5,page6);
}


//**************************************************************************
//                    D3 code for graphs
//**************************************************************************
var colors = d3.scale.ordinal()
    .range(["#f43d55", "#C0DA74", "#FCA17D", "#6CBEED", "#9A348E", "#F9ECA7"]);

function scatterPlot(page1, page2, page3, page4, page5, page6){
  console.log("making a scatterPlot");
  console.log(page1 + " " + page2 + " " + page3);
var w = 960;
var h = 500;

var padding = 100;

d3.json("data.json", function(data) {

var filtered = data.filter(function (a) { 
  if ((a.current_page === page1) || (a.current_page === page2) || (a.current_page === page3) || (a.current_page === page4) || (a.current_page === page5) || (a.current_page === page6)){ 
      return a.current_page } 
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
/*
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
      .text(function(d) { return d; }); */

});

}

function remove() {
    d3.select("svg").remove();
    console.log("removed scatterplot");
    scatterPlot(page1,page2,page3);
}
