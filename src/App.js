import React, {Component} from 'react';
import logo from './logo.png';
import './App.css';
import StatsComponent from "./StatsComponent";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {file: null, distribute_year: true};
        this.handle_options = this.handle_options.bind(this);
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} id="logo" alt="logo"/>
                    <div id="title">
                        <h2>Bookstats</h2>
                    </div>
                    <div className="clearfloat"/>
                </div>
                <div id="content">
                    <div className="InputCSV">
                        <p>Select the .csv file exported from goodreads below.<br/>
                            The export button can be found on <a href="https://www.goodreads.com/review/import">this page</a>,
                            in the right column.</p>
                        <input type="file" name="file" id="library_xml" accept=".csv"
                               ref={(ref) => this.fileUpload = ref}
                               onChange={this.handle_options}/>
                        <div className="options">
                            <label>
                                <input name="distribute_year" type="checkbox"
                                       checked={this.state.distribute_year} onChange={this.handle_options}/>
                                If more than 10 books are read on Jan 1. spread them over the whole year.
                            </label>
                        </div>
                    </div>

                    <StatsComponent file={this.state.file} distribute_year={this.state.distribute_year}/>
                </div>
            </div>
        );
    }

    handle_options(e) {
        const target = e.target;
        if (target.name === "file") {
            this.setState({file: this.fileUpload.files[0]});
            return;
        }
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [target.name]: value
        });
    }

}

export default App;
