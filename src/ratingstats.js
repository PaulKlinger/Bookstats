/**
 * Created by Paul on 2017-05-20.
 */
import React, { Component } from 'react';
import createPlotlyComponent from 'react-plotlyjs';
import Plotly from 'plotly.js/dist/plotly-cartesian'

import regression_line from './shared_plotconfig.js'

const PlotlyComponent = createPlotlyComponent(Plotly);

export default class RatingStats extends Component {
    render() {
        return (
            <div className="RatingStats">
                <p>Data length: {(this.props.statistics === null) ? 0 : this.props.statistics.data.length}</p>
                <RatingHist statistics={this.props.statistics}/>
                <UserVsAvgRating statistics={this.props.statistics}/>
                <PagesVsRating statistics={this.props.statistics}/>
            </div>
        );
    }
}


class RatingHist extends Component{
    render(){
        let raw_data = this.props.statistics.data.map(b => b.user_rating);
        let data = [
            {
                type: 'histogram',
                x: raw_data
            }
        ];
        let layout = {
            xaxis: {
                title: 'your rating',
                tickvals: [1,2,3,4,5]
            }
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


class UserVsAvgRating extends Component{
    render(){
        let raw_data = this.props.statistics.user_rating_vs_average_rating;
        let data = [
            {
                type: 'scattergl',  // all "scatter" attributes: https://plot.ly/javascript/reference/#scatter
                mode: 'markers',
                x: raw_data.avg,     // more about "x": #scatter-x
                y: raw_data.user,     // #scatter-y
                marker: {         // marker is an object, valid marker keys: #scatter-marker
                    symbol: 'cross',
                    color: 'rgb(16, 32, 77)' // more about "marker.color": #scatter-marker-color
                }
            }
        ];
        if (raw_data.regression.R2 > 0.7){
            data.push(regression_line(raw_data.regression, 1, 5))
        }
        let layout = {                     // all "layout" attributes: #layout
            autosize: true,
            xaxis: {                  // all "layout.xaxis" attributes: #layout-xaxis
                title: 'average rating'         // more about "layout.xaxis.title": #layout-xaxis-title
            },
            yaxis: {
                title: 'your rating'
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

class PagesVsRating extends Component {
    render(){
        let raw_data = this.props.statistics.user_rating_vs_num_pages;
        let data = [
            {
                type: 'scattergl',  // all "scatter" attributes: https://plot.ly/javascript/reference/#scatter
                mode: 'markers',
                x: raw_data.pages,     // more about "x": #scatter-x
                y: raw_data.user,     // #scatter-y
                marker: {         // marker is an object, valid marker keys: #scatter-marker
                    symbol: 'cross',
                    color: 'rgb(16, 32, 77)' // more about "marker.color": #scatter-marker-color
                }
            }
        ];
        if (raw_data.regression.R2 > 0.001){
            data.push(regression_line(raw_data.regression, 1, Math.max(...raw_data.pages)))
        }
        let layout = {                     // all "layout" attributes: #layout
            xaxis: {                  // all "layout.xaxis" attributes: #layout-xaxis
                title: '# pages'         // more about "layout.xaxis.title": #layout-xaxis-title
            },
            yaxis: {
                title: 'your rating'
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