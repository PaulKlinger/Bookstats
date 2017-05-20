/**
 * Created by Paul on 2017-05-20.
 */
import React, { Component } from 'react';
import createPlotlyComponent from 'react-plotlyjs';
import Plotly from 'plotly.js/dist/plotly-cartesian'

const PlotlyComponent = createPlotlyComponent(Plotly);

export default class RatingStats extends Component {
    render() {//{this.statistics.user_rating_vs_average_rating}
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
        let layout = {                     // all "layout" attributes: #layout
            title: 'simple example',  // more about "layout.title": #layout-title
            xaxis: {                  // all "layout.xaxis" attributes: #layout-xaxis
                title: 'average rating'         // more about "layout.xaxis.title": #layout-xaxis-title
            },
            yaxis: {
                title: 'Your rating'
            }
        };
        let config = {
            showLink: false,
        };
        return (
            <div className="RatingStats">
                <p>Data length: {(this.props.statistics === null) ? 0 : this.props.statistics.data.length}</p>
                <PlotlyComponent data={data} layout={layout} config={config}/>
            </div>
        );
    }
}