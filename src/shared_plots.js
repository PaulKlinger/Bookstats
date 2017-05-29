/**
 * Created by Paul on 2017-05-21.
 */

import React, {Component} from 'react';
import PlotlyComponent from './PlotlyComponent';
import Plotly from 'plotly.js/dist/plotly-cartesian'

let defaultMargins = {l: 50, r: 50, t: 80, b: 50};

export class ScatterPlot extends Component {
    render() {
        let raw_data = this.props.data;
        let data = [
            {
                type: 'scattergl',
                mode: 'markers',
                x: raw_data.x,
                y: raw_data.y,
                text: raw_data.text,
                marker: {
                    symbol: 'cross',
                    color: 'rgb(16, 32, 77)'
                }
            }
        ];
        let layout = {
            margin: defaultMargins,
            title: this.props.title,
            autosize: true,
            hovermode: 'closest',
            xaxis: {
                title: this.props.xaxis_title
            },
            yaxis: {
                title: this.props.yaxis_title
            }
        };
        let config = {
            showLink: false,
        };
        return (
            <div className="plot plot_scatter">
                <PlotlyComponent plotly={Plotly} data={data} layout={layout} config={config}/>
            </div>
        );
    }
}

export class Histogram extends Component {
    render() {
        let raw_data = this.props.data;
        let data = [
            {
                type: 'histogram',
                x: raw_data
            }
        ];
        let layout = {
            margin: defaultMargins,
            title: this.props.title,
            autosize: true,
            xaxis: {
                title: this.props.xaxis_title,
                tickvals: this.props.tickvals,
                ticktext: this.props.ticktext
            },
            yaxis: {title: "# of books"}
        };
        let config = {
            showLink: false,
        };
        return (
            <div className="plot plot_histogram">
                <PlotlyComponent plotly={Plotly} data={data} layout={layout} config={config}/>
            </div>
        );
    }
}

export class Bar extends Component {
    render() {
        let data = [
            {
                type: 'bar',
                x: this.props.data.x,
                y: this.props.data.y
            }
        ];
        let layout = {
            margin: defaultMargins,
            title: this.props.title,
            autosize: true,
            xaxis: {
                title: this.props.xaxis_title,
                hoverformat: this.props.xaxis_hoverformat
            },
            yaxis: {title: this.props.yaxis_title}
        };
        let config = {
            showLink: false,
        };
        return (
            <div className="plot plot_bar">
                <PlotlyComponent plotly={Plotly} data={data} layout={layout} config={config}/>
            </div>
        );
    }
}

export class TimeLinePlot extends Component {
    render() {
        let raw_data_1 = this.props.data.data1;
        let raw_data_2 = this.props.data.data2;
        let data = [
            {
                type: 'scattergl',
                mode: 'line',
                name: this.props.line_1_legend,
                x: raw_data_1.x,
                y: raw_data_1.y,
                yaxis: 'y1'
            }
        ];
        let layout = {
            margin: defaultMargins,
            title: this.props.title,
            autosize: true,
            hovermode: 'closest',
            yaxis: {
                title: this.props.yaxis_title
            }
        };
        if (!(raw_data_2 === undefined)) {
            const y2_type = this.props.y2_type === undefined ? "bar" : this.props.y2_type;
            data.push({
                type: 'scattergl',
                mode: y2_type,
                x: raw_data_2.x,
                y: raw_data_2.y,
                yaxis: 'y2',
                name: this.props.line_2_legend
            });
            layout.yaxis2 = {
                side: 'right',
                title: this.props.yaxis2_title,
                overlaying: 'y' //???
            };
            layout.showlegend = true;
            layout.legend = {x: 0, y:1};
        }

        let config = {
            showLink: false,
        };
        return (
            <div className="plot plot_timeline">
                <PlotlyComponent plotly={Plotly} data={data} layout={layout} config={config}/>
            </div>
        );
    }
}

export class DotViolin extends Component {
    render() {
        const sortedxs = this.props.data.x.slice().sort();
        const minx = sortedxs[0];
        const slotsize = (sortedxs[Math.floor(sortedxs.length * 0.95)] - sortedxs[Math.floor(sortedxs.length * 0.05)]) / 100;
        const occupied = {};
        const ys = [];

        this.props.data.x.forEach(x => {
            let y = 0;
            const slot = Math.floor((x - minx) / slotsize);
            while (true){
                if (!occupied.hasOwnProperty([slot, y])){
                    break;
                }
                y += 1;
                if (!occupied.hasOwnProperty([slot, -y])){
                    y = -y;
                    break;
                }
            }
            occupied[[slot, y]] = true;
            ys.push(y);
        });

        let data = [
            {
                type: 'scattergl',
                mode: 'markers',
                x: this.props.data.x,
                y: ys,
                text: this.props.data.text,
                hoverinfo: "x+text",
                marker: {
                    symbol: 'circle-dot',
                    color: 'rgb(16, 32, 77)'
                }
            }
        ];
        let layout = {
            margin: {t: this.props.title === undefined ? 0 : 50, l: 50, r: 50, b: 40},
            title: this.props.title,
            height: (this.props.size === "full") ? 500 : 250,
            width: 550,
            hovermode: 'closest',
            xaxis: {
                title: this.props.xaxis_title,
                zeroline: false
            },
            yaxis: {
                visible: false
            }
        };
        let config = {
            showLink: false,
        };
        return (
            <div className={"plot plot_dotviolin" + ((this.props === 'full') ? "" : "plot_half")}>
                <PlotlyComponent plotly={Plotly} data={data} layout={layout} config={config}/>
            </div>
        );
    }
}