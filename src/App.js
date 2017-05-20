import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Statistics from './statistics.js'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {statistics: null, file: null};
        this.read_file = this.read_file.bind(this);
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
              <input type="file" id="library_xml" accept=".csv" ref={(ref) => this.fileUpload = ref}/>
              <input type="button" value="process file" onClick={this.read_file} />
          </div>
          <div className="DataDisplay">
              <p>{(this.state.statistics === null)? "" : this.state.statistics.data}</p>
          </div>
      </div>
    );
  }

  read_file() {
        let file = this.fileUpload.files[0];
        this.statistics = new Statistics(file);
        this.statistics.process_file();
  }
}

export default App;
