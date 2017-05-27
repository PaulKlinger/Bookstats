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
                <div className="overview">
                    <p>{(this.state.statistics === null)? "no data" : this.state.statistics.data.length + " books"}</p>
                </div>
                <ReadingStats statistics={this.state.statistics} />
                <AuthorStats statistics={this.state.statistics} />
                <RatingStats statistics={this.state.statistics} />
            </div>
        );
    }
}