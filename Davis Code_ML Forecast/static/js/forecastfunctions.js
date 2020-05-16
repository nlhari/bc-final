//global variables
var datapath = "static/data/fcstresults3.csv";
var trans_time = 1500;

var margin_l = { top: 100, right: 30, bottom: 30, left: 50 },
    width_l = 600 - margin_l.left - margin_l.right,
    height_l = 600 - margin_l.top - margin_l.bottom;

// append the svg object to the body of the page
var svg_l = d3.select("#forecastchart")
    .append("svg")
    .attr("width", width_l + margin_l.left + margin_l.right)
    .attr("height", height_l + margin_l.top + margin_l.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin_l.left + "," + margin_l.top + ")");



svg_l.append("text")
    .attr("x", (width_l / 2))
    .attr("y", 0 - (margin_l.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "32px")
    .text("Monthly Sales and Forecast");


// Initialise a X axis:
var x_l = d3.scaleTime().range([0, width_l]);
var xAxis_l = d3.axisBottom(x_l);

svg_l.append("g")
    .attr("transform", "translate(0," + height_l + ")")
    .attr("class", "myXaxis")


// Initialize an Y axis
var y_l = d3.scaleLinear().range([height_l, 0]);
var yAxis_l = d3.axisLeft().scale(y_l);

svg_l.append("g")
    .attr("class", "myYaxis")


svg_l.append("circle").attr("cx", (width_l - 80)).attr("cy", (height_l - 40)).attr("r", 6).style("fill", "steelblue")
svg_l.append("circle").attr("cx", (width_l - 80)).attr("cy", (height_l - 60)).attr("r", 6).style("fill", "orangered")
svg_l.append("text").attr("x", (width_l - 60)).attr("y", (height_l - 40)).text("Actual Sales").style("font-size", "14px").attr("alignment-baseline", "middle")
svg_l.append("text").attr("x", (width_l - 60)).attr("y", (height_l - 60)).text("Forecast").style("font-size", "14px").attr("alignment-baseline", "middle")



function getDateArray(start, end) {
    var
        arr = new Array(),
        dt = new Date(start);

    while (dt <= end) {
        arr.push(new Date(dt));
        dt.setDate(dt.getDate() + 1);
    }
    return arr;
}


var
    startDate = new Date("2016-01-02"),
    endDate = new Date("2022-01-01");
var dateArr = getDateArray(startDate, endDate);
var x_array = dateArr.filter(d => d.getDate() === 1)

function updateall(datapath, cat = "Total Sales", subcat = "Total Sales") {


    var graph_value = [];

    d3.csv(datapath).then(d => {

        var filteredData = d.filter(d => (d.cat === cat) & (d.subcat === subcat));
        var y_h = filteredData[0].y;
        y_h = y_h.split(",");
        y_h = y_h.map(d => d.replace("[", ""))
        y_h = y_h.map(d => d.replace("]", ""))
        y_h = y_h.map(d => parseInt(d))
        y_h = y_h.map(d => d || null)
        y_h = y_h.map(d => Math.round(d * 100) / 100)

        var y_f = filteredData[0].y_fcst;
        y_f = y_f.split(",");
        y_f = y_f.map(d => d.replace("[", ""))
        y_f = y_f.map(d => d.replace("]", ""))
        y_f = y_f.map(d => parseInt(d))
        y_f = y_f.map(d => d || null)
        y_f = y_f.map(d => Math.round(d * 100) / 100)

        var MSE_val = parseFloat(filteredData[0]["MSE"]);
        MSE_val = Math.round(MSE_val * 1000) / 1000;
        var MAPE_val = parseFloat(filteredData[0]["MAPE"]);
        AMPE_val = Math.round(MAPE_val * 1000) / 1000;

        for (i = 0; i < 72; i++) {
            const d_obj = {};
            d_obj.date = x_array[i];
            d_obj.sales = y_h[i];
            d_obj.pred = y_f[i];
            graph_value.push(d_obj);
        }

        console.log(filteredData[0]["MSE"])

        var data = { "layer1": cat, "layer2": subcat, "d": graph_value, "metric_mse": MSE_val, "metric_mape": MAPE_val };

        updategraph(data)

    })
}


function updategraph(d) {

    data = d.d;
    MSE_val = d.metric_mse;
    MAPE_val = d.metric_mape;

    var u_title = svg_l.selectAll(".selectedf").data([d.layer1]);

    u_title
        .enter()
        .append("text")
        .attr("class", "selectedf")
        .merge(u_title)
        .transition()
        .duration(trans_time)
        .attr("x", (width_l / 2))
        .attr("y", 0 - (margin_l.top / 2) + 30)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", 650)
        .text(`Level 1 : ${d.layer1} || Level 2 : ${d.layer2}`);


    var u_m = svg_l.selectAll(".MSEvalue").data([MSE_val]);

    u_m
        .enter()
        .append("text")
        .attr("class", "MSEvalue")
        .merge(u_m)
        .transition()
        .duration(trans_time)
        .attr("x", 20)
        .attr("y", 0 - (margin_l.top / 2) + 60)
        .attr("text-anchor", "left")
        .style("font-size", "16px")
        .text(`Loss Metric from Keras(Mean Squared Value) : ${MSE_val}`);

    var u_m2 = svg_l.selectAll(".MAPEvalue").data([MAPE_val]);

    u_m2
        .enter()
        .append("text")
        .attr("class", "MAPEvalue")
        .merge(u_m2)
        .transition()
        .duration(trans_time)
        .attr("x", 20)
        .attr("y", 0 - (margin_l.top / 2) + 80)
        .attr("text-anchor", "left")
        .style("font-size", "16px")
        .text(`Forecast Accuracy (Mean Absolute Percentage Error, MAPE) : ${MAPE_val}%`);

    // Create the X axis:
    x_l.domain(d3.extent(data, function(d) { return d.date; }));

    svg_l.selectAll(".myXaxis")
        .transition()
        .duration(trans_time)
        .call(xAxis_l);

    // create the Y axis
    y_l.domain([0, d3.max(data, function(d) { return d.pred })]);

    svg_l.selectAll(".myYaxis")
        .transition()
        .duration(trans_time)
        .call(yAxis_l);








    // Create a update selection: bind to the new data
    var u_s = svg_l.selectAll(".lineSales")
        .data([data], function(d) { return d.date });

    // Updata the line
    u_s
        .enter()
        .append("path")
        .attr("class", "lineSales")
        .merge(u_s)
        .transition()
        .duration(trans_time)
        .attr("d", d3.line()
            .defined(function(d) { return d.sales !== 0; })
            .x(function(d) { return x_l(d.date); })
            .y(function(d) { return y_l(d.sales); })
            .curve(d3.curveMonotoneX))
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("opacity", 0.7)

    var u_f = svg_l.selectAll(".lineFCST")
        .data([data], function(d) { return d.date });

    // Updata the line
    u_f
        .enter()
        .append("path")
        .attr("class", "lineFCST")
        .style("stroke-dasharray", ("3, 3"))
        .merge(u_f)
        .transition()
        .duration(trans_time)
        .attr("d", d3.line()
            .defined(function(d) { return d.pred !== 0; })
            .x(function(d) { return x_l(d.date); })
            .y(function(d) { return y_l(d.pred); })
            .curve(d3.curveMonotoneX))
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("opacity", 0.7)

}


var treeData = {
    "name": "Total Sales",
    "children": [{
            "name": "Furniture",
            "children": [{
                    "name": "Bookcases"
                },
                {
                    "name": "Furnishings"
                },
                {
                    "name": "Tables"
                },
                {
                    "name": "Chairs"
                }
            ]
        },
        {
            "name": "Office Supplies",
            "children": [{
                    "name": "Appliances"
                },
                {
                    "name": "Binders"
                },
                {
                    "name": "Envelopes"
                },
                {
                    "name": "Fasteners"
                },
                {
                    "name": "Labels"
                },
                {
                    "name": "Paper"
                },
                {
                    "name": "Storage"
                },
                {
                    "name": "Supplies"
                },
                {
                    "name": "Art"
                }
            ]
        },
        {
            "name": "Technology",
            "children": [{
                    "name": "Accessories"
                },
                {
                    "name": "Machines"
                },
                {
                    "name": "Phones"
                },
                {
                    "name": "Copiers"
                }
            ]
        }
    ]
}



// Set the dimensions and margins of the diagram
var margin = { top: 100, right: 90, bottom: 40, left: 90 },
    width = 550 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#y_filters").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" +
        margin.left + "," + margin.top + ")");

svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "32px")
    .text("Select Product Category")
    .attr("font-family", 'Gill Sans MT');


var i = 0,
    duration = trans_time,
    root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);

// Assigns parent, children, height, depth
root = d3.hierarchy(treeData, function(d) { return d.children; });
root.x0 = height / 2;
root.y0 = 0;

// Collapse after the second level
root.children.forEach(collapse);

update(root);

// Collapse the node and all it's children
function collapse(d) {
    if (d.children) {
        d._children = d.children
        d._children.forEach(collapse)
        d.children = null
    }
}

function update(source) {

    // Assigns the x and y position for the nodes
    var treeData = treemap(root);

    // Compute the new tree layout.
    var nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180 });

    // ****************** Nodes section ***************************

    // Update the nodes...
    var node = svg.selectAll('g.node')
        .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter any new modes at the parent's previous position.
    var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr("transform", function(d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on('click', click);

    // Add Circle for the nodes
    nodeEnter.append('circle')
        .attr("id", function(d) { return d.data.name; })
        .attr('class', 'node')
        .attr('r', 1e-6)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        })
        .on("click", function(nothing) {
            y_key = d3.select(this).attr("id");
            clickevent(y_key);
        })

    // Add labels for the nodes
    nodeEnter.append('text')
        .attr("dy", ".35em")
        .attr("x", function(d) {
            return d.children || d._children ? -13 : 13;
        })
        .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start";
        })
        .text(function(d) { return d.data.name; });

    // UPDATE
    var nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate.transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    // Update the node attributes and style
    nodeUpdate.select('circle.node')
        .attr('r', 10)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        })
        .attr('cursor', 'pointer');


    // Remove any exiting nodes
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle')
        .attr('r', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text')
        .style('fill-opacity', 1e-6);

    // ****************** links section ***************************

    // Update the links...
    var link = svg.selectAll('path.link')
        .data(links, function(d) { return d.id; });

    // Enter any new links at the parent's previous position.
    var linkEnter = link.enter().insert('path', "g")
        .attr("class", "link")
        .attr('d', function(d) {
            var o = { x: source.x0, y: source.y0 }
            return diagonal(o, o)
        });

    // UPDATE
    var linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition()
        .duration(duration)
        .attr('d', function(d) { return diagonal(d, d.parent) });

    // Remove any exiting links
    var linkExit = link.exit().transition()
        .duration(duration)
        .attr('d', function(d) {
            var o = { x: source.x, y: source.y }
            return diagonal(o, o)
        })
        .remove();

    // Store the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {

        path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

        return path
    }

    // Toggle children on click.
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }
}


function clickevent(new_key) {

    const invserse_obj = {};
    invserse_obj["Total Sales"] = { "cat": "Total Sales", "subcat": "Total Sales" };
    invserse_obj["Furniture"] = { "cat": "Furniture", "subcat": "Total Sales" };
    invserse_obj["Office Supplies"] = { "cat": "Office Supplies", "subcat": "Total Sales" };
    invserse_obj["Technology"] = { "cat": "Technology", "subcat": "Total Sales" };
    invserse_obj["Bookcases"] = { "cat": "Furniture", "subcat": "Bookcases" };
    invserse_obj["Furnishings"] = { "cat": "Furniture", "subcat": "Furnishings" };
    invserse_obj["Tables"] = { "cat": "Furniture", "subcat": "Tables" };
    invserse_obj["Chairs"] = { "cat": "Furniture", "subcat": "Chairs" };
    invserse_obj["Appliances"] = { "cat": "Office Supplies", "subcat": "Appliances" };
    invserse_obj["Binders"] = { "cat": "Office Supplies", "subcat": "Binders" };
    invserse_obj["Envelopes"] = { "cat": "Office Supplies", "subcat": "Envelopes" };
    invserse_obj["Fasteners"] = { "cat": "Office Supplies", "subcat": "Fasteners" };
    invserse_obj["Labels"] = { "cat": "Office Supplies", "subcat": "Labels" };
    invserse_obj["Paper"] = { "cat": "Office Supplies", "subcat": "Paper" };
    invserse_obj["Storage"] = { "cat": "Office Supplies", "subcat": "Storage" };
    invserse_obj["Supplies"] = { "cat": "Office Supplies", "subcat": "Supplies" };
    invserse_obj["Art"] = { "cat": "Office Supplies", "subcat": "Art" };
    invserse_obj["Accessories"] = { "cat": "Technology", "subcat": "Accessories" };
    invserse_obj["Machines"] = { "cat": "Technology", "subcat": "Machines" };
    invserse_obj["Phones"] = { "cat": "Technology", "subcat": "Phones" };
    invserse_obj["Copiers"] = { "cat": "Technology", "subcat": "Copiers" };

    updateall(datapath, invserse_obj[new_key]["cat"], invserse_obj[new_key]["subcat"])
}

updateall(datapath)

// $("circle")
//     .on("click", function(nothing) {
//         y_key = d3.select(this).attr("id");
//         clickevent(y_key);
//     });