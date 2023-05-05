class Scatter {

    constructor(con, root) {
        this.con = con;
        this.selectedPlanetType = '';

        const div = root.append('div')
        .style('width', '910px')
        .style('height', '1080px');


          // Create the chart
        const margin = { top: 20, right: 20, bottom: 80, left: 40 };
        const width = 900 - margin.left - margin.right;
        const height = 1080 - margin.top - margin.bottom;

        const svg = div.append('svg')
            .style('width', '100%')
            .style('height','100%')
            .append('g')
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");

      d3.csv('Output.csv').then((data) => {
        // Parse the data
        const stellar_mag = d3.map(data, function(d) { return d.stellar_magnitude});
        const discovery_year= d3.map(data, function(d) {return d.discovery_year});
      
        this.colorScale = d3.scaleOrdinal(d3.schemeTableau10);

        this.x = d3.scaleLinear()
        .domain([d3.min(discovery_year), d3.max(discovery_year)])
        .range([1, width]);

        this.y = d3.scaleLinear()
        .domain([0, 30])
        .range([height, 0]);
      
        const xAxis = d3.axisBottom(this.x)
        .tickFormat(d3.format(".0f"));

        const yAxis = d3.axisLeft(this.y);
    
      
        svg.append("g")
          .attr("class", "date-axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);
      
        svg.append("g")
        .attr("class", "magnitude-axis")
        .call(yAxis);
    
        this.data = data;
        // Create circles representing the data points
        this.dots = svg.append("g")
          .attr("class", "dots-group")
          .selectAll("dot")
          .data(data.filter((d) => !this.selectedPlanetType || d.planet_type == this.selectedPlanetType))
          .enter()
          .append("circle")
            .attr("cx", (d) => this.x(d.discovery_year) + Math.random()*10 - 4)
            .attr("cy", (d) => this.y(d.stellar_magnitude) + Math.random()*10 - 4)
            .attr("r", 2.5)
            .style("opacity", 0.4)
            .style("fill", d => this.colorScale(d.planet_type));

    });

  }
  
  
  setResultText(planetType) {
    if (planetType !== this.selectedPlanetType) {
      // update dots
      this.dots = this.dots.data(this.data.filter((d) => d && d.planet_type == planetType));
    
      // Remove any circles that are no longer needed
      this.dots.exit().remove();

      // update selected planet type
      this.selectedPlanetType = planetType;

      // filter dots
      this.dots
        .data(this.data.filter((d) => d.planet_type === planetType))
        .transition()
        .duration(500)
        .attr("cx", (d) => this.x(d.discovery_year) + Math.random()*10 - 4)
        .attr("cy", (d) => this.y(d.stellar_magnitude) + Math.random()*10 - 4)
        .style("fill", (d) => this.colorScale(d.planet_type));
    }
  }
}