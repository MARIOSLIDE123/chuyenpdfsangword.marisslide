import { DocumentAnalysisReport } from '../types';

export const SAMPLE_DOCUMENTS: DocumentAnalysisReport[] = [
  {
    documentName: 'Bao_Cao_Ky_Thuat_AeroSpace_2026.pdf',
    pageCount: 2,
    complexityScore: 8.9,
    textDensityPct: 78,
    tableCount: 2,
    imageCount: 3,
    vectorGraphicCount: 4,
    fontCount: 4,
    layerBreakdown: {
      textLayerPct: 65,
      imageLayerPct: 15,
      vectorLayerPct: 15,
      logicalStructureScore: 92
    },
    typographySpecs: [
      {
        detectedFont: 'Helvetica-Bold',
        recommendedWordFont: 'Arial',
        fontSizePt: 22,
        weight: 'bold',
        isItalic: false,
        letterSpacingPt: 0.2,
        lineHeightRatio: 1.2,
        metricCompatibilityScore: 99.1,
        sampleText: 'BÁO CÁO KỸ THUẬT: CẤU TRÚC ĐỘNG CƠ TÊN LỬA AI-3000'
      },
      {
        detectedFont: 'TimesNewRomanPS-MT',
        recommendedWordFont: 'Times New Roman',
        fontSizePt: 11,
        weight: 'normal',
        isItalic: false,
        letterSpacingPt: 0,
        lineHeightRatio: 1.35,
        metricCompatibilityScore: 100.0,
        sampleText: 'Hệ thống đẩy kết hợp buồng đốt áp suất cao với hợp kim Titan-Bụi Niobi chịu nhiệt tới 3,200 độ C.'
      },
      {
        detectedFont: 'Courier-Oblique',
        recommendedWordFont: 'Consolas',
        fontSizePt: 9.5,
        weight: 'normal',
        isItalic: true,
        letterSpacingPt: -0.1,
        lineHeightRatio: 1.15,
        metricCompatibilityScore: 97.4,
        sampleText: 'Telemetry_Data = [0x4F, 0x99, 0x1A] // Raw Sensor Vector'
      }
    ],
    layoutSpecs: {
      pageMargins: { top: 25.4, bottom: 25.4, left: 31.8, right: 31.8 },
      lineSpacing: '1.25x Multiple',
      paragraphSpacingAfterPt: 6,
      columnLayout: 'Dual-Column Grid (50:50) with 6mm Gutter',
      positioningStrategy: 'Natural Text Flow (Recommended)'
    },
    warnings: [
      {
        severity: 'medium',
        title: 'Cột chữ kép kép dòng (Dual-Column Flow Overflow)',
        description: 'Văn bản cột trái có nguy cơ tràn sang trang 2 nếu giữ nguyên font Helvetica 12pt không map chuẩn.',
        mitigation: 'Sử dụng font Arial với tỉ lệ kerning -0.1pt và khung lề 31.8mm để khớp dòng tuyệt đối.'
      },
      {
        severity: 'low',
        title: 'Sơ đồ Vector Buồng Đốt (Vector Graphics Mapping)',
        description: 'Hình ảnh sơ đồ chứa các đường kích thước vector mảnh (0.5pt).',
        mitigation: 'Nhúng dưới dạng tệp SVG / Vector Shape trong Word để không bị mờ nhòe khi phóng to 300%.'
      }
    ],
    conversionStrategy: [
      'Trích xuất lớp văn bản OCR chính xác 100% với font mapping Times New Roman và Arial.',
      'Tái dựng bố cục 2 cột bằng tính năng Cột văn bản tự nhiên (Native Columns) trong Word thay vì dùng Text Box cố định.',
      'Khôi phục 2 bảng thông số kỹ thuật với độ rộng ô tỉ lệ tuyệt đối %, gộp dòng (Rowspan) cho ô Tiêu đề.',
      'Sử dụng thuật toán Flow Anchor để giữ hình ảnh đồ thị nằm sát đằng sau đoạn văn bản mô tả.'
    ],
    pages: [
      {
        pageNumber: 1,
        widthMm: 210,
        heightMm: 297,
        marginTopMm: 25.4,
        marginBottomMm: 25.4,
        marginLeftMm: 31.8,
        marginRightMm: 31.8,
        columns: 2,
        headerText: 'DỰ ÁN AEROSIM 2026 | BÁO CÁO MÔ PHỎNG VẬT LIỆU',
        footerText: 'Trang 1 / 2 - Bảo mật Cấp độ 3',
        hasPageNumbers: true,
        textBlocks: [
          {
            id: 'tb-1',
            text: 'BÁO CÁO KỸ THUẬT: MÔ PHỎNG ĐỘNG CƠ AI-3000',
            fontMetric: {
              detectedFont: 'Helvetica-Bold',
              recommendedWordFont: 'Arial',
              fontSizePt: 20,
              weight: 'bold',
              isItalic: false,
              letterSpacingPt: 0.2,
              lineHeightRatio: 1.2,
              metricCompatibilityScore: 99.1,
              sampleText: 'BÁO CÁO KỸ THUẬT'
            },
            bbox: { x: 5, y: 5, width: 90, height: 8 },
            type: 'title',
            flowType: 'inline'
          },
          {
            id: 'tb-2',
            text: '1. Tổng quan về vật liệu chịu nhiệt buồng đốt',
            fontMetric: {
              detectedFont: 'Helvetica-Bold',
              recommendedWordFont: 'Arial',
              fontSizePt: 13,
              weight: 'bold',
              isItalic: false,
              letterSpacingPt: 0,
              lineHeightRatio: 1.25,
              metricCompatibilityScore: 98.5,
              sampleText: '1. Tổng quan...'
            },
            bbox: { x: 5, y: 15, width: 42, height: 5 },
            type: 'heading1',
            flowType: 'inline',
            columnGroup: 1
          },
          {
            id: 'tb-3',
            text: 'Trong thiết kế động cơ tên lửa đẩy tầng đầu tiên, lực đẩy sinh ra từ sự giãn nở của khí cháy đạt nhiệt độ đỉnh 3,450K. Vật liệu chế tạo vỏ buồng đốt yêu cầu hệ số dẫn nhiệt cực cao để tránh hiện tượng nổ cục bộ.',
            fontMetric: {
              detectedFont: 'TimesNewRomanPS-MT',
              recommendedWordFont: 'Times New Roman',
              fontSizePt: 11,
              weight: 'normal',
              isItalic: false,
              letterSpacingPt: 0,
              lineHeightRatio: 1.35,
              metricCompatibilityScore: 100,
              sampleText: 'Trong thiết kế...'
            },
            bbox: { x: 5, y: 21, width: 42, height: 18 },
            type: 'body',
            flowType: 'inline',
            columnGroup: 1
          },
          {
            id: 'tb-4',
            text: '2. Phân tích áp suất và gia tốc dòng chảy',
            fontMetric: {
              detectedFont: 'Helvetica-Bold',
              recommendedWordFont: 'Arial',
              fontSizePt: 13,
              weight: 'bold',
              isItalic: false,
              letterSpacingPt: 0,
              lineHeightRatio: 1.25,
              metricCompatibilityScore: 98.5,
              sampleText: '2. Phân tích...'
            },
            bbox: { x: 52, y: 15, width: 43, height: 5 },
            type: 'heading1',
            flowType: 'inline',
            columnGroup: 2
          },
          {
            id: 'tb-5',
            text: 'Các phương trình Navier-Stokes giải mã bằng phương pháp phân tích phần tử hữu hạn (FEA) cho thấy áp suất va đập tại cổ loa phụt đạt 18.4 MPa. Sự biến dạng dẻo nằm trong giới hạn cho phép 0.02%.',
            fontMetric: {
              detectedFont: 'TimesNewRomanPS-MT',
              recommendedWordFont: 'Times New Roman',
              fontSizePt: 11,
              weight: 'normal',
              isItalic: false,
              letterSpacingPt: 0,
              lineHeightRatio: 1.35,
              metricCompatibilityScore: 100,
              sampleText: 'Các phương trình...'
            },
            bbox: { x: 52, y: 21, width: 43, height: 18 },
            type: 'body',
            flowType: 'inline',
            columnGroup: 2
          }
        ],
        tables: [
          {
            id: 'tbl-1',
            rowsCount: 4,
            colsCount: 4,
            borderColor: '#334155',
            borderWidthPt: 0.75,
            hasMergedCells: true,
            caption: 'Bảng 1: Bảng so sánh đặc tính cơ học vật liệu siêu hợp kim',
            cells: [
              { row: 0, col: 0, colSpan: 4, text: 'THÔNG SỐ VẬT LIỆU CHỊU NHIỆT (TEST 2026)', isHeader: true, bgColor: '#1e293b' },
              { row: 1, col: 0, text: 'Loại Vật Liệu', isHeader: true, bgColor: '#334155' },
              { row: 1, col: 1, text: 'Điểm Chảy (K)', isHeader: true, bgColor: '#334155' },
              { row: 1, col: 2, text: 'Độ Bền Kéo (MPa)', isHeader: true, bgColor: '#334155' },
              { row: 1, col: 3, text: 'Trọng Lượng (g/cm³)', isHeader: true, bgColor: '#334155' },
              { row: 2, col: 0, text: 'Titan Cargon-Niobi' },
              { row: 2, col: 1, text: '3,450 K' },
              { row: 2, col: 2, text: '1,250 MPa' },
              { row: 2, col: 3, text: '4.51' },
              { row: 3, col: 0, text: 'Inconel 718-Pro' },
              { row: 3, col: 1, text: '1,600 K' },
              { row: 3, col: 2, text: '1,100 MPa' },
              { row: 3, col: 3, text: '8.19' }
            ]
          }
        ],
        images: [
          {
            id: 'img-1',
            bbox: { x: 5, y: 55, width: 90, height: 32 },
            caption: 'Hình 1: Mô hình lưới vector 3D phân bố ứng suất buồng đốt tên lửa',
            isVector: true,
            resolutionDpi: 600
          }
        ]
      },
      {
        pageNumber: 2,
        widthMm: 210,
        heightMm: 297,
        marginTopMm: 25.4,
        marginBottomMm: 25.4,
        marginLeftMm: 31.8,
        marginRightMm: 31.8,
        columns: 1,
        headerText: 'DỰ ÁN AEROSIM 2026 | BÁO CÁO MÔ PHỎNG VẬT LIỆU',
        footerText: 'Trang 2 / 2 - Bảo mật Cấp độ 3',
        hasPageNumbers: true,
        textBlocks: [
          {
            id: 'tb-6',
            text: '3. Kết luận và đề xuất sản xuất thử nghiệm',
            fontMetric: {
              detectedFont: 'Helvetica-Bold',
              recommendedWordFont: 'Arial',
              fontSizePt: 13,
              weight: 'bold',
              isItalic: false,
              letterSpacingPt: 0,
              lineHeightRatio: 1.25,
              metricCompatibilityScore: 98.5,
              sampleText: '3. Kết luận...'
            },
            bbox: { x: 5, y: 5, width: 90, height: 6 },
            type: 'heading1',
            flowType: 'inline'
          },
          {
            id: 'tb-7',
            text: 'Dựa trên dữ liệu mô phỏng, phương án hợp kim Titan Cargon-Niobi đem lại hiệu năng vượt trội 35% so với phương án truyền thống. Quy trình in 3D laser kim loại SLM được kiến nghị ứng dụng cho đợt chế tạo nguyên mẫu tháng 9/2026.',
            fontMetric: {
              detectedFont: 'TimesNewRomanPS-MT',
              recommendedWordFont: 'Times New Roman',
              fontSizePt: 11,
              weight: 'normal',
              isItalic: false,
              letterSpacingPt: 0,
              lineHeightRatio: 1.35,
              metricCompatibilityScore: 100,
              sampleText: 'Dựa trên dữ liệu...'
            },
            bbox: { x: 5, y: 13, width: 90, height: 15 },
            type: 'body',
            flowType: 'inline'
          }
        ],
        tables: [],
        images: []
      }
    ]
  },
  {
    documentName: 'Bao_Cao_Tai_Chinh_Q2_2026.pdf',
    pageCount: 1,
    complexityScore: 9.4,
    textDensityPct: 88,
    tableCount: 3,
    imageCount: 1,
    vectorGraphicCount: 2,
    fontCount: 3,
    layerBreakdown: {
      textLayerPct: 82,
      imageLayerPct: 3,
      vectorLayerPct: 10,
      logicalStructureScore: 96
    },
    typographySpecs: [
      {
        detectedFont: 'Calibri-Bold',
        recommendedWordFont: 'Calibri',
        fontSizePt: 18,
        weight: 'bold',
        isItalic: false,
        letterSpacingPt: 0,
        lineHeightRatio: 1.2,
        metricCompatibilityScore: 100,
        sampleText: 'BÁO CÁO TÀI CHÍNH HỢP NHẤT QÚA 2 - 2026'
      },
      {
        detectedFont: 'Calibri',
        recommendedWordFont: 'Calibri',
        fontSizePt: 10,
        weight: 'normal',
        isItalic: false,
        letterSpacingPt: 0,
        lineHeightRatio: 1.15,
        metricCompatibilityScore: 100,
        sampleText: 'Đơn vị tính: Triệu Việt Nam Đồng (VND)'
      }
    ],
    layoutSpecs: {
      pageMargins: { top: 20, bottom: 20, left: 20, right: 20 },
      lineSpacing: '1.15x Single',
      paragraphSpacingAfterPt: 4,
      columnLayout: 'Full Width Financial Table Layout',
      positioningStrategy: 'Natural Text Flow (Recommended)'
    },
    warnings: [
      {
        severity: 'high',
        title: 'Căn lề số tiền tài chính (Financial Number Alignment)',
        description: 'Các con số âm nằm trong ngoặc ngoặc tròn (1,250,000) yêu cầu căn lề phải chuẩn xác 100%.',
        mitigation: 'Tự động áp dụng tab căn lề phải (Right-Aligned Tab Stops) và định dạng ô số tài chính trong Word.'
      }
    ],
    conversionStrategy: [
      'Phân tích cấu trúc bảng tài chính đa tầng với tiêu đề gộp ô 3 cấp.',
      'Sử dụng định dạng font Calibri tương thích tuyệt đối giữa PDF và Word .docx.',
      'Đảm bảo viền bảng mảnh 0.5pt chuẩn màu xám ngân hàng #94a3b8.',
      'Khôi phục công thức tổng (Totals) dưới dạng hàng in đậm với đường kẻ đôi ở đáy bảng (Double Bottom Border).'
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
        headerText: 'CÔNG TY CỔ PHẦN TẬP ĐOÀN CÔNG NGHỆ GLOBAL | TÀI CHÍNH Q2',
        footerText: 'Đã kiểm toán độc lập theo chuẩn mực VAS & IFRS',
        hasPageNumbers: true,
        textBlocks: [
          {
            id: 'fin-1',
            text: 'BẢNG CÂN ĐỐI KẾ TOÁN HỢP NHẤT Q2 / 2026',
            fontMetric: {
              detectedFont: 'Calibri-Bold',
              recommendedWordFont: 'Calibri',
              fontSizePt: 18,
              weight: 'bold',
              isItalic: false,
              letterSpacingPt: 0,
              lineHeightRatio: 1.2,
              metricCompatibilityScore: 100,
              sampleText: 'BẢNG CÂN ĐỐI...'
            },
            bbox: { x: 5, y: 5, width: 90, height: 6 },
            type: 'title',
            flowType: 'inline'
          },
          {
            id: 'fin-2',
            text: 'Tại ngày 30 tháng 06 năm 2026 | Đơn vị tính: VNĐ',
            fontMetric: {
              detectedFont: 'Calibri-Italic',
              recommendedWordFont: 'Calibri',
              fontSizePt: 10,
              weight: 'normal',
              isItalic: true,
              letterSpacingPt: 0,
              lineHeightRatio: 1.15,
              metricCompatibilityScore: 100,
              sampleText: 'Tại ngày 30...'
            },
            bbox: { x: 5, y: 12, width: 90, height: 4 },
            type: 'caption',
            flowType: 'inline'
          }
        ],
        tables: [
          {
            id: 'fin-tbl-1',
            rowsCount: 6,
            colsCount: 4,
            borderColor: '#64748b',
            borderWidthPt: 0.5,
            hasMergedCells: true,
            caption: 'Bảng 1. Tài sản ngắn hạn & Tài sản dài hạn',
            cells: [
              { row: 0, col: 0, text: 'TÀI SẢN', isHeader: true, bgColor: '#0f172a' },
              { row: 0, col: 1, text: 'MÃ SỐ', isHeader: true, bgColor: '#0f172a' },
              { row: 0, col: 2, text: '30/06/2026 (VNĐ)', isHeader: true, bgColor: '#0f172a' },
              { row: 0, col: 3, text: '01/01/2026 (VNĐ)', isHeader: true, bgColor: '#0f172a' },
              { row: 1, col: 0, text: 'A. TÀI SẢN NGẮN HẠN', isHeader: false, bgColor: '#f1f5f9' },
              { row: 1, col: 1, text: '100' },
              { row: 1, col: 2, text: '854,230,000,000', align: 'right' },
              { row: 1, col: 3, text: '720,100,000,000', align: 'right' },
              { row: 2, col: 0, text: 'I. Tiền và các khoản tương đương tiền' },
              { row: 2, col: 1, text: '110' },
              { row: 2, col: 2, text: '310,500,000,000', align: 'right' },
              { row: 2, col: 3, text: '240,000,000,000', align: 'right' },
              { row: 3, col: 0, text: 'II. Đầu tư tài chính ngắn hạn' },
              { row: 3, col: 1, text: '120' },
              { row: 3, col: 2, text: '180,000,000,000', align: 'right' },
              { row: 3, col: 3, text: '150,000,000,000', align: 'right' },
              { row: 4, col: 0, text: 'III. Các khoản phải thu ngắn hạn' },
              { row: 4, col: 1, text: '130' },
              { row: 4, col: 2, text: '263,730,000,000', align: 'right' },
              { row: 4, col: 3, text: '230,100,000,000', align: 'right' },
              { row: 5, col: 0, text: 'TỔNG CỘNG TÀI SẢN (100 + 200)', isHeader: true, bgColor: '#e2e8f0' },
              { row: 5, col: 1, text: '270', isHeader: true, bgColor: '#e2e8f0' },
              { row: 5, col: 2, text: '1,420,850,000,000', isHeader: true, align: 'right', bgColor: '#e2e8f0' },
              { row: 5, col: 3, text: '1,210,000,000,000', isHeader: true, align: 'right', bgColor: '#e2e8f0' }
            ]
          }
        ],
        images: []
      }
    ]
  },
  {
    documentName: 'Tap_Chi_Cong_Nghe_Ban_Dan_2026.pdf',
    pageCount: 1,
    complexityScore: 9.1,
    textDensityPct: 70,
    tableCount: 1,
    imageCount: 2,
    vectorGraphicCount: 3,
    fontCount: 5,
    layerBreakdown: {
      textLayerPct: 60,
      imageLayerPct: 25,
      vectorLayerPct: 15,
      logicalStructureScore: 89
    },
    typographySpecs: [
      {
        detectedFont: 'PlayfairDisplay-Bold',
        recommendedWordFont: 'Georgia',
        fontSizePt: 28,
        weight: 'bold',
        isItalic: false,
        letterSpacingPt: 0.5,
        lineHeightRatio: 1.1,
        metricCompatibilityScore: 96.5,
        sampleText: 'KỶ NGUYÊN CHIP 2NM: BƯỚC NGOẶT LỚN CỦA TRÍ TUỆ NHÂN TẠO'
      },
      {
        detectedFont: 'Garamond-Regular',
        recommendedWordFont: 'Garamond',
        fontSizePt: 11.5,
        weight: 'normal',
        isItalic: false,
        letterSpacingPt: 0,
        lineHeightRatio: 1.4,
        metricCompatibilityScore: 100,
        sampleText: 'Công nghệ quang khắc tia cực tím cực ngắn (EUV) thứ ba đã đưa quy mô bóng bán dẫn...'
      }
    ],
    layoutSpecs: {
      pageMargins: { top: 15, bottom: 15, left: 18, right: 18 },
      lineSpacing: '1.3x Expanded',
      paragraphSpacingAfterPt: 8,
      columnLayout: 'Magazine 3-Column Editorial Grid',
      positioningStrategy: 'Smart Anchored Text Boxes'
    },
    warnings: [
      {
        severity: 'medium',
        title: 'Chữ hoa thả lề (Drop Cap) & Khung ảnh bao quanh (Text Wrapping)',
        description: 'Chữ cái đầu tiên "C" tạo Drop Cap kích thước 36pt và văn bản uốn quanh ảnh minh họa.',
        mitigation: 'Sử dụng khung Drop Cap của Word và thiết lập tính năng Tight Text Wrap quanh hình ảnh.'
      }
    ],
    conversionStrategy: [
      'Khôi phục tiêu đề phong cách tạp chí cao cấp với font Georgia / Playfair Display.',
      'Thiết lập bố cục 3 cột editorial tự nhiên.',
      'Cấu hình ảnh minh họa Silicon Wafer chèn dán dạng Square Text Wrapping.'
    ],
    pages: [
      {
        pageNumber: 1,
        widthMm: 210,
        heightMm: 297,
        marginTopMm: 15,
        marginBottomMm: 15,
        marginLeftMm: 18,
        marginRightMm: 18,
        columns: 3,
        headerText: 'CHUYÊN ĐỀ TẠP CHÍ BÁN DẪN VIỆT NAM - SỐ THÁNG 8/2026',
        footerText: 'Tạp chí Khoa học & Công nghệ Quốc gia',
        hasPageNumbers: true,
        textBlocks: [
          {
            id: 'mag-1',
            text: 'KỶ NGUYÊN CHIP 2NM: BƯỚC NGOẶT AI',
            fontMetric: {
              detectedFont: 'PlayfairDisplay-Bold',
              recommendedWordFont: 'Georgia',
              fontSizePt: 24,
              weight: 'bold',
              isItalic: false,
              letterSpacingPt: 0.5,
              lineHeightRatio: 1.1,
              metricCompatibilityScore: 96.5,
              sampleText: 'KỶ NGUYÊN CHIP...'
            },
            bbox: { x: 5, y: 5, width: 90, height: 8 },
            type: 'title',
            flowType: 'inline'
          },
          {
            id: 'mag-2',
            text: 'Công nghệ chip 2nm sử dụng cấu trúc Gate-All-Around (GAAFET) chính thức bước vào giai đoạn sản xuất thương mại hàng loạt. Điều này mở ra kỷ nguyên tính toán năng lượng thấp cho các trung tâm dữ liệu AI cực lớn.',
            fontMetric: {
              detectedFont: 'Garamond-Regular',
              recommendedWordFont: 'Garamond',
              fontSizePt: 11,
              weight: 'normal',
              isItalic: false,
              letterSpacingPt: 0,
              lineHeightRatio: 1.4,
              metricCompatibilityScore: 100,
              sampleText: 'Công nghệ chip...'
            },
            bbox: { x: 5, y: 16, width: 28, height: 40 },
            type: 'body',
            flowType: 'inline',
            columnGroup: 1
          },
          {
            id: 'mag-3',
            text: 'Nhờ vào bóng bán dẫn NanoSheet xếp chồng theo chiều dọc, mật độ bóng bán dẫn tăng 45% trong khi điện năng tiêu thụ giảm 30% so với tiến trình 3nm FinFET trước đó.',
            fontMetric: {
              detectedFont: 'Garamond-Regular',
              recommendedWordFont: 'Garamond',
              fontSizePt: 11,
              weight: 'normal',
              isItalic: false,
              letterSpacingPt: 0,
              lineHeightRatio: 1.4,
              metricCompatibilityScore: 100,
              sampleText: 'Nhờ vào bóng...'
            },
            bbox: { x: 36, y: 16, width: 28, height: 40 },
            type: 'body',
            flowType: 'inline',
            columnGroup: 2
          },
          {
            id: 'mag-4',
            text: 'Việt Nam hiện nắm giữ vai trò chiến lược trong khâu kiểm thử và đóng gói chip tiên tiến (Advanced Packaging), thu hút hàng tỷ USD đầu tư từ các tập đoàn toàn cầu.',
            fontMetric: {
              detectedFont: 'Garamond-Regular',
              recommendedWordFont: 'Garamond',
              fontSizePt: 11,
              weight: 'normal',
              isItalic: false,
              letterSpacingPt: 0,
              lineHeightRatio: 1.4,
              metricCompatibilityScore: 100,
              sampleText: 'Việt Nam hiện...'
            },
            bbox: { x: 67, y: 16, width: 28, height: 40 },
            type: 'body',
            flowType: 'inline',
            columnGroup: 3
          }
        ],
        tables: [],
        images: [
          {
            id: 'mag-img-1',
            bbox: { x: 5, y: 60, width: 90, height: 30 },
            caption: 'Hình 1: Đĩa Silicon Wafer 300mm chế tạo tại nhà máy bán dẫn siêu sạch',
            isVector: false,
            resolutionDpi: 300
          }
        ]
      }
    ]
  }
];
