import React, {Component} from 'react';
import logo from './img/logo.png';
import error_smiley from './img/error_smiley.png'
import './css/App.css';
import demo_library from './export_enhanced_full.csv'

import StatsComponent from "./StatsComponent";
import parseExport from "./parseExport"
import Spinner from "./Spinner";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {file: null, distribute_year: true, statistics: null,processing: false, error: false};
        this.show_demo = this.show_demo.bind(this);
        this.handle_options = this.handle_options.bind(this);
        this.calc_statistics = this.calc_statistics.bind(this);
    }

    show_demo(e) {
        e.preventDefault();
        this.setState({file: demo_library, statistics: null}, this.calc_statistics);
    }

    handle_options(e) {
        const target = e.target;
        if (target.name === "file") {
            this.setState({file: this.fileUpload.files[0], statistics: null}, this.calc_statistics);
        } else {
            const value = target.type === 'checkbox' ? target.checked : target.value;
            this.setState({
                [target.name]: value,
                statistics: null
            }, this.calc_statistics);
        }
    }

    calc_statistics() {
        let self = this;

        if (this.state.file !== undefined && this.state.file !== null) {
            this.setState({processing: true, error: false, statistics: null}, () => {
                parseExport(this.state.file, {distribute_year: this.state.distribute_year}).then((statistics) => {
                    self.setState({statistics: statistics, processing: false});
                }, (reason) => {
                    console.log(reason);
                    self.setState({statistics: null, processing: false, error: true})
                });
            });
        }
    }

    render() {
        return (
            <div className="App">
                <div id="non-footer">
                <div className="App-header">
                    <img src={logo} id="logo" alt="logo"/>
                    <div id="title">
                        <h1>Bookstats</h1>
                    </div>
                    <div className="clearfloat"/>
                </div>
                <div id="content">
                    <div id="top-bar">
                        <div className="InputCSV">
                            <p>This app shows you detailed statistics about your goodreads library.<br/>
                                To start, select the .csv file exported from goodreads below.<br/>
                                (The export function can be found on <a href="https://www.goodreads.com/review/import">this
                                    page</a>,
                                in the right column.)</p>
                            <p>You can optionally use <a href="https://github.com/PaulKlinger/Enhance-GoodReads-Export">this tool</a> to add genre and multiple reading date
                                 information to the export file.</p>
                            <p>All processing is done in the browser, your data never leaves your computer.</p>
                            <div id="file_select_and_processing">
                                <div id="file_select" className="float">
                                    <input type="file" name="file" id="library_xml" accept=".csv"
                                           ref={(ref) => this.fileUpload = ref}
                                           onChange={this.handle_options}
                                           disabled={this.state.processing}/>
                                    <br />
                                    <span className="link_button" id="demo_link"
                                       style={{display: this.state.processing ? "none" : "block"}}
                                       onClick={this.show_demo}>(show demo)</span>
                                </div>
                                <div id="processing" className="float"
                                     style={{display: this.state.processing ? "block" : "none"}}>
                                    <Spinner />
                                </div>
                                <div id="error" style={{display: this.state.error ? "flex" : "none"}}>
                                    <img className="error_smiley" alt="" src={error_smiley}/>error processing file
                                </div>
                                <div className="clearfloat"/>
                            </div>
                            <div className="options">
                                <label>
                                    <input name="distribute_year" type="checkbox"
                                           checked={this.state.distribute_year} onChange={this.handle_options}/>
                                    If more than 10 books are read on Jan 1. spread them over the whole year.
                                </label>
                            </div>
                        </div>
                        {this.state.statistics !== null && this.state.statistics.data.length > 0 &&
                            <div id="overview" className="float">
                                <div id="number_stats" className="float">
                                    Found
                                    <ul>
                                        <li>{this.state.statistics.data.length + " books,"}</li>
                                        <li>containing {this.state.statistics.total_pages.toLocaleString()} pages
                                            ({this.state.statistics.data.filter(b => !(b.num_pages > 0)).length} books without # pages)
                                        </li>
                                        <li>or approximately {(this.state.statistics.total_words).toLocaleString()} words (270 words/page),</li>
                                        <li>{`${this.state.statistics.data.filter(b => b.user_rating > 0).length} rated books,`}</li>
                                        <li>{`${this.state.statistics.data_valid_date_read.length} books with finish date,`}</li>
                                        {(!this.state.statistics.has_read_dates) ? "" :
                                            <li>{`${this.state.statistics.data.filter(b => b.date_started.isValid() && b.date_read.isValid()).length} books with start and finish date,`}</li>
                                        }
                                        <li>{`by ${Object.keys(this.state.statistics.author_stats).length} authors.`}</li>
                                    </ul>
                                </div>
                                <div id="instructions">
                                    <p>Click and drag on any graph to zoom in, double click to zoom out again.</p>
                                    <p>Click on the table headings to change the sort order.</p>
                                    {this.state.statistics.has_read_dates ? "" :
                                        <p>The .csv file exported from goodreads does not include the date you started reading a book, or reread dates.
                                        This means that each book is shown once on the timeline and some of the graphs are not very accurate (e.g. pages read per day).</p>
                                    }
                                    {this.state.statistics.has_read_dates ? "" :
                                        <p>You can use <a href="https://github.com/PaulKlinger/Enhance-GoodReads-Export">this tool</a> to
                                            add start and end dates (including rereading dates) to the export file</p>
                                    }
                                </div>
                                <div className="clearfloat"/>
                            </div>
                        }
                        <div className="clearfloat" />
                    </div>

                    <StatsComponent statistics={this.state.statistics}/>
                </div>
                </div>
                <div id="footer">
                    Code available on <a href="https://github.com/PaulKlinger/Bookstats">GitHub</a>.
                </div>
            </div>
        );
    }
}

export default App;
