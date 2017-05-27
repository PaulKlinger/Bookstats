/**
 * Created by Paul on 2017-05-21.
 */
import React, { Component } from 'react';

import {ScatterPlot, Histogram, DensityPlot, Bar, TimeLinePlot} from './shared_plots.js'


export default class ReadingStats extends Component {
    render() {
        return (
            <div className="ReadingStats">
                <Bar title="books read per month" data={this.props.statistics.months_books_read_bar}
                     xaxis_title="Month" yaxis_title="# books read" />
                <TimeLinePlot title="books / pages read per day, 2 month moving average"
                              data={this.props.statistics.pages_read_31_day_sliding_window}
                              yaxis_title="pages read / day" y2_type="line"
                              yaxis2_title="books read / day"/>
                <Bar title="weekday of book finish dates"
                     data={this.props.statistics.weekday_finish}
                     xaxis_title="weekday of finish date" yaxis_title="# of books"/>
                <Histogram title="books read by number of pages"
                           data={this.props.statistics.data.map(b => b.num_pages)}
                           xaxis_title="# of pages" />
                <Bar title="books read by publication year"
                     data={this.props.statistics.publication_year_bar}
                     xaxis_title="publication year" yaxis_title="# books read"/>
                <div className="clearfloat"/>
            </div>
        );
    }
}