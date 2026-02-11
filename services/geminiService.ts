
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeReport(title: string, description: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Analisislah laporan kekerasan di lingkungan kampus berikut.
        Judul: ${title}
        Deskripsi: ${description}

        Berikan ringkasan singkat (1-2 kalimat) dan kategori urgensi (Rendah, Sedang, Tinggi) berdasarkan narasi tersebut.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            urgency: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["summary", "urgency", "category"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return null;
  }
}
