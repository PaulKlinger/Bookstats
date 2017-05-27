import React, { Component } from 'react';
import logo from './logo.svg';
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
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Goodreads Analysis</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
          <div className="InputCSV">
              <p>Select the xml file from the <a href="https://www.goodreads.com/review/import">Goodreads export library feature</a> below.</p>
              <input type="file" name="file" id="library_xml" accept=".csv" ref={(ref) => this.fileUpload = ref}
                     onChange={this.handle_options}/>
          </div>
          <div className="options">
              <label>
                  Spread Jan. 1 books over whole year if > 10
                  <input name="distribute_year" type="checkbox"
                         checked={this.state.distribute_year} onChange={this.handle_options}/>
              </label>
          </div>
          <StatsComponent file={this.state.file} distribute_year={this.state.distribute_year}/>
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
