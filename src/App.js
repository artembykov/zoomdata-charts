import React, { Component } from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';
import Chart from './Chart.js';
import charts from './charts.json';
import './App.css';
import thumbnail from './thumbnail.png';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div className="App">
          <header className="App-header">
            <Link to="/">
              <span role="img" aria-label="chart">📈</span>
              Zoomdata Charts
            </Link>
          </header>
          <content className="App-content">
            <Route exact path="/" component={Home} />
            <Route path="/:chartId" component={Chart} />
          </content>
        </div>
      </HashRouter>
    );
  }
}

function Home() {
  return <>
    {Object.keys(charts).map((chartId, index) => {
      const chart = charts[chartId];

      return <Link to={`/${chartId}`} className="ChartLink" key={index}>
        <img src={chart.image || thumbnail} alt={chart.name} />
        <div>{chart.name}</div>
      </Link>;
    })}
  </>;
}

export default App;
