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

    const systemPrompt = `Voce e o Thomas, melhor amigo e conselheiro financeiro do Gui.
Regras:
- Fala como um brother: informal, direto, sem frescura
- Maximo 2-3 frases por resposta. Sem textao
- Use R$ pra valores
- Base TUDO nos dados reais abaixo, nao inventa
- Se nao sabe, fala "nao tenho esse dado aqui, mano"
- Pode zoar de leve quando o Gui gastar com besteira
- Da toques uteis tipo "olha, se cortar X sobra Y pro carro"

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
              text: "Fala Gui! To aqui pra te ajudar com a grana. Manda a braba!",
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
