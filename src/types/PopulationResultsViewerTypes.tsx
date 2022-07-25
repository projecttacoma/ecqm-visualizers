import { fhirJson } from '@fhir-typescript/r4-core';

export type PopulationReportViewerProps = {
  reports: MeasureReportInfoArray;
};

export type DetailedMeasureReport = {
  label: string;
  report: fhirJson.MeasureReport;
};

export type MeasureReportInfoArray = Array<
  fhirJson.MeasureReport | DetailedMeasureReport
>;

export type PopulationResult = {
  label: string;
  numerator?: number;
  denominator?: number;
  'initial-population'?: number;
  'denominator-exclusion'?: number;
};
