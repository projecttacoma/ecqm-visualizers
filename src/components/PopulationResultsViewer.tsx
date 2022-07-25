import React from 'react';
import { Table } from '@mantine/core';
import {
  PopulationReportViewerProps,
  DetailedMeasureReport,
  MeasureReportInfoArray,
  PopulationResult,
} from '../types/PopulationResultsViewerTypes';

export default function PopulationReportViewer({
  reports,
}: PopulationReportViewerProps) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Patient</th>
          <th>Initial Population</th>
          <th>Numerator</th>
          <th>Denominator</th>
          <th>Denominator Exclusion</th>
        </tr>
      </thead>
      <tbody>{constructPopulationResultsArray(reports)}</tbody>
    </Table>
  );
}

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
  mr: fhir4.MeasureReport,
  label: string = 'Unlabeled Patient'
) {
  const group = mr.group?.[0];
  const populationResults = { label };
  group?.population?.reduce((acc: any, e) => {
    const key = e?.code?.coding?.[0].code;
    if (key) {
      acc[key as string] = e.count;
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
      <td>{populationResult['initial-population']}</td>
      <td>{populationResult.numerator}</td>
      <td>{populationResult.denominator}</td>
      <td>{populationResult['denominator-exclusion']}</td>
    </tr>
  );
}

function isDetailedMeasureReportArr(
  mrInfoArr: any
): mrInfoArr is DetailedMeasureReport[] {
  return mrInfoArr.every(
    (e: any) =>
      typeof e.label === 'string' && e.report?.resourceType === 'MeasureReport'
  );
}

function isMeasureReportArr(
  mrInfoArr: any
): mrInfoArr is fhir4.MeasureReport[] {
  return mrInfoArr.every((e: any) => e.resourceType === 'MeasureReport');
}
