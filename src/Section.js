/**
 * Created by Paul on 2017-05-27.
 */

import React, { Component } from 'react';

export default class Section extends Component {
    constructor(props) {
        super(props);
        this.state = {visible: props.defaultVisible};
        this.changeVisibility = this.changeVisibility.bind(this);
    }

    changeVisibility(){
        this.setState({visible: ! this.state.visible});
    }

    render() {
        return (<div className="section">
            <div className="section-title" onClick={this.changeVisibility}>
                {this.props.title} {this.state.visible ? "▲" : "▼"}
            </div>
            <div className="section-content" style={{display: this.state.visible ? "block" : "none"}}>
                {this.props.children}
            </div>
        </div> );
    }
}