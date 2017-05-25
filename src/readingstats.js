/**
 * Created by Paul on 2017-05-21.
 */
import React, { Component } from 'react';

import {ScatterPlot, Histogram, DensityPlot} from './shared_plots.js'
import {TimeLinePlot} from "./shared_plots";


export default class ReadingStats extends Component {
    render() {
        return (
            <div className="ReadingStats">
                <Histogram data={this.props.statistics.data.map(b => b.num_pages)}
                           xaxis_title="# of pages" />
                <TimeLinePlot data={this.props.statistics.pages_read_31_day_sliding_window}
                              yaxis_title="pages_read / day" show_num={false}/>
            </div>
        );
    }
}