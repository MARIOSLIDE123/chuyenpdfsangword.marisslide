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

export async function generateDocxBlob(
  docReport: DocumentAnalysisReport,
  mode: DocxExportMode = 'standard'
): Promise<Blob> {
  const sections = docReport.pages.map((page) => {
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
              alignment: AlignmentType.RIGHT,
              style: 'Header'
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
    page.textBlocks.forEach((tb) => {
      let headingLevel: (typeof HeadingLevel)[keyof typeof HeadingLevel] | undefined;
      if (tb.type === 'title') {
        headingLevel = HeadingLevel.TITLE;
      } else if (tb.type === 'heading1') {
        headingLevel = HeadingLevel.HEADING_1;
      } else if (tb.type === 'heading2') {
        headingLevel = HeadingLevel.HEADING_2;
      }

      children.push(
        new Paragraph({
          heading: headingLevel,
          spacing: {
            before: tb.type === 'title' ? 240 : tb.type === 'heading1' ? 200 : 120,
            after: docReport.layoutSpecs.paragraphSpacingAfterPt * 20, // convert pt to twips
            line: Math.round(tb.fontMetric.lineHeightRatio * 240)
          },
          alignment: tb.type === 'title' ? AlignmentType.CENTER : AlignmentType.LEFT,
          children: [
            new TextRun({
              text: tb.text,
              font: tb.fontMetric.recommendedWordFont || 'Times New Roman',
              size: Math.round(tb.fontMetric.fontSizePt * 2),
              bold: tb.fontMetric.weight === 'bold' || tb.fontMetric.weight === '600' || tb.fontMetric.weight === '800',
              italics: tb.fontMetric.isItalic
            })
          ]
        })
      );
    });

    // Render Tables
    page.tables.forEach((tbl) => {
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

      const rowMap: { [rowIndex: number]: typeof tbl.cells } = {};
      tbl.cells.forEach((cell) => {
        if (!rowMap[cell.row]) rowMap[cell.row] = [];
        rowMap[cell.row].push(cell);
      });

      const tableRows: TableRow[] = [];
      const rowIndices = Object.keys(rowMap)
        .map(Number)
        .sort((a, b) => a - b);

      rowIndices.forEach((rIdx) => {
        const cellsInRow = rowMap[rIdx].sort((a, b) => a.col - b.col);
        const docxCells = cellsInRow.map((c) => {
          let align: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.LEFT;
          if (c.align === 'center') align = AlignmentType.CENTER;
          if (c.align === 'right') align = AlignmentType.RIGHT;

          return new TableCell({
            columnSpan: c.colSpan || 1,
            rowSpan: c.rowSpan || 1,
            shading: c.bgColor
              ? {
                  fill: c.bgColor.replace('#', ''),
                  type: ShadingType.CLEAR,
                  color: 'auto'
                }
              : undefined,
            width: {
              size: Math.floor(100 / tbl.colsCount) * (c.colSpan || 1),
              type: WidthType.PERCENTAGE
            },
            children: [
              new Paragraph({
                alignment: align,
                spacing: { before: 60, after: 60 },
                children: [
                  new TextRun({
                    text: c.text,
                    bold: c.isHeader,
                    color: c.isHeader && c.bgColor?.toLowerCase().includes('0f172a') ? 'FFFFFF' : '000000',
                    font: 'Arial',
                    size: c.isHeader ? 22 : 20
                  })
                ]
              })
            ]
          });
        });

        tableRows.push(
          new TableRow({
            children: docxCells
          })
        );
      });

      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: Math.round(tbl.borderWidthPt * 8), color: tbl.borderColor.replace('#', '') },
            bottom: { style: BorderStyle.SINGLE, size: Math.round(tbl.borderWidthPt * 8), color: tbl.borderColor.replace('#', '') },
            left: { style: BorderStyle.SINGLE, size: Math.round(tbl.borderWidthPt * 8), color: tbl.borderColor.replace('#', '') },
            right: { style: BorderStyle.SINGLE, size: Math.round(tbl.borderWidthPt * 8), color: tbl.borderColor.replace('#', '') },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
            insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' }
          },
          rows: tableRows
        })
      );
    });

    return {
      properties: {
        page: {
          margin: {
            top: Math.round((page.marginTopMm / 25.4) * 1440),
            bottom: Math.round((page.marginBottomMm / 25.4) * 1440),
            left: Math.round((page.marginLeftMm / 25.4) * 1440),
            right: Math.round((page.marginRightMm / 25.4) * 1440)
          }
        }
      },
      headers: pageHeader ? { default: pageHeader } : undefined,
      footers: pageFooter ? { default: pageFooter } : undefined,
      children
    };
  });

  const doc = new Document({
    creator: 'Senior Document Architect (Pixel-Perfect OCR Engine)',
    title: docReport.documentName,
    description: `Reconstructed Word Document (${mode})`,
    sections
  });

  return await Packer.toBlob(doc);
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
