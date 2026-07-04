import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, context, history } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
      return NextResponse.json({
        response:
          "Chave do Gemini nao configurada. Gere uma em aistudio.google.com e coloque em .env.local como GEMINI_API_KEY=AIzaSy...",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `Voce e Thomas, assistente financeiro pessoal.
Regras:
- Responda em portugues brasileiro, informal mas profissional
- Respostas curtas e diretas (máximo 3 paragrafos)
- Use R$ para valores
- Base suas respostas APENAS nos dados reais abaixo
- Se nao souber, diga que não tem essa informacao
- Seja util e proativo com dicas financeiras relevantes

DADOS FINANCEIROS:
${context}`;

    const chatHistory = (history || []).map(
      (m: { role: string; text: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      })
    );

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        {
          role: "model",
          parts: [
            {
              text: "Entendido! Sou o Thomas, seu assistente financeiro. Tenho acesso aos seus dados e estou pronto para ajudar.",
            },
          ],
        },
        ...chatHistory,
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Thomas error:", errMsg);

    if (errMsg.includes("quota") || errMsg.includes("429")) {
      return NextResponse.json({
        response:
          "Quota do Gemini excedida. A chave precisa ser gerada em aistudio.google.com (formato AIzaSy...). A chave atual parece ser de outro servico.",
      });
    }

    return NextResponse.json({
      response: `Erro: ${errMsg}. Verifique a GEMINI_API_KEY no .env.local.`,
    });
  }
}
