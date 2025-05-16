export interface ComparisonItem {
  section: string;
  doc1: string;
  doc2: string;
}

export interface ComparisonResult {
  text: ComparisonItem[] | string;
}