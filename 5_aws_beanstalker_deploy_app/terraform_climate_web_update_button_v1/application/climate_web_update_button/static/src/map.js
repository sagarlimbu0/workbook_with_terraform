// d3 geo map visualization for OCO2 xoc2 anomalies

var map_color = '#454545' //"#a9a9a9" //"#dfe6e6"
var circle_fill_color = "#c06c84"
var circle_stroke_color = "#6c5b7b"
var min_xco2 = 390;
var max_xco2 = 420;

var tooltip_offset = 1100 + 30;
var svg_map = d3.select("#map")

// SECOND graph chart
// var svg_second_graph = d3.select("#second");

var width_map = window.innerWidth

var height_map = +svg_map.attr("height");

var margin2 = { top: 10, right: 10, bottom: 10, left: 0 };

// Set width and height
var width = window.innerWidth - margin2.left - margin2.right,
    height = +svg_map.attr("height");

// Offset for the graphs 
var leftOffset = 250;
// Adjust the WIDTH of the chart
var line_chart_width = 450;


console.log(window.width);

// svg_map.attr("width", width_map);

// append the svg object to the body of the page
svg_map.append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

// // Map and projection
var projection = d3.geoNaturalEarth1()
    //  var projection = d3.geoOrthograph/ic() //ortho spherical
    .scale(width_map / Math.PI)
    .translate([width_map / 2, height_map / 2])
    .scale([185])
// .rotate([0, 0]);

const config = {
    speed: 0.010,
    verticalTilted: -10,
    horizontalTilted: 0
}

// Rotate the global map
function Rotate() {
    d3.timer(function (elapsed) {
        projection.rotate(
            [
                config.speed * elapsed - 120,
                config.verticalTilted,
                config.horizontalTilted]);

        svg_map.selectAll("path").attr("d", path);

    })
}

// Rotate();

var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

//svg_map.call(zoom);

// DRAG the map
const sensitivity = 75
let path = d3.geoPath().projection(projection)



//////////////
//// DRAG feature to move around map

// svg_map.call(d3.drag()
//     .on('drag', () => {
//         const rotate = projection.rotate()
//         const k = sensitivity / projection.scale()

//     projection.rotate([
//       rotate[0] + d3.event.dx * k,
//       rotate[1] - d3.event.dy * k
//     ])
//     path = d3.geoPath().projection(projection)
//     svg_map.selectAll("path").attr("d", path)
//   }))


// ZOOM feature
function zoomed() {

    // transforming the other data points as well
    var transformed = d3.event.transform

    svg_map.selectAll("path")
        .attr("transform", d3.event.transform);

    svg_map.selectAll(".pin, .circle")
        .attr("transform", d3.event.transform)
        .attr("r", 1.5 / transformed.k);
}


//var colorXco2= d3.scaleSequential(d3.interpolatePiYG)
var colorXco2 = d3.scaleSequential(d3.interpolateViridis)
    // var colorXco2= d3.scaleSequential(d3.interpolateRdBu)
    .domain([min_xco2, max_xco2])


// Load external GeoJSON data to create global map
d3.json(base_url + "/get_world_map", function (data) {


    // function create_map(globalData)
    // {
    // // // entire global map
    // svg_map.append("g")
    //     .selectAll("path")
    //     .data(globalData.features)
    //     .enter()
    //     .append("path")
    //         .attr("fill", map_color)
    //         .attr("d", d3.geoPath()
    //             .projection(projection)
    //         )
    //         .style("stroke", "#fff")

    // }

    // function create_map(globalData)
    // {
    // // entire global map
    svg_map.append("g")

        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        // .attr("class", "continent")
        // .attr("fill", map_color)

        .style("fill", "#7fcdff")
        .style("stroke", "black")
        .style("stroke-width", 0.15)
        .attr("d", d3.geoPath()
            .projection(projection)
        )
    // .style("stroke", "#fff")


    // call the function 
    // create_map(data);

    /////////////////////
    // DropDown menu to select the PATH for file
    d3.select("select")
        .on("change", function (d) {

            // Get the value from the Dropdown option
            var selected = d3.select("#data_year")
                .node().value;

            console.log("FILE PATH: ")
            //    file_path= "climate_clean_var_half_" + selected

            // file_path= "combined_sif_xco2_" + selected

            file_path = "city_weather_halve_" + selected
            // console.log(file_path)

            updateFileByYear(file_path)

        }).node().value;


    // updateFileByYear("2020");

    // TIME format
    // var time_format= "%Y-%m-%d";
    var time_format = "%m/%d/%Y";

    // Function to update by YEAR, dropdown menu
    function updateFileByYear(file_path) {
        // Redirect the PATH to file by selected YEAR
        return d3.csv(base_url + "/get_climate_data?filename=" + file_path,

            function (d) {
                return {

                    // Index: +d.Index,
                    // //date: d3.timeParse(time_format)(d.Date),
                    // date: d3.timeParse("%Y-%m-%d")(d.Date),

                    // x: +d.Longitude_x,
                    // y: +d.Latitude_y,
                    // month: +d.Month,
                    // year: +d.Year,
                    // sif: +d["sif_757nm"],
                    // xco2: +d["Xco2"]


                    x: +d.Long,
                    y: +d.Lat,
                    groups: +d.groups,
                    city: +d.City,
                    temperature: +d.Temperature,
                    humidity: +d.Humidity,
                    cloudiness: +d.Cloudiness,
                    wind: +d.Wind,

                }
            },

            // LOAD data by selected year
            // second function to select MONTH after filtering
            function (data) {

                // Assign unique ID
                var graph_ID = "graphs_id";

                // UPDATE and remove previous data
                function removeData() {
                    //        svg_map.selectAll("*").remove();
                    svg_map.selectAll("circle").remove();
                    svg_map.selectAll("text").remove();
                    svg_map.selectAll("g.brush").remove();

                    // svg_map.select("g").remove();

                    // Recreate the global map
                    // create_map(data);

                    // svg_map.selectAll("g" + graph_ID).remove();

                    // svg_map.selectAll("g" + graph_ID).remove();
                    // svg_map.selectAll("g").remove();

                }

                //////////////////
                /// CLEAR button to clear everything
                d3.select("#clearAll")
                    .on("click", function () {
                        d3.selectAll("g." + graph_ID).remove();

                    })

                //////////////////////////////////////////////////////////////////////////
                //////////////////////////////////////////////////////////////////////////
                // Function to update the data by diff. MONTH selection
                //function updateMap(data, month_sel) {

                // update and clean the map
                removeData();

                //filter the data by month and use for visualization
                //  data= data.filter( d => {
                //     return d.month === +month_sel;
                // })

                // console.log("Parsed Data: ")
                // console.log(data)

                // function uniqueVal(arr) {
                //     let output = arr.filter(function (v, i, self) {
                //         return i === self.indexOf(v);
                //     });
                //     return output;
                // }
                // //////////////////////////
                // //// Legend Labels; Anomalies
                // // var anomalies_keys = data.columns
                // var anomalies_keys_ = uniqueVal(data.map(d => d.groups))

                // var colorGroups_ = d3.scaleOrdinal()
                //     .domain(anomalies_keys_)
                //     .range(d3.schemeSet1);


                // append the points on MAP
                var pinsGroup = svg_map.selectAll(".pin")
                    .data(data)
                    .enter().append("circle")
                    .attr("class", "pin")
                    // .attr("cx", function(d) { return projection([d.Longitude, d.Latitude])[0]; })
                    // .attr("cy", function(d) { return projection([d.Longitude, d.Latitude])[1]; })
                    .attr("cx", function (d) { return projection([d.x, d.y])[0]; })
                    .attr("cy", function (d) { return projection([d.x, d.y])[1]; })
                    .attr("r", 2.5)
                    .attr("fill", "red")

                // .attr("fill", function(d) {
                //     return colorGroups_(d.groups)
                // })

                // .style("fill", d => colorXco2(d.xco2))
                // .style("stroke", circle_stroke_color);


                //////////////////////////////                    
                //////////////////////////////
                // COLOR BAR
                // Create a color bar gradient

                const colorBar = svg_map.append("g")
                    //.attr("transform", `translate( ${width_map /4.5  }, ${ height_map/ 2 })`);
                    .attr("transform", `translate( ${width_map / 3.5}, ${height_map / 1.9})`);


                // Calculate the width of each color segment
                // var segmentWidth = 26;

                var color_bar_width = 1000
                var segmentWidth = 15;
                var segmentHeight = 20;
                var segments = 18;
                var segmentColors = [];


                var columns = data.columns
                ///////////////////////////////
                ///////////////////////////////
                // COLOR bar segments loop
                // for (var i = min_xco2; i <= max_xco2; i++) {
                //     // for (var i = min_mean_xco2; i <= max_mean_xco2; i++) {

                //     segmentColors.push(colorXco2(i));
                // }

                // // Draw the color segments
                // colorBar.selectAll("rect")
                //     .data(segmentColors)
                //     .enter()
                //     .append("rect")
                //     .attr("x", function (d, i) {
                //         return i * segmentWidth;
                //     })
                //     .attr("y", 0)
                //     .attr("width", segmentWidth)
                //     .attr("height", segmentHeight)
                //     .attr("fill", function (d) {
                //         return d;
                //     });

                // // Add text labels to the color bar
                // colorBar.selectAll("text")
                //     .data(segmentColors)
                //     .enter()
                //     .append("text")
                //     .attr("x", function (d, i) {
                //         return i * segmentWidth;
                //     })
                //     .attr("y", segmentHeight + 15)
                //     .text(function (d, i) {
                //         var value = i + 390;

                //         // var value= i + 0;
                //         return value;
                //     })
                //     .style("font-size", "8px")
                //     .attr("font-weight", 450)


                //  function(d,i) {return i*100+100;})

                ////////////////
                // Brushable actions on XCO2 globally
                // using the brush to retrieve data points and display on scatter plot
                // BRUSHING tool
                var brush = d3.brush()
                    .extent([[0, 0], [width_map, height_map]])
                    .on("brush", brushed)

                // .on("Start brush", brushCircle)

                svg_map.append("g")
                    // .attr("class", graph_ID)
                    .call(brush);

                //// GRAPH
                //////////////////////
                // NEW SVG selection
                var svg_graph = d3.select("#graph");

                // // SECOND graph chart
                var svg_second_graph = d3.select("#second_graph");


                //////////////////////////////////////
                //// FIRST chart
                // SCATTER PLOT uses the Second SVG; 
                // SCATTER plot graph
                var scatter_plot = svg_graph.append("g")
                    // .attr("transform", "translate(100," + (height_map / 1.5) + ")")
                    // .attr("class", graph_ID);
                    .attr("class", "scatter_plot")
                    // .attr("transform", "translate(100," + (height_map/1.5) + ")")
                    .attr("transform", "translate(120," + (60) + ")")

                ////////////////////////
                // Second scatter plot chart; side-by-side using other vars
                var scatter_plot_second = svg_graph.append("g")
                    .attr("class", "scatter_plot_second")
                    // .attr("transform", "translate(100," + (height_map/1.5) + ")")
                    .attr("transform", "translate(560," + (60) + ")")

                // LINE plot: modis
                var line_graph = svg_graph.append("g")

                //////////////////////
                ///// parallel Chart; use third SVG
                var parallel_graph = svg_second_graph.append("g")
                    .attr("transform", "translate(220," + 60 + ")")


                /////////////////////
                //// TABLE with variables values
                var tableBody = d3.select("#data-table tbody")

                //// LEGEND, selecting the MAP SVG; this svg is different than the CHART
                // LEGEND labels
                var legend_labels = svg_map.append("g")
                var legend_colors = svg_map.append("g")
                var legend_title = svg_map.append("g")

                // LEGEND labels for Parallel CHARTS
                var legend_labels_second = svg_second_graph.append("g")
                // .attr("transform", "translate(580," + (300) + ")")
                var legend_colors_second = svg_second_graph.append("g")
                var legend_title_second = svg_second_graph.append("g")



                // Remove GRAPH elements
                // function to CLEAR previous data points
                function removeScatterPoints() {
                    //    scatter_plot.selectAll("circle").remove();
                    scatter_plot.selectAll("*").remove();
                    scatter_plot_second.selectAll("*").remove();

                    legend_colors.selectAll("rect").remove();

                    legend_labels.selectAll("*").remove();
                    legend_title.selectAll("*").remove();

                    // clear the second legend labels
                    legend_colors_second.selectAll("*").remove();
                    legend_labels_second.selectAll("*").remove();
                    legend_title_second.selectAll("*").remove();

                    // clear the second graph
                    parallel_graph.selectAll("*").remove();

                    line_graph.selectAll("*").remove();
                    tableBody.selectAll("*").remove();
                    // table.selectAll("*").remove();

                }

                // Brushing function
                // selects the dotted points with BRUSH feature
                function brushed() {
                    const selection = d3.event.selection;

                    if (selection) {
                        const selectedPoints = data.filter(d => {
                            const [x0, y0] = projection([d.x, d.y]);

                            // Collect data within the SELECTED brush RANGE
                            return x0 >= selection[0][0] && x0 <= selection[1][0] &&
                                y0 >= selection[0][1] && y0 <= selection[1][1];
                        });

                        ///Do something with selectedPoints
                        // console.log("Selected Points:", selectedPoints);

                        // Update the style of selected points
                        //pinsGroup.attr("fill", d => selectedPoints.includes(d) ? "red" : "blue");


                        //// CHECK date variable
                        // console.log("City:")
                        // console.log(selectedPoints)

                        // var dates= selectedPoints.map( d=> d.date)
                        // console.log(dates)

                        // window resize for graph
                        var chart_width_adjust = 190;

                        // SCATTER plot with the data within BRUSHED range
                        var left_width = 40
                        // var sep_chart= window.width + 242;

                        var sep_chart = 1000;
                        var xlabel_scale = "-.15em"
                        var ylabel_scale = ".15em"

                        /// Variables
                        var firstVarSelection = "humidity"
                        var secondVarSelection = "wind"
                        var thirdVarSelection = "temperature"

                        ///////////////////////////////
                        ///////////////////////////////
                        ///// GRIDS
                        // function yGrid(graph, yScale){
                        //     graph.append("g")
                        //     .attr("class", "grid-lines")
                        //     .selectAll("line")
                        //     .data(yScale)
                        //     .join('line')
                        //     .attr('x1', margin2.left)
                        //     .attr('x2', width_map - margin2.right)
                        //     .attr('y1', d => yScale(d))
                        //     .attr('y2', d => yScale(d))
                        // }


                        ///test the function
                        // updateScatterPlot(selectedPoints, firstVarSelection, secondVarSelection)

                        updateScatterPlot(selectedPoints, firstVarSelection, secondVarSelection, thirdVarSelection)

                        //////////////////////////////////////////////
                        //////////////////////////////////////////////
                        // FUNCTION to update the SCATTER POINTS
                        function updateScatterPlot(filteredData, firstVar, secondVar, thirdVar) {

                            // update the scatter plot graph
                            removeScatterPoints();

                            ////////////////////////
                            //// LEGEND of Anomalies
                            function uniqueVal(arr) {
                                let output = arr.filter(function (v, i, self) {
                                    return i === self.indexOf(v);
                                });
                                return output;
                            }
                            //////////////////////////
                            //// Legend Labels; Anomalies
                            // var anomalies_keys = data.columns
                            var anomalies_keys = uniqueVal(filteredData.map(d => d.groups))

                            // console.log("Anomalies: ")
                            // console.log(anomalies_keys)

                            var size = 15;

                            var colorGroups = d3.scaleOrdinal()
                                .domain(anomalies_keys)
                                .range(d3.schemeSet1);


                            // var legend_colors = svg_map.append("g")
                            legend_colors.selectAll("mydots")
                                // .attr("transform", "translate(0," + 200)
                                .attr("transform", "translate(0," + (200) + ")")

                                .data(anomalies_keys)
                                .enter()
                                .append("rect")
                                .attr("x", 100)
                                .attr("y", function (d, i) { return 100 + i * (size + 5) })
                                .attr("width", size)
                                .attr("height", size)
                                // .style("fill", function (d) { return color_anomalies(d) })
                                .style("fill", function (d) { return colorGroups(d) })

                            // Add one dot in the legend for each name.
                            // var legend_labels= svg_map.append("g")
                            legend_labels.selectAll("mylabels")
                                .attr("transform", "translate(0," + (800) + ")")
                                .data(anomalies_keys)
                                .enter()
                                .append("text")
                                .attr("x", 100 + size * 1.2)
                                .attr("y", function (d, i) { return 100 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
                                // .style("fill", function (d) { return color_anomalies(d) })

                                .style("fill", function (d) { return colorGroups(d) })

                                .text(function (d) { return d })
                                .attr("text-anchor", "left")
                                .style("alignment-baseline", "middle")


                            //TITLE of legend; Anomalies
                            legend_title.append("text")
                                //.attr("transform", "translate(0," + 800)
                                //.attr("class", "scatter_plot")
                                // .attr("transform", "rotate(-90)")
                                .attr("y", 50)
                                .attr("x", 100)
                                .attr("dy", "2em")
                                .style("text-anchor", "middle")
                                .style("font-size", "15px")
                                .text("Anomalies")


                            // console.log("Width map:")
                            // console.log(window.width)
                            // console.log(window.width/ 2)

                            ////////////////////////////////
                            /// length, width
                            var left_offset = 0;


                            var x = //d3.scaleTime()
                                d3.scaleLinear()
                                    // .domain([0, d3.max( data, d=> d.Index)])
                                    //.domain([d3.min(selectedPoints, d=> d.Index), d3.max( selectedPoints, d=> d.Index)])

                                    .domain([0, 100])
                                    // .domain([d3.min(filteredData, d => d[firstVar]), d3.max(filteredData, d => d[firstVar])])
                                    .range([0, 300])//sep_chart/ 2])
                            //.range([0, sep_chart / 1.5])

                            var y = d3.scaleLinear()
                                //.domain(d3.extent( data, d => d.mean_xco2_anomaly))
                                // .domain([-6, 6])

                                .domain([0, 60])
                                //.domain([d3.min(filteredData, d => d[secondVar]), d3.max(filteredData, d => d[secondVar])])
                                // .domain([0, d3.max(selectedPoints, d=> d.xco2)])
                                .range([200, 0])
                            //.range([height, 0])

                            // X-AXIS 
                            scatter_plot.append("g")
                                //.attr("transform", "translate(0," + (height_map / 3.5) + ")")
                                .attr("transform", "translate(0," + (200) + ")")
                                .call(d3.axisBottom(x)
                                    .tickSize(1.3)
                                    .ticks(10)
                                )
                                .selectAll("text")
                            // .attr("dx", xlabel_scale)
                            // .attr("dy", ylabel_scale)

                            // .attr("transform", "rotate(-70)")


                            scatter_plot.append("g")
                                // .attr("transform", "translate(" + (200), 0 + ")")
                                .call(d3.axisLeft(y))

                            // SCATTER plot

                            // scatter_plot.append("path")
                            //     .datum(selectedPoints)
                            //     .attr("fill", "none")
                            //     .attr("stroke", "steelblue")
                            //     .attr("stroke-width", 1.1)
                            //     .attr("d", d3.line()
                            //         //.x(function(d) { return x(d.Index)})

                            //         // .x(function(d) { return x( d.date)})
                            //         // .y(function(d) { return y(d.xco2)})
                            //         .x(function (d) { return x(d[firstVar]) })
                            //         .y(function (d) { return y(d[secondVar]) })
                            //         .curve(d3.curveCardinal.tension(0.25))
                            //     )

                            scatter_plot
                                .selectAll("dot")
                                .data(filteredData)
                                .enter()
                                .append("circle")
                                // .attr("class", "scatter_plot")
                                .attr("cx", function (d) { return x(d[firstVar]) })
                                .attr("cy", function (d) { return y(d[secondVar]) })
                                .attr("r", 3)
                                .style("opacity", .5)
                                .attr("fill", "green")
                                .attr("stroke", "black")


                            /// ADD Y-axis label
                            scatter_plot.append("text")
                                .attr("transform", "rotate(-90)")
                                .attr("y", -95)
                                .attr("x", -70)
                                .attr("dy", "2.5em")
                                .style("text-anchor", "middle")
                                .text(secondVar)
                            // .text("OCO2-XCO2")

                            // X-Axis label
                            scatter_plot.append("text")
                                .attr("transform", "translate(160," + (chart_width_adjust + 55) + ")")
                                .attr("text-anchor", "end")
                                .text(firstVar)


                            //// GRID



                            ////////////////////////////////
                            ///////////////////////////////
                            /// Second scatter plot, side-by-side

                            var x_second_scatterplot = //d3.scaleTime()
                                d3.scaleLinear()
                                    .domain([0, 125]) // temp max: 120
                                    // .domain([d3.min(filteredData, d => d[firstVar]), d3.max(filteredData, d => d[firstVar])])
                                    .range([0, 300])//sep_chart/ 2])

                            var y_second_scatterplot = d3.scaleLinear()
                                .domain([0, 60])
                                .range([200, 0])

                            // X-AXIS 
                            scatter_plot_second.append("g")
                                //.attr("transform", "translate(0," + (height_map / 3.5) + ")")
                                .attr("transform", "translate(0," + (200) + ")")
                                .call(d3.axisBottom(x_second_scatterplot))
                            //.selectAll("text")
                            // .attr("transform", "translate(400, 10)")

                            // Y-AXIS
                            scatter_plot_second.append("g")
                                // .attr("transform", "translate(800, 500 )")
                                .call(d3.axisLeft(y_second_scatterplot))


                            scatter_plot_second
                                .selectAll("dot")
                                .data(filteredData)
                                .enter()
                                .append("circle")
                                // .attr("class", "scatter_plot")
                                .attr("cx", function (d) { return x_second_scatterplot(d[thirdVar]) })
                                .attr("cy", function (d) { return y_second_scatterplot(d[secondVar]) })
                                .attr("r", 3)
                                .style("opacity", .5)
                                .attr("fill", "red")
                                .attr("stroke", "black")

                            /// ADD Y-axis label
                            scatter_plot_second.append("text")
                                .attr("transform", "rotate(-90)")
                                .attr("y", -95)
                                .attr("x", -70)
                                .attr("dy", "2.5em")
                                .style("text-anchor", "middle")
                                .text(secondVar)
                            // .text("OCO2-XCO2")

                            // X-Axis label
                            scatter_plot_second.append("text")
                                .attr("transform", "translate(160," + (chart_width_adjust + 55) + ")")
                                .attr("text-anchor", "end")
                                .text(thirdVar)


                            ///////////////////////////
                            //////////////////////////
                            //// Second-graph Chart
                            /// multiple- y line charts
                            /// Taking averages of the data-points and creating line-charts


                            // console.log("Filtered Data")
                            // console.log(filteredData)

                            const averages_total = Object.entries(
                                filteredData.reduce((acc,
                                    { groups, temperature, wind, humidity, cloudiness }) => ({
                                        ...acc, [groups]: [...(acc[groups] || []),
                                        { temperature, wind, humidity, cloudiness }]
                                    }), {}))
                                .map(([groups, dataPoints]) => {
                                    const average = dataPoints.reduce((acc,
                                        { temperature, wind, humidity, cloudiness }) =>
                                    ({
                                        temperature: acc.temperature + temperature,
                                        wind: acc.wind + wind,
                                        humidity: acc.humidity + humidity,
                                        cloudiness: acc.cloudiness + cloudiness,
                                    }),
                                        { temperature: 0, wind: 0, humidity: 0, cloudiness: 0 });

                                    const count = dataPoints.length;

                                    return {
                                        groups,
                                        temperature: average.temperature / count,
                                        wind: average.wind / count,
                                        humidity: average.humidity / count,
                                        cloudiness: average.cloudiness / count,
                                    };
                                });

                            console.log("Avg of Line charts")
                            console.log(averages_total)

                            // multiple y-axis variables to show connection

                            var climate_var = ["temperature", "humidity", "cloudiness", "wind"]

                            var color_climate = d3.scaleOrdinal()
                                .domain([climate_var])
                                .range(d3.schemeSet1);
                            //.range(["#440154ff", "#21908dff", "#fde725ff"])


                            var offSet = 5;

                            // Y-Axis variables for climate variables
                            // Multiple y-axis 
                            var y_b = {}
                            for (i in climate_var) {
                                //// save all the climate variables
                                name_ = climate_var[i]

                                // console.log("variable name:")
                                // console.log(climate_var[i])

                                y_b[name_] = d3.scaleLinear()
                                    // .domain([0, 120])
                                    // .domain([d3.min(filteredData, d=> d[String(climate_var[i])], d3.max(filteredData, d=> d[String(climate_var[i])]))])

                                    // .domain([(d3.min(filteredData, d => d[String(climate_var[i])]) - offSet),
                                    // (d3.max(filteredData, d => d[String(climate_var[i])]) + offSet)])


                                    .domain([(d3.min(averages_total, d => d[String(climate_var[i])]) - offSet),
                                    (d3.max(averages_total, d => d[String(climate_var[i])]) + offSet)])

                                    // different AXIS for each climate var
                                    .range([height_map / 1.5, 0])
                            }

                            // console.log("list of y:")
                            // console.log(y_b)

                            // Build x-axis points for every climate var
                            var x_b = d3.scalePoint()
                                .range([0, width / 1.65])
                                .domain(climate_var)


                            // HOVERING the variables
                            // Highlight the selected variable
                            // var highlight = function (d) {

                            //     anomalies = d.groups

                            //     // first every group turns grey
                            //     //d3.selectAll(".line")
                            //     parallel_graph.selectAll(".line")
                            //         .transition().duration(200)
                            //         .style("stroke", "lightgrey")
                            //         .style("opacity", "0.2")

                            //     // Second the hovered specie takes its color
                            //     // d3.selectAll("." + anomalies)
                            //     parallel_graph.selectAll("." + anomalies)
                            //         .transition().duration(200)
                            //         .style("stroke", colorGroups(anomalies))
                            //         .style("opacity", "1")
                            // }

                            // // Unhighlight the variable
                            // var doNotHighlight = function (d) {
                            //     // d3.selectAll(".line")
                            //     parallel_graph.selectAll(".line")
                            //         .transition().duration(200).delay(1000)
                            //         .style("stroke", function (d) { return (colorGroups(d.groups)) })
                            //         .style("opacity", "1")
                            // }



                            // Function; PATH, to take a row of CSV as input
                            // Returns the x and y coordinate
                            function path_(d) {
                                return d3.line()(climate_var.map(function (p) {
                                    return [x_b(p), y_b[p](d[p])];
                                }));
                            }

                            // Draw the LINE plots
                            parallel_graph.selectAll("myPath")

                                // .data(filteredData)

                                .data(averages_total)
                                .enter()
                                .append("path")
                                .attr("class", function (d) {
                                    return "line" + d.groups
                                })
                                .attr("d", path_)
                                .attr("fill", "None")
                                .style("stroke", function (d) {
                                    // return (color_climate(d.groups))
                                    return (colorGroups(d.groups))
                                })
                                .style("opacity", 1.5)
                            // .on("mouseover", highlight)
                            // .on("mouseleave", doNotHighlight)



                            // .attr("transform", function (d) {
                            //     return "translate(" + x_b(d) + ")";
                            // })
                            // .each(function (d) {
                            //     d3.select(this)
                            //         .call(d3.axisLeft()
                            //             .ticks(5).scale(y_b[d]));
                            // })
                            // .append("text")
                            // .style("text-anchor", "middle")
                            // .attr("y", -9)
                            // .text(function (d) {
                            //     return d;
                            // })
                            // .style("fill", "black")

                            /// Draw the AXIS
                            parallel_graph.selectAll("myAxis")
                                .data(climate_var)
                                .enter()
                                .append("g")
                                .attr("class", "axis")
                                .attr("transform", function (d) {
                                    return "translate(" + x_b(d) + ")";
                                })
                                .each(function (d) {
                                    d3.select(this).call(d3.axisLeft()
                                        .ticks(5).scale(y_b[d]));
                                })
                                //add the title
                                .append("text")
                                .style("text-anchor", "middle")
                                .attr("y", -9)
                                .text(function (d) { return d; })
                                .style("fill", "black")


                            /// LEGEND labels
                            // var legend_colors = svg_map.append("g")
                            legend_colors_second.selectAll("mydots")
                                // .attr("transform", "translate(580," + (300) + ")")

                                .data(anomalies_keys)
                                .enter()
                                .append("rect")
                                .attr("x", 100)
                                .attr("y", function (d, i) { return 100 + i * (size + 5) })
                                .attr("width", size)
                                .attr("height", size)
                                // .style("fill", function (d) { return color_anomalies(d) })
                                .style("fill", function (d) { return colorGroups(d) })

                            // Add one dot in the legend for each name.
                            // var legend_labels= svg_map.append("g")
                            legend_labels_second.selectAll("mylabels")
                                // .attr("transform", "translate(580," + (300) + ")")
                                .data(anomalies_keys)
                                .enter()
                                .append("text")
                                .attr("x", 100 + size * 1.2)
                                .attr("y", function (d, i) { return 100 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
                                // .style("fill", function (d) { return color_anomalies(d) })

                                .style("fill", function (d) { return colorGroups(d) })

                                .text(function (d) { return d })
                                .attr("text-anchor", "left")
                                .style("alignment-baseline", "middle")


                            //TITLE of legend; Anomalies
                            legend_title_second.append("text")
                                //.attr("transform", "translate(0," + 800)
                                //.attr("class", "scatter_plot")
                                // .attr("transform", "rotate(-90)")
                                .attr("y", 50)
                                .attr("x", 100)
                                .attr("dy", "2em")
                                .style("text-anchor", "middle")
                                .style("font-size", "13px")
                                .text("Agg. Values by Anomalies")




                            // var x_b = //d3.scaleTime()
                            //     d3.scaleLinear()
                            //         .domain([d3.min(filteredData, d => d[firstVar]), d3.max(filteredData, d => d[firstVar])])
                            //         .range([0, sep_chart / 1.5])

                            // var y_b = d3.scaleLinear()
                            //     .domain([d3.min(filteredData, d => d[thirdVar]), d3.max(filteredData, d => d[thirdVar])])
                            //     .range([200, 0])

                            //// AXIS ticks/format
                            // Y-Axis
                            // parallel_graph.append("g")
                            //     .call(d3.axisLeft(y_b))

                            // // X-Axis
                            // parallel_graph.append("g")
                            //     .attr("transform", "translate(0, 200)")
                            //     .call(d3.axisBottom(x_b))



                            // parallel_graph
                            //     .selectAll("dot")
                            //     .data(filteredData)
                            //     .enter()
                            //     .append("circle")
                            //     // .attr("class", "scatter_plot")
                            //     .attr("cx", function (d) { return x_b(d[firstVar]) })
                            //     .attr("cy", function (d) { return y_b(d[thirdVar]) })
                            //     .attr("r", 5)
                            //     .attr("fill", "blue")
                            //     .attr("stroke", "black")


                            /////////////////////////
                            /////////////////////////
                            /// Axis labels
                            // parallel_graph.append("text")
                            //     .attr("transform", "rotate(-90)")
                            //     .attr("y", -95)
                            //     .attr("x", -70)
                            //     .attr("dy", "2.5em")
                            //     .style("text-anchor", "middle")
                            //     .text(thirdVar)
                            // // .text("OCO2-XCO2")

                            // // X-Axis label
                            // parallel_graph.append("text")
                            //     .attr("transform", "translate(400," + (chart_width_adjust + 50) + ")")
                            //     .attr("text-anchor", "end")
                            //     .text(firstVar)

                            // var x_b= d3.scalePoint()
                            //     .range([0, width_map])
                            //     .domain()

                            // ///y-variables
                            // // storing all the variables as y-axis labels
                            // y= {}
                            // for (i in climate_var){
                            //     name_= climate_var[i]
                            //     y[name_]= d3.scaleLinear()
                            //             .domain([0, 8])
                            //             .range([height_map, 0])
                            // }

                            // parallel_graph.selectAll("myPath")
                            //     .data(filteredData)
                            //     .enter()
                            //     append("path")
                            //         .attr("class", function(d) {
                            //             return "line " + d.
                            //         })



                            ///////////////////////
                            ///////////////////////
                            // LINE graph- second y axis
                            //var rightEnd= window.width_map;

                            var rightEnd = 500;

                            // var rightEnd = line_chart_width;
                            var labelBar = 100;

                            // console.log("window width:")
                            // console.log(window.width_map);
                            // LINE PLOT graph
                            // var x_a = //d3.scaleTime()
                            //     d3.scaleLinear()
                            //         // .domain([0, d3.max(data, d => d.Index)])
                            //         // .domain([d3.min(selectedPoints, d=> d.Index), d3.max(selectedPoints, d => d.Index)])

                            //         // .domain(d3.extent(selectedPoints, function(d){ return d.date}))
                            //         .domain([d3.min(selectedPoints, d => d[firstVar]), d3.max(selectedPoints, d => d[firstVar])])
                            //         .range([0, .4 * sep_chart])
                            // //.range([leftOffset , width - line_chart_width])


                            // //total_column_water_vapour_combined_uncertainty
                            // var y_a = d3.scaleLinear()
                            //     // .domain([0, 30])
                            //     //                        .domain([0, d3.max(selectedPoints, d => d.total_column_water_vapour_era5)])
                            //     // .domain([0, d3.max(selectedPoints, d => d.sif)])

                            //     // .domain([d3.min(selectedPoints, d=> d.sif), d3.max(selectedPoints, d=> d.sif)])

                            //     .domain([d3.min(selectedPoints, d => d[thirdVar]), d3.max(selectedPoints, d => d[thirdVar])])
                            //     .range([200, 0])


                            // // X-AXIS label
                            // line_graph.append("g")
                            //     .attr("transform", "translate(0," + (height_map / 3.5) + ")")
                            //     .call(d3.axisBottom(x))
                            //     .selectAll("text")
                            //     // .attr("dx", xlabel_scale)
                            //     .attr("dy", ylabel_scale)
                            //     .attr("transform", "rotate(-70)");

                            // // RIGHT Y-AXIS for second variable
                            // line_graph.append("g")
                            //     // .attr("transform", `translate(${rightEnd}, 0)`)

                            //     .attr("transform", `translate(${sep_chart / 1.5}, 0)`)
                            //     .call(d3.axisRight(y_a))


                            // line_graph.append("path")
                            //     .datum(selectedPoints)
                            //     .attr("fill", "none")
                            //     //.attr("stroke", "steelblue")

                            //     .attr("stroke", "#DE3163")
                            //     .attr("stroke-width", 1.1)
                            //     .attr("d", d3.line()
                            //         // .x(function(d) { return x_a(d.Index)})
                            //         //.x(function(d) { return x(d.Index)})

                            //         .x(function (d) { return x(d[firstVar]) })
                            //         .y(function (d) { return y_a(d[secondVar]) })

                            //         .curve(d3.curveCardinal.tension(0.25))
                            //     )

                            // // Color Line bar 
                            // line_graph.append("line")
                            //     .attr("stroke", "#DE3163")
                            //     .attr("stroke-width", 7)
                            //     // .attr("x1", rightEnd + 72)
                            //     .attr("x1", sep_chart / 1.37)
                            //     .attr("y1", -35)
                            //     // .attr("x2", rightEnd + 72)
                            //     .attr("x2", sep_chart / 1.37)
                            //     .attr("y2", 190)

                            // // .attr("y", rightEnd + 40)
                            // // .attr("x", -80)

                            // line_graph.append("text")
                            //     .attr("transform", "rotate(-90)")
                            //     // .attr("y", rightEnd + 20)
                            //     .attr("y", sep_chart / 1.5 + 10)
                            //     .attr("x", -80)
                            //     .attr("dy", "2.5em")
                            //     .style("text-anchor", "middle")
                            //     .text(thirdVar)
                            // .text("SIF")

                            // line_graph.selectAll("circle")
                            // .data(selectedPoints)
                            // .enter().append("circle")
                            // .style("stroke", "gray")
                            // // .style("fill", d => colorBar(d["mean_xco2"]))
                            // .attr("cx", d => x_a(d["Index"]))
                            // .attr("cy", d => y_a(d.lst_day))
                            // // .attr("fill", d => colorXco2(d["Xco2"]))
                            // .attr("r", 1.75)
                            // .style("opacity", .95)


                            ///////////////////////
                            /////////////////////////////
                            //// Get values that are inside the bounding box

                            // console.log("new arr:")
                            var new_arr = filteredData.map(elem => ({
                                // city: elem.city,
                                // date: elem.date,
                                // xco2: elem.xco2,
                                // sif: elem.sif,

                                firstVar: elem[firstVar],
                                secondVar: elem[secondVar],
                                // sif: elem.sif,

                            }))

                            var unique = new_arr.filter((item, i, ar) => ar.indexOf(item) === i);

                            // console.log("unique values:")
                            // console.log(new_arr)

                            // GENERATE a table

                            //// Create table, ongoing
                            var keys = d3.keys(new_arr[0])

                            // var table= d3.select("#second_map")

                            // const tableBody= d3.select("#data-table tbody")

                            // const rows = tableBody
                            //     .selectAll("tr")
                            //     .data(new_arr)
                            //     .enter()
                            //     .append("tr")
                            //     .attr("class", graph_ID)
                            //     .style("border", "1px black solid")
                            //     .style("padding", "3px")
                            //     // .style("background-color", "lightgray")
                            //     // .style("font-weight", "bold")
                            //     // .style("text-transform", "uppercase")
                            //     .on("mouseover", function () {
                            //         d3.select(this).style("background-color", "#D3D3D3"); //powderblue");
                            //     })
                            //     .on("mouseout", function () {
                            //         d3.select(this).style("background-color", "#f4f0ec");
                            //     })

                            // rows.append("td")
                            //     // .text((d) => d.date);
                            //     .text((d) => d[firstVar]);

                            // // rows.append("br")

                            // rows.append("td")
                            //     // .text((d) => d.xco2);
                            //     .text((d) => d[secondVar]);

                            // rows.append("br")
                            // rows.append("td")
                            // // .text((d) => d.sif)
                            // .text((d) => d[thirdVar])

                            // rows.append("br")
                            // rows.append("td")
                            //     .text((d) => d.Uncertanity_column_water_vapour)


                        }/// FUNCTION to select scatterplot Vars

                    } /// Brush selection ending
                }



                //} // END of month selection function

                /////////////////////////////////////
                /// SLIDER
                // /// UPDATE the map by month

                // var slider= document.getElementById("mySlider");
                // var output = document.getElementById("demo");

                //     // display the slider value
                //     output.innerHTML= slider.value;

                //     //update the slider value when dragging
                //     slider.oninput= function(){
                //         output.innerHTML= this.value;
                //         var month= this.value;

                //         updateMap(data, month);

                //         ///update the scatter points
                //         removeScatterPoints();
                //         //removeData();

                //     }


                //     updateMap(data, "1")

            }
        )
    }
})


