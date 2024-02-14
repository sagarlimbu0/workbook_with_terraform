// tooltip
         // Show information on hover
         pinsGroup.on("mouseover", function(d) {
            var screen_width = window.innerWidth;
            var mouse_left = d3.event.pageX;
            if (mouse_left > screen_width-300) {
                mouse_left = mouse_left - 300;
            }

            var tooltip = d3.select("#tooltip")
                .style("left", (mouse_left + 10) + "px")
                .style("top", (d3.event.pageY - tooltip_offset) + "px");

            tooltip.select("#xco2").text(d.mean_xco2)
                 
            // tooltip.select("#Longitude").text(d.Longitude)
            // tooltip.select("#Latitude").text(d.Latitude);
            tooltip.select("#Longitude").text(d.x)
            tooltip.select("#Latitude").text(d.y);
            
            // tooltip.select("#details").text("Site Classification: "+d.SITE_CLASSIFICATION);

            tooltip.style("display", "block");
        })


    /// BURSH functin to retrieve data as ARRAY 
           // // function to updated when called
       // function updateChart(svg){

       //     let value= [];

       //     // coordinates of the brush
       //     var selection = d3.event.selection;
           
           
       //     // if (!selection) { return }
           
       //     if (selection !== null ){
           
       //         let targetX1 = selection[0][0];
       //         let targetY1= selection[0][1];
       //         let targetX2= selection[1][0];
       //         let targetY2= selection[1][1];

       //         // get the array of circles
       //         const circles= d3.selectAll(".pin")
       //             .nodes();

       //         circles.forEach( element => {

       //             curr_x= element.cx.baseVal.value;
       //             curr_y= element.cy.baseVal.value;

       //         // see if node is in BRUSH rect.
       //         if (curr_x >= targetX1 && targetX2 &&
       //             curr_y >= targetY1 && curr_y <= targetY2){

       //                 toggleSelection( element.id);
       //             }
       //         });
               
       //     }
       //     }