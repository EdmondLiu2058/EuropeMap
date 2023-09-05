// import { mapData } from "./loadData.js";

// const width = document.getElementById('europemap').getBoundingClientRect().width;
// const height = document.getElementById('europemap').getBoundingClientRect().height;

// const projection = d3.geoMercator() //  d3 geographic projection
//     .fitSize([width, height], mapData);

// const pathGenerator = d3.geoPath().projection(projection);

// const svg = d3.select("#europemap");

// // Tooltip to show country name
// const tooltip = d3.select("body").append("div")
//     .attr("class", "tooltip")
//     .style("position", "absolute")
//     .style("background-color", "white")
//     .style("border", "solid")
//     .style("border-width", "10px")
//     .style("border-radius", "15px")
//     .style("padding", "10px")
//     .style("opacity", 0);

// async function drawMap() {

//     svg.selectAll("path")
//         .data(mapData.features)
//         .enter()
//         .append("path")
//         .attr("d", pathGenerator)
//         .attr("fill", "#ccc")
//         .attr("stroke", "#000")
//         .on("mouseover", function (event, d) {  // Mouseover effect
//             tooltip.transition()
//                 .duration(200)
//                 .style("opacity", 1);
//             tooltip.html(d.properties.NAME)   // Assuming 'name' is the property in your geojson file
//                 .style("left", (event.pageX + 10) + "px")
//                 .style("top", (event.pageY - 28) + "px");
//             // Dim other countries
//             countries.transition().duration(200)
//                 .style("opacity", c => (c === d ? 1 : 0.2));
//         })
//         .on("mouseout", function (d) {  // Mouseout effect
//             tooltip.transition()
//                 .duration(500)
//                 .style("opacity", 0);
//         });
// }

// drawMap();
async function drawMap() {
    const mapData = await d3.json("./data/europe.geojson");

    const width = document.getElementById('europemap').getBoundingClientRect().width;
    const height = document.getElementById('europemap').getBoundingClientRect().height;

    const projection = d3.geoMercator()
        .fitSize([width, height], mapData);

    const pathGenerator = d3.geoPath().projection(projection);

    const svg = d3.select("#europemap");

    // Tooltip for country name on hover
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("opacity", 0);

    // Details div for showing country details on click
    const details = d3.select("body").append("div")
        .attr("class", "details")
        .style("position", "fixed")
        .style("top", "10px")
        .style("left", "10px")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("opacity", 0);

    const countries = svg.selectAll("path")
        .data(mapData.features)
        .enter()
        .append("path")
        .attr("d", pathGenerator)
        .attr("fill", "#ccc")
        .attr("stroke", "#000")
        .on("mouseover", function (event, d) {
            // Display tooltip with country name
            tooltip.transition()
                .duration(200)
                .style("opacity", 1);
            tooltip.html(d.properties.NAME)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");

            // Dim other countries
            countries.transition().duration(200)
                .style("opacity", c => (c === d ? 1 : 0.2));
        })
        .on("mouseout", function (d) {
            // Hide tooltip
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);

            // If not clicked, restore opacity to all countries
            if (!d.clicked) {
                countries.transition().duration(200)
                    .style("opacity", 1);
            }
        })
        .on("click", function (event, d) {
            // Display country details
            details.html(`
                <strong>${d.properties.NAME}</strong><br>
                AREA: ${d.properties.AREA}<br>
                POP2005: ${d.properties.POP2005}<br>
                REGION: ${d.properties.REGION}
            `).style("opacity", 1);

            // Mark the country as clicked
            d.clicked = true;

            // Hide other countries
            countries.transition().duration(200)
                .style("opacity", c => (c === d ? 1 : 0));
        });

    // Click on SVG (blank space) to reset view
    svg.on("click", function (event) {
        if (event.target === this) {
            details.style("opacity", 0);
            countries.transition().duration(200).style("opacity", 1);
            mapData.features.forEach(d => d.clicked = false);  // Reset clicked status
        }
    });
}

drawMap();
