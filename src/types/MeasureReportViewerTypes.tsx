export type MeasureReportViewerProps = {
  reports: MeasureReportInfoArray;
};

export type DetailedMeasureReport = {
  label: string;
  report: fhir4.MeasureReport;
};

export type MeasureReportInfoArray = Array<
  fhir4.MeasureReport | DetailedMeasureReport
>;

export type PopulationResult = {
  label: string;
  numerator?: number;
  denominator?: number;
  'initial-population'?: number;
  'denominator-exclusion'?: number;
};
