import { GoogleGenAI } from '@google/genai';

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
    const { userMessage, documentContext, conversationHistory, userApiKey, requestedModel } = req.body || {};

    const apiKey = userApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: 'Chưa cấu hình API Key. Vui lòng nhập API key trong mục Settings.' });
    }

    const ai = new GoogleGenAI({
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

    const response = await ai.models.generateContent({
      model: modelName,
      contents: promptContext,
      config: {
        systemInstruction,
        temperature: 0.2
      }
    });

    return res.status(200).json({ reply: response.text });
  } catch (err: any) {
    console.error('Error in Vercel serverless architect-chat:', err);
    return res.status(500).json({ error: err.message || 'Architect API error.' });
  }
}
