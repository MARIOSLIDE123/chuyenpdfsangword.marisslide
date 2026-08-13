export interface FontMetric {
  detectedFont: string;
  recommendedWordFont: string;
  fontSizePt: number;
  weight: 'normal' | 'bold' | '600' | '800';
  isItalic: boolean;
  letterSpacingPt: number;
  lineHeightRatio: number;
  metricCompatibilityScore: number; // 0 - 100%
  sampleText: string;
}

export interface TableCellModel {
  row: number;
  col: number;
  rowSpan?: number;
  colSpan?: number;
  text: string;
  isHeader?: boolean;
  align?: 'left' | 'center' | 'right';
  bgColor?: string;
}

export interface TableModel {
  id: string;
  rowsCount: number;
  colsCount: number;
  cells: TableCellModel[];
  borderColor: string;
  borderWidthPt: number;
  hasMergedCells: boolean;
  caption?: string;
}

export interface TextBlockModel {
  id: string;
  text: string;
  fontMetric: FontMetric;
  bbox: { x: number; y: number; width: number; height: number }; // percentage relative to page
  type: 'title' | 'heading1' | 'heading2' | 'body' | 'caption' | 'footnote' | 'bullet';
  flowType: 'inline' | 'anchored' | 'multi_column';
  columnGroup?: number;
}

export interface ImageBlockModel {
  id: string;
  bbox: { x: number; y: number; width: number; height: number };
  caption?: string;
  isVector: boolean;
  resolutionDpi: number;
  dataUrl?: string;
}

export interface PageModel {
  pageNumber: number;
  widthMm: number;
  heightMm: number;
  marginTopMm: number;
  marginBottomMm: number;
  marginLeftMm: number;
  marginRightMm: number;
  columns: number;
  headerText?: string;
  footerText?: string;
  hasPageNumbers: boolean;
  textBlocks: TextBlockModel[];
  tables: TableModel[];
  images: ImageBlockModel[];
}

export interface DocumentAnalysisReport {
  documentName: string;
  pageCount: number;
  complexityScore: number; // 1 to 10
  textDensityPct: number;
  tableCount: number;
  imageCount: number;
  vectorGraphicCount: number;
  fontCount: number;
  layerBreakdown: {
    textLayerPct: number;
    imageLayerPct: number;
    vectorLayerPct: number;
    logicalStructureScore: number;
  };
  typographySpecs: FontMetric[];
  layoutSpecs: {
    pageMargins: { top: number; bottom: number; left: number; right: number };
    lineSpacing: string;
    paragraphSpacingAfterPt: number;
    columnLayout: string;
    positioningStrategy: 'Natural Text Flow (Recommended)' | 'Smart Anchored Text Boxes' | 'Hybrid Flow & Absolute Frames';
  };
  warnings: {
    severity: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    mitigation: string;
  }[];
  conversionStrategy: string[];
  pages: PageModel[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'architect';
  timestamp: string;
  content: string;
  formattedOutput?: {
    analysis?: string;
    strategy?: string;
    specs?: string;
    warnings?: string;
    simulatedResult?: string;
  };
}

export interface QAAuditResult {
  overallFidelityScore: number; // e.g. 99.4%
  textFlowFidelityPct: number;
  typographyMatchPct: number;
  tableAlignmentPct: number;
  overflowRiskScore: number; // lower is better
  passedChecks: number;
  totalChecks: number;
  anomalies: string[];
}
