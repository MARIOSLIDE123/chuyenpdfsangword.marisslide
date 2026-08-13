import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req: any, res: any) {
  // Support CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileName, fileBase64, mimeType, userApiKey, requestedModel } = req.body || {};

    const apiKey = userApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: 'Chưa cấu hình API Key. Vui lòng nhấn vào nút Settings (API Key) trên Header để nhập key của bạn.'
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' }
      }
    });

    const modelName = requestedModel || 'gemini-3-flash-preview';

    const systemPrompt = `You are a Senior Document Engineer & PDF Conversion Architect.
Analyze the provided document (PDF/Image) for 1:1 Pixel-Perfect Word reconstruction.
Extract font properties, margins, line spacing, table structures with merged cells, text flow, and potential layout warnings.
Return structured JSON matching the requested schema.`;

    const contentsParts: any[] = [
      { text: `Document Name: ${fileName || 'Document.pdf'}. Perform OCR and full layout reconstruction analysis.` }
    ];

    if (fileBase64 && mimeType) {
      contentsParts.push({
        inlineData: {
          data: fileBase64.replace(/^data:[^;]+;base64,/, ''),
          mimeType: mimeType || 'image/png'
        }
      });
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: contentsParts },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
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
                logicalStructureScore: { type: Type.NUMBER }
              },
              required: ['textLayerPct', 'imageLayerPct', 'vectorLayerPct', 'logicalStructureScore']
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
                  sampleText: { type: Type.STRING }
                },
                required: ['detectedFont', 'recommendedWordFont', 'fontSizePt', 'sampleText']
              }
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
                    right: { type: Type.NUMBER }
                  }
                },
                lineSpacing: { type: Type.STRING },
                paragraphSpacingAfterPt: { type: Type.NUMBER },
                columnLayout: { type: Type.STRING },
                positioningStrategy: { type: Type.STRING }
              }
            },
            warnings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  severity: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  mitigation: { type: Type.STRING }
                }
              }
            },
            conversionStrategy: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
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
                            sampleText: { type: Type.STRING }
                          }
                        },
                        bbox: {
                          type: Type.OBJECT,
                          properties: {
                            x: { type: Type.NUMBER },
                            y: { type: Type.NUMBER },
                            width: { type: Type.NUMBER },
                            height: { type: Type.NUMBER }
                          }
                        }
                      }
                    }
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
                              bgColor: { type: Type.STRING }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    let cleanText = (response.text || '{}').trim();
    cleanText = cleanText.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

    let analysisData = {};
    try {
      analysisData = JSON.parse(cleanText);
    } catch (pErr) {
      const match = cleanText.match(/\{[\s\S]*\}/);
      if (match) {
        analysisData = JSON.parse(match[0]);
      } else {
        throw new Error('Gemini response could not be parsed as structured JSON.');
      }
    }

    return res.status(200).json(analysisData);
  } catch (err: any) {
    console.error('Error in Vercel serverless analyze-document:', err);
    return res.status(500).json({ error: err.message || 'Failed to analyze document.' });
  }
}
