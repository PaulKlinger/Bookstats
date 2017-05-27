/**
 * Created by Paul on 2017-05-27.
 */

import React, {Component} from 'react';
import './Spinner.css'

export default class Section extends Component {
    render() {
        return (
            <div className="spinner">
                <div className="rect1"/>
                <div className="rect2"/>
                <div className="rect3"/>
                <div className="rect4"/>
                <div className="rect5"/>
            </div>
        );
    }
}