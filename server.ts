import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // Initialize Gemini Client with User-Agent header for telemetry
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Senior Document Architect API' });
  });

  // API 1: Document AI Vision Analysis & Layout Reconstruction
  app.post('/api/gemini/analyze-document', async (req, res) => {
    try {
      const { fileName, fileBase64, mimeType, userApiKey, requestedModel } = req.body;

      const apiKey = userApiKey || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: 'Chưa cấu hình API Key. Vui lòng nhấn vào nút Settings (API Key) trên Header để nhập key của bạn.' });
      }

      const activeClient = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const modelName = requestedModel || 'gemini-3-flash-preview';

      const systemPrompt = `You are a Lead Optical Character Recognition (OCR) Engine & Senior Document Engineer specializing in 100% Full-Text Extraction for Microsoft Word (.docx) reconstruction.

CRITICAL MANDATES FOR COMPLETE EXHAUSTIVE OCR EXTRACTION:
1. EXHAUSTIVE OCR: Extract EVERY SINGLE PAGE, PARAGRAPH, HEADING, SUBHEADING, BULLET POINT, FOOTNOTE, HEADER, FOOTER, CAPTION, AND TABLE CELL from the document.
2. NO SUMMARIZATION OR OMISSION: Do NOT summarize, abbreviate, trim, or skip ANY text. Every word, sentence, and paragraph in the input document MUST be extracted verbatim into "textBlocks" or "tables".
3. COMPLETE TABLE EXTRACTION: Extract ALL rows and ALL columns of every table with exact text in every cell. Do NOT skip any rows or cells.
4. EXACT READING ORDER: Output all text blocks sequentially in exact reading order per page.
5. FONT & FORMATTING ACCURACY: Accurately estimate font sizes, bold weights, italics, and line spacing for pixel-perfect Word conversion.`;

      const contentsParts: any[] = [
        {
          text: `Document Name: ${fileName || 'Document.pdf'}. Perform an EXHAUSTIVE, COMPLETE, 100% FULL-TEXT OCR EXTRACTION on this document. Extract ALL text blocks and ALL table rows/cells verbatim without skipping a single word, sentence, or paragraph.`
        }
      ];

      if (fileBase64 && mimeType) {
        contentsParts.push({
          inlineData: {
            data: fileBase64.replace(/^data:[^;]+;base64,/, ''),
            mimeType: mimeType || 'image/png',
          },
        });
      }

      const response = await activeClient.models.generateContent({
        model: modelName,
        contents: { parts: contentsParts },
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          maxOutputTokens: 8192,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              documentName: { type: Type.STRING },
              pageCount: { type: Type.INTEGER },
              complexityScore: { type: Type.NUMBER },
              textDensityPct: { type: Type.NUMBER },
              tableCount: { type: Type.INTEGER },
              imageCount: { type: Type.INTEGER },
              vectorGraphicCount: { type: Type.INTEGER },
              fontCount: { type: Type.INTEGER },
              layerBreakdown: {
                type: Type.OBJECT,
                properties: {
                  textLayerPct: { type: Type.NUMBER },
                  imageLayerPct: { type: Type.NUMBER },
                  vectorLayerPct: { type: Type.NUMBER },
                  logicalStructureScore: { type: Type.NUMBER },
                },
                required: ['textLayerPct', 'imageLayerPct', 'vectorLayerPct', 'logicalStructureScore'],
              },
              typographySpecs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    detectedFont: { type: Type.STRING },
                    recommendedWordFont: { type: Type.STRING },
                    fontSizePt: { type: Type.NUMBER },
                    weight: { type: Type.STRING },
                    isItalic: { type: Type.BOOLEAN },
                    letterSpacingPt: { type: Type.NUMBER },
                    lineHeightRatio: { type: Type.NUMBER },
                    metricCompatibilityScore: { type: Type.NUMBER },
                    sampleText: { type: Type.STRING },
                  },
                  required: ['detectedFont', 'recommendedWordFont', 'fontSizePt', 'sampleText'],
                },
              },
              layoutSpecs: {
                type: Type.OBJECT,
                properties: {
                  pageMargins: {
                    type: Type.OBJECT,
                    properties: {
                      top: { type: Type.NUMBER },
                      bottom: { type: Type.NUMBER },
                      left: { type: Type.NUMBER },
                      right: { type: Type.NUMBER },
                    },
                  },
                  lineSpacing: { type: Type.STRING },
                  paragraphSpacingAfterPt: { type: Type.NUMBER },
                  columnLayout: { type: Type.STRING },
                  positioningStrategy: { type: Type.STRING },
                },
              },
              warnings: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    severity: { type: Type.STRING },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    mitigation: { type: Type.STRING },
                  },
                },
              },
              conversionStrategy: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              pages: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    pageNumber: { type: Type.INTEGER },
                    widthMm: { type: Type.NUMBER },
                    heightMm: { type: Type.NUMBER },
                    marginTopMm: { type: Type.NUMBER },
                    marginBottomMm: { type: Type.NUMBER },
                    marginLeftMm: { type: Type.NUMBER },
                    marginRightMm: { type: Type.NUMBER },
                    columns: { type: Type.INTEGER },
                    headerText: { type: Type.STRING },
                    footerText: { type: Type.STRING },
                    hasPageNumbers: { type: Type.BOOLEAN },
                    textBlocks: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          text: { type: Type.STRING },
                          type: { type: Type.STRING },
                          flowType: { type: Type.STRING },
                          fontMetric: {
                            type: Type.OBJECT,
                            properties: {
                              detectedFont: { type: Type.STRING },
                              recommendedWordFont: { type: Type.STRING },
                              fontSizePt: { type: Type.NUMBER },
                              weight: { type: Type.STRING },
                              isItalic: { type: Type.BOOLEAN },
                              letterSpacingPt: { type: Type.NUMBER },
                              lineHeightRatio: { type: Type.NUMBER },
                              metricCompatibilityScore: { type: Type.NUMBER },
                              sampleText: { type: Type.STRING },
                            },
                          },
                          bbox: {
                            type: Type.OBJECT,
                            properties: {
                              x: { type: Type.NUMBER },
                              y: { type: Type.NUMBER },
                              width: { type: Type.NUMBER },
                              height: { type: Type.NUMBER },
                            },
                          },
                        },
                      },
                    },
                    tables: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          rowsCount: { type: Type.INTEGER },
                          colsCount: { type: Type.INTEGER },
                          borderColor: { type: Type.STRING },
                          borderWidthPt: { type: Type.NUMBER },
                          hasMergedCells: { type: Type.BOOLEAN },
                          caption: { type: Type.STRING },
                          cells: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                row: { type: Type.INTEGER },
                                col: { type: Type.INTEGER },
                                rowSpan: { type: Type.INTEGER },
                                colSpan: { type: Type.INTEGER },
                                text: { type: Type.STRING },
                                isHeader: { type: Type.BOOLEAN },
                                align: { type: Type.STRING },
                                bgColor: { type: Type.STRING },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      let cleanText = (response.text || '{}').trim();
      cleanText = cleanText.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
      
      let analysisData = {};
      try {
        analysisData = JSON.parse(cleanText);
      } catch (pErr) {
        console.warn('Direct JSON parse failed, trying regex match:', pErr);
        const match = cleanText.match(/\{[\s\S]*\}/);
        if (match) {
          analysisData = JSON.parse(match[0]);
        } else {
          throw new Error('Gemini response could not be parsed as structured JSON.');
        }
      }

      res.json(analysisData);
    } catch (err: any) {
      console.error('Error analyzing document with Gemini:', err);
      res.status(500).json({ error: err.message || 'Failed to analyze document.' });
    }
  });

  // API 2: Architect Chat Consultant (Senior Document Engineering Persona)
  app.post('/api/gemini/architect-chat', async (req, res) => {
    try {
      const { userMessage, documentContext, conversationHistory, userApiKey, requestedModel } = req.body;

      const apiKey = userApiKey || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: 'Chưa cấu hình API Key. Vui lòng nhập API key trong mục Settings.' });
      }

      const activeClient = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const modelName = requestedModel || 'gemini-3-flash-preview';

      const systemInstruction = `You are a Senior Document Architect & Lead OCR Layout Reconstruction Engineer.
You have perfectionist standards for pixel-perfect 1:1 PDF to Word (.docx) conversion.

Your response MUST STRICTLY adhere to the following output structure whenever giving technical advice or document evaluations:

1. **Phân tích Tài liệu (Document Analysis):** (Evaluate document complexity, text density, tables, fonts, layer hierarchy).
2. **Chiến lược Chuyển đổi (Conversion Strategy):** (Specific technical step-by-step conversion pipeline for difficult sections).
3. **Thông số kỹ thuật tái lập (Reconstruction Specs):**
   - *Typography:* Font mapping list, metric sizes, kerning.
   - *Layout:* Margins, line spacing, columns, anchor vs flow text box strategy.
   - *Elements:* Table cell borders, merged cells, graphic vectors.
4. **Cảnh báo & Tối ưu (Warnings & Optimization):** (Point out overflow risks, font metric gaps, and mitigations).
5. **Kết quả mô phỏng (Simulated Result):** (Describe or output the resulting .docx structure, XML anchor rules, or verification checks).

Maintain a professional, highly technical, perfectionist, and meticulous tone. Use terminology like OCR Engine, Font Embedding, Vectorization, XML structure, Anchor points, Metric-compatible fonts.`;

      const promptContext = `
[Document Context]
Name: ${documentContext?.documentName || 'Unknown'}
Page Count: ${documentContext?.pageCount || 1}
Complexity: ${documentContext?.complexityScore || 8}/10
Fonts Detected: ${JSON.stringify(documentContext?.typographySpecs || [])}
Warnings: ${JSON.stringify(documentContext?.warnings || [])}

User Question/Directive:
"${userMessage}"
`;

      const response = await activeClient.models.generateContent({
        model: modelName,
        contents: promptContext,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      res.json({ reply: response.text });
    } catch (err: any) {
      console.error('Error in architect chat:', err);
      res.status(500).json({ error: err.message || 'Architect API error.' });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
