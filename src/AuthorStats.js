/**
 * Created by Paul on 2017-05-26.
 */
import React, { Component } from 'react';

import {ScatterPlot, DotViolin} from './shared_plots.js'
import SortableTable from './SortableTable.js'
import {cmpNumNullLast} from './util.js'


export default class AuthorStats extends Component {
    render() {
        return (
            <div className="AuthorStats">
                <ScatterPlot title="# books read by author vs your average rating"
                             data={this.props.statistics.author_num_books_vs_avg_user_rating}
                             xaxis_title="# books read by author" yaxis_title="your average rating"/>

                <div className="plot plot_list">
                <SortableTable data={this.props.statistics.author_stats_list} columns={[
                    {column: "author", name: "Author",
                        cmpfunction: (a, b) => a.author_sort < b.author_sort ? -1 : a.author_sort > b.author_sort ? 1 : 0},
                    {column: "num_books", name: "# Books",
                        cmpfunction: (a, b) => a.num_books - b.num_books},
                    {column: "avg_user_rating_2prec", name: "Your Avg. ★",
                        cmpfunction: (a, b) => cmpNumNullLast(a.avg_user_rating, b.avg_user_rating)},
                    {column: "avg_rating_diff_2prec", name: "Your ★ -  Avg. ★",
                        cmpfunction: (a, b) => cmpNumNullLast(a.avg_rating_diff, b.avg_rating_diff)}
                ]} defaultSort={{column: "avg_user_rating_2prec", mult: -1}}/>
                </div>
                <DotViolin data={{x: this.props.statistics.author_stats_list.map(a => a.num_books),
                    text: this.props.statistics.author_stats_list.map(a => a.author)}}
                           xaxis_title="# books read by author" size="half"/>
                <DotViolin data={{x: this.props.statistics.author_stats_list.map(a => a.avg_user_rating),
                    text: this.props.statistics.author_stats_list.map(a => a.author)}}
                           xaxis_title="your avg. rating" size="half"/>
                <div className="clearfloat"/>
            </div>
        );
    }
}
