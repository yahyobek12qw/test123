import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const { type, context } = await req.json()

  // Check if Anthropic API key exists
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    // Return mock response when no API key
    return NextResponse.json(mockResponse(type, context))
  }

  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const anthropic = new Anthropic({ apiKey })

    const systemPrompt = `Sen O'zbekistondagi foydalanuvchi uchun shaxsiy moliyaviy maslahatchisin.
    Foydalanuvchining moliyaviy ma'lumotlari va joriy iqtisodiy ko'rsatkichlarga kirishingiz bor.
    Har doim qisqa va amaliy javob ber. Raqamlarni aniq ko'rsat.
    UZS miqdorlarini ko'm bilan ajrat (masalan: 1,250,000 so'm).
    Javoblarni O'zbek tilida ber.`

    let userMessage = ''

    if (type === 'impact_analysis') {
      userMessage = `
Joriy iqtisodiy voqealar:
- USD/UZS kursi: ${context?.usdRate ?? 12748} so'm (haftada +2.1%)
- Inflyatsiya: ${context?.inflation ?? 8.7}%
- Bitcoin: $${context?.btcPrice ?? 68420} (+1.8%)
- Oltin: $${context?.goldPrice ?? 2340}/oz (+0.35%)

Foydalanuvchining moliyaviy profili:
- Oylik daromad: ${context?.monthlyIncome ?? 8000000} so'm
- Oylik xarajat: ${context?.monthlyExpenses ?? 5500000} so'm
- Investitsiyalar: ${JSON.stringify(context?.investments ?? [])}

Ushbu iqtisodiy voqealar bu foydalanuvchining moliyasiga qanday ta'sir qilishini tahlil qiling.
JSON formatida qaytaring: { "summary": "...", "impacts": [{"event": "...", "impact": "...", "direction": "positive|negative|neutral", "magnitude": "high|medium|low", "amountAffected": 0}], "recommendations": ["..."], "riskScore": 0 }`
    } else if (type === 'chat') {
      userMessage = String(context?.message ?? '')
    } else if (type === 'expense_review') {
      userMessage = `
Xarajatlar tahlili:
${JSON.stringify(context?.expensesByCategory ?? {})}

Ushbu xarajatlarni tahlil qilib, qisqartirish imkoniyatlarini aniqlang.`
    }

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })

    const content = message.content[0]
    const text = content.type === 'text' ? content.text : ''

    return NextResponse.json({ result: text, type })
  } catch (error) {
    console.error('AI API error:', error)
    return NextResponse.json(mockResponse(type, context))
  }
}

function mockResponse(type: string, _context: unknown) {
  if (type === 'impact_analysis') {
    return {
      type,
      result: JSON.stringify({
        summary:
          "Dollar kursi o'sishi xarajatlaringizga ta'sir qilmoqda, ammo umumiy moliyaviy holatingiz barqaror.",
        impacts: [
          {
            event: "Dollar kursi ko'tarildi (+2.1%)",
            impact: "Oylik import xarajatlaringiz taxminan 115,500 so'mga oshdi",
            direction: 'negative',
            magnitude: 'medium',
            amountAffected: 115500,
          },
          {
            event: "Oltin narxi o'sdi (+0.35%)",
            impact: "Oltin investitsiyangiz qiymati biroz oshgan bo'lishi mumkin",
            direction: 'positive',
            magnitude: 'low',
            amountAffected: 0,
          },
          {
            event: 'Bitcoin +1.8% oshdi',
            impact: "Kripto investitsiyangiz bo'lsa, qiymat oshgan",
            direction: 'positive',
            magnitude: 'medium',
            amountAffected: 0,
          },
        ],
        recommendations: [
          "Valyuta xarajatlarini kamaytirish uchun mahalliy mahsulotlarga o'ting",
          "Jamg'armaning bir qismini dollar yoki oltinda saqlashni ko'rib chiqing",
          'Oylik byudjetni qayta ko\'rib chiqing',
        ],
        riskScore: 35,
      }),
    }
  }

  if (type === 'chat') {
    return {
      type,
      result:
        "Salom! Men sizning moliyaviy maslahatchangizman. Xarajatlar, investitsiyalar yoki moliyaviy maqsadlar haqida savollaringiz bo'lsa, yordam berishga tayyorman. Hozir qanday savolingiz bor?",
    }
  }

  return { type, result: "Ma'lumot tahlil qilindi." }
}
