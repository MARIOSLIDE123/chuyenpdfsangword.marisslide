import { DocumentAnalysisReport } from '../types';

/**
 * Generates an educational slide presentation HTML / PPTX-compatible file from DocumentAnalysisReport.
 * Creates clean PowerPoint slides for teachers with Title slide, Overview, Section Slides, and Tables.
 */
export async function generatePptxBlob(report: DocumentAnalysisReport): Promise<Blob> {
  const slidePages = report.pages.map((page, pIdx) => {
    const textBullets = page.textBlocks
      .map(tb => `<li style="margin-bottom: 10px; font-size: 18px; color: #334155;">${tb.text}</li>`)
      .join('');

    const tableMarkup = page.tables
      .map(tbl => {
        const rows = tbl.cells.map(c => `
          <td style="border: 1px solid #cbd5e1; padding: 8px; background: ${c.bgColor || '#ffffff'}; font-size: 14px; font-weight: ${c.isHeader ? 'bold' : 'normal'};">
            ${c.text}
          </td>
        `).join('');
        return `<table style="width: 100%; border-collapse: collapse; margin-top: 15px;"><tr>${rows}</tr></table>`;
      })
      .join('');

    return `
      <section style="page-break-after: always; padding: 40px; background: #ffffff; min-height: 500px; border-radius: 16px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); font-family: Arial, sans-serif;">
        <div style="display: flex; justify-content: space-between; border-b: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #0f172a; font-size: 24px;">Trang ${page.pageNumber}: Bài Giảng Chi Tiết</h2>
          <span style="color: #0284c7; font-weight: bold; font-size: 14px;">${report.documentName}</span>
        </div>
        <ul style="line-height: 1.6; padding-left: 20px;">
          ${textBullets || '<li>Không có khối văn bản nào.</li>'}
        </ul>
        ${tableMarkup}
      </section>
    `;
  }).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${report.documentName} - Bài Giảng PowerPoint</title>
      <style>
        body { background: #f8fafc; font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; margin: 0; }
        .cover { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); color: white; padding: 60px 40px; border-radius: 20px; margin-bottom: 30px; text-align: center; }
        .cover h1 { font-size: 36px; color: #38bdf8; margin-bottom: 10px; }
        .cover p { font-size: 18px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="cover">
        <h1>🎓 ${report.documentName}</h1>
        <p>Bài Giảng PowerPoint Giảng Dạy • Tự Động Tái Tạo Từ File PDF</p>
        <p style="font-size: 14px; opacity: 0.8;">Tổng số trang: ${report.pageCount} | Độ phức tạp: ${report.complexityScore}/10</p>
      </div>
      ${slidePages}
    </body>
    </html>
  `;

  return new Blob([htmlContent], { type: 'application/vnd.ms-powerpoint' });
}

export function downloadPptxFile(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName.endsWith('.ppt') || fileName.endsWith('.pptx') ? fileName : `${fileName}_BaiGiang.ppt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
