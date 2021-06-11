let data_url = 'https://raw.githubusercontent.com/tur461/d3_test/master/data.json',
    use_D3_Fetch = _ => d3.json(data_url)
                        .then(dat => createChart(dat))
                        .catch(e => console.log('error:', e)),
    use_JS_Fetch = _ => fetch(data_url)
                        .then(dat => dat.json())
                        .then(dat => createChart(dat))
                        .catch(e => console.log('error:', e));

// using d3 based json fetcher
use_D3_Fetch();

function createChart(data){
    let margin = {t: 50, l: 50, b: 50, r: 50},
        width = 600 - margin.l - margin.r,
        height = 580 - margin.t - margin.b,
        salesPerState = {},
        states = [],                            // list of states --- unique
        uoSales = [],                           // unordered_sales just for finding max sales!
        svg = null,
        scale_x = null,
        scale_y = null;

    data.forEach(d => salesPerState[d.State] = salesPerState[d.State] ? (salesPerState[d.State] + d.Sales) : d.Sales);
    states = Object.keys(salesPerState);
    states.forEach(s => uoSales.push(salesPerState[s]));

    // d3 selection for svg
    svg = d3.select('.chart--container')
            .append('svg')
            .attr('width', width + margin.l + margin.r)
            .attr('height', height + margin.t + margin.b)
            .append('g')
            .attr('transform', `translate(${margin.l}, ${margin.r})`);

    // scale for x-axis
    scale_x = d3.scaleBand()
                .domain(states)
                .range([0, width])
                .padding(0.1);

    // scale for y-axis
    scale_y = d3.scaleLinear()
                .domain([0, d3.max(uoSales)])
                .range([height, 0]);

    // vertical bars
    svg.selectAll('rect')
        .data(states)
        .enter()
        .append('rect')
        .attr('x', state => scale_x(state))
        .attr('y', state => scale_y(salesPerState[state]))
        .attr('height', state => height - scale_y(salesPerState[state]))
        .attr('width', scale_x.bandwidth());

    // x-axis
    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(scale_x)
        .tickSizeOuter(0));

    // y-axis
    svg.append('g')
        .call(d3.axisLeft(scale_y));

    // label for x-axis
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + margin.b - 10)
        .text("State");

    // label for y-axis
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", margin.l/2)
        .attr("y", -margin.t)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Sales");
}
