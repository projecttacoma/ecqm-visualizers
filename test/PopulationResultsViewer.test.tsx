import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PopulationResultsViewer from '../src/components/PopulationResultsViewer';
import { DetailedMeasureReport } from '../src/types/PopulationResultsViewerTypes';
import { fhirJson } from '@fhir-typescript/r4-core';

const mrs = require('./fixtures/measureReports.json');

describe('MeasureReportViewer', () => {
  it('renders the proper headers and data for regular Measure Report input', () => {
    render(
      <PopulationResultsViewer reports={mrs as fhirJson.MeasureReport[]} />
    );
    const numerIdentifier = screen.getByText('Patient/numer-EXM130');
    const denomIdentifier = screen.getByText('Patient/denom-EXM130');
    const numQualified = screen.getAllByText('1');
    const numUnqualified = screen.getAllByText('0');

    expect(numerIdentifier).toBeInTheDocument();
    expect(denomIdentifier).toBeInTheDocument();
    expect(numQualified.length).toBe(5);
    expect(numUnqualified.length).toBe(3);
  });
  it('renders the proper headers and data for detailed Measure Report input', () => {
    const labeledMRs = [
      { label: 'Patient1', report: mrs[0] },
      { label: 'Patient2', report: mrs[1] },
    ];
    render(
      <PopulationResultsViewer
        reports={labeledMRs as DetailedMeasureReport[]}
      />
    );
    const numerIdentifier = screen.getByText('Patient1');
    const denomIdentifier = screen.getByText('Patient2');
    const numQualified = screen.getAllByText('1');
    const numUnqualified = screen.getAllByText('0');

    expect(numerIdentifier).toBeInTheDocument();
    expect(denomIdentifier).toBeInTheDocument();
    expect(numQualified.length).toBe(5);
    expect(numUnqualified.length).toBe(3);
  });
});
