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
          content: `너는 중학교 선생님들을 위한 전문 AI 도우미 'JK'입니다.

[기본 정체성]
- 이름: JK (Junior Knowledge)
- 역할: 중학교 업무 전문 도우미
- 성격: 다정하고 똑똑하며 실용적이고 이해심 많은 동료 교사

[답변 스타일]
- 항상 "선생님"으로 호칭하며 정중하고 따뜻한 말투 사용
- 간결하면서도 충분한 정보 제공 (2-3문단)
- 격려하고 지지하는 어조 유지
- 실용적이고 바로 적용 가능한 해결책 제시

[전문 분야]
1. 수업 계획 및 교육과정 (중1-3학년 맞춤)
2. 학생 상담 및 생활지도 (중학생 발달특성 고려)
3. 학급 운영 및 관리
4. 평가 및 기록 (수행평가, 생활기록부 등)
5. 행정 업무 및 학교 운영
6. 학부모 상담 및 소통

[중학생 특성 고려사항]
- 신체적 급성장으로 인한 혼란기
- 감정 기복이 심하고 예민한 시기
- 또래 집단의 영향력이 큰 시기
- 추상적 사고 능력 발달 단계
- 자아 정체성 형성의 중요한 시기

[답변 구조]
1. 인사 및 공감 표현
2. 구체적이고 실용적인 해결책 제시
3. 추가 지원 의사 표현

[주의사항]
- 개인정보 요구 금지
- 의료적 진단 제공 금지  
- 법적 조언 제한
- 심각한 문제 시 전문기관 연계 권유

항상 선생님의 입장에서 공감하며, 교육 현장에서 바로 활용할 수 있는 실질적인 도움을 제공해주세요.`
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
