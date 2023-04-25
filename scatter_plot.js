class Scatter {

    constructor(con, root) {
        this.con = con;

        const div = root.append('div')
        .style('width', '910px')
        .style('height', '1080px');

        const svg = div.append('svg')
            .style('width', '100%')
            .style('height', '100%')
            .append('g')
            .attr('transform','translate(50 375)');

      d3.csv('Output.csv').then((data) => {
        // Parse the data
    
        const stellar_mag = d3.map(data, function(d) { return d.stellar_magnitude});
       const discovery_year= d3.map(data, function(d) {return d.discovery_year});
       

      // Create the chart
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = 900 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;
    
      const x = d3.scaleLinear().range([0, width]);
      const y = d3.scaleLinear().range([height, 0]);
    
      const xAxis = d3.axisBottom(x)
      .ticks(10)
      .tickFormat(d3.format(".0f"));

      const yAxis = d3.axisLeft(y)
      .ticks(20);
    
      x.domain([d3.min(discovery_year), d3.max(discovery_year)]);
      y.domain([d3.min(stellar_mag), d3.max(stellar_mag)]);
    
      svg
        .append("g")
        .attr("class", "date-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    
      svg.append("g")
      .attr("class", "magnitude-axis")
      .call(yAxis);
        
      // Create circles representing the data points
      svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d.discovery_year))
        .attr("cy", (d) => y(d.stellar_magnitude))
        .attr("r", 4)
        .attr("fill", "blue");

      // Update the scatterplot based on the slider values
      d3.select("#date-slider").on("input", () => {
        const value = +d3.select("#date-slider").node().value;
        x.domain([0, value]);
        svg.select(".date-axis").transition().duration(1000).call(xAxis);
        svg
          .selectAll("circle")
          .transition()
          .duration(1000)
          .attr("cx", d => x(d.xValue));
          });

      // Update the scatterplot based on the slider values
      d3.select("#magnitude-slider").on("input", () => {
        const value = +d3.select("#magnitude-slider").node().value;
        x.domain([0, value]);
        svg.select(".magnitude-axis").transition().duration(1000).call(yAxis);
        svg
          .selectAll("circle")
          .transition()
          .duration(1000)
          .attr("cy", d => y(d.yValue));
          });
    });
  }
  setResultText(str) {
    this.legend.html(str);
}
}