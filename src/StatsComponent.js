/**
 * Created by Paul on 2017-05-27.
 */

import React, { Component } from 'react';

import RatingStats from './RatingStats.js'
import ReadingStats from './ReadingStats.js'
import AuthorStats from './AuthorStats.js'

import parseExport from './parseExport'


export default class StatsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {statistics: null}
    }
    componentWillReceiveProps(nextProps) {
        let self = this;
        let file = nextProps.file;
        if (file !== undefined) {
            parseExport(file, {distribute_year: nextProps.distribute_year}).then((statistics) => {
                self.setState({statistics: statistics});
            });
        }
    }

    render() {
        if (this.state.statistics === null) {return null}
        return (
            <div id="stats" style={{display: this.state.statistics.data.length >0 ? "block" : "none"}}>
                <div id="overview">
                    <div id="number_stats">
                        Found
                        <ul>
                            <li>{this.state.statistics.data.length + " books,"}</li>
                            <li>{`${this.state.statistics.data.filter(b => b.user_rating > 0).length} rated books,`}</li>
                            <li>{`${this.state.statistics.data_valid_date_read.length} books with finish date,`}</li>
                            <li>{`by ${Object.keys(this.state.statistics.author_stats).length} authors.`}</li>
                        </ul>
                    </div>
                    <div id="instructions">
                        <p>Click and drag on any graph to zoom in, double click to zoom out again.</p>
                        <p>Click on the table headings to change the sort order.</p>
                        <p>The .csv file exported from goodreads does not include the date you started reading a book,
                            so some of the graphs are not very accurate (e.g. pages read per day).</p>
                    </div>
                    <div className="clearfloat" />
                </div>
                <ReadingStats statistics={this.state.statistics} />
                <AuthorStats statistics={this.state.statistics} />
                <RatingStats statistics={this.state.statistics} />
            </div>
        );
    }
}