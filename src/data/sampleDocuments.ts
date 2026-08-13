import { DocumentAnalysisReport } from '../types';

export const INITIAL_EMPTY_DOCUMENT: DocumentAnalysisReport = {
  documentName: 'Tep_Cua_Ban.pdf',
  pageCount: 1,
  complexityScore: 1.0,
  textDensityPct: 50,
  tableCount: 0,
  imageCount: 0,
  vectorGraphicCount: 0,
  fontCount: 1,
  layerBreakdown: {
    textLayerPct: 100,
    imageLayerPct: 0,
    vectorLayerPct: 0,
    logicalStructureScore: 10.0
  },
  typographySpecs: [
    {
      detectedFont: 'Times New Roman',
      recommendedWordFont: 'Times New Roman',
      fontSizePt: 14,
      weight: 'bold',
      isItalic: false,
      letterSpacingPt: 0,
      lineHeightRatio: 1.15,
      metricCompatibilityScore: 100,
      sampleText: 'Chào mừng bạn đến với Ứng Dụng Chuyển PDF Sang Word 1:1'
    }
  ],
  layoutSpecs: {
    pageMargins: { top: 20, bottom: 20, left: 20, right: 20 },
    lineSpacing: '1.15',
    paragraphSpacingAfterPt: 6,
    columnLayout: 'Single Column',
    positioningStrategy: 'Natural Text Flow (Recommended)'
  },
  warnings: [],
  conversionStrategy: [
    'Tải tệp PDF hoặc Ảnh tài liệu của bạn lên ứng dụng',
    'Hệ thống AI Gemini sẽ trích xuất văn bản & cấu trúc bảng biểu',
    'Xem so sánh song song và tải tệp .docx chuẩn 1:1'
  ],
  pages: [
    {
      pageNumber: 1,
      widthMm: 210,
      heightMm: 297,
      marginTopMm: 20,
      marginBottomMm: 20,
      marginLeftMm: 20,
      marginRightMm: 20,
      columns: 1,
      hasPageNumbers: false,
      textBlocks: [
        {
          id: 'welcome-title',
          text: 'VUI LÒNG TẢI LÊN TỆP PDF CỦA BẠN ĐỂ BẮT ĐẦU CHUYỂN ĐỔI SANG WORD 1:1',
          type: 'title',
          flowType: 'inline',
          fontMetric: {
            detectedFont: 'Times New Roman',
            recommendedWordFont: 'Times New Roman',
            fontSizePt: 16,
            weight: 'bold',
            isItalic: false,
            letterSpacingPt: 0,
            lineHeightRatio: 1.2,
            metricCompatibilityScore: 100,
            sampleText: 'VUI LÒNG TẢI LÊN TỆP PDF CỦA BẠN'
          },
          bbox: { x: 5, y: 5, width: 90, height: 10 }
        },
        {
          id: 'welcome-desc',
          text: 'Nhấn vào nút "Tải File PDF / Ảnh" ở góc trên hoặc thanh công cụ để tải tài liệu cần phân tích và chuyển đổi.',
          type: 'body',
          flowType: 'inline',
          fontMetric: {
            detectedFont: 'Arial',
            recommendedWordFont: 'Arial',
            fontSizePt: 12,
            weight: 'normal',
            isItalic: false,
            letterSpacingPt: 0,
            lineHeightRatio: 1.15,
            metricCompatibilityScore: 98,
            sampleText: 'Nhấn vào nút Tải File PDF'
          },
          bbox: { x: 5, y: 18, width: 90, height: 10 }
        }
      ],
      tables: [],
      images: []
    }
  ]
};

export const SAMPLE_DOCUMENTS: DocumentAnalysisReport[] = [];
