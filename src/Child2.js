import React, {Component} from 'react';
import * as d3 from 'd3';

class Child2 extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    componentDidUpdate() {
        var data = this.props.data2
        
        var margin = { top: 60, right: 10, bottom: 50, left: 30 },
            w = 500 - margin.left - margin.right,
            h = 350 - margin.top - margin.bottom;

        var container = d3.select(".child2_svg")
            .attr('width', w + margin.left + margin.right)
            .attr('height', h + margin.top + margin.bottom)
            .select(".g_2")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        var x_data = data.map(item => item.day)
        const uniqueDays = [...new Set(x_data)];

        const x_scale = d3.scaleLinear().domain([-0.1, uniqueDays.length]).range([margin.left, w]);

        container.selectAll(".x_axis_g").data([0]).join('g').attr("class", "x_axis_g")
            .attr("transform", `translate(0, ${h})`).call(d3.axisBottom(x_scale).tickValues([0.5,1.5,2.5,3.5]).tickFormat((d,i) => uniqueDays[i]));

        var y_data = new Array(uniqueDays.length)

        const groupByDay = data.reduce((accum, c) => {
            const day = c.day;
            if (!accum[day]) {
                accum[day] = [];
            }

            accum[day].push(c.tip);

            return accum;
        }, {});

        var i = 0
        for (const day in groupByDay) {
            const numDays = groupByDay[day].length
            const sum = groupByDay[day].reduce((accum, c) => accum + c, 0)
            y_data[i] = sum/numDays
            i = i+1
        }

        const y_scale = d3.scaleLinear().domain([0, d3.max(y_data)]).range([h, 0]);

        container.selectAll(".y_axis_g").data([0]).join('g').attr("class", "y_axis_g")
            .attr("transform", `translate(${margin.left}, 0)`).call(d3.axisLeft(y_scale));
        
        const barWidth = (x_scale(uniqueDays.length) - x_scale(0))/uniqueDays.length - 20;
        container.selectAll("rect").data(y_data).join("rect")
            .attr("x", function (d, i) {
                return x_scale(i + 0.5) - barWidth/2;
            })
            .attr("y", function (d) {
                return y_scale(d);
            })
            .attr("height", function (d) {
                return y_scale(d3.max(y_data) - d);
            })
            .attr("width", barWidth)
            .style("fill", "#69b3a2")
        
        d3.select('.title_2').attr("text-anchor", "middle").attr("font-size", "17")
        .attr("x", `${500/2}`).attr("y", `${-margin.top/2}`)
        
        d3.select('.xtext_2').attr("text-anchor", "middle").attr("font-size", "17")
        .attr("x", `${500/2}`).attr("y", `${h + margin.bottom/2 + 10}`)

        const ytext_x = -margin.left/2 + 5
        const ytext_y = h/2

        d3.select('.ytext_2').attr("text-anchor", "middle").attr("font-size", "17")
        .attr("x", `${ytext_x}`).attr("y", `${ytext_y}`).attr("transform", `rotate(-90, ${ytext_x}, ${ytext_y})`)
    }
    render() {
        return <svg className="child2_svg">
             <g className="g_2">
                <text className = 'title_2'>Average Tip by Day</text>
                <text className = 'ytext_2'>Average Tip</text>
                <text className = 'xtext_2'>Day</text>
            </g>
        </svg>;
    }
}
export default Child2;