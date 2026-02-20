import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `Ты — помощник для анализа продуктовых чеков из магазинов Португалии.
Проанализируй фото чека. Извлеки:
1. Дату покупки (формат: YYYY-MM-DD)
2. Название магазина
3. Список товаров с ценами

Для каждого товара определи категорию на русском языке. Возможные категории:
- Алкоголь
- Овощи
- Фрукты
- Мясо
- Рыба
- Молочка
- Хлеб
- Снэки
- Бытовая химия
- Другое
- Кафе/Ресторан

Верни ТОЛЬКО чистый JSON без markdown форматирования в следующем формате:
{
    "store_name": "Название магазина",
    "purchase_date": "YYYY-MM-DD",
    "items": [
        {"name": "Название товара на русском", "price": 1.99, "category": "Категория"}
    ]
}`;

export async function POST(request: NextRequest) {
    try {
        const { image } = await request.json();

        if (!image) {
            return NextResponse.json({ error: 'Image is required' }, { status: 400 });
        }

        // Get API keys from environment variables
        const openaiKey = process.env.OPENAI_API_KEY;
        const googleKey = process.env.GOOGLE_API_KEY;

        if (!openaiKey && !googleKey) {
            return NextResponse.json(
                { error: 'No API key configured. Please set OPENAI_API_KEY or GOOGLE_API_KEY in environment variables.' },
                { status: 500 }
            );
        }

        // Extract base64 data from data URL
        const base64Data = image.split(',')[1];

        // Prefer OpenAI if available
        if (openaiKey) {
            const openai = new OpenAI({ apiKey: openaiKey });

            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: 'Проанализируй этот чек и извлеки данные:' },
                            {
                                type: 'image_url',
                                image_url: { url: `data:image/jpeg;base64,${base64Data}` }
                            }
                        ]
                    }
                ],
                max_tokens: 2000
            });

            const content = response.choices[0].message.content || '';
            const jsonStr = extractJson(content);
            const data = JSON.parse(jsonStr);

            return NextResponse.json(data);
        } else if (googleKey) {
            // Google Gemini
            const geminiResponse = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [
                                { text: SYSTEM_PROMPT + '\n\nПроанализируй этот чек и извлеки данные:' },
                                {
                                    inline_data: {
                                        mime_type: 'image/jpeg',
                                        data: base64Data
                                    }
                                }
                            ]
                        }]
                    })
                }
            );

            if (!geminiResponse.ok) {
                const error = await geminiResponse.json();
                throw new Error(error.error?.message || 'Gemini API error');
            }

            const geminiData = await geminiResponse.json();
            const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const jsonStr = extractJson(text);
            const data = JSON.parse(jsonStr);

            return NextResponse.json(data);
        }

        return NextResponse.json({ error: 'No API key available' }, { status: 500 });
    } catch (error) {
        console.error('Analyze error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Analysis failed' },
            { status: 500 }
        );
    }
}

function extractJson(text: string): string {
    // Remove markdown code blocks if present
    let cleaned = text.trim();
    if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    return cleaned;
}
