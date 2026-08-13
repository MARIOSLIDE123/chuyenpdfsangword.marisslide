import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  Header,
  Footer,
  HeadingLevel,
  AlignmentType,
  ShadingType
} from 'docx';
import { DocumentAnalysisReport } from '../types';

export type DocxExportMode = 'standard' | 'student_exam' | 'teacher_key';

function sanitizeHexColor(colorStr?: string, defaultHex: string = 'FFFFFF'): string {
  if (!colorStr) return defaultHex;
  const clean = colorStr.replace('#', '').trim();
  if (/^[0-9A-Fa-f]{6}$/.test(clean)) return clean;
  if (/^[0-9A-Fa-f]{3}$/.test(clean)) return clean.split('').map(c => c + c).join('');
  return defaultHex;
}

export async function generateDocxBlob(
  docReport: DocumentAnalysisReport,
  mode: DocxExportMode = 'standard'
): Promise<Blob> {
  try {
    const pages = Array.isArray(docReport?.pages) && docReport.pages.length > 0
      ? docReport.pages
      : [
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
                id: 'tb-default',
                text: 'Nội dung tài liệu đã được trích xuất.',
                type: 'body' as const,
                flowType: 'inline' as const,
                fontMetric: {
                  detectedFont: 'Arial',
                  recommendedWordFont: 'Times New Roman',
                  fontSizePt: 12,
                  weight: 'normal' as const,
                  isItalic: false,
                  letterSpacingPt: 0,
                  lineHeightRatio: 1.15,
                  metricCompatibilityScore: 98,
                  sampleText: 'Nội dung tài liệu'
                },
                bbox: { x: 0, y: 0, width: 100, height: 10 }
              }
            ],
            tables: [],
            images: []
          }
        ];

    const sections = pages.map((page) => {
      const children: (Paragraph | Table)[] = [];

      // Mode Title Banner
      if (mode === 'student_exam') {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 200 },
            children: [
              new TextRun({
                text: 'ĐỀ THI VÀ BÀI TẬP (DÀNH CHO HỌC SINH)',
                bold: true,
                size: 28,
                font: 'Times New Roman',
                color: '1E3A8A'
              })
            ]
          })
        );
      } else if (mode === 'teacher_key') {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 200 },
            children: [
              new TextRun({
                text: 'GIÁO ÁN VÀ ĐÁP ÁN CHI TIẾT (DÀNH CHO GIÁO VIÊN)',
                bold: true,
                size: 28,
                font: 'Times New Roman',
                color: '991B1B'
              })
            ]
          })
        );
      }

      // Header & Footer
      const pageHeader = page.headerText
        ? new Header({
            children: [
              new Paragraph({
                text: mode === 'teacher_key' ? `${page.headerText} - [ĐÁP ÁN GIÁO VIÊN]` : page.headerText,
                alignment: AlignmentType.RIGHT
              })
            ]
          })
        : undefined;

      const pageFooter = page.footerText
        ? new Footer({
            children: [
              new Paragraph({
                text: page.footerText,
                alignment: AlignmentType.CENTER
              })
            ]
          })
        : undefined;

      // Render Text Blocks
      const textBlocks = Array.isArray(page.textBlocks) ? page.textBlocks : [];
      textBlocks.forEach((tb) => {
        let headingLevel: (typeof HeadingLevel)[keyof typeof HeadingLevel] | undefined;
        if (tb.type === 'title') {
          headingLevel = HeadingLevel.TITLE;
        } else if (tb.type === 'heading1') {
          headingLevel = HeadingLevel.HEADING_1;
        } else if (tb.type === 'heading2') {
          headingLevel = HeadingLevel.HEADING_2;
        }

        const fontMetric = tb.fontMetric || {};
        const fontName = fontMetric.recommendedWordFont || 'Times New Roman';
        const fontSizePt = typeof fontMetric.fontSizePt === 'number' && fontMetric.fontSizePt > 0 ? fontMetric.fontSizePt : 12;
        const lineHeightRatio = typeof fontMetric.lineHeightRatio === 'number' && fontMetric.lineHeightRatio > 0 ? fontMetric.lineHeightRatio : 1.15;
        const spacingAfterPt = typeof docReport?.layoutSpecs?.paragraphSpacingAfterPt === 'number' ? docReport.layoutSpecs.paragraphSpacingAfterPt : 6;

        children.push(
          new Paragraph({
            heading: headingLevel,
            spacing: {
              before: tb.type === 'title' ? 240 : tb.type === 'heading1' ? 200 : 120,
              after: Math.round(spacingAfterPt * 20),
              line: Math.round(lineHeightRatio * 240)
            },
            alignment: tb.type === 'title' ? AlignmentType.CENTER : AlignmentType.LEFT,
            children: [
              new TextRun({
                text: tb.text || '',
                font: fontName,
                size: Math.round(fontSizePt * 2),
                bold: fontMetric.weight === 'bold' || fontMetric.weight === '600' || fontMetric.weight === '800',
                italics: Boolean(fontMetric.isItalic)
              })
            ]
          })
        );
      });

      // Render Tables
      const tables = Array.isArray(page.tables) ? page.tables : [];
      tables.forEach((tbl) => {
        if (tbl.caption) {
          children.push(
            new Paragraph({
              spacing: { before: 180, after: 120 },
              children: [
                new TextRun({
                  text: tbl.caption,
                  bold: true,
                  size: 20,
                  font: 'Arial'
                })
              ]
            })
          );
        }

        const cells = Array.isArray(tbl.cells) ? tbl.cells : [];
        const rowMap: { [rowIndex: number]: typeof cells } = {};
        cells.forEach((cell) => {
          const r = typeof cell.row === 'number' ? cell.row : 0;
          if (!rowMap[r]) rowMap[r] = [];
          rowMap[r].push(cell);
        });

        const tableRows: TableRow[] = [];
        const rowIndices = Object.keys(rowMap)
          .map(Number)
          .sort((a, b) => a - b);

        const colsCount = Math.max(1, tbl.colsCount || 1);

        rowIndices.forEach((rIdx) => {
          const cellsInRow = rowMap[rIdx].sort((a, b) => (a.col || 0) - (b.col || 0));
          const docxCells = cellsInRow.map((c) => {
            let align: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.LEFT;
            if (c.align === 'center') align = AlignmentType.CENTER;
            if (c.align === 'right') align = AlignmentType.RIGHT;

            const colSpan = Math.max(1, c.colSpan || 1);
            const rowSpan = Math.max(1, c.rowSpan || 1);
            const bgHex = c.bgColor ? sanitizeHexColor(c.bgColor, 'FFFFFF') : undefined;

            return new TableCell({
              columnSpan: colSpan,
              rowSpan: rowSpan,
              shading: bgHex
                ? {
                    fill: bgHex,
                    type: ShadingType.CLEAR,
                    color: 'auto'
                  }
                : undefined,
              width: {
                size: Math.floor(100 / colsCount) * colSpan,
                type: WidthType.PERCENTAGE
              },
              children: [
                new Paragraph({
                  alignment: align,
                  spacing: { before: 60, after: 60 },
                  children: [
                    new TextRun({
                      text: c.text || '',
                      bold: Boolean(c.isHeader),
                      color: c.isHeader && bgHex && bgHex.toLowerCase().includes('0f172a') ? 'FFFFFF' : '000000',
                      font: 'Arial',
                      size: c.isHeader ? 22 : 20
                    })
                  ]
                })
              ]
            });
          });

          if (docxCells.length > 0) {
            tableRows.push(
              new TableRow({
                children: docxCells
              })
            );
          }
        });

        if (tableRows.length > 0) {
          const borderColorHex = sanitizeHexColor(tbl.borderColor, 'CBD5E1');
          const borderWidth = Math.max(1, Math.round((tbl.borderWidthPt || 1) * 8));

          children.push(
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.SINGLE, size: borderWidth, color: borderColorHex },
                bottom: { style: BorderStyle.SINGLE, size: borderWidth, color: borderColorHex },
                left: { style: BorderStyle.SINGLE, size: borderWidth, color: borderColorHex },
                right: { style: BorderStyle.SINGLE, size: borderWidth, color: borderColorHex },
                insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
                insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' }
              },
              rows: tableRows
            })
          );
        }
      });

      // Ensure section is never empty
      if (children.length === 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Nội dung trang.',
                font: 'Times New Roman',
                size: 24
              })
            ]
          })
        );
      }

      const marginTop = Math.max(100, Math.round(((page.marginTopMm || 20) / 25.4) * 1440));
      const marginBottom = Math.max(100, Math.round(((page.marginBottomMm || 20) / 25.4) * 1440));
      const marginLeft = Math.max(100, Math.round(((page.marginLeftMm || 20) / 25.4) * 1440));
      const marginRight = Math.max(100, Math.round(((page.marginRightMm || 20) / 25.4) * 1440));

      return {
        properties: {
          page: {
            margin: {
              top: marginTop,
              bottom: marginBottom,
              left: marginLeft,
              right: marginRight
            }
          }
        },
        headers: pageHeader ? { default: pageHeader } : undefined,
        footers: pageFooter ? { default: pageFooter } : undefined,
        children
      };
    });

    const docName = docReport?.documentName || 'Document.pdf';

    const doc = new Document({
      creator: 'Senior Document Architect (Pixel-Perfect OCR Engine)',
      title: docName,
      description: `Reconstructed Word Document (${mode})`,
      sections
    });

    return await Packer.toBlob(doc);
  } catch (err: any) {
    console.error('CRITICAL error in generateDocxBlob:', err);
    throw new Error(`Lỗi tạo file Word (.docx): ${err?.message || 'Không thể tạo tệp .docx'}`);
  }
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName.endsWith('.docx') ? fileName : `${fileName}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
