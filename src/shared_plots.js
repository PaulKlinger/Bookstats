/**
 * Created by Paul on 2017-05-21.
 */

import React, {Component} from 'react';
import PlotlyComponent from './PlotlyComponent';
import Plotly from 'plotly.js/dist/plotly-cartesian';
import {nday_sliding_window} from "./Statistics.js";

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
        const margins = Object.assign({}, defaultMargins);
        if (this.props.margin_bottom !== undefined) {
            margins.b = this.props.margin_bottom;
        }
        const layout = {
            margin: margins,
            title: this.props.title,
            autosize: true,
            xaxis: {
                title: this.props.xaxis_title,
                hoverformat: this.props.xaxis_hoverformat,
                tickangle: this.props.tickangle
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
            layout.legend = {x: 0, y: 1};
        }

        if (this.props.data.dots_data !== undefined) {
            data.push({
                type: "scattergl",
                mode: "markers",
                x: this.props.data.dots_data.x,
                y: this.props.data.dots_data.y,
                text: this.props.data.dots_data.text,
                showlegend: false,
                hoverinfo: "x+text"
            })
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

export class TimeLineSlidingWindowPlot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ndays: props.default_ndays,
        };
        this.change_sliding_window = this.change_sliding_window.bind(this);
        this.handle_key = this.handle_key.bind(this);
    }

    handle_key(event) {
        if (event.key === 'Enter') {
            event.target.blur();
        }
    }

    change_sliding_window(event) {
        this.setState({ndays: parseInt(event.target.value, 10)});
    }

    render() {
        let raw_data_1 = nday_sliding_window(this.props.data.data1, this.state.ndays, this.props.fillval);
        let raw_data_2 = nday_sliding_window(this.props.data.data2, this.state.ndays, this.props.fillval);

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
            margin: {
                l: 50,
                r: 50,
                b: 20,
                t: 40,
                pad: 4
            },
            title: null,
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
            layout.legend = {x: 0, y: 1};
        }

        if (this.props.data.dots_data !== undefined) {
            data.push({
                type: "scattergl",
                mode: "markers",
                x: this.props.data.dots_data.x,
                y: this.props.data.dots_data.y,
                text: this.props.data.dots_data.text,
                showlegend: false,
                hoverinfo: "x+text"
            })
        }

        let config = {
            showLink: false,
        };
        return (
            <div className="plot plot_timeline_sliding_window">
                <span>{this.props.title},
                    <input type="number" min="0" onBlur={this.change_sliding_window} onKeyPress={this.handle_key}
                           defaultValue={this.state.ndays}
                           style={{width: "3em", marginLeft: "5px", marginRight: "5px"}}/>
                    day sliding window</span>
                <PlotlyComponent plotly={Plotly} data={data} layout={layout} config={config}/>
            </div>
        );
    }
}

function calcViolinYs(xs, offset, slotsize, oneside) {
    const sortedxs = xs.slice().sort();
    const minx = sortedxs[0];

    if (slotsize === undefined) {
        // Somewhat arbitrary algorithm to calculate "bin" size
        // split 10th to 90th percentile region into bins
        // such that for a flat distribution each bin contains 15 points
        // this seems to give a nice picture for ~240 and ~1270 points
        // TODO: maybe adjust based on plot height?

        const interval_of_interest = (sortedxs[Math.floor(sortedxs.length * 0.90)] - sortedxs[Math.floor(sortedxs.length * 0.10)]);
        slotsize = interval_of_interest / (0.8 * sortedxs.length / 15);
    }
    const occupied = {};

    const ys = [];

    xs.forEach(x => {
        let y = oneside ? 1 : 0;
        const slot = Math.floor((x - minx) / slotsize);
        while (true) {
            if (!occupied.hasOwnProperty([slot, y])) {
                break;
            }
            y += 1;
            if (!oneside) {
                if (!occupied.hasOwnProperty([slot, -y])) {
                    y = -y;
                    break;
                }
            }
        }
        occupied[[slot, y]] = true;
        ys.push(y + offset);
    });
    return ys;
}

export class DotViolin extends Component {
    render() {
        let ys = calcViolinYs(this.props.data.x, 0, this.props.slotsize, this.props.oneside);
        let xs = this.props.data.x;

        let data = [
            {
                type: 'scattergl',
                mode: 'markers',
                x: xs,
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
            height: (this.props.size === "full") ? 500 : 235,
            width: 550,
            hovermode: 'closest',
            xaxis: {
                title: this.props.xaxis_title,
                zeroline: false
            },
            yaxis: {
                dtick: 5,
                visible: !!this.props.oneside,
            }
        };
        let config = {
            showLink: false,
        };
        return (
            <div className={"plot plot_dotviolin " + ((this.props.size === 'full') ? "" : "plot_half")}>
                <PlotlyComponent plotly={Plotly} data={data} layout={layout} config={config}/>
            </div>
        );
    }
}

export class MeanStdDev extends Component {
    render() {
        const margins = Object.assign({}, defaultMargins);
        margins.l = 150;
        let data = [
            {
                type: 'scattergl',
                mode: 'markers',
                x: this.props.data.xs,
                y: this.props.data.ys,
                error_x: {
                    visible: true,
                    type: "array",
                    array: this.props.data.errors
                },
                marker: {
                    symbol: 'circle-dot',
                    color: 'rgb(16, 32, 77)'
                }
            }
        ];
        let layout = {
            margin: margins,
            title: this.props.title,
            autosize: true,
            hovermode: 'closest',
            xaxis: {
                title: this.props.xaxis_title,
                tickvals: this.props.tickvals,
            },
            yaxis: {
                title: this.props.yaxis_title
            }
        };
        let config = {
            showLink: false,
        };
        return (
            <div className="plot plot_meanstddev">
                <PlotlyComponent plotly={Plotly} data={data} layout={layout} config={config}/>
            </div>
        );
    }
}

export class BoxPlots extends Component {
    render() {
        let data = [];
        this.props.data.forEach(d => {
            data.push({
                x: d.xs,
                name: d.name,
                type: "box",
                boxmean: "sd"
            });
        });
        let layout = {
            margin: defaultMargins,
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
            <div className={"plot plot_box" + ((this.props === 'full') ? "" : "plot_half")}>
                <PlotlyComponent plotly={Plotly} data={data} layout={layout} config={config}/>
            </div>
        );
    }
}