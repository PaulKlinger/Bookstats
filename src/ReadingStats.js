/**
 * Created by Paul on 2017-05-21.
 */
import React, { Component } from 'react';

import {ScatterPlot, Histogram, DensityPlot, Bar, TimeLinePlot} from './shared_plots.js'


export default class ReadingStats extends Component {
    render() {
        return (
            <div className="ReadingStats">
                <Histogram data={this.props.statistics.data.map(b => b.num_pages)}
                           xaxis_title="# of pages" />
                <Bar data={this.props.statistics.publication_year_bar}
                           xaxis_title="publication year" />
                <TimeLinePlot data={this.props.statistics.pages_read_31_day_sliding_window}
                              yaxis_title="pages read / day" y2_type="line"
                              yaxis2_title="books read / day"/>
                <Bar data={this.props.statistics.weekday_finish}
                           xaxis_title="weekday of finish date" yaxis_title="# of books"/>
                <div className="clearfloat"/>
            </div>
        );
    }
}