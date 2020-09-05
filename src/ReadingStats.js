/**
 * Created by Paul on 2017-05-21.
 */
import React, {Component} from 'react';

import {Bar, TimeLineSlidingWindowPlot, DotViolin, ScatterPlot} from './shared_plots.js'


export default class ReadingStats extends Component {
    render() {
        return (
            <div className="ReadingStats">
                <Bar title="books read per month" data={this.props.statistics.months_books_read_bar}
                     xaxis_title="Month" yaxis_title="# books read" xaxis_hoverformat="%B %Y"/>
                <TimeLineSlidingWindowPlot title="pages read per day & books read per week"
                                           data={this.props.statistics.books_pages_read}
                                           yaxis_title="pages read / day" y2_type="line"
                                           yaxis2_title="books read / week"
                                           line_1_legend="pages" line_2_legend="books"
                                           default_ndays={62} fillval_1={0} fillval_2={0}
                                           aggregation_1={"mean"} aggregation_2={"mean"}/>
                <Bar title="# books finished by weekday"
                     data={this.props.statistics.weekday_finish}
                     xaxis_title="weekday of finish date" yaxis_title="# of books"/>
                <DotViolin size="full" title="books read by number of pages"
                           data={this.props.statistics.pages_and_title}
                           xaxis_title="# pages"/>
                <DotViolin size="full" title="books read by publication year"
                           data={this.props.statistics.publication_year_title}
                           xaxis_title={null} slotsize={1} oneside={true}/>
                {this.props.statistics.has_read_dates ?
                    <Bar title="books read by genre"
                         data={this.props.statistics.genre_books}
                         yaxis_title="# books read" margin_bottom="150" margin_top="50" tickangle="-45"/>
                    : ""}
                <ScatterPlot title="read date vs publication date"
                             data={this.props.statistics.read_vs_pub}
                             xaxis_title="read date" yaxis_title="publication date"/>
                <div className="clearfloat"/>
            </div>
        );
    }
}