import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `당신은 친근하고 도움이 되는 AI 도우미입니다. 
          사용자의 질문에 정확하고 유용한 답변을 제공해주세요.
          
          답변 가이드라인:
          - 친근하고 정중한 말투 사용
          - 명확하고 이해하기 쉬운 설명
          - 필요시 구체적인 예시 제공
          - 답변은 간결하면서도 충분한 정보 포함`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ 
      message: '죄송해요. 잠시 문제가 발생했어요. 다시 시도해주세요.' 
    });
  }
}