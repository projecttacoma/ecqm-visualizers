import React, { useMemo } from 'react';
import { Table } from '@mantine/core';
import {
  PopulationReportViewerProps,
  DetailedMeasureReport,
  MeasureReportInfoArray,
  PopulationResult,
} from '../types/PopulationResultsViewerTypes';
import { fhirJson } from '@fhir-typescript/r4-core';

export default function PopulationReportViewer({
  reports,
}: PopulationReportViewerProps) {
  const firstMR = isDetailedMeasureReportArr(reports)
    ? reports[0].report
    : isMeasureReportArr(reports)
    ? reports[0]
    : null;
  const tableHeaders = useMemo(() => {
    if (firstMR) {
      return extractTableHeaders(firstMR);
    }
    return [];
  }, reports);

  /**
   * Converts an array of FHIR MeasureReport information with or without labels and formats it into JSX table rows for display
   * @param reports {Array} an array of either DetailedMeasureReports or FHIR MeasureReports
   * @returns an array of JSX table rows for display of MeasureReport population info
   */
  function constructPopulationResultsArray(reports: MeasureReportInfoArray) {
    if (isDetailedMeasureReportArr(reports)) {
      return reports
        .filter((mrInfo) => mrInfo.report.group?.[0])
        .map((mrInfo) => {
          return extractPopulationResultRow(mrInfo.report, mrInfo.label);
        });
    } else if (isMeasureReportArr(reports)) {
      return reports
        .filter((mrInfo) => mrInfo.group?.[0])
        .map((mrInfo) =>
          extractPopulationResultRow(mrInfo, mrInfo.subject?.reference)
        );
    } else {
      return null;
    }
  }

  /**
   * Strips population results off of a FHIR MeasureReport and calls PopulationResultsRow to format them into a TSX component
   * @param mr {Object} a FHIR MeasureReport resource
   * @param label {String} string with which to identify the patient
   * @returns a TSX component which displays the population results as a table row
   */
  function extractPopulationResultRow(
    mr: fhirJson.MeasureReport,
    label: string = 'Unlabeled Patient'
  ) {
    const group = mr.group?.[0];
    const populationResults = { label };
    group?.population?.reduce((acc: any, e) => {
      const key = e?.code?.coding?.[0]?.display || e?.code?.coding?.[0]?.code;
      if (key) {
        acc[key as string] = e?.count;
      }
      return acc;
    }, populationResults);
    return PopulationResultsRow(populationResults);
  }

  /**
   * Formats population results for a FHIR Patient into a TSX component for display as a table row
   * @param populationResult {Object} a breakdown of which populations a FHIR Patient qualified for in a MeasureReport
   * @returns a TSX component which displays the population results as a table row
   */
  function PopulationResultsRow(populationResult: PopulationResult) {
    return (
      <tr key={populationResult.label}>
        <td>{populationResult.label}</td>
        {tableHeaders.map((e) => (
          <td key={e}>{populationResult[e]}</td>
        ))}
      </tr>
    );
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>Patient</th>
          {tableHeaders?.map((e) => (
            <th key={e}>{e}</th>
          ))}
        </tr>
      </thead>
      <tbody>{constructPopulationResultsArray(reports)}</tbody>
    </Table>
  );
}

/**
 * Pulls off the population group displays/codes for use as table headers
 * @param mr {Object} A FHIR MeasureReport
 * @returns an array of strings to be displayed as table headers
 */
function extractTableHeaders(mr: fhirJson.MeasureReport): string[] {
  const group = mr.group?.[0];
  if (group?.population?.length) {
    console.log(group.population);
    return group?.population.map((e) => {
      return e?.code?.coding?.[0]?.display || e?.code?.coding?.[0]?.code || '';
    });
  }
  return [];
}

function isDetailedMeasureReportArr(
  mrInfoArr: any[]
): mrInfoArr is DetailedMeasureReport[] {
  return mrInfoArr.every(
    (e) =>
      typeof e.label === 'string' && e.report?.resourceType === 'MeasureReport'
  );
}

function isMeasureReportArr(
  mrInfoArr: any[]
): mrInfoArr is fhirJson.MeasureReport[] {
  return mrInfoArr.every((e) => e.resourceType === 'MeasureReport');
}
