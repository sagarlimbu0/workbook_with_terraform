// Second SVG graph
var second_map= d3.select("#second_map")

//var height_second_map = +second_map.attr("height");

second_map.attr("width", width_map)


var left_width= 40

// Scatter plot

var scatter_plot= second_map.append("g")
 .attr("transform", "translate(80," + (height_map/1.5) + ")")

// var xAxis= d3.scaleLinear()
// //    .domain(d3.extent(data, d => d.length))       
//     .domain([1, 12])
//     .range([0, height_map ])

var x= d3.scaleLinear()
    .domain([0, d3.max( data, d=> d.Index)])
    .range([0, 500])

var y= d3.scaleLinear()
    .domain(d3.extent( data, d => d.mean_xco2))
    // .domain([0, 6])
    .range([200, 0])
    

var xAxis= 
    scatter_plot.append("g")
    .attr("transform", "translate(0," + (height_map/3.5 ) + ")")
    .call(d3.axisBottom(x))

scatter_plot.append("g")
    .attr("transform", "translate(0," + (height_map/3.5 ) + ")")
    .call(d3.axisBottom(x))

scatter_plot.append("g")
    .call(d3.axisLeft(y))


scatter_plot.selectAll("circle")
.data(data)
.enter().append("circle")
.style("stroke", "gray")
// .style("fill", d => colorBar(d["mean_xco2"]))
.attr("cx", d => x(d["Index"]))
.attr("cy", d => y(d["mean_xco2"]))
.attr("fill", d => colorXco2(d["mean_xco2"]))
.attr("r", 2)
.style("opacity", .85)


/// BRUSH
// BRUSHING tool
var brush= d3.brush()
.extent([ [0, 0], [width_map, height_map]] )
.on("brush", updateChart)

// .on("Start brush", brushCircle)

svg_map.append("g")
            .attr("class", "brush")
            .call(brush);


// function to updated when called
function updateChart(){

let value= [];
var selection = d3.event.selection;


if (!selection) { return }

if (selection){

    const [[x0, y0], [x1, y1]] = selection;

    const isSelected= d => 
        x()
}

}
