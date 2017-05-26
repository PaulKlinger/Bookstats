/**
 * Created by Paul on 2017-05-20.
 */
import React, { Component } from 'react';

import {ScatterPlot, Histogram, DensityPlot} from './shared_plots.js'
import {TimeLinePlot} from "./shared_plots";


export default class RatingStats extends Component {
    render() {
        return (
            <div className="RatingStats">
                <p>Data length: {(this.props.statistics === null) ? 0 : this.props.statistics.data.length}</p>
                <Histogram data={this.props.statistics.data.map(b => b.user_rating === null ? 0 : b.user_rating)}
                           xaxis_title="your rating" tickvals={[0,1,2,3,4,5]} ticktext={["not rated",1,2,3,4,5]} />
                <ScatterPlot data={this.props.statistics.user_rating_vs_average_rating}
                             xaxis_title="average rating" yaxis_title="your rating"/>
                <ScatterPlot data={this.props.statistics.user_rating_vs_num_pages}
                             xaxis_title="# pages" yaxis_title="your rating"/>
                <TimeLinePlot data={this.props.statistics.user_rating_vs_date_read_sliding_window}
                              yaxis_title="your rating" yaxis2_title="# rated books"/>
                <div className="clearfloat"/>
            </div>
        );
    }
}
