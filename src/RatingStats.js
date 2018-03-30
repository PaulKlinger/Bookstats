/**
 * Created by Paul on 2017-05-20.
 */
import React, {Component} from 'react';

import {ScatterPlot, Histogram, TimeLinePlot, DotViolin, MeanStdDev, TimeLineSlidingWindowPlot} from './shared_plots'
import SortableTable from "./SortableTable"
import {cmpNumNullLast} from "./util"

export default class RatingStats extends Component {
    render() {
        return (
            <div className="RatingStats">
                <Histogram title="your book ratings"
                           data={this.props.statistics.data.map(b => b.user_rating === null ? 0 : b.user_rating)}
                           xaxis_title="your rating" tickvals={[0, 1, 2, 3, 4, 5]}
                           ticktext={["not rated", 1, 2, 3, 4, 5]}/>
                <ScatterPlot title="your rating vs average rating"
                             data={this.props.statistics.user_rating_vs_average_rating}
                             xaxis_title="average rating" yaxis_title="your rating"/>
                <ScatterPlot title="your rating vs number of pages"
                             data={this.props.statistics.user_rating_vs_num_pages}
                             xaxis_title="# pages" yaxis_title="your rating"/>
                <TimeLineSlidingWindowPlot title="average of your rating"
                                           data={this.props.statistics.user_rating_vs_date_read}
                                           yaxis_title="your rating" yaxis2_title="# rated books"
                                           line_1_legend="rating" line_2_legend="# books"
                                           default_ndays={62} fillval_1={null} fillval_2={0}
                                           aggregation_1={"mean"} aggregation_2={"sum"}/>
                <Histogram title="difference between your rating and average rating"
                           data={this.props.statistics.data.filter(b => b.user_rating > 0)
                               .map(b => b.user_rating - b.average_rating)}
                           xaxis_title="Your ★ - Avg. ★" yaxis_title="# Books"/>
                <div className="plot plot_list">
                    Δ ★ is the difference between your rating and the average rating.
                    <SortableTable data={this.props.statistics.book_list}
                                   columns={[
                                       {
                                           column: "title", name: "Title",
                                           cmpfunction: (a, b) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0
                                       },
                                       {
                                           column: "author", name: "Author",
                                           cmpfunction: (a, b) => a.author_sort < b.author_sort ? -1 : a.author_sort > b.author_sort ? 1 : 0
                                       },
                                       {
                                           column: "user_rating", name: "Your ★",
                                           cmpfunction: (a, b) => cmpNumNullLast(a.user_rating, b.user_rating)
                                       },
                                       {
                                           column: "avg_rating_2prec", name: "Avg. ★",
                                           cmpfunction: (a, b) => cmpNumNullLast(a.avg_rating, b.avg_rating)
                                       },
                                       {
                                           column: "rating_diff_2prec", name: "Δ ★",
                                           cmpfunction: (a, b) => cmpNumNullLast(a.rating_diff, b.rating_diff)
                                       }
                                   ]} defaultSort={{column: "rating_diff_2prec", mult: -1}}/>
                </div>
                <DotViolin data={this.props.statistics.avgrating_and_title}
                           xaxis_title="avg. rating" size="full" title="average rating of books you read"/>
                {this.props.statistics.has_genres ?
                    <MeanStdDev data={this.props.statistics.genre_ratings} size="full"
                                title="your average rating per genre"
                                tickvals={[1, 2, 3, 4, 5]}/>
                    : ""}
                <div className="clearfloat"/>
            </div>
        );
    }
}
