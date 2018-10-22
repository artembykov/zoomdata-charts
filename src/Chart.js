import React, { Component } from 'react';
import charts from './charts.json';
import jszip from 'jszip/dist/jszip.min.js';
import saveAs from 'file-saver';
import './Chart.css';

export default class Chart extends Component {
  state = {
    packageJson: null,
    zip: null,
  };

  chartId = this.props.match.params.chartId;
  chart = charts[this.chartId];

  async componentDidMount() {
    const baseUrl = `https://unpkg.com/${this.chartId}`;
    const packageJson = await getPackageJson(baseUrl);

    const visualizationJsUrl = new URL(packageJson.main, `${baseUrl}@${packageJson.version}/`);
    const visualizationJsonUrl = new URL('./visualization.json', visualizationJsUrl);

    const [visualizationJs, visualizationJson] = await Promise.all([
      fetch(visualizationJsUrl).then(response => response.text()),
      fetch(visualizationJsonUrl).then(response => response.json()),
    ]);

    visualizationJson.components = [
      {
        name: 'visualization.js',
        type: 'text/javascript',
        body: visualizationJs,
      }
    ];

    const zip = jszip();
    zip.file('version', '"3.7.0-0-SNAPSHOT"');
    zip.file('visualization.json', JSON.stringify(visualizationJson));
    zip.file('components/visualization.js', visualizationJs);

    const content = await zip.generateAsync({ type: 'blob' });

    this.setState({
      packageJson,
      zip: content,
    });
  }

  download = () => {
    saveAs(this.state.zip, `${this.chart.name}.zip`);
  }

  render() {
    return (
      <div className="Chart">
        <h2>{this.chart.name}</h2>
        {this.state.packageJson ? <PackageInfo package={this.state.packageJson} /> : <div>Loading package info...</div>}
        {this.state.zip ? (
          <button className="Chart-download" onClick={this.download}>
            <span role="img" aria-label="download">⬇️</span>
            Download ZIP
          </button>
        ) : <div>Preparing ZIP for download</div>}
      </div>
    );
  }
}

function PackageInfo(props) {
  return <>
    <div>{props.package.version}</div>
    {props.package.repository ? (
      <a href={props.package.repository.url}>Repository</a>
    ) : null}
  </>;
}

function getPackageJson(url) {
  return fetch(`${url}/package.json`).then(response => response.json());
}
