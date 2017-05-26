/**
 * Created by Paul on 2017-05-21.
 */

import React, {Component} from 'react';
import createPlotlyComponent from 'react-plotlyjs';
import Plotly from 'plotly.js/dist/plotly-cartesian'

const PlotlyComponent = createPlotlyComponent(Plotly);

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
                <PlotlyComponent data={data} layout={layout} config={config}/>
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
                <PlotlyComponent data={data} layout={layout} config={config}/>
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
            xaxis: {
                title: this.props.xaxis_title,
            },
            yaxis: {title: this.props.yaxis_title}
        };
        let config = {
            showLink: false,
        };
        return (
            <div className="plot plot_bar">
                <PlotlyComponent data={data} layout={layout} config={config}/>
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
                x: raw_data_1.x,
                y: raw_data_1.y,
                yaxis: 'y1'
            }
        ];
        let layout = {
            autosize: true,
            hovermode: 'closest',
            yaxis: {
                title: this.props.yaxis_title
            }
        };
        if (!(raw_data_2 === undefined)) {
            const y2_type = this.props.y2_type === undefined ? "bar" : this.props.y2_type;
            data.push({
                type: y2_type,
                x: raw_data_2.x,
                y: raw_data_2.y,
                yaxis: 'y2'
            });
            layout.yaxis2 = {
                side: 'right',
                title: this.props.yaxis2_title,
                overlaying: 'y' //???
            };
        }

        let config = {
            showLink: false,
        };
        return (
            <div className="plot plot_timeline">
                <PlotlyComponent data={data} layout={layout} config={config}/>
            </div>
        );
    }
}

export class DensityPlot extends Component {
    render() {
        let raw_data = this.props.data;
        let data = [
            {
                type: 'histogram2dcontour',
                x: raw_data.x,
                y: raw_data.y,
                text: raw_data.text,
                marker: {
                    symbol: 'cross',
                    color: 'rgb(16, 32, 77)'
                }
            },
            {
                type: 'scatter',
                mode: 'markers',
                x: raw_data.x,
                y: raw_data.y,
                text: raw_data.text,
                marker: {
                    symbol: 'cross',
                    color: 'rgba(50, 50, 50, 0.04)'
                }
            }
        ];
        if (raw_data.regression.R2 > 0.5) {
            data.push(this.regression_line(raw_data.regression, Math.min(...raw_data.x), Math.max(...raw_data.x)));
        }
        let layout = {
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
                <PlotlyComponent data={data} layout={layout} config={config}/>
            </div>
        );
    }
}