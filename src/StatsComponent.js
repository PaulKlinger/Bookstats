/**
 * Created by Paul on 2017-05-27.
 */

import React, {Component} from 'react';

import RatingStats from './RatingStats'
import ReadingStats from './ReadingStats'
import AuthorStats from './AuthorStats'

import Section from "./Section"


export default class StatsComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.statistics === null || this.props.statistics.data.length === 0) {
            return null
        }
        return (
            <div id="stats">
                <Section title="General" defaultVisible={true}>
                    <ReadingStats statistics={this.props.statistics}/>
                </Section>
                <Section title="Author" defaultVisible={true}>
                    <AuthorStats statistics={this.props.statistics}/>
                </Section>
                <Section title="Rating" defaultVisible={true}>
                    <RatingStats statistics={this.props.statistics}/>
                </Section>
            </div>
        );
    }
}