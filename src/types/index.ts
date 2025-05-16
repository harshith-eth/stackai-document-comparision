export interface ComparisonItem {
  section: string;
  doc1: string;
  doc2: string;
  changeType?: 'addition' | 'deletion' | 'modification' | 'unchanged';
  importance?: 'high' | 'medium' | 'low';
}

export interface ComparisonResult {
  text: ComparisonItem[] | string;
}