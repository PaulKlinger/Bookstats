/**
 * Created by Paul on 2017-05-26.
 */
import React, { Component } from 'react';

import {ScatterPlot, Histogram, DensityPlot, Bar} from './shared_plots.js'
import SortableTable from './SortableTable.js'


export default class AuthorStats extends Component {
    render() {
        return (
            <div className="ReadingStats">
                <ScatterPlot data={this.props.statistics.author_num_books_vs_avg_user_rating}
                             xaxis_title="# books read by author" yaxis_title="your average rating"/>

                <div className="plot plot_list">
                <SortableTable data={this.props.statistics.author_stats_list} columns={[
                    {column: "author", name: "Author", cmpfunction: (a, b) => a < b ? -1 : a > b ? 1 : 0},
                    {column: "num_books", name: "# Books", cmpfunction: (a, b) => a < b ? -1 : a > b ? 1 : 0},
                    {column: "avg_user_rating_2prec", name: "Your Avg. Rating", cmpfunction: (a, b) => (+a < +b || a === null) ? -1 : +a > +b ? 1 : 0}
                ]} defaultSort={{column: "avg_user_rating_2prec", mult: -1}}/>
                </div>
            </div>
        );
    }
}