
class Exo {
    constructor(con,root){
        this.con = con;
        
        const div = root.append('div')
        .style('width', '910px')
        .style('height', '1080px');

        con.Test("Exo is connected");

        const svg = div.append('svg')
            .style('width', '100%')
            .style('height', '100%')
            .append('g')
            .attr('transform','translate(455 540)');
            
        d3.csv('Output.csv').then(data => {

            console.log(data[0])

            // Group the planets by planet type
            const groups = d3.group(data, d => d.planet_type);

            const radius = {
                'Earth': 6.371e6,
                'Jupiter': 6.9911e7,
                'Mars': 3.3895e6,
                'Mercury': 2.4397e6,
                'Neptune': 2.4622e7,
                'Saturn': 5.8232e7,
                'Uranus': 2.5362e7,
                'Venus': 6.0518e6
            };

            const mass = {
                'Earth': 5.97e24,
                'Jupiter': 1.898e27,
                'Mars': 6.39e23,
                'Mercury': 3.285e23,
                'Neptune': 1.024e26,
                'Saturn': 5.68e26,
                'Uranus': 8.68e25,
                'Venus': 4.867e24
            };

            // Calculate the averages for each group
            const averages = Array.from(groups, ([planet_type, group]) => {
            const avg_distance = d3.mean(group, d => +d.distance);
            const avg_orbital_radius = d3.mean(group, d => +d.orbital_radius);
            const avg_orbital_period = d3.mean(group, d => +d.orbital_period);
            const avg_radius = d3.mean(group, d => (+d.radius_multiplier) * radius[d.radius_wrt]);
            const avg_mass = d3.mean(group, d => (+d.mass_multiplier) * mass[d.mass_wrt]);
            return { planet_type, avg_distance, avg_orbital_radius, avg_radius, avg_orbital_period, avg_mass};
            });

            // The diameter scale
            const diameterScale = d3.scaleLinear()
            .domain(d3.extent(averages, function(d) { return +d['avg_radius'];}))
            .range([6, 30]);
            
            // The distance scale
            const distanceScale = d3.scaleLog()
            .domain(d3.extent(averages, function(d) { return +d['avg_orbital_radius'];}))
            .range([100, 400])

            // The revolution scale
            const revolutionScale = d3.scaleLinear()
            .domain(d3.extent(data, function(d) { return +d['Revolution (day)'];}))
            .range([5, 1000]);

            // The color scale
            const colorScale = d3.scaleOrdinal(d3.schemeTableau10);


            // Draw the sun
            const sun = svg.append('g').append('circle')
                .attr('r', 60)
                .attr("cx", 0)
                .attr("cy", 0)
                .style('fill', 'yellow')


            // Draw the orbits
            const orbits = svg.append('g').selectAll('circle')
                .data(averages)
                .join('circle')
                .attr('class', 'orbit')
                .attr('r', d => distanceScale(d.avg_orbital_radius))
                .attr('fill', 'none')
                .attr('stroke', 'gray')
                .attr('stroke-width', '1px');

            
            // Draw the planets
            const planets = svg.append('g').selectAll('circle')
                .data(averages)
                .join('circle')
                .attr('class', 'planet')
                .attr("cx", d => distanceScale(d.avg_orbital_radius))
                .attr('r', d => diameterScale(d.avg_radius))
                .attr('fill', d => colorScale(d.planet_type))


            // The legend 
            const legend = svg.append('foreignObject')
                .attr('width', '210')
                .attr('height', '175')
                .attr('x', '25%')
                .attr('y', '33%')
                .append('xhtml:div')
                .style('background-color', 'gray')
                .style('padding', '10px')
                .style('border-radius', '5px')
                .style('font-size', '16px')
                .style('color', 'white')
                .html('Click on a planet to see its details');
        
            
            planets.on('click', (event, d) => {
                    const text = `Planet Type: ${d.planet_type} 
                        <br>--------------------------------<br>
                        Avg Orbital Radius: ${d.avg_orbital_radius.toFixed(3)}
                        <br>--------------------------------<br>
                        Avg Mass: ${d.avg_mass.toFixed(3)}
                        <br>--------------------------------<br>
                        Avg Orbital Period: ${d.avg_orbital_period.toFixed(3)}`;

                    console.log(d.planet_type);
                    legend.html(text);
                    con.Update(d.planet_type);
            });
        });

    }
    setResultText(str) {
        this.legend.html(str);
    }
}