import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MeasureReportsViewer from '../src/components/MeasureReportViewer';
const mrs = require('../test/fixtures/measureReports.json');

const labeledFixture = [
  { label: 'Patient1', report: mrs[0] },
  { label: 'Patient2', report: mrs[1] },
];
const App = () => {
  return (
    <div>
      <MeasureReportsViewer reports={mrs} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
