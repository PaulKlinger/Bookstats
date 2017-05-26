/**
 * Created by Paul on 2017-05-26.
 */
import React, {Component} from 'react';

export default class SortableTable extends Component {
    // data = [{*columName1*: *value1*, ...},...]
    // columns = [{column: *columnName*, name: *header text*, cmpfunction: *(a,b) => ...*},...]
    // defaultSort = {column: *columName*, mult: 1/-1}
    constructor(props) {
        super(props);
        this.state = {sort: props.defaultSort};
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.setState({
            sort: {
                column: e.target.name,
                mult: e.target.name === this.state.sort.column ? -this.state.sort.mult : -1
            }
        });
    }

    render() {
        let self = this;
        let sorted_data = this.props.data.sort((a, b) =>
            (this.state.sort.mult * this.props.columns.filter(c => c.column === this.state.sort.column)[0]
                .cmpfunction(a[this.state.sort.column], b[this.state.sort.column])));
        return (
            <table>
                <thead>
                <tr>{this.props.columns.map(c => (<th key={c.column}>
                    <a name={c.column} onClick={this.handleClick}>
                        {c.name}{this.state.sort.column === c.column ? (this.state.sort.mult === -1 ? "▼" : "▲") : ""}
                    </a>
                </th>))}</tr>
                </thead>
                <tbody>
                {sorted_data.map((r, i) => (
                    <tr key={i} className={"SortedTable_row_" + (i % 2 === 0 ? "even" : "odd")}>{self.props.columns.map(c => (
                        <td key={c.column}>
                            {r[c.column]}
                        </td>
                    ))}</tr>
                ))}
                </tbody>
            </table>
        );
    }
}