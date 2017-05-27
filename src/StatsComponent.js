/**
 * Created by Paul on 2017-05-27.
 */

import React, { Component } from 'react';

import RatingStats from './RatingStats.js'
import ReadingStats from './ReadingStats.js'
import AuthorStats from './AuthorStats.js'




export default class StatsComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.statistics === null || this.props.statistics.data.length === 0) {return null}
        return (
            <div id="stats">
                <ReadingStats statistics={this.props.statistics} />
                <AuthorStats statistics={this.props.statistics} />
                <RatingStats statistics={this.props.statistics} />
            </div>
        );
    }
}