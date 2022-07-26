import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { PopulationResultsViewer } from '../src';
const mrs = require('../test/fixtures/measureReports.json');

const labeledFixture = [
  { label: 'Patient1', report: mrs[0] },
  { label: 'Patient2', report: mrs[1] },
];
const App = () => {
  return (
    <div>
      <PopulationResultsViewer reports={labeledFixture} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
