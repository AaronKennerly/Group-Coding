class Scatter {

    constructor(con, root) {
        this.con = con;

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

      // Group the planets by planet type
      const groups = d3.group(data, d => d.planet_type);
      
    
      const x = d3.scaleLinear()
      .domain([d3.min(discovery_year), d3.max(discovery_year)])
      .range([1, width]);

      const y = d3.scaleLinear()
      .domain([0, 30])
      .range([height, 0]);
    
      const xAxis = d3.axisBottom(x)
      .tickFormat(d3.format(".0f"));

      const yAxis = d3.axisLeft(y);
  
    
      svg.append("g")
        .attr("class", "date-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    
      svg.append("g")
      .attr("class", "magnitude-axis")
      .call(yAxis);
        
      
      // Create circles representing the data points
      svg.append("g")
        .attr("class", "dots-group")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
          .attr("cx", (d) => x(d.discovery_year) + Math.random()*10 - 5)
          .attr("cy", (d) => y(d.stellar_magnitude) + Math.random()*10 - 5)
          .attr("r", 1.5)
          .style("opacity", 0.5)
          .style("fill", "blue");

    });

  }
  setResultText(str) {
    const dots = d3.selectAll('.dots-group circle');
    const filteredData = dots.data().filter((d) => d.planet_type === str);

        dots.data(filteredData)
          .attr("cx", (d) => x(d.discovery_year) + Math.random()*10 - 5)
          .attr("cy", (d) => y(d.stellar_magnitude) + Math.random()*10 - 5);
}
}